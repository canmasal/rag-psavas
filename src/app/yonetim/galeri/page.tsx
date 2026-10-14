/* eslint-disable @next/next/no-img-element */
import { Play, Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { PanelHeader } from "@/components/dashboard/Shell";
import { GalleryUploadForm } from "@/components/dashboard/GalleryUploadForm";
import { deleteGalleryItem } from "@/app/actions/admin";
import { galleryCategories } from "@/data/content";

export default async function AdminGallery() {
  const items = await db.galleryItem.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
  const cats = Array.from(new Set([...galleryCategories, ...items.map((i) => i.category)]));
  return (
    <>
      <PanelHeader title="Galeri" description="Fotoğraf yükleyin veya YouTube videosu ekleyin." />
      <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
        <div className="card self-start p-6"><p className="font-display text-xl">Yeni içerik ekle</p><div className="mt-5"><GalleryUploadForm categories={cats} /></div></div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((g) => (
            <div key={g.id} className="group relative overflow-hidden rounded-xl border border-line bg-white">
              <img src={g.imageUrl} alt={g.title} className="aspect-square w-full object-cover" />
              {g.videoUrl && <span className="absolute left-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white/90"><Play className="h-3.5 w-3.5 fill-current" /></span>}
              <div className="flex items-center gap-2 p-3">
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{g.title}</p><p className="text-xs text-muted">{g.category}</p></div>
                <form action={deleteGalleryItem}><input type="hidden" name="id" value={g.id} /><button type="submit" className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-red-50 hover:text-red-700" aria-label="Sil"><Trash2 className="h-4 w-4" /></button></form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
