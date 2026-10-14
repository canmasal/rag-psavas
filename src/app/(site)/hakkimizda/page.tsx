import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Eye, Target, Gem } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { ArtCover } from "@/components/art";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "Ragıp Savaş Sanat Akademisi 2007'den bu yana çocuk ve yetişkinlere sahne sanatları, müzik ve görsel sanatlar eğitimi veriyor.",
};

const timeline = [
  { y: "2007", t: "İlk adım", d: "Ragıp Savaş, İzmit Sanat Merkezi'ni kurarak sanat eğitimi yolculuğuna başladı." },
  { y: "2009+", t: "Büyüyen aile", d: "Sakarya, İstanbul ve Bursa'da Ragıp Savaş Sanat Akademisi adıyla yeni okullar açıldı." },
  { y: "Göktürk", t: "İstanbul akademisi", d: "Göktürk'teki akademimiz tiyatro, bale, müzik, resim, dans ve kişisel gelişim branşlarıyla hizmet vermeye başladı." },
  { y: "Bugün", t: "17.000+ mezun", d: "Binlerce çocuk ve yetişkin akademimizde sanatla tanıştı, yüzlercesi profesyonel sahneye adım attı." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Kurumsal"
        title="Sanatla büyüyen nesiller için"
        description="2007'den bu yana çocuklara ve yetişkinlere sanat ve kişisel gelişim eğitimi veriyoruz."
        crumbs={[{ label: "Hakkımızda" }]}
      />
      <section className="py-20">
        <div className="container-rs grid gap-14 lg:grid-cols-2 lg:items-center">
          <div className="prose-rs">
            <p className="font-display !text-2xl leading-snug !text-ink">
              Ragıp Savaş Sanat Akademisi; sahne sanatları, müzik ve görsel sanatlar alanlarında, her yaştan öğrenciye
              nitelikli ve sistematik bir eğitim sunmak amacıyla kurulmuştur.
            </p>
            <p>
              Kurucumuz ve Genel Sanat Yönetmenimiz <strong>Ragıp Savaş</strong>, Mimar Sinan Güzel Sanatlar Üniversitesi Devlet
              Konservatuvarı Tiyatro Bölümü mezunudur. Tiyatro sahnelerinden televizyon ve sinemaya uzanan uzun soluklu
              kariyerinde edindiği deneyimi, yeni nesillere aktarmak için 2007 yılında ilk sanat merkezini açmıştır.
            </p>
            <p>
              Bugün Göktürk&apos;teki akademimizde; klasik bale, müzikal tiyatro, yaratıcı drama, dans, piyano, keman, gitar,
              bateri, şan, yan flüt, resim, seramik, Mix Art, jimnastik ve aikido branşlarında eğitim veriyoruz. Müzik
              eğitimimiz hem Milli Eğitim Bakanlığı hem de London College of Music (LCM) sistemine göre yürütülmektedir.
            </p>
            <p>
              Her öğrencinin farklı bir yeteneği ve öğrenme biçimi olduğuna inanıyor; küçük gruplar, birebir dersler ve
              düzenli gelişim takibiyle her öğrencinin potansiyelini en iyi şekilde ortaya çıkarmayı hedefliyoruz.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ArtCover seed="hakkimizda-1" color="#b8242f" icon="Drama" className="aspect-[3/4] rounded-[1.6rem]" />
            <div className="space-y-4 pt-12">
              <ArtCover seed="hakkimizda-2" color="#1f3a8a" icon="Piano" className="aspect-square rounded-[1.6rem]" />
              <ArtCover seed="hakkimizda-3" color="#c2477a" icon="Sparkles" className="aspect-square rounded-[1.6rem]" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-sand py-20">
        <div className="container-rs grid gap-6 md:grid-cols-3">
          {[
            { Icon: Target, t: "Misyonumuz", d: "Her yaştan bireyin sanatla tanışmasını, kendini keşfetmesini ve yaratıcılığını özgüvenle ifade etmesini sağlayan nitelikli bir eğitim ortamı sunmak." },
            { Icon: Eye, t: "Vizyonumuz", d: "Türkiye'nin sanat eğitiminde örnek gösterilen, sahneye ve sanat dünyasına yetenekli bireyler kazandıran öncü akademisi olmak." },
            { Icon: Gem, t: "Değerlerimiz", d: "Disiplin, sevgi, saygı, yaratıcılık ve süreklilik. Sanatın herkes için olduğuna ve her çocuğun özel olduğuna inanıyoruz." },
          ].map(({ Icon, t, d }) => (
            <div key={t} className="card p-8">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ink text-gold"><Icon className="h-5 w-5" /></span>
              <h2 className="mt-5 text-2xl">{t}</h2>
              <p className="mt-3 leading-relaxed text-muted">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20">
        <div className="container-rs">
          <SectionHeading eyebrow="Yolculuğumuz" title="Bir sahneden bir akademiye" />
          <ol className="mt-12 grid gap-6 md:grid-cols-4">
            {timeline.map((item) => (
              <li key={item.y} className="relative border-t-2 border-ink pt-6">
                <span className="absolute -top-[7px] left-0 h-3 w-3 rounded-full bg-accent" />
                <p className="font-display text-3xl text-accent">{item.y}</p>
                <p className="mt-2 font-bold">{item.t}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.d}</p>
              </li>
            ))}
          </ol>
          <div className="mt-16 flex flex-wrap gap-3">
            <Link href="/ragip-savas-kimdir" className="btn btn-dark">Ragıp Savaş Kimdir? <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/egitimlerimiz" className="btn btn-outline">Eğitimlerimiz</Link>
          </div>
        </div>
      </section>
    </>
  );
}
