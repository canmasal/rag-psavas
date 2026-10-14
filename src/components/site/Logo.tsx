import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <circle cx="24" cy="24" r="23" fill="currentColor" />
      <path d="M9 13c5 4 7 14 6 26M39 13c-5 4-7 14-6 26" stroke="#c99a3b" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M10 12.5c4.5-2.4 9-3.5 14-3.5s9.5 1.1 14 3.5" stroke="#c99a3b" strokeWidth="2" fill="none" strokeLinecap="round" />
      <text x="24" y="31" textAnchor="middle" fontFamily="Fraunces Variable, Georgia, serif" fontSize="16" fontWeight="600" fill="#fbf8f3">
        RS
      </text>
    </svg>
  );
}

export function Logo({ light = false, className }: { light?: boolean; className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-3", className)} aria-label="Ragıp Savaş Sanat Akademisi — Ana sayfa">
      <LogoMark className={cn("h-11 w-11 shrink-0", light ? "text-accent" : "text-ink")} />
      <span className="leading-none">
        <span className={cn("block font-display text-[1.2rem] font-semibold", light ? "text-white" : "text-ink")}>Ragıp Savaş</span>
        <span className={cn("mt-1 block text-[0.62rem] font-extrabold tracking-[0.28em]", light ? "text-gold" : "text-accent")}>
          SANAT AKADEMİSİ
        </span>
      </span>
    </Link>
  );
}
