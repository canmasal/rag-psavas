import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ChevronDown, CreditCard, Landmark, Wallet } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { faqs } from "@/data/content";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Rehber & Sıkça Sorulan Sorular",
  description: "Kayıt süreci, yaşa göre branş seçimi, ödeme seçenekleri, akademi kuralları, LCM sınavları ve sıkça sorulan sorular.",
};

const ageGuide = [
  { age: "4–6 yaş", desc: "Oyun temelli, motor ve sosyal becerileri destekleyen branşlar.", slugs: ["yaratici-drama", "klasik-bale", "mix-art", "jimnastik", "resim"] },
  { age: "7–10 yaş", desc: "Enstrüman eğitimine ve teknik çalışmalara başlamak için ideal dönem.", slugs: ["piyano", "keman", "muzikal-tiyatro", "dans", "aikido", "seramik"] },
  { age: "11–17 yaş", desc: "Sahne ve teknik derinlik; yetenek sınavlarına hazırlık.", slugs: ["muzikal-tiyatro", "san", "gitar", "bateri", "yan-flut", "resim"] },
  { age: "Yetişkin", desc: "Hobi, kişisel gelişim ve stres yönetimi için esnek programlar.", slugs: ["piyano", "gitar", "san", "seramik", "resim", "dans"] },
];

const sections = [
  { id: "kayit", t: "Kayıt süreci" },
  { id: "yas", t: "Yaşa göre branş rehberi" },
  { id: "odeme", t: "Ödeme seçenekleri" },
  { id: "kurallar", t: "Akademi kuralları" },
  { id: "lcm", t: "LCM müzik sınavları" },
  { id: "sss", t: "Sıkça sorulan sorular" },
];

