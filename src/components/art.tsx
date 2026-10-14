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
  const r = clamp(((n >> 16) & 255) * (1 + amount));
  const g = clamp(((n >> 8) & 255) * (1 + amount));
  const b = clamp((n & 255) * (1 + amount));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/**
 * Görsel yüklenmemiş içerikler için markaya uygun, deterministik soyut kapak görseli.
 */
export function ArtCover({
  seed,
  color = "#b8242f",
  icon,
  image,
  className,
  iconClassName,
  alt = "",
}: {
  seed: string;
  color?: string;
  icon?: string;
  image?: string | null;
  className?: string;
  iconClassName?: string;
  alt?: string;
}) {
  if (image) {
    return (
      <div className={cn("relative overflow-hidden bg-sand", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={alt} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      </div>
    );
  }
  const rnd = hash(seed);
  const id = `g${Math.floor(rnd() * 1e6)}`;
  const c1 = shade(color, 0.15);
  const c2 = shade(color, -0.45);
  const cx = 60 + rnd() * 260;
  const cy = 40 + rnd() * 180;
  const r = 90 + rnd() * 90;
  const arcs = Array.from({ length: 4 }, (_, i) => ({ r: 60 + i * 38 + rnd() * 10, o: 0.18 - i * 0.03 }));
  const ax = rnd() * 400;
  const ay = 300 - rnd() * 80;

  return (
    <div className={cn("relative overflow-hidden grain", className)} role="img" aria-label={alt}>
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id={`${id}a`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={c1} />
            <stop offset="1" stopColor={c2} />
          </linearGradient>
          <radialGradient id={`${id}b`}>
            <stop offset="0" stopColor="#f4e7c8" stopOpacity="0.55" />
            <stop offset="1" stopColor="#f4e7c8" stopOpacity="0" />
          </radialGradient>
          <pattern id={`${id}d`} width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill="white" fillOpacity="0.18" />
          </pattern>
        </defs>
        <rect width="400" height="300" fill={`url(#${id}a)`} />
        <circle cx={cx} cy={cy} r={r} fill={`url(#${id}b)`} />
        {arcs.map((a, i) => (
          <circle key={i} cx={ax} cy={ay} r={a.r} fill="none" stroke="white" strokeOpacity={a.o} strokeWidth="1.5" />
        ))}
        <rect x={rnd() * 200} y={rnd() * 120} width="140" height="110" fill={`url(#${id}d)`} />
        <path
          d={`M0 ${230 + rnd() * 30} C 120 ${170 + rnd() * 60}, 260 ${280 - rnd() * 60}, 400 ${200 + rnd() * 40} L400 300 L0 300 Z`}
          fill="black"
          fillOpacity="0.14"
        />
      </svg>
      {icon && (
        <CourseIcon
          name={icon}
          strokeWidth={1.1}
          className={cn("absolute -bottom-4 -right-4 h-2/3 w-auto text-white/25", iconClassName)}
        />
      )}
    </div>
  );
}
