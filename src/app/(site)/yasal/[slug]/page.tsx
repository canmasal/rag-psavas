import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Markdown } from "@/lib/markdown";
import { getSettings, type SiteSettings } from "@/lib/settings";

type Doc = { title: string; body: (s: SiteSettings) => string };

const docs: Record<string, Doc> = {
  kvkk: {
    title: "KVKK Aydınlatma Metni",
    body: (s) => `Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında veri sorumlusu sıfatıyla **${s.siteName}** tarafından hazırlanmıştır.

## İşlenen Kişisel Veriler
Kimlik (ad, soyad, doğum tarihi), iletişim (telefon, e-posta, adres), müşteri işlem (kayıt, ödeme ve fatura bilgileri) ile veli onayı alınması halinde görsel kayıt verileriniz işlenmektedir.

## İşleme Amaçları
- Eğitim hizmetlerinin sunulması, kayıt ve ders planlamasının yapılması
- Ödeme ve faturalandırma süreçlerinin yürütülmesi
- Veliler ile iletişim kurulması, duyuru ve bilgilendirmelerin yapılması
- Yasal yükümlülüklerin yerine getirilmesi

## Aktarım
Kişisel verileriniz; ödeme hizmet sağlayıcısı (iyzico), yetkili kamu kurum ve kuruluşları ile hizmet aldığımız bilişim altyapı sağlayıcılarına, yalnızca yukarıdaki amaçlarla sınırlı olarak aktarılabilir. Kart bilgileriniz sistemlerimizde saklanmaz.

## Haklarınız
KVKK'nın 11. maddesi uyarınca; verilerinizin işlenip işlenmediğini öğrenme, düzeltilmesini veya silinmesini talep etme ve işlemeye itiraz etme haklarına sahipsiniz. Taleplerinizi ${s.email} adresine iletebilirsiniz.`,
  },
  gizlilik: {
    title: "Gizlilik Politikası",
    body: (s) => `${s.siteName} olarak ziyaretçilerimizin ve üyelerimizin gizliliğine önem veriyoruz.

## Çerezler
Sitemizde oturum yönetimi için zorunlu çerezler kullanılmaktadır. Bu çerezler, üye girişinizin güvenli şekilde sürdürülmesini sağlar.

## Güvenlik
Tüm veri iletimi SSL ile şifrelenir. Şifreleriniz geri döndürülemez şekilde (bcrypt) saklanır. Kart bilgileriniz yalnızca ödeme kuruluşu tarafından işlenir; sunucularımızda tutulmaz.

## İletişim
Gizlilik ile ilgili sorularınız için ${s.email} adresinden bize ulaşabilirsiniz.`,
  },
  "mesafeli-satis-sozlesmesi": {
    title: "Mesafeli Satış Sözleşmesi",
    body: (s) => `## 1. Taraflar
**Satıcı:** ${s.siteName} — ${s.address} — Tel: ${s.phone} — E-posta: ${s.email}

**Alıcı:** Web sitesi üzerinden kayıt oluşturan üye.

## 2. Konu
İşbu sözleşmenin konusu, alıcının web sitesi üzerinden elektronik ortamda satın aldığı eğitim hizmetinin satışı ve ifasına ilişkin olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin belirlenmesidir.

## 3. Hizmetin Niteliği ve Bedeli
Hizmetin adı, paketi, süresi ve KDV dahil bedeli ödeme adımında ve üye panelindeki kayıt detayında yer almaktadır.

## 4. Hizmetin İfası
Eğitim hizmeti, ödemenin onaylanmasının ardından akademi tarafından belirlenen ders programına göre akademi binasında verilir.

## 5. Cayma Hakkı
Alıcı, hizmetin ifasına başlanmadan önce (ilk dersten önce) 14 gün içinde herhangi bir gerekçe göstermeksizin cayma hakkını kullanabilir. Hizmetin ifasına alıcının onayı ile başlanmışsa cayma hakkı, İptal & İade Politikası'ndaki koşullara göre uygulanır.

## 6. Uyuşmazlıklar
Uyuşmazlıklarda Ticaret Bakanlığınca ilan edilen değere kadar Tüketici Hakem Heyetleri, üzerindeki değerlerde Tüketici Mahkemeleri yetkilidir.`,
  },
  "iptal-iade": {
    title: "İptal & İade Politikası",
    body: (s) => `## İlk Dersten Önce İptal
İlk ders gerçekleşmeden önce yapılan iptal taleplerinde ödenen ücretin **tamamı** iade edilir.

## Dönem Başladıktan Sonra İptal
Dönem başladıktan sonra yapılan iptallerde, katılım sağlanan veya katılım sağlanmayıp önceden bildirilmeyen derslerin ücreti düşülerek **kalan derslerin bedeli** iade edilir. İndirimli (dönemlik/yıllık) paketlerde, kullanılan süre aylık liste fiyatı üzerinden hesaplanır.

## İade Süreci
İade talepleri ${s.email} adresine veya akademi sekreterliğine yazılı olarak iletilir. Onaylanan iadeler, ödemenin yapıldığı karta veya hesaba 10 iş günü içinde gerçekleştirilir. Kartınıza yansıma süresi bankanıza göre değişebilir.

## Akademi Kaynaklı İptaller
Akademi tarafından iptal edilen derslerin tamamı telafi edilir; telafi mümkün değilse ücreti iade edilir.`,
  },
};

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: docs[slug]?.title ?? "Yasal" };
}

export default async function LegalPage({ params }: Props) {
  const { slug } = await params;
  const doc = docs[slug];
  if (!doc) notFound();
  const settings = await getSettings();
  return (
    <>
      <PageHero eyebrow="Yasal" title={doc.title} crumbs={[{ label: doc.title }]} />
      <section className="py-16">
        <div className="container-rs max-w-3xl">
          <Markdown source={doc.body(settings)} />
          <p className="mt-12 text-sm text-muted">Son güncelleme: {new Date().getFullYear()}</p>
        </div>
      </section>
    </>
  );
}
