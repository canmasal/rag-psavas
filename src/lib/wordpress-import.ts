/**
 * Eski WordPress sitesinden içerik aktarımı (WordPress REST API: /wp-json/wp/v2).
 * - Medya kütüphanesindeki fotoğraflar → Galeri
 * - Yazılar → Blog (kapak görselleriyle)
 * - Eğitim sayfalarının öne çıkan görselleri (ve isteğe bağlı metinleri) → Eğitimler
 * - Hakkımızda / Ragıp Savaş Kimdir görselleri → Site ayarları
 * Tekrar çalıştırıldığında daha önce aktarılanlar atlanır.
 */
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { db } from "./db";
import { UPLOAD_DIR } from "./uploads";

export type ImportOptions = {
  baseUrl: string;
  gallery?: boolean;
  posts?: boolean;
  courseImages?: boolean;
  courseTexts?: boolean;
  minWidth?: number;
  log?: (msg: string) => void;
};

export type ImportReport = {
  gallery: number;
  posts: number;
  courseImages: number;
  courseTexts: number;
  settings: number;
  skipped: number;
  errors: string[];
};

type WpRendered = { rendered: string };
type WpMedia = {
  id: number;
  slug: string;
  title: WpRendered;
  alt_text?: string;
  media_type: string;
  mime_type: string;
  source_url: string;
  media_details?: { width?: number; height?: number; sizes?: Record<string, { source_url: string; width: number }> };
};
type WpPost = {
  id: number;
  slug: string;
  date: string;
  link: string;
  title: WpRendered;
  excerpt?: WpRendered;
  content: WpRendered;
  featured_media?: number;
  parent?: number;
  _embedded?: { "wp:term"?: { name: string; taxonomy: string }[][] };
};

const ENTITIES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", hellip: "…", ndash: "–", mdash: "—",
  rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", laquo: "«", raquo: "»", copy: "©", reg: "®",
};

export function decodeEntities(text: string) {
  return text
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m);
}