export default async function GuidePage() {
  const courses = await db.course.findMany({ where: { active: true }, select: { slug: true, title: true, color: true } });
  const bySlug = Object.fromEntries(courses.map((c) => [c.slug, c]));
  return (
    <>
      <PageHero eyebrow="Rehber" title="Veli ve öğrenci rehberi" description="Kayıttan ödemeye, branş seçiminden akademi kurallarına kadar bilmeniz gereken her şey tek sayfada." crumbs={[{ label: "Rehber" }]} />
      <section className="py-16 md:py-20">
        <div className="container-rs grid gap-12 lg:grid-cols-[16rem_1fr]">
          <aside className="hidden lg:block">
            <nav className="sticky top-28 space-y-1 border-l border-line">
              {sections.map((s) => (
                <a key={s.id} href={`#${s.id}`} className="-ml-px block border-l-2 border-transparent py-2 pl-4 text-sm font-semibold text-muted hover:border-accent hover:text-ink">{s.t}</a>
              ))}
            </nav>
          </aside>
          <div className="space-y-20">
            <div id="kayit" className="scroll-mt-28">
              <h2 className="text-3xl md:text-4xl">Kayıt süreci</h2>
              <ol className="mt-8 grid gap-4 md:grid-cols-2">
                {[
                  ["Ücretsiz deneme dersi", "Branşı tanımak için ücretsiz deneme dersine katılın (isteğe bağlı)."],
                  ["Üyelik oluşturun", "Web sitemiz üzerinden birkaç saniyede üye olun."],
                  ["Öğrenci ekleyin", "Üye panelinde çocuğunuzun / öğrencinin bilgilerini ekleyin."],
                  ["Eğitim ve paket seçin", "Branş ve aylık, dönemlik veya yıllık paketlerden birini seçin."],
                  ["Ödemeyi tamamlayın", "Kredi kartı ile taksitli ya da Havale/EFT ile ödeme yapın."],
                  ["Ders programınız hazır", "Ders gün ve saatiniz danışmanımız tarafından teyit edilir, panelinizde görüntülenir."],
                ].map(([t, d], i) => (
                  <li key={t} className="card flex gap-4 p-5">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink font-display text-gold">{i + 1}</span>
                    <div><p className="font-bold">{t}</p><p className="mt-1 text-sm text-muted">{d}</p></div>
                  </li>
                ))}
              </ol>
            </div>

            <div id="yas" className="scroll-mt-28">
              <h2 className="text-3xl md:text-4xl">Yaşa göre branş rehberi</h2>
              <p className="mt-3 text-muted">Her çocuk farklıdır; bu tablo bir başlangıç noktasıdır. Kesin karar için deneme dersi öneririz.</p>
              <div className="mt-8 divide-y divide-line overflow-hidden rounded-[1.25rem] border border-line bg-white">
                {ageGuide.map((g) => (
                  <div key={g.age} className="grid gap-4 p-6 md:grid-cols-[10rem_1fr]">
                    <p className="font-display text-2xl text-accent">{g.age}</p>
                    <div>
                      <p className="text-muted">{g.desc}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {g.slugs.filter((s) => bySlug[s]).map((s) => (
                          <Link key={s} href={`/egitimlerimiz/${s}`} className="flex items-center gap-2 rounded-full border border-line px-3 py-1 text-sm font-semibold hover:border-ink">
                            <span className="h-2 w-2 rounded-full" style={{ background: bySlug[s].color }} />{bySlug[s].title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div id="odeme" className="scroll-mt-28">
              <h2 className="text-3xl md:text-4xl">Ödeme seçenekleri</h2>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {[
                  { Icon: CreditCard, t: "Kredi / Banka Kartı", d: "3D Secure korumalı iyzico altyapısıyla güvenli ödeme. Bankanıza göre 2–9 taksit seçeneği." },
                  { Icon: Landmark, t: "Havale / EFT", d: "Kayıt sırasında size iletilen IBAN'a açıklama kısmına kayıt numaranızı yazarak ödeme yapın." },
                  { Icon: Wallet, t: "Akademide ödeme", d: "Dilerseniz sekreterliğimizde kredi kartı ile de ödemenizi gerçekleştirebilirsiniz." },
                ].map(({ Icon, t, d }) => (
                  <div key={t} className="card p-6"><Icon className="h-6 w-6 text-accent" /><p className="mt-4 font-bold">{t}</p><p className="mt-2 text-sm leading-relaxed text-muted">{d}</p></div>
                ))}
              </div>
            </div>

            <div id="kurallar" className="scroll-mt-28">
              <h2 className="text-3xl md:text-4xl">Akademi kuralları</h2>
              <ul className="prose-rs mt-6">
                <li>Öğrencilerin derse en az 10 dakika önce gelmeleri ve branşa uygun kıyafetle katılmaları beklenir.</li>
                <li>Devamsızlıkların en az 24 saat önceden bildirilmesi halinde telafi dersi planlanır.</li>
                <li>Veliler, ders sırasında sınıf dışında bekleme alanını kullanabilir. Derslerin akışı için sınıfa giriş yapılmaz.</li>
                <li>Resmi tatillerde dersler yapılmaz; bu dersler dönem içinde telafi edilir.</li>
                <li>Yıl sonu gösterisi ve sergilerine katılım, öğrencinin gelişimi için önemle tavsiye edilir.</li>
                <li>Ders kayıtları ve fotoğraf paylaşımları KVKK kapsamında veli onayı ile yapılır.</li>
              </ul>
            </div>

            <div id="lcm" className="scroll-mt-28 rounded-[1.5rem] bg-ink p-8 text-white md:p-12">
              <h2 className="text-3xl md:text-4xl">LCM müzik sınavları</h2>
              <p className="mt-4 max-w-2xl leading-relaxed text-white/75">
                Müzik eğitimimiz Milli Eğitim Bakanlığı ve London College of Music (LCM) sistemine göre yürütülür. İsteyen
                öğrencilerimiz yıl sonunda LCM sınavlarına girerek uluslararası geçerliliği olan derece sertifikaları alabilir.
              </p>
              <Link href="/blog/lcm-sinavlari-nedir" className="btn btn-light mt-6">LCM hakkında detaylı bilgi <ArrowRight className="h-4 w-4" /></Link>
            </div>

            <div id="sss" className="scroll-mt-28">
              <h2 className="text-3xl md:text-4xl">Sıkça sorulan sorular</h2>
              <div className="mt-8 space-y-3">
                {faqs.map((f) => (
                  <details key={f.q} className="group card overflow-hidden">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-bold [&::-webkit-details-marker]:hidden">
                      {f.q}
                      <ChevronDown className="h-5 w-5 shrink-0 transition group-open:rotate-180" />
                    </summary>
                    <p className="px-5 pb-5 leading-relaxed text-muted">{f.a}</p>
                  </details>
                ))}
              </div>
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
                  }),
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
