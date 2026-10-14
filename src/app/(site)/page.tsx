import Link from "next/link";
import { ArrowRight, Award, CalendarCheck, CreditCard, GraduationCap, HeartHandshake, Play, Quote, ShieldCheck, Sparkles, Star, UserPlus } from "lucide-react";
import { db } from "@/lib/db";
import { ArtCover } from "@/components/art";
import { CourseIcon } from "@/components/icons";
import { CourseCard } from "@/components/site/CourseCard";
import { PostCard } from "@/components/site/PostCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { testimonials } from "@/data/content";

export const revalidate = 300;

export default async function HomePage() {
  const [courses, posts, gallery] = await Promise.all([
    db.course.findMany({ where: { active: true }, orderBy: { order: "asc" }, include: { packages: { orderBy: { price: "asc" }, take: 1 } } }),
    db.post.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" }, take: 3 }),
    db.galleryItem.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }], take: 5 }),
  ]);
  const featured = courses.filter((c) => c.featured).slice(0, 6);
  const heroCourses = courses.slice(0, 6);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 top-10 h-[34rem] w-[34rem] rounded-full bg-accent/30 blur-[120px]" />
          <div className="absolute -right-20 bottom-0 h-[26rem] w-[26rem] rounded-full bg-gold/20 blur-[110px]" />
          {/* Sahne perdesi motifi */}
          <svg className="absolute inset-x-0 top-0 h-24 w-full text-accent/40" viewBox="0 0 1200 100" preserveAspectRatio="none" aria-hidden>
            <path d="M0 0h1200v40c-50 0-50 30-100 30S1050 40 1000 40s-50 30-100 30S850 40 800 40s-50 30-100 30S650 40 600 40s-50 30-100 30S450 40 400 40s-50 30-100 30S250 40 200 40s-50 30-100 30S50 40 0 40Z" fill="currentColor" />
          </svg>
        </div>
        <div className="container-rs relative grid items-center gap-14 py-20 md:py-28 lg:grid-cols-[1.1fr_1fr]">
          <div className="animate-fade-up">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-bold tracking-wide text-gold">
              <Sparkles className="h-3.5 w-3.5" /> 2007&apos;den beri Göktürk&apos;te
            </p>
            <h1 className="mt-6 text-5xl font-medium leading-[1.02] md:text-7xl">
              Sahneye çıkan her çocuğun <em className="font-normal text-gold">hikâyesi</em> burada başlar.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
              Klasik baleden müzikal tiyatroya, piyanodan seramiğe 15&apos;ten fazla branşta; çocuk, genç ve yetişkinlere
              uzman eğitmenlerle sanat eğitimi.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/ucretsiz-deneme-dersi" className="btn btn-primary">
                Ücretsiz Deneme Dersi Al <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/egitimlerimiz" className="btn btn-ghost-light">
                Eğitimleri Keşfet
              </Link>
            </div>
            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-8">
              {[
                ["17.000+", "Mezun öğrenci"],
                ["15+", "Sanat branşı"],
                ["18 yıl", "Eğitim deneyimi"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="sr-only">{l}</dt>
                  <dd className="font-display text-3xl text-white md:text-4xl">{v}</dd>
                  <dd className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/50">{l}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative hidden lg:block">
            <div className="grid grid-cols-3 gap-3">
              {heroCourses.map((c, i) => (
                <Link
                  key={c.slug}
                  href={`/egitimlerimiz/${c.slug}`}
                  className={`group relative overflow-hidden rounded-[1.4rem] ${i % 3 === 1 ? "translate-y-10" : ""}`}
                >
                  <ArtCover seed={c.slug} color={c.color} icon={c.icon} image={c.image} className="aspect-[3/4] transition duration-500 group-hover:scale-105" />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-10 font-display text-lg">{c.title}</span>
                </Link>
              ))}
            </div>
            <div className="absolute -bottom-6 -left-8 flex items-center gap-3 rounded-2xl bg-white p-4 text-ink shadow-2xl">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-gold-soft text-gold"><Award className="h-5 w-5" /></span>
              <span className="text-sm leading-tight"><b className="block">LCM & MEB</b>onaylı müzik programı</span>
            </div>
          </div>
        </div>
      </section>

      {/* BRANŞ ŞERİDİ */}
      <section className="border-b border-line bg-white">
        <div className="container-rs flex gap-2 overflow-x-auto py-5 [scrollbar-width:none]">
          {courses.map((c) => (
            <Link key={c.slug} href={`/egitimlerimiz/${c.slug}`} className="flex shrink-0 items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold transition hover:border-ink">
              <CourseIcon name={c.icon} className="h-4 w-4" />
              {c.title}
            </Link>
          ))}
        </div>
      </section>

      {/* ÖNE ÇIKAN EĞİTİMLER */}
      <section className="py-20 md:py-28">
        <div className="container-rs">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading eyebrow="Eğitimlerimiz" title="Her yaşa, her yeteneğe uygun bir sahne" description="Sahne sanatları, müzik, görsel sanatlar ve hareket alanlarında uzman kadromuzla sistematik ve keyifli programlar." />
            <Link href="/egitimlerimiz" className="btn btn-outline shrink-0">Tüm Eğitimler <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((c) => (
              <CourseCard key={c.slug} course={{ ...c, minPrice: c.packages[0]?.months ? c.packages[0]?.price : undefined }} />
            ))}
          </div>
        </div>
      </section>

      {/* NEDEN BİZ */}
      <section className="bg-sand py-20 md:py-28">
        <div className="container-rs grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div className="relative">
            <ArtCover seed="ragip-savas-portre" color="#2a2236" icon="Drama" className="aspect-[4/5] rounded-[2rem]" />
            <div className="absolute -bottom-8 -right-4 max-w-xs rounded-2xl bg-white p-6 shadow-2xl md:-right-10">
              <Quote className="h-6 w-6 text-accent" />
              <p className="mt-2 font-display text-lg leading-snug">
                &ldquo;Sanat, çocuğa kendini ifade etmenin en güzel yolunu öğretir.&rdquo;
              </p>
              <p className="mt-3 text-sm font-bold">Ragıp Savaş</p>
              <p className="text-xs text-muted">Kurucu & Genel Sanat Yönetmeni</p>
            </div>
          </div>
          <div>
            <SectionHeading eyebrow="Neden Ragıp Savaş?" title="Sahne deneyimiyle şekillenen bir eğitim anlayışı" />
            <p className="mt-5 text-lg leading-relaxed text-muted">
              Tiyatro, sinema ve televizyonda 35 yılı aşkın deneyime sahip Ragıp Savaş&apos;ın kurduğu akademimizde amacımız;
              çocukların sanatla tanışmasını, kendini keşfetmesini ve özgüvenle sahneye çıkmasını sağlamaktır.
            </p>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {[
                { Icon: GraduationCap, t: "Uzman eğitmen kadrosu", d: "Konservatuvar ve güzel sanatlar mezunu, alanında deneyimli eğitmenler." },
                { Icon: Award, t: "Uluslararası sertifika", d: "Müzik branşlarında London College of Music (LCM) sınavları." },
                { Icon: Star, t: "Yıl sonu gösterileri", d: "Öğrencilerimiz her yıl profesyonel sahnede seyirciyle buluşur." },
                { Icon: HeartHandshake, t: "Gelişim takibi", d: "Düzenli veli görüşmeleri ve dönemlik gelişim raporları." },
              ].map(({ Icon, t, d }) => (
                <div key={t} className="rounded-2xl border border-line bg-white p-5">
                  <Icon className="h-6 w-6 text-accent" />
                  <p className="mt-3 font-bold">{t}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{d}</p>
                </div>
              ))}
            </div>
            <Link href="/hakkimizda" className="btn btn-dark mt-10">Akademimizi Tanıyın <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      {/* NASIL KAYIT OLUNUR */}
      <section className="py-20 md:py-28">
        <div className="container-rs">
          <SectionHeading align="center" eyebrow="Online Kayıt" title="4 adımda kaydınızı tamamlayın" description="Üye panelimiz sayesinde kayıt, ödeme ve ders takibini tek yerden, dilediğiniz zaman yapabilirsiniz." />
          <ol className="mt-14 grid gap-6 md:grid-cols-4">
            {[
              { Icon: UserPlus, t: "Üye olun", d: "Birkaç saniyede ücretsiz üyelik oluşturun." },
              { Icon: Sparkles, t: "Branşı seçin", d: "Öğrenci bilgilerini ekleyin, eğitim ve paket seçin." },
              { Icon: CreditCard, t: "Güvenle ödeyin", d: "Kredi kartı (taksit) veya Havale/EFT ile ödeyin." },
              { Icon: CalendarCheck, t: "Derse başlayın", d: "Ders programınız ve duyurular panelinizde." },
            ].map(({ Icon, t, d }, i) => (
              <li key={t} className="relative rounded-[1.4rem] border border-line bg-white p-7">
                <span className="absolute right-6 top-5 font-display text-5xl text-line">0{i + 1}</span>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ink text-gold"><Icon className="h-5 w-5" /></span>
                <p className="mt-5 font-display text-xl">{t}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link href="/kayit" className="btn btn-primary">Hemen Üye Ol</Link>
            <span className="flex items-center gap-2 text-sm text-muted"><ShieldCheck className="h-4 w-4 text-emerald-600" /> 256-bit SSL & 3D Secure güvenli ödeme</span>
          </div>
        </div>
      </section>

      {/* YORUMLAR */}
      <section className="relative overflow-hidden bg-ink py-20 text-white md:py-28">
        <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-accent/25 blur-[100px]" />
        <div className="container-rs relative">
          <SectionHeading light eyebrow="Veli & Öğrenci Yorumları" title="Onların sahnesinden" />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((t) => (
              <figure key={t.name} className="flex flex-col rounded-[1.4rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="flex gap-0.5 text-gold">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div>
                <blockquote className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-white/80">&ldquo;{t.text}&rdquo;</blockquote>
                <figcaption className="mt-6 border-t border-white/10 pt-4">
                  <p className="font-bold">{t.name}</p>
                  <p className="text-xs text-white/50">{t.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* GALERİ */}
      {gallery.length > 0 && (
        <section className="py-20 md:py-28">
          <div className="container-rs">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <SectionHeading eyebrow="Galeri" title="Akademiden kareler" description="Derslerimizden, gösterilerimizden ve sergilerimizden anlar." />
              <Link href="/galeri" className="btn btn-outline shrink-0">Galeriyi Gör <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="mt-12 grid auto-rows-[11rem] grid-cols-2 gap-3 md:auto-rows-[14rem] md:grid-cols-4">
              {gallery.map((g, i) => (
                <Link
                  key={g.id}
                  href="/galeri"
                  className={`group relative overflow-hidden rounded-[1.2rem] ${i === 0 ? "col-span-2 row-span-2" : ""}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g.imageUrl} alt={g.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
                  {g.videoUrl && <span className="absolute left-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-ink"><Play className="h-4 w-4 fill-current" /></span>}
                  <span className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black/70 to-transparent p-4 pt-10 text-sm font-semibold text-white opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">{g.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BLOG */}
      {posts.length > 0 && (
        <section className="border-t border-line bg-white py-20 md:py-28">
          <div className="container-rs">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <SectionHeading eyebrow="Blog" title="Sanat eğitimi üzerine yazılar" />
              <Link href="/blog" className="btn btn-outline shrink-0">Tüm Yazılar <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="mt-12 grid gap-10 md:grid-cols-3">
              {posts.map((p) => <PostCard key={p.slug} post={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20">
        <div className="container-rs">
          <div className="relative overflow-hidden rounded-[2rem] bg-accent px-8 py-14 text-white md:px-16 md:py-20">
            <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full border-[50px] border-white/10" />
            <div className="pointer-events-none absolute -bottom-24 right-40 h-64 w-64 rounded-full bg-gold/30 blur-3xl" />
            <div className="relative grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <h2 className="text-4xl font-medium leading-tight md:text-5xl">İlk ders bizden. Çocuğunuzun yeteneğini birlikte keşfedelim.</h2>
                <p className="mt-4 max-w-xl text-white/80">Formu doldurun, eğitim danışmanımız size en uygun gün ve saati planlamak için ulaşsın.</p>
              </div>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <Link href="/ucretsiz-deneme-dersi" className="btn btn-light">Deneme Dersi Planla <ArrowRight className="h-4 w-4" /></Link>
                <Link href="/iletisim" className="btn btn-ghost-light">Bize Ulaşın</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
