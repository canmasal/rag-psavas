# Ragıp Savaş Sanat Akademisi — Web Sitesi

WordPress yerine sıfırdan geliştirilmiş, hızlı ve güvenli kurumsal web sitesi; **üyelik paneli**, **online kayıt & ödeme**, **yönetim paneli**, blog, galeri, rehber ve iletişim modüllerini içerir.

**Teknoloji:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Prisma ORM (SQLite / PostgreSQL) · iyzico ödeme altyapısı

---

## Özellikler

### Web sitesi
| Sayfa | Açıklama |
|---|---|
| Ana sayfa | Hero, branşlar, öne çıkan eğitimler, neden biz, online kayıt adımları, yorumlar, galeri, blog, CTA |
| Kurumsal | Hakkımızda (misyon, vizyon, tarihçe) ve Ragıp Savaş Kimdir? |
| Eğitimlerimiz | 16 branş, kategori filtresi; her branşta detay, yaş grubu, ders saatleri, öne çıkanlar ve **fiyat paketleri** |
| Rehber | Kayıt süreci, yaşa göre branş rehberi, ödeme seçenekleri, akademi kuralları, LCM sınavları, SSS |
| Blog | Kategoriler, yazı detayı, paylaşım butonları |
| Galeri | Kategori filtresi, ışık kutusu (lightbox), YouTube video desteği |
| İletişim | Form, harita, telefon / WhatsApp |
| Ücretsiz deneme dersi | Başvuru formu (yönetim paneline düşer) |
| Yasal | KVKK, gizlilik, mesafeli satış sözleşmesi, iptal & iade |
| SEO | Sitemap, robots, Open Graph, schema.org (Course, FAQ) yapılandırılmış veri |

### Üye paneli (`/panel`)
- Üye ol / giriş / şifremi unuttum (e-posta ile sıfırlama)
- Bir veli hesabına birden fazla **öğrenci** ekleme
- **Yeni kayıt:** eğitim → paket → öğrenci → ödeme yöntemi → sözleşme onayı
- **Kredi kartı** (iyzico, 3D Secure, taksit) veya **Havale/EFT** (IBAN + referans kodu)
- Kayıtlarım, ödemelerim, yazdırılabilir makbuz, duyurular, profil & şifre

### Yönetim paneli (`/yonetim`)
- Genel bakış: aylık tahsilat grafiği, aktif kayıt, popüler branşlar, son ödemeler
- Kayıt yönetimi (durum değiştirme), ödeme yönetimi (havale onayı, iade)
- Deneme dersi talepleri, iletişim mesajları
- Üyeler (arama, detay, yönetici yetkisi, elle üye açma)
- Eğitim & fiyat paketi düzenleme, blog yazıları, galeri (fotoğraf yükleme / YouTube), duyurular
- Site ayarları: telefonlar, adres, e-posta, sosyal medya, IBAN, üst duyuru şeridi

---

## Kurulum (yerel)

```bash
npm install
cp .env.example .env        # AUTH_SECRET'i değiştirin
npm run setup               # veritabanını oluşturur ve örnek içerikleri yükler
npm run dev                 # http://localhost:3000
```

**İlk yönetici hesabı:** `.env` içindeki `ADMIN_EMAIL` / `ADMIN_PASSWORD` (varsayılan `admin@ragipsavassanat.com` / `Admin123!`).
> ⚠️ Canlıya almadan önce şifreyi değiştirin.

## Ödeme sistemi (iyzico)

`IYZICO_API_KEY` ve `IYZICO_SECRET_KEY` **boşsa** site **test modunda** çalışır: kart ödemesi sitedeki test sayfasında simüle edilir (gerçek çekim yapılmaz).

- Başarılı test kartı: `5528 7900 0000 0008`
- Başarısız senaryo: `4000 0000 0000 0002`

Canlıya geçmek için iyzico üye işyeri panelinden alınan anahtarları `.env` dosyasına yazın:

```env
IYZICO_API_KEY="..."
IYZICO_SECRET_KEY="..."
IYZICO_BASE_URL="https://api.iyzipay.com"        # sandbox: https://sandbox-api.iyzipay.com
NEXT_PUBLIC_SITE_URL="https://www.ragipsavassanat.com"
```

Ödeme dönüş adresi otomatik olarak `https://ALANADI/api/odeme/iyzico` kullanılır.

## E-posta (SMTP)

Şifre sıfırlama ve hoş geldin e-postaları için `.env` içindeki `SMTP_*` alanlarını doldurun. Boşsa e-postalar sunucu günlüğüne yazılır.

## Canlıya alma

### Seçenek A — VPS / sunucu (önerilen, SQLite ile)
```bash
npm ci && npm run setup && npm run build
npm start                    # veya: pm2 start npm --name ragipsavas -- start
```
Nginx ile 3000 portuna yönlendirip SSL (Let's Encrypt) ekleyin. Veritabanı `prisma/dev.db`, yüklenen görseller `uploads/` klasöründedir — **ikisini de düzenli yedekleyin**.

### Seçenek B — Docker
```bash
docker build -t ragipsavas .
docker run -d -p 3000:3000 --env-file .env -e DATABASE_URL="file:/app/data/app.db" \
  -v ragipsavas-data:/app/data -v ragipsavas-uploads:/app/uploads ragipsavas
```

### Seçenek C — Vercel / sunucusuz
Sunucusuz ortamlarda dosya sistemi kalıcı olmadığından:
1. `prisma/schema.prisma` içinde `provider = "postgresql"` yapın ve `DATABASE_URL`'e bir PostgreSQL (Neon, Supabase vb.) adresi girin.
2. Görselleri yükleme yerine görsel adresi (URL) ile ekleyin ya da `UPLOAD_DIR` yerine bir nesne depolama çözümü bağlayın.

## İçerik notları

- Fiyatlar, örnek yorumlar ve IBAN **örnek değerlerdir**; yönetim panelinden güncelleyin.
- Görseli olmayan eğitim ve yazılarda markaya uygun otomatik "sanat kapağı" gösterilir. Gerçek fotoğrafları yönetim panelinden yükledikçe bunların yerini alır. Galerideki örnek görseller `public/galeri/` altındadır; panelden silinip gerçek fotoğraflar eklenebilir.

## Proje yapısı

```
prisma/              veri modeli + başlangıç verileri (seed)
src/app/(site)/      herkese açık sayfalar
src/app/(auth)/      giriş, kayıt, şifre işlemleri
src/app/panel/       üye paneli
src/app/yonetim/     yönetim paneli
src/app/actions/     sunucu işlemleri (form, ödeme, yönetim)
src/lib/             oturum, ödeme (iyzico), ayarlar, yardımcılar
src/components/      arayüz bileşenleri
```
