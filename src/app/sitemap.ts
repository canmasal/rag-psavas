import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { siteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const [courses, posts] = await Promise.all([
    db.course.findMany({ where: { active: true }, select: { slug: true, updatedAt: true } }),
    db.post.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
  ]);
  const pages = ["", "/hakkimizda", "/ragip-savas-kimdir", "/egitimlerimiz", "/rehber", "/blog", "/galeri", "/iletisim", "/ucretsiz-deneme-dersi"];
  return [
    ...pages.map((p) => ({ url: `${base}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.8 })),
    ...courses.map((c) => ({ url: `${base}/egitimlerimiz/${c.slug}`, lastModified: c.updatedAt, priority: 0.9 })),
    ...posts.map((p) => ({ url: `${base}/blog/${p.slug}`, lastModified: p.updatedAt, priority: 0.6 })),
  ];
}
