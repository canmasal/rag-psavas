/* Başlangıç verileri: eğitimler, blog, galeri, duyurular, ayarlar ve yönetici hesabı */
import fs from "node:fs";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Drama, Music, Palette, Piano, Sparkles, Star, Guitar, PersonStanding, Shapes, MicVocal, Theater, Brush } from "lucide-react";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { seedCourses } from "../src/data/courses";
import { seedAnnouncements, seedPosts } from "../src/data/content";
import { defaultSettings } from "../src/lib/settings";

const db = new PrismaClient();

const galleryArt = [
  { title: "Yıl sonu bale gösterisi", category: "Bale", color: "#c2477a", Icon: Sparkles },
  { title: "Müzikal tiyatro provası", category: "Tiyatro", color: "#b8242f", Icon: Drama },
  { title: "Piyano resitali", category: "Müzik", color: "#1f3a8a", Icon: Piano },
  { title: "Resim atölyesi", category: "Resim & Seramik", color: "#2563eb", Icon: Palette },
  { title: "Yaratıcı drama dersi", category: "Tiyatro", color: "#e0752d", Icon: Theater },
  { title: "Gitar topluluğu konseri", category: "Müzik", color: "#a16207", Icon: Guitar },
  { title: "Hazırlık sınıfı bale dersi", category: "Bale", color: "#db2777", Icon: Star },
  { title: "Seramik sergisi", category: "Resim & Seramik", color: "#9a3412", Icon: Shapes },
  { title: "Modern dans koreografisi", category: "Etkinlikler", color: "#7a3fd0", Icon: PersonStanding },
  { title: "Şan sınıfı konseri", category: "Müzik", color: "#0e7490", Icon: MicVocal },
  { title: "Mix Art çalışmaları", category: "Resim & Seramik", color: "#be185d", Icon: Brush },
  { title: "Akademi korosu", category: "Etkinlikler", color: "#334155", Icon: Music },
];

function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(amt >= 0 ? v + (255 - v) * amt : v * (1 + amt))));
  return `#${[(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => f(v).toString(16).padStart(2, "0")).join("")}`;
}

function artSvg(i: number, color: string, Icon: typeof Drama) {
  const icon = renderToStaticMarkup(createElement(Icon, { color: "#ffffff", strokeWidth: 1, size: 24 }))
    .replace(/^<svg[^>]*>/, "")
    .replace(/<\/svg>$/, "");
  const w = 1200;
  const h = i % 3 === 0 ? 1500 : i % 3 === 1 ? 1200 : 900;
  const r = (s: number) => (Math.sin(i * 97 + s * 13) + 1) / 2;
  const blobs = [
    [shade(color, 0.05), r(1) * w, r(2) * h, 520, 0.95],
    [shade(color, -0.3), r(3) * w, r(4) * h, 420, 0.9],
    ["#c99a3b", 200 + r(5) * 800, 150 + r(6) * (h - 300), 260, 0.5],
    [shade(color, 0.3), r(7) * w, r(8) * h, 220, 0.6],
  ] as const;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <defs>
    <filter id="b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="120"/></filter>
    <pattern id="l" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="18" stroke="#fff" stroke-opacity=".045" stroke-width="3"/></pattern>
    <linearGradient id="v" x1="0" y1="0" x2="0" y2="1"><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="${shade(color, -0.62)}"/>
  <g filter="url(#b)">${blobs.map(([c, x, y, rad, o]) => `<circle cx="${x}" cy="${y}" r="${rad}" fill="${c}" opacity="${o}"/>`).join("")}</g>
  <rect width="${w}" height="${h}" fill="url(#l)"/>
  ${[0, 1, 2].map((k) => `<circle cx="${w * 0.75}" cy="${h * 0.8}" r="${280 + k * 140}" fill="none" stroke="#f4e7c8" stroke-opacity="${0.16 - k * 0.04}" stroke-width="2.5"/>`).join("")}
  <rect width="${w}" height="${h}" fill="url(#v)"/>
  <g transform="translate(${w * 0.5 - 130} ${h * 0.5 - 130}) scale(10.8)" fill="none" stroke="#fff" stroke-opacity=".4" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.8">${icon}</g>
</svg>`;
}

async function main() {
  console.log("→ Ayarlar");
  for (const [key, value] of Object.entries(defaultSettings)) {
    await db.setting.upsert({ where: { key }, create: { key, value }, update: {} });
  }

  console.log("→ Yönetici hesabı");
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@ragipsavassanat.com").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin123!";
  await db.user.upsert({
    where: { email: adminEmail },
    create: { email: adminEmail, name: "Akademi Yönetimi", role: "ADMIN", passwordHash: await bcrypt.hash(adminPassword, 10) },
    update: { role: "ADMIN" },
  });

  console.log("→ Eğitimler");
  for (const [i, c] of seedCourses.entries()) {
    const { packages, highlights, ...data } = c;
    const exists = await db.course.findUnique({ where: { slug: c.slug } });
    if (exists) continue;
    await db.course.create({
      data: {
        ...data,
        highlights: highlights.join("\n"),
        featured: c.featured ?? false,
        order: i,
        packages: { create: packages.map((p, j) => ({ ...p, popular: p.popular ?? false, order: j })) },
      },
    });
  }

  console.log("→ Blog");
  for (const [i, p] of seedPosts.entries()) {
    const publishedAt = new Date(Date.now() - i * 9 * 24 * 3600 * 1000);
    await db.post.upsert({ where: { slug: p.slug }, create: { ...p, publishedAt }, update: {} });
  }

  console.log("→ Duyurular");
  if ((await db.announcement.count()) === 0) {
    for (const [i, a] of seedAnnouncements.entries()) {
      await db.announcement.create({ data: { ...a, createdAt: new Date(Date.now() - i * 5 * 24 * 3600 * 1000) } });
    }
  }

  console.log("→ Galeri");
  const dir = path.join(process.cwd(), "public", "galeri");
  fs.mkdirSync(dir, { recursive: true });
  const createRows = (await db.galleryItem.count()) === 0;
  for (const [i, g] of galleryArt.entries()) {
    const file = `ornek-${String(i + 1).padStart(2, "0")}.svg`;
    fs.writeFileSync(path.join(dir, file), artSvg(i, g.color, g.Icon));
    if (createRows) await db.galleryItem.create({ data: { title: g.title, category: g.category, imageUrl: `/galeri/${file}`, order: i } });
  }

  console.log(`✓ Tamamlandı. Yönetici: ${adminEmail} / ${process.env.ADMIN_PASSWORD ? "(.env'deki şifre)" : adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
