import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Clapperboard, Theater, Tv, Trophy } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { ArtCover } from "@/components/art";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Ragıp Savaş Kimdir?",
  description: "Akademimizin kurucusu ve Genel Sanat Yönetmeni Ragıp Savaş'ın hayatı ve sanat kariyeri.",
};

export default async function BioPage() {
  const settings = await getSettings();
  return (
    <>
      <PageHero eyebrow="Kurucumuz" title="Ragıp Savaş Kimdir?" crumbs={[{ href: "/hakkimizda", label: "Kurumsal" }, { label: "Ragıp Savaş Kimdir?" }]} />
      <section className="py-20">
        <div className="container-rs grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <ArtCover seed="ragip-savas-bio" color="#2a2236" icon="Drama" image={settings.founderImage || null} alt="Ragıp Savaş" className="aspect-[4/5] rounded-[2rem]" />
            <div className="mt-6 grid grid-cols-2 gap-3 text-center">
              {[["1966", "İzmit doğumlu"], ["1990", "Konservatuvar mezuniyeti"], ["2007", "Akademinin kuruluşu"], ["35+ yıl", "Sahne deneyimi"]].map(([v, l]) => (
                <div key={l} className="card p-4">
                  <p className="font-display text-2xl text-accent">{v}</p>
                  <p className="mt-1 text-xs font-semibold text-muted">{l}</p>
                </div>
              ))}
            </div>
          </div>
          <article className="prose-rs">
            <p className="font-display !text-2xl leading-snug !text-ink">
              Oyuncu, yönetmen ve eğitmen Ragıp Savaş, 1966 yılında İzmit&apos;te doğdu. Sahneye olan tutkusunu, binlerce öğrenciye
              ilham veren bir eğitim yolculuğuna dönüştürdü.
            </p>
            <h2>Eğitim ve Sahne Yılları</h2>
            <p>
              1986 yılında <strong>Mimar Sinan Üniversitesi Devlet Konservatuvarı Tiyatro Bölümü</strong>&apos;ne giren Savaş, 1990
              yılında mezun oldu. Profesyonel tiyatro hayatına <strong>Bakırköy Belediye Tiyatroları</strong>&apos;nda başladı ve
              kurumun kurucu kadrosunda yer aldı. Gençlik yıllarında voleybolcu olarak da sporla iç içe bir hayat sürdü.
            </p>
            <p>
              2004 yılında <strong>Kocaeli Büyükşehir Belediyesi Şehir Tiyatrosu</strong>&apos;na Genel Sanat Yönetmen Vekili olarak
              atandı ve pek çok prodüksiyonun hayata geçmesine öncülük etti.
            </p>
            <h2>Televizyon ve Sinema</h2>
            <p>
              Sinema ve televizyonda da pek çok önemli yapımda rol alan Savaş; <strong>Kurtlar Vadisi Pusu</strong>,{" "}
              <strong>Kuruluş: Osman</strong> gibi geniş kitlelere ulaşan dizilerin yanı sıra çeşitli sinema filmlerinde yer
              aldı.
            </p>
            <h2>Sanat Eğitimine Adanmış Bir Yolculuk</h2>
            <p>
              2007 yılında <strong>İzmit Sanat Merkezi</strong>&apos;ni kuran Ragıp Savaş, ardından Sakarya, İstanbul ve Bursa&apos;da
              Ragıp Savaş Sanat Akademisi adıyla yeni okullar açtı. Bugün İstanbul Göktürk&apos;teki akademimizin kurucusu ve
              Genel Sanat Yönetmeni olarak, sanatı çocuklara sevdirmek ve yeni yetenekler yetiştirmek için çalışmalarını
              sürdürmektedir.
            </p>
            <p>Evli ve bir kız çocuğu babasıdır.</p>
          </article>
        </div>
        <div className="container-rs mt-16 grid gap-4 md:grid-cols-4">
          {[
            { Icon: Theater, t: "Tiyatro", d: "Bakırköy Belediye Tiyatroları kurucu kadrosu" },
            { Icon: Trophy, t: "Yöneticilik", d: "Kocaeli BB Şehir Tiyatrosu Genel Sanat Yönetmen Vekili" },
            { Icon: Tv, t: "Televizyon", d: "Kurtlar Vadisi Pusu, Kuruluş: Osman ve daha fazlası" },
            { Icon: Clapperboard, t: "Eğitim", d: "2007'den bu yana sanat akademileri kurucusu" },
          ].map(({ Icon, t, d }) => (
            <div key={t} className="rounded-2xl bg-ink p-6 text-white">
              <Icon className="h-6 w-6 text-gold" />
              <p className="mt-4 font-display text-xl">{t}</p>
              <p className="mt-1 text-sm text-white/65">{d}</p>
            </div>
          ))}
        </div>
        <div className="container-rs mt-12">
          <Link href="/egitimlerimiz/muzikal-tiyatro" className="btn btn-primary">Müzikal Tiyatro Programı <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </>
  );
}
