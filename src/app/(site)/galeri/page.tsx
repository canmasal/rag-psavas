import type { Metadata } from "next";
import { db } from "@/lib/db";
import { PageHero } from "@/components/ui/PageHero";
import { GalleryGrid } from "@/components/site/GalleryGrid";

export const metadata: Metadata = { title: "Galeri", description: "Derslerimizden, yıl sonu gösterilerimizden ve sergilerimizden fotoğraf ve videolar." };

export default async function GalleryPage() {
  const items = await db.galleryItem.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
  return (
    <>
      <PageHero eyebrow="Galeri" title="Akademiden kareler" description="Derslerimizden, gösterilerimizden ve sergilerimizden fotoğraf ve videolar." crumbs={[{ label: "Galeri" }]} />
      <section className="py-14 md:py-20">
        <div className="container-rs">
          <GalleryGrid items={items.map((i) => ({ id: i.id, title: i.title, category: i.category, imageUrl: i.imageUrl, videoUrl: i.videoUrl }))} />
        </div>
      </section>
    </>
  );
}
