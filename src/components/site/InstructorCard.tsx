/* eslint-disable @next/next/no-img-element */
import { ArtCover } from "../art";

export function InstructorCard({ t }: { t: { id: string; name: string; title: string; bio: string; photo: string | null; branches: string } }) {
  const branches = t.branches.split(",").map((b) => b.trim()).filter(Boolean);
  return (
    <article data-reveal className="group">
      <div className="relative overflow-hidden rounded-[1.4rem]">
        {t.photo ? (
          <img src={t.photo} alt={t.name} className="aspect-[4/5] w-full object-cover grayscale-[25%] transition duration-700 group-hover:scale-105 group-hover:grayscale-0" loading="lazy" />
        ) : (
          <ArtCover seed={t.id} color="#2a2236" className="aspect-[4/5]" />
        )}
        {!t.photo && <span className="absolute inset-0 grid place-items-center font-display text-7xl text-white/80">{t.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}</span>}
      </div>
      <h3 className="mt-5 font-display text-2xl">{t.name}</h3>
      <p className="text-sm font-bold text-accent">{t.title}</p>
      {t.bio && <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-muted">{t.bio}</p>}
      {branches.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {branches.map((b) => <span key={b} className="rounded-full border border-line px-2.5 py-0.5 text-xs font-semibold">{b}</span>)}
        </div>
      )}
    </article>
  );
}