export function stripHtml(html: string) {
  return decodeEntities(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

/** WordPress HTML içeriğini sitenin kullandığı sade Markdown biçimine çevirir. */
export function htmlToMarkdown(html: string) {
  let s = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style|iframe|figure|form|noscript)[\s\S]*?<\/\1>/gi, "")
    .replace(/<img[^>]*>/gi, "")
    .replace(/\r/g, "");
  s = s.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (_, t) => `\n\n## ${stripHtml(t)}\n\n`);
  s = s.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, t) => `\n\n## ${stripHtml(t)}\n\n`);
  s = s.replace(/<h[3-6][^>]*>([\s\S]*?)<\/h[3-6]>/gi, (_, t) => `\n\n### ${stripHtml(t)}\n\n`);
  s = s.replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, __, t) => (stripHtml(t) ? `**${stripHtml(t)}**` : ""));
  s = s.replace(/<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, __, t) => (stripHtml(t) ? `*${stripHtml(t)}*` : ""));
  s = s.replace(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, t) => (stripHtml(t) ? `[${stripHtml(t)}](${href})` : ""));
  s = s.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, inner) => {
    let i = 0;
    return "\n\n" + inner.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_m: string, t: string) => `${++i}. ${t.replace(/<[^>]+>/g, " ").trim()}\n`) + "\n";
  });
  s = s.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, inner) =>
    "\n\n" + inner.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_m: string, t: string) => `- ${t.replace(/<[^>]+>/g, " ").trim()}\n`) + "\n",
  );
  s = s.replace(/<br\s*\/?>/gi, "\n").replace(/<\/(p|div|section|blockquote)>/gi, "\n\n");
  s = s.replace(/<[^>]+>/g, "");
  s = decodeEntities(s)
    .split("\n")
    .map((l) => l.replace(/[ \t]+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return s;
}

function guessGalleryCategory(text: string) {
  const t = text.toLocaleLowerCase("tr-TR");
  if (/bale|balerin|ballet/.test(t)) return "Bale";
  if (/tiyatro|drama|müzikal|muzikal|oyun|sahne/.test(t)) return "Tiyatro";
  if (/piyano|keman|gitar|şan|san-|koro|konser|müzik|muzik|bateri|flüt|flut|resital/.test(t)) return "Müzik";
  if (/resim|seramik|sergi|mix|atölye|atolye|boya/.test(t)) return "Resim & Seramik";
  return "Etkinlikler";
}

function guessPostCategory(post: WpPost) {
  const terms = post._embedded?.["wp:term"]?.flat().filter((t) => t.taxonomy === "category") ?? [];
  const name = terms.find((t) => !/genel|uncategori|kategorisiz/i.test(t.name))?.name;
  return name ? decodeEntities(name) : "Akademiden Haberler";
}

async function getJson<T>(url: string): Promise<{ data: T; totalPages: number }> {
  const res = await fetch(url, { headers: { Accept: "application/json", "User-Agent": "RagipSavas-Importer/1.0" }, cache: "no-store" });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`);
  return { data: (await res.json()) as T, totalPages: Number(res.headers.get("x-wp-totalpages") || 1) };
}

async function getAll<T>(base: string, endpoint: string, query = ""): Promise<T[]> {
  const items: T[] = [];
  for (let page = 1; page <= 50; page++) {
    const { data, totalPages } = await getJson<T[]>(`${base}/wp-json/wp/v2/${endpoint}?per_page=100&page=${page}${query}`);
    items.push(...data);
    if (page >= totalPages || data.length === 0) break;
  }
  return items;
}

const EXT: Record<string, string> = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/gif": ".gif", "image/avif": ".avif" };

async function download(url: string): Promise<string> {
  const res = await fetch(url, { headers: { "User-Agent": "RagipSavas-Importer/1.0" }, cache: "no-store" });
  if (!res.ok) throw new Error(`Görsel indirilemedi (${res.status}): ${url}`);
  const type = (res.headers.get("content-type") || "").split(";")[0].trim();
  const ext = EXT[type] ?? (path.extname(new URL(url).pathname).toLowerCase() || ".jpg");
  if (!Object.values(EXT).includes(ext)) throw new Error(`Desteklenmeyen görsel türü: ${url}`);
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const name = `wp-${Date.now()}-${crypto.randomBytes(3).toString("hex")}${ext}`;
  await fs.writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await res.arrayBuffer()));
  return `/medya/${name}`;
}

function bestSource(m: WpMedia) {
  const sizes = m.media_details?.sizes ?? {};
  // Çok büyük orijinaller yerine ~2000px civarındaki boyutu tercih et
  const candidates = Object.values(sizes).filter((s) => s.width >= 1200 && s.width <= 2200).sort((a, b) => b.width - a.width);
  return candidates[0]?.source_url ?? sizes.full?.source_url ?? m.source_url;
}

async function loadMap(): Promise<Record<string, string>> {
  const row = await db.setting.findUnique({ where: { key: "_wpImportMap" } });
  try { return row ? JSON.parse(row.value) : {}; } catch { return {}; }
}

async function saveMap(map: Record<string, string>) {
  const value = JSON.stringify(map);
  await db.setting.upsert({ where: { key: "_wpImportMap" }, create: { key: "_wpImportMap", value }, update: { value } });
}

export async function importFromWordPress(opts: ImportOptions): Promise<ImportReport> {
  const log = opts.log ?? (() => undefined);
  const base = opts.baseUrl.trim().replace(/\/+$/, "");
  if (!/^https?:\/\//.test(base)) throw new Error("Geçerli bir site adresi girin (https://…).");
  const report: ImportReport = { gallery: 0, posts: 0, courseImages: 0, courseTexts: 0, settings: 0, skipped: 0, errors: [] };
  const map = await loadMap(); // wp medya id → yerel adres

  log("Medya kütüphanesi okunuyor…");
  const media = (await getAll<WpMedia>(base, "media", "&media_type=image")).filter((m) => m.mime_type?.startsWith("image/"));
  log(`${media.length} görsel bulundu.`);
  const mediaById = new Map(media.map((m) => [m.id, m]));

  const localFor = async (id: number | undefined): Promise<string | null> => {
    if (!id) return null;
    if (map[id]) return map[id];
    const m = mediaById.get(id);
    if (!m) return null;
    try {
      map[id] = await download(bestSource(m));
      return map[id];
    } catch (e) {
      report.errors.push((e as Error).message);
      return null;
    }
  };

  if (opts.gallery) {
    const minWidth = opts.minWidth ?? 700;
    const existing = new Set((await db.galleryItem.findMany({ select: { imageUrl: true } })).map((g) => g.imageUrl));
    let order = await db.galleryItem.count();
    for (const m of media) {
      const w = m.media_details?.width ?? 0;
      const label = `${m.slug} ${stripHtml(m.title.rendered)} ${m.alt_text ?? ""}`;
      if ((w && w < minWidth) || /logo|icon|ikon|favicon|banner-?bg|placeholder/i.test(label)) { report.skipped++; continue; }
      const local = await localFor(m.id);
      if (!local || existing.has(local)) { report.skipped++; continue; }
      const title = stripHtml(m.title.rendered).replace(/[-_]+/g, " ").replace(/\b(img|dsc|wp|image)\s*\d+/gi, "").trim();
      await db.galleryItem.create({
        data: { title: m.alt_text?.trim() || (title.length > 3 ? title : "Akademiden"), category: guessGalleryCategory(label), imageUrl: local, order: order++ },
      });
      existing.add(local);
      report.gallery++;
    }
    log(`Galeriye ${report.gallery} fotoğraf eklendi.`);
  }

  if (opts.posts) {
    log("Blog yazıları okunuyor…");
    const posts = await getAll<WpPost>(base, "posts", "&_embed=wp:term");
    for (const p of posts) {
      const slug = decodeURIComponent(p.slug).slice(0, 80);
      if (await db.post.findUnique({ where: { slug } })) { report.skipped++; continue; }
      const content = htmlToMarkdown(p.content.rendered);
      if (content.length < 40) { report.skipped++; continue; }
      const excerpt = stripHtml(p.excerpt?.rendered ?? "").replace(/\[…\]|\[&hellip;\]/g, "").trim().slice(0, 280) || content.slice(0, 200);
      await db.post.create({
        data: {
          slug,
          title: stripHtml(p.title.rendered),
          excerpt,
          content,
          category: guessPostCategory(p),
          cover: await localFor(p.featured_media),
          publishedAt: new Date(p.date),
          readMinutes: Math.max(1, Math.round(content.split(/\s+/).length / 200)),
        },
      });
      report.posts++;
    }
    log(`${report.posts} blog yazısı aktarıldı.`);
  }

  if (opts.courseImages || opts.courseTexts) {
    log("Sayfalar okunuyor…");
    const pages = await getAll<WpPost>(base, "pages");
    const courses = await db.course.findMany();
    for (const page of pages) {
      const slug = decodeURIComponent(page.slug);
      const course = courses.find((c) => c.slug === slug || slug === c.slug.replace(/-/g, "") || page.link.replace(/\/$/, "").endsWith(`/${c.slug}`));
      if (course) {
        const data: { image?: string; content?: string } = {};
        if (opts.courseImages && !course.image) {
          const img = await localFor(page.featured_media);
          if (img) { data.image = img; report.courseImages++; }
        }
        if (opts.courseTexts) {
          const md = htmlToMarkdown(page.content.rendered);
          if (md.length > 120) { data.content = md; report.courseTexts++; }
        }
        if (Object.keys(data).length) await db.course.update({ where: { id: course.id }, data });
        continue;
      }
      const settingKey = /hakkimizda|hakkinda|kurumsal/.test(slug) ? "aboutImage" : /ragip-savas|kurucu/.test(slug) ? "founderImage" : null;
      if (settingKey && opts.courseImages) {
        const current = await db.setting.findUnique({ where: { key: settingKey } });
        if (!current?.value) {
          const img = await localFor(page.featured_media);
          if (img) {
            await db.setting.upsert({ where: { key: settingKey }, create: { key: settingKey, value: img }, update: { value: img } });
            report.settings++;
          }
        }
      }
    }
    log(`${report.courseImages} eğitim görseli, ${report.courseTexts} eğitim metni güncellendi.`);
  }

  // Ana sayfa kapak fotoğrafı boşsa galerideki ilk geniş fotoğrafı kullan
  const hero = await db.setting.findUnique({ where: { key: "heroImage" } });
  if (!hero?.value) {
    const wide = media.find((m) => (m.media_details?.width ?? 0) >= 1600 && (m.media_details?.width ?? 0) > (m.media_details?.height ?? 0) * 1.3 && map[m.id]);
    if (wide) {
      await db.setting.upsert({ where: { key: "heroImage" }, create: { key: "heroImage", value: map[wide.id] }, update: { value: map[wide.id] } });
      report.settings++;
    }
  }

  await saveMap(map);
  return report;
}
