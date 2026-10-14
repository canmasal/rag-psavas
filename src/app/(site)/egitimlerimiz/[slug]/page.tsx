import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, CalendarDays, Check, Clock, Phone, ShieldCheck, Users, UsersRound } from "lucide-react";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { ArtCover } from "@/components/art";
import { CourseIcon } from "@/components/icons";
import { CourseCard } from "@/components/site/CourseCard";
import { Markdown } from "@/lib/markdown";
import { formatPrice, cn } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = await db.course.findUnique({ where: { slug } });
  if (!course) return {};
  return { title: `${course.title} Eğitimi`, description: course.shortDesc };
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const [course, settings] = await Promise.all([
    db.course.findUnique({ where: { slug }, include: { packages: { orderBy: [{ order: "asc" }, { price: "asc" }] } } }),
    getSettings(),
  ]);
  if (!course || !course.active) notFound();

  const related = await db.course.findMany({
    where: { active: true, category: course.category, NOT: { id: course.id } },
    take: 3,
    orderBy: { order: "asc" },
    include: { packages: { orderBy: { price: "asc" } } },
  });
  const highlights = course.highlights.split("\n").map((s) => s.trim()).filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.shortDesc,
    provider: { "@type": "Organization", name: settings.siteName },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="relative overflow-hidden text-white" style={{ background: course.color }}>
        <ArtCover seed={course.slug + "-hero"} color={course.color} icon={course.icon} image={course.image} className="absolute inset-0 opacity-90" iconClassName="h-[120%] -bottom-10 -right-10 text-white/15" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />
        <div className="container-rs relative py-16 md:py-24">
          <nav className="mb-8 flex flex-wrap items-center gap-2 text-xs font-semibold text-white/70">
            <Link href="/" className="hover:text-white">Ana Sayfa</Link> /
            <Link href="/egitimlerimiz" className="hover:text-white">Eğitimlerimiz</Link> /
            <span className="text-white">{course.title}</span>
          </nav>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider backdrop-blur">
            <CourseIcon name={course.icon} className="h-4 w-4" /> {course.category}
          </span>
          <h1 className="mt-5 text-5xl font-medium md:text-7xl">{course.title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85">{course.shortDesc}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#paketler" className="btn btn-light">Paketler & Kayıt <ArrowRight className="h-4 w-4" /></a>
            <Link href={`/ucretsiz-deneme-dersi?brans=${course.slug}`} className="btn btn-ghost-light">Ücretsiz Deneme Dersi</Link>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-white">
        <div className="container-rs grid grid-cols-2 divide-line md:grid-cols-4 md:divide-x">
          {[
            { Icon: Users, l: "Yaş grubu", v: course.ageRange },
            { Icon: Clock, l: "Ders süresi", v: course.duration },
            { Icon: UsersRound, l: "Ders formatı", v: course.format },
            { Icon: CalendarDays, l: "Ders saatleri", v: course.schedule },
          ].map(({ Icon, l, v }) => (
            <div key={l} className="flex gap-3 px-2 py-6 md:px-6">
              <Icon className="mt-0.5 h-5 w-5 shrink-0" style={{ color: course.color }} />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted">{l}</p>
                <p className="mt-1 text-sm font-semibold">{v}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container-rs grid gap-14 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <Markdown source={course.content} />
          </div>
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            {highlights.length > 0 && (
              <div className="card p-7">
                <p className="font-display text-xl">Programın öne çıkanları</p>
                <ul className="mt-5 space-y-3">
                  {highlights.map((h) => (
                    <li key={h} className="flex gap-3 text-sm">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-white" style={{ background: course.color }}>
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="rounded-[1.25rem] bg-ink p-7 text-white">
              <p className="font-display text-xl">Aklınıza takılan bir şey mi var?</p>
              <p className="mt-2 text-sm text-white/70">Eğitim danışmanlarımız tüm sorularınızı yanıtlamaktan mutluluk duyar.</p>
              <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`} className="btn btn-light btn-sm mt-5">
                <Phone className="h-4 w-4" /> {settings.phone}
              </a>
            </div>
          </aside>
        </div>
      </section>

      {course.packages.length > 0 && (
        <section id="paketler" className="scroll-mt-24 bg-sand py-16 md:py-24">
          <div className="container-rs">
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow justify-center">Paketler</p>
              <h2 className="mt-3 text-4xl font-medium md:text-5xl">Size uygun paketi seçin</h2>
              <p className="mt-4 text-muted">Online kayıt oluşturun; kredi kartı ile taksitli veya Havale/EFT ile ödeyin.</p>
            </div>
            <div className={cn("mx-auto mt-12 grid max-w-5xl gap-6", course.packages.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2")}>
              {course.packages.map((p) => (
                <div key={p.id} className={cn("relative flex flex-col rounded-[1.4rem] border bg-white p-8", p.popular ? "border-ink shadow-2xl md:-translate-y-3" : "border-line")}>
                  {p.popular && <span className="absolute -top-3 left-8 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white">En çok tercih edilen</span>}
                  <p className="font-display text-2xl">{p.name}</p>
                  {p.description && <p className="mt-1 text-sm text-muted">{p.description}</p>}
                  <p className="mt-6 font-display text-5xl font-medium">{formatPrice(p.price)}</p>
                  <p className="mt-1 text-xs font-semibold text-muted">KDV dahil · {p.months > 1 ? `aylık ${formatPrice(Math.round(p.price / p.months))}` : "tek ödeme"}</p>
                  <Link href={`/panel/yeni-kayit?kurs=${course.slug}&paket=${p.id}`} className={cn("btn mt-8 w-full", p.popular ? "btn-primary" : "btn-dark")}>
                    Kayıt Ol
                  </Link>
                </div>
              ))}
            </div>
            <p className="mt-8 flex items-center justify-center gap-2 text-sm text-muted">
              <ShieldCheck className="h-4 w-4 text-emerald-600" /> Güvenli ödeme · Kardeş indirimi için bizimle iletişime geçin.
            </p>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container-rs">
            <h2 className="text-3xl font-medium md:text-4xl">Bunlar da ilginizi çekebilir</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((c) => (
                <CourseCard key={c.slug} course={{ ...c, minPrice: c.packages.find((p) => p.months === 1)?.price }} />
              ))}
            </div>
          </div>
        </section>
      )}
      {course.packages.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-4 py-3 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.25)] backdrop-blur lg:hidden">
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-muted">{course.title}</p>
              <p className="font-display text-lg leading-tight">{formatPrice(Math.min(...course.packages.map((p) => p.price)))}<span className="text-xs font-sans text-muted">&apos;den başlayan</span></p>
            </div>
            <a href="#paketler" className="btn btn-primary btn-sm">Kayıt Ol</a>
          </div>
        </div>
      )}
    </>
  );
}
