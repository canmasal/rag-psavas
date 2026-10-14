import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function PageHero({
  title,
  eyebrow,
  description,
  crumbs = [],
  children,
}: {
  title: string;
  eyebrow?: string;
  description?: string;
  crumbs?: { href?: string; label: string }[];
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-sand">
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border-[40px] border-gold/15" />
      <div className="pointer-events-none absolute -bottom-32 right-48 h-64 w-64 rounded-full bg-accent/10 blur-2xl" />
      <div className="container-rs relative py-14 md:py-20">
        <nav aria-label="Sayfa yolu" className="mb-6 flex flex-wrap items-center gap-1 text-xs font-semibold text-muted">
          <Link href="/" className="hover:text-ink">Ana Sayfa</Link>
          {crumbs.map((c) => (
            <span key={c.label} className="flex items-center gap-1">
              <ChevronRight className="h-3.5 w-3.5" />
              {c.href ? <Link href={c.href} className="hover:text-ink">{c.label}</Link> : <span className="text-ink">{c.label}</span>}
            </span>
          ))}
        </nav>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="mt-3 max-w-4xl text-4xl font-medium leading-[1.08] md:text-6xl">{title}</h1>
        {description && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{description}</p>}
        {children}
      </div>
    </section>
  );
}
