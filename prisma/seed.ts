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
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(v * (1 + amt))));
  return `#${[(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => f(v).toString(16).padStart(2, "0")).join("")}`;
}

function artSvg(i: number, color: string, Icon: typeof Drama) {
  const icon = renderToStaticMarkup(createElement(Icon, { color: "#ffffff", strokeWidth: 1, size: 24 }))
    .replace(/^<svg[^>]*>/, "")
    .replace(/<\/svg>$/, "");
  const w = 1200;
  const h = i % 3 === 0 ? 1500 : i % 3 === 1 ? 1200 : 900;
  const r = (s: number) => ((Math.sin(i * 97 + s * 13) + 1) / 2);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <defs>
    <linearGradient id="a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${shade(color, 0.2)}"/><stop offset="1" stop-color="${shade(color, -0.55)}"/></linearGradient>
    <radialGradient id="b"><stop offset="0" stop-color="#f4e7c8" stop-opacity=".6"/><stop offset="1" stop-color="#f4e7c8" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#a)"/>
  <circle cx="${200 + r(1) * 800}" cy="${150 + r(2) * (h - 300)}" r="${300 + r(3) * 200}" fill="url(#b)"/>
  ${[0, 1, 2, 3, 4].map((k) => `<circle cx="${r(4) * w}" cy="${h - r(5) * 200}" r="${180 + k * 110}" fill="none" stroke="#fff" stroke-opacity="${0.22 - k * 0.04}" stroke-width="3"/>`).join("")}
  <path d="M0 ${h * 0.78} C ${w * 0.3} ${h * 0.62}, ${w * 0.65} ${h * 0.95}, ${w} ${h * 0.7} L ${w} ${h} L 0 ${h} Z" fill="#000" fill-opacity=".16"/>
  <g transform="translate(${w * 0.5 - 260} ${h * 0.5 - 260}) scale(21.6)" fill="none" stroke="#fff" stroke-opacity=".55" stroke-linecap="round" stroke-linejoin="round" stroke-width="1">${icon}</g>
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
  if ((await db.galleryItem.count()) === 0) {
    const dir = path.join(process.cwd(), "public", "galeri");
    fs.mkdirSync(dir, { recursive: true });
    for (const [i, g] of galleryArt.entries()) {
      const file = `ornek-${String(i + 1).padStart(2, "0")}.svg`;
      fs.writeFileSync(path.join(dir, file), artSvg(i, g.color, g.Icon));
      await db.galleryItem.create({ data: { title: g.title, category: g.category, imageUrl: `/galeri/${file}`, order: i } });
    }
  }

  console.log(`✓ Tamamlandı. Yönetici: ${adminEmail} / ${process.env.ADMIN_PASSWORD ? "(.env'deki şifre)" : adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
