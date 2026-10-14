import { CourseIcon } from "./icons";
import { cn } from "@/lib/utils";

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 1000) / 1000;
  };
}

function shade(hex: string, amount: number) {
  const n = parseInt(hex.replace("#", ""), 16);
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const mix = (c: number) => (amount >= 0 ? c + (255 - c) * amount : c * (1 + amount));
  const r = clamp(mix((n >> 16) & 255));
  const g = clamp(mix((n >> 8) & 255));
  const b = clamp(mix(n & 255));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/**
 * Fotoğrafı olmayan içerikler için markaya uygun, deterministik "mesh" kapak görseli.
 * Fotoğraf yüklendiğinde (image) otomatik olarak fotoğraf gösterilir.
 */
export function ArtCover({
  seed,
  color = "#b8242f",
  icon,
  image,
  className,
  iconClassName,
  alt = "",
  priority = false,
}: {
  seed: string;
  color?: string;
  icon?: string;
  image?: string | null;
  className?: string;
  iconClassName?: string;
  alt?: string;
  priority?: boolean;
}) {
  if (image) {
    return (
      <div className={cn("relative overflow-hidden bg-ink", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={alt} className="absolute inset-0 h-full w-full object-cover" loading={priority ? "eager" : "lazy"} />
      </div>
    );
  }
  const rnd = hash(seed);
  const id = `m${Math.floor(rnd() * 1e7)}`;
  const base = shade(color, -0.62);
  const blobs = [
    { c: shade(color, 0.05), x: rnd() * 400, y: rnd() * 300, r: 150 + rnd() * 70, o: 0.95 },
    { c: shade(color, -0.25), x: rnd() * 400, y: rnd() * 300, r: 120 + rnd() * 60, o: 0.9 },
    { c: "#c99a3b", x: 60 + rnd() * 280, y: 40 + rnd() * 200, r: 70 + rnd() * 50, o: 0.55 },
    { c: shade(color, 0.35), x: rnd() * 400, y: rnd() * 300, r: 60 + rnd() * 40, o: 0.6 },
  ];
  const ax = 260 + rnd() * 160;
  const ay = 220 + rnd() * 120;

  return (
    <div className={cn("relative overflow-hidden grain", className)} role={alt ? "img" : undefined} aria-label={alt || undefined} style={{ background: base }}>
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <filter id={`${id}b`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="38" />
          </filter>
          <pattern id={`${id}l`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="white" strokeOpacity="0.045" strokeWidth="1" />
          </pattern>
          <linearGradient id={`${id}v`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0.45" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.35" />
          </linearGradient>
        </defs>
        <g filter={`url(#${id}b)`}>
          {blobs.map((b, i) => (
            <circle key={i} cx={b.x} cy={b.y} r={b.r} fill={b.c} opacity={b.o} />
          ))}
        </g>
        <rect width="400" height="300" fill={`url(#${id}l)`} />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={ax} cy={ay} r={90 + i * 46} fill="none" stroke="#f4e7c8" strokeOpacity={0.16 - i * 0.04} strokeWidth="0.75" />
        ))}
        <rect width="400" height="300" fill={`url(#${id}v)`} />
      </svg>
      {icon && (
        <CourseIcon
          name={icon}
          strokeWidth={0.75}
          className={cn("absolute bottom-[8%] right-[7%] h-[38%] w-auto text-white/30", iconClassName)}
        />
      )}
    </div>
  );
}
