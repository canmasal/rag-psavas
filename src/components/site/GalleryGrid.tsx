"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Item = { id: string; title: string; category: string; imageUrl: string; videoUrl: string | null };

function youtubeEmbed(url: string) {
  const m = /(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/.exec(url);
  return m ? `https://www.youtube-nocookie.com/embed/${m[1]}?autoplay=1` : null;
}

export function GalleryGrid({ items }: { items: Item[] }) {
  const categories = useMemo(() => Array.from(new Set(items.map((i) => i.category))), [items]);
  const [filter, setFilter] = useState<string | null>(null);
  const [index, setIndex] = useState<number | null>(null);
  const visible = filter ? items.filter((i) => i.category === filter) : items;

  const close = useCallback(() => setIndex(null), []);
  const move = useCallback((d: number) => setIndex((i) => (i === null ? i : (i + d + visible.length) % visible.length)), [visible.length]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [index, close, move]);

  const current = index !== null ? visible[index] : null;
  const embed = current?.videoUrl ? youtubeEmbed(current.videoUrl) : null;

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {[null, ...categories].map((c) => (
          <button key={c ?? "all"} type="button" onClick={() => setFilter(c)} className={cn("rounded-full border px-4 py-2 text-sm font-bold transition", filter === c ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink")}>
            {c ?? "Tümü"}
          </button>
        ))}
      </div>
      <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
        {visible.map((item, i) => (
          <button key={item.id} type="button" onClick={() => setIndex(i)} className="group relative mb-4 block w-full overflow-hidden rounded-[1.2rem] text-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.imageUrl} alt={item.title} loading="lazy" className={cn("w-full object-cover transition duration-700 group-hover:scale-105", i % 3 === 0 ? "aspect-[4/5]" : i % 3 === 1 ? "aspect-square" : "aspect-[4/3]")} />
            {item.videoUrl && <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-xl"><Play className="h-6 w-6 fill-current" /></span>}
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4 pt-12 text-white">
              <span className="block text-[0.7rem] font-bold uppercase tracking-wider text-gold">{item.category}</span>
              <span className="block font-semibold">{item.title}</span>
            </span>
          </button>
        ))}
      </div>
      {visible.length === 0 && <p className="py-20 text-center text-muted">Henüz içerik eklenmedi.</p>}

      {current && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4" role="dialog" aria-modal onClick={close}>
          <button type="button" onClick={close} className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Kapat"><X /></button>
          <button type="button" onClick={(e) => { e.stopPropagation(); move(-1); }} className="absolute left-4 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Önceki"><ChevronLeft /></button>
          <button type="button" onClick={(e) => { e.stopPropagation(); move(1); }} className="absolute right-4 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Sonraki"><ChevronRight /></button>
          <figure className="max-h-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            {embed ? (
              <iframe src={embed} title={current.title} className="aspect-video w-[min(90vw,64rem)] rounded-xl" allow="autoplay; encrypted-media" allowFullScreen />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={current.imageUrl} alt={current.title} className="max-h-[80vh] rounded-xl object-contain" />
            )}
            <figcaption className="mt-4 text-center text-white">
              <span className="text-xs font-bold uppercase tracking-wider text-gold">{current.category}</span>
              <span className="block font-display text-xl">{current.title}</span>
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
