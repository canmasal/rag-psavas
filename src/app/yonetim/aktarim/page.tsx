import { PanelHeader } from "@/components/dashboard/Shell";
import { ImportForm } from "@/components/dashboard/ImportForm";

export const maxDuration = 300;

export default function ImportPage() {
  return (
    <>
      <PanelHeader title="WordPress'ten Aktarım" description="Eski sitenizdeki fotoğrafları, blog yazılarını ve eğitim içeriklerini tek tıkla yeni siteye taşıyın." />
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="card p-6"><ImportForm /></div>
        <div className="card self-start p-6 text-sm leading-relaxed text-muted">
          <p className="font-display text-xl text-ink">Nasıl çalışır?</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Eski sitenin herkese açık WordPress REST API&apos;si (<code>/wp-json/wp/v2</code>) okunur; şifre gerekmez.</li>
            <li>Medya kütüphanesindeki fotoğraflar indirilip <b>Galeri</b>&apos;ye eklenir (logo ve küçük görseller atlanır).</li>
            <li>Yazılar, kapak görselleri ve kategorileriyle <b>Blog</b>&apos;a aktarılır.</li>
            <li>Bağlantı adı eşleşen eğitim sayfalarının öne çıkan görselleri <b>Eğitimler</b>&apos;e eklenir. İsterseniz eski açıklama metinleri de alınır.</li>
            <li>Geniş bir fotoğraf bulunursa ana sayfa kapak fotoğrafı olarak ayarlanır.</li>
            <li>İşlem birkaç dakika sürebilir. Tekrar çalıştırıldığında daha önce aktarılanlar atlanır.</li>
            <li>Aktarımdan sonra Galeri sayfasından istemediğiniz fotoğrafları silebilirsiniz.</li>
          </ul>
        </div>
      </div>
    </>
  );
}
