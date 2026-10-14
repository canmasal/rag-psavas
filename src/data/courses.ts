// Başlangıç (seed) verisi — tüm içerikler yönetim panelinden düzenlenebilir.

export type SeedCourse = {
  slug: string;
  title: string;
  category: string;
  shortDesc: string;
  content: string;
  ageRange: string;
  duration: string;
  format: string;
  schedule: string;
  highlights: string[];
  color: string;
  icon: string;
  featured?: boolean;
  packages: { name: string; description?: string; price: number; months: number; popular?: boolean }[];
};

const groupPackages = (monthly: number) => [
  { name: "Aylık", description: "Ayda 4 ders, esnek başlangıç", price: monthly, months: 1 },
  {
    name: "Dönemlik (4 Ay)",
    description: "16 ders · %10 indirimli",
    price: Math.round((monthly * 4 * 0.9) / 50) * 50,
    months: 4,
    popular: true,
  },
  {
    name: "Yıllık (9 Ay)",
    description: "36 ders · %18 indirimli · yıl sonu gösterisi dahil",
    price: Math.round((monthly * 9 * 0.82) / 50) * 50,
    months: 9,
  },
];

export const CATEGORIES = ["Sahne Sanatları", "Müzik", "Görsel Sanatlar", "Hareket & Spor", "Yaz Okulu"] as const;

export const seedCourses: SeedCourse[] = [
  {
    slug: "klasik-bale",
    title: "Klasik Bale",
    category: "Sahne Sanatları",
    shortDesc:
      "2 yıl hazırlık ve 8 yıl akademik bale eğitiminden oluşan, 4 yaşından itibaren başlayan 10 yıllık sistematik program.",
    content: `Klasik bale, disiplin, zarafet ve müzikaliteyi bir arada geliştiren en köklü sahne sanatlarından biridir. Akademimizdeki bale programı **2 yıl hazırlık** ve **8 yıl akademik bale** olmak üzere toplam 10 yıllık sistematik bir eğitim planına dayanır.

## Program Yapısı
- **Hazırlık Sınıfları (4–6 yaş):** Ritim, beden farkındalığı, temel duruş ve oyun temelli hareket çalışmaları.
- **Akademik Sınıflar (7 yaş +):** Barre ve orta çalışmaları, pozisyonlar, adagio, allegro ve sahne terminolojisi.
- **İleri Seviye:** Pointe hazırlığı, repertuvar çalışmaları ve koreografi.

## Neler Kazanır?
Bale eğitimi çocuğun duruşunu düzeltir, esneklik ve kas gücünü artırır, odaklanma ve öz disiplin kazandırır. Öğrencilerimiz her yıl sonunda profesyonel sahnede düzenlenen **yıl sonu gösterisinde** öğrendiklerini sergiler.

## Kıyafet ve Ekipman
Kızlar için pembe tayt, bale mayosu ve yarım tabanlı bale ayakkabısı; erkekler için siyah tayt ve beyaz tişört önerilir. Kayıt sonrası size detaylı bir ekipman listesi iletilir.`,
    ageRange: "4 yaş ve üzeri",
    duration: "Haftada 2 gün · 60 dk",
    format: "Grup dersi (en fazla 12 öğrenci)",
    schedule: "Hafta içi 16:30–19:30 · Cumartesi 10:00–16:00",
    highlights: [
      "Rusya Vaganova metoduna dayalı müfredat",
      "Yıl sonu sahne gösterisi",
      "Seviye belirleme ve gelişim raporu",
      "Hazırlık sınıflarında oyun temelli öğrenme",
    ],
    color: "#c2477a",
    icon: "Sparkles",
    featured: true,
    packages: groupPackages(3600),
  },
  {
    slug: "muzikal-tiyatro",
    title: "Müzikal Tiyatro",
    category: "Sahne Sanatları",
    shortDesc:
      "Oyunculuk, şan ve dansı tek bir sahnede buluşturan; Ragıp Savaş'ın sahne deneyimiyle şekillenen bütünsel program.",
    content: `Müzikal tiyatro; **oyunculuk, şan ve dans** disiplinlerini aynı anda geliştiren, sahne sanatlarının en kapsamlı dalıdır. Programımız, kurucumuz Ragıp Savaş'ın 35 yılı aşkın sahne deneyimiyle hazırlanmıştır.

## Derslerde Neler Var?
- Doğaçlama, karakter yaratma ve sahne hakimiyeti
- Diksiyon, nefes ve ses eğitimi
- Müzikal repertuvarından şarkı çalışmaları
- Sahne dansı ve koreografi
- Dönem sonu müzikal prodüksiyonu

## Kimler İçin?
Sahnede olmayı seven, kendini ifade etmek isteyen 7 yaş ve üzeri tüm çocuk, genç ve yetişkinler için uygundur. Önceden deneyim gerekmez; seviye gruplarına göre sınıflar oluşturulur.

Her dönemin sonunda öğrencilerimiz, profesyonel bir tiyatro salonunda sergilenen bir müzikal oyunda rol alır.`,
    ageRange: "7 yaş ve üzeri",
    duration: "Haftada 1 gün · 120 dk",
    format: "Grup dersi (en fazla 15 öğrenci)",
    schedule: "Cumartesi & Pazar 10:00–18:00",
    highlights: [
      "Profesyonel salonda dönem sonu müzikali",
      "Oyunculuk + şan + dans tek programda",
      "Ragıp Savaş ile atölye çalışmaları",
      "Kamera önü oyunculuk modülü",
    ],
    color: "#b8242f",
    icon: "Drama",
    featured: true,
    packages: groupPackages(3800),
  },
  {
    slug: "yaratici-drama",
    title: "Yaratıcı Drama",
    category: "Sahne Sanatları",
    shortDesc:
      "Oyun, doğaçlama ve canlandırma yoluyla çocukların hayal gücünü, empati ve iletişim becerilerini geliştiren atölye.",
    content: `Yaratıcı drama, çocukların **oyun ve doğaçlama** yoluyla kendilerini keşfettiği, duygularını güvenli bir ortamda ifade etmeyi öğrendiği bir eğitim yöntemidir. Amaç sahne performansı değil, sürecin kendisidir.

## Kazanımlar
- Özgüven ve kendini ifade etme
- Empati ve iş birliği
- Problem çözme ve yaratıcı düşünme
- Dil gelişimi ve sözel ifade
- Kurallara uyum ve grup bilinci

## Ders Akışı
Her ders; ısınma oyunları, canlandırma, doğaçlama ve değerlendirme bölümlerinden oluşur. Eğitmenlerimiz, MEB onaylı yaratıcı drama liderliği sertifikasına sahiptir.`,
    ageRange: "4–12 yaş",
    duration: "Haftada 1 gün · 60 dk",
    format: "Grup dersi (8–12 öğrenci)",
    schedule: "Hafta içi 16:00–18:00 · Cumartesi 10:00–14:00",
    highlights: [
      "Yaş gruplarına göre ayrılmış sınıflar",
      "MEB onaylı drama liderleri",
      "Dönem sonu veli katılımlı atölye",
      "Sosyal-duygusal gelişim odaklı",
    ],
    color: "#e0752d",
    icon: "Theater",
    featured: true,
    packages: groupPackages(3000),
  },
  {
    slug: "dans",
    title: "Dans",
    category: "Sahne Sanatları",
    shortDesc: "Modern dans, hip-hop ve jazz dans derslerinde ritim, koordinasyon ve sahne enerjisi.",
    content: `Dans derslerimizde öğrenciler **modern dans, jazz ve hip-hop** tekniklerini öğrenirken ritim duygusu, koordinasyon ve beden kontrolü kazanır.

## Branşlar
- **Modern Dans:** Akış, zemin çalışmaları ve doğaçlama
- **Jazz Dans:** Teknik, dönüşler ve sahne koreografileri
- **Hip-Hop:** Groove, footwork ve freestyle

Her dönem sonunda öğrenciler hazırladıkları koreografileri yıl sonu gösterisinde sergiler.`,
    ageRange: "6 yaş ve üzeri",
    duration: "Haftada 2 gün · 60 dk",
    format: "Grup dersi",
    schedule: "Hafta içi 17:00–20:00 · Cumartesi 12:00–16:00",
    highlights: ["Modern, jazz ve hip-hop", "Koreografi çalışmaları", "Yıl sonu gösterisi", "Yetişkin grupları"],
    color: "#7a3fd0",
    icon: "PersonStanding",
    packages: groupPackages(3200),
  },
  {
    slug: "piyano",
    title: "Piyano",
    category: "Müzik",
    shortDesc:
      "Çocuk, genç ve yetişkinlere birebir piyano eğitimi; isteyen öğrenciler yıl sonunda LCM sınavıyla uluslararası sertifika alır.",
    content: `Piyano dersleri çocuklar, gençler ve yetişkinler için **haftada 1 gün, 1 saat birebir özel ders** olarak verilir. Müzik eğitimimiz hem **Milli Eğitim Bakanlığı** hem de **London College of Music (LCM)** sistemine göre yürütülür.

## Program
- Nota okuma, ritim ve solfej
- Teknik etütler ve gam çalışmaları
- Klasik, caz ve popüler repertuvar
- Kulaktan çalma ve doğaçlama

## LCM Sınavları
İsteyen öğrencilerimiz yıl sonunda **London College of Music** sınavlarına girerek uluslararası geçerliliği olan derece sertifikaları alabilir. Bu sertifikalar yurt dışı üniversite başvurularında da değerlendirilir.`,
    ageRange: "5 yaş ve üzeri",
    duration: "Haftada 1 gün · 60 dk",
    format: "Birebir özel ders",
    schedule: "Pazartesi–Pazar, randevulu",
    highlights: ["Birebir özel ders", "LCM uluslararası sertifika", "MEB müfredatına uygun", "Yıl sonu resitali"],
    color: "#1f3a8a",
    icon: "Piano",
    featured: true,
    packages: groupPackages(5200),
  },
  {
    slug: "keman",
    title: "Keman",
    category: "Müzik",
    shortDesc: "Doğru duruş ve yay tekniğiyle başlayan, oda müziğine uzanan birebir keman eğitimi.",
    content: `Keman eğitimimiz doğru **duruş, tutuş ve yay tekniği** üzerine kurulu sağlam bir temelle başlar. Öğrencilerimiz ilerleyen seviyelerde oda müziği gruplarında birlikte çalma deneyimi kazanır.

## Program
- Duruş, tutuş ve temel yay teknikleri
- Pozisyon çalışmaları ve entonasyon
- Etütler ve klasik repertuvar
- Oda müziği ve orkestra hazırlığı

İsteyen öğrenciler LCM sınavlarına hazırlanabilir.`,
    ageRange: "5 yaş ve üzeri",
    duration: "Haftada 1 gün · 45–60 dk",
    format: "Birebir özel ders",
    schedule: "Randevulu",
    highlights: ["Çocuk boyu enstrüman desteği", "LCM sınav hazırlığı", "Oda müziği grupları", "Yıl sonu konseri"],
    color: "#7c2d12",
    icon: "Music",
    packages: groupPackages(5000),
  },
  {
    slug: "gitar",
    title: "Gitar",
    category: "Müzik",
    shortDesc: "Klasik, akustik ve elektro gitar derslerinde akor, ritim ve repertuvar çalışmaları.",
    content: `Gitar derslerimizde öğrenciler **klasik, akustik veya elektro gitar** seçeneklerinden birini seçerek ilerler.

## Program
- Akorlar, ritim kalıpları ve tavır
- Nota ve tab okuma
- Parmak teknikleri ve pena kullanımı
- Pop, rock, klasik ve flamenko repertuvarı

Grup çalışmaları ve akademi gruplarında birlikte çalma imkânı sunulur.`,
    ageRange: "7 yaş ve üzeri",
    duration: "Haftada 1 gün · 60 dk",
    format: "Birebir özel ders",
    schedule: "Randevulu",
    highlights: ["Klasik, akustik veya elektro", "Akademi grubunda çalma", "LCM sertifika seçeneği", "Yetişkinlere özel saatler"],
    color: "#a16207",
    icon: "Guitar",
    packages: groupPackages(4600),
  },
  {
    slug: "bateri",
    title: "Bateri",
    category: "Müzik",
    shortDesc: "Ritim duygusunu, koordinasyonu ve enerjiyi sahneye taşıyan birebir bateri dersleri.",
    content: `Bateri dersleri ritim duygusu ve **el-ayak koordinasyonu** geliştirmek için en etkili yollardan biridir.

## Program
- Rudiment'ler ve stick kontrolü
- Temel ritimler: rock, pop, funk, latin
- Okuma ve metronom çalışmaları
- Şarkı eşliği ve grup provaları

Ses yalıtımlı stüdyomuzda profesyonel ekipmanla eğitim verilir.`,
    ageRange: "7 yaş ve üzeri",
    duration: "Haftada 1 gün · 60 dk",
    format: "Birebir özel ders",
    schedule: "Randevulu",
    highlights: ["Ses yalıtımlı stüdyo", "Profesyonel ekipman", "Grup provaları", "Yıl sonu konseri"],
    color: "#334155",
    icon: "Drum",
    packages: groupPackages(4800),
  },
  {
    slug: "san",
    title: "Şan",
    category: "Müzik",
    shortDesc:
      "Nefes, ses ve yorum tekniklerinin MEB ve London College of Music sistemine göre öğretildiği şan eğitimi.",
    content: `Şan eğitimimiz **Milli Eğitim Bakanlığı** ve **London College of Music (LCM)** sistemine göre yürütülür. Doğru nefes kullanımı ile sesin sağlıklı ve güçlü gelişmesini hedefler.

## Program
- Diyafram nefesi ve ses ısınmaları
- Rezonans, entonasyon ve ses aralığı genişletme
- Klasik, pop ve müzikal tiyatro repertuvarı
- Sahne yorumu ve mikrofon tekniği

Yıl sonunda öğrencilerimiz resitallerde sahne alır; isteyenler LCM sınavlarına girer.`,
    ageRange: "8 yaş ve üzeri",
    duration: "Haftada 1 gün · 45–60 dk",
    format: "Birebir özel ders",
    schedule: "Randevulu",
    highlights: ["MEB ve LCM sistemi", "Klasik & pop & müzikal", "Mikrofon ve sahne tekniği", "Yıl sonu resitali"],
    color: "#0e7490",
    icon: "MicVocal",
    packages: groupPackages(5000),
  },
  {
    slug: "yan-flut",
    title: "Yan Flüt",
    category: "Müzik",
    shortDesc: "Nefes kontrolü ve ton güzelliğiyle öne çıkan, birebir yan flüt eğitimi.",
    content: `Yan flüt dersleri, doğru **nefes kontrolü ve ton üretimi** üzerine kurulu bir program ile ilerler.

## Program
- Embouchure ve nefes teknikleri
- Gamlar, artikülasyon ve etütler
- Barok, klasik ve çağdaş repertuvar
- Oda müziği çalışmaları`,
    ageRange: "8 yaş ve üzeri",
    duration: "Haftada 1 gün · 45–60 dk",
    format: "Birebir özel ders",
    schedule: "Randevulu",
    highlights: ["Birebir ders", "LCM sınav hazırlığı", "Oda müziği", "Yıl sonu konseri"],
    color: "#0f766e",
    icon: "Wind",
    packages: groupPackages(4800),
  },
  {
    slug: "resim",
    title: "Resim",
    category: "Görsel Sanatlar",
    shortDesc: "Karakalem, suluboya, akrilik ve yağlı boya teknikleriyle yaşa uygun resim atölyesi.",
    content: `Resim atölyemizde çocuklar ve yetişkinler, **karakalem, pastel, suluboya, akrilik ve yağlı boya** gibi teknikleri yaşlarına ve seviyelerine uygun bir program dahilinde öğrenir.

## Program
- Çizim temelleri: çizgi, form, oran ve perspektif
- Renk teorisi ve kompozisyon
- Natürmort, portre ve peyzaj
- Sanat tarihi ve ünlü ressamlar üzerine çalışmalar
- Güzel Sanatlar Lisesi ve fakülte yetenek sınavı hazırlığı

Dönem sonunda öğrencilerimizin eserleri **akademi sergisinde** ziyaretçilerle buluşur.`,
    ageRange: "4 yaş ve üzeri",
    duration: "Haftada 1 gün · 90 dk",
    format: "Grup dersi (en fazla 10 öğrenci)",
    schedule: "Hafta içi 16:00–20:00 · Hafta sonu 10:00–17:00",
    highlights: ["Tüm malzemeler dahil", "Yetenek sınavı hazırlığı", "Dönem sonu sergisi", "Yetişkin atölyesi"],
    color: "#2563eb",
    icon: "Palette",
    featured: true,
    packages: groupPackages(3400),
  },
  {
    slug: "seramik",
    title: "Seramik",
    category: "Görsel Sanatlar",
    shortDesc: "Çamurla şekillendirme, el yapımı form, sırlama ve fırınlama süreçlerini kapsayan atölye.",
    content: `Seramik atölyemizde öğrenciler **çamurun doğasını** tanıyarak elle şekillendirme, plaka, sucuk (bobin) ve tornada şekillendirme tekniklerini öğrenir.

## Program
- Elle şekillendirme teknikleri
- Plaka ve bobin yöntemleri
- Dekorlama, astar ve sırlama
- Fırınlama süreci

Öğrencilerimizin yaptığı tüm eserler fırınlanarak kendilerine teslim edilir.`,
    ageRange: "5 yaş ve üzeri",
    duration: "Haftada 1 gün · 90 dk",
    format: "Grup dersi (en fazla 10 öğrenci)",
    schedule: "Hafta içi 16:00–19:00 · Cumartesi 10:00–16:00",
    highlights: ["Malzeme ve fırınlama dahil", "Eserler öğrenciye teslim", "Çocuk & yetişkin grupları", "Atölye sergisi"],
    color: "#9a3412",
    icon: "Shapes",
    packages: groupPackages(3600),
  },
  {
    slug: "mix-art",
    title: "Mix Art",
    category: "Görsel Sanatlar",
    shortDesc: "Kolaj, röprodüksiyon, çizgi roman, grafiti, pop-up kağıt heykel ve modern heykelin buluştuğu karma sanat atölyesi.",
    content: `Mix Art atölyesi, çocukların farklı sanat disiplinlerini tek bir programda tanımasını sağlar. Atölyede **kolaj, röprodüksiyon, çizgi roman, grafiti, pop-up kağıt heykel ve modern heykel (modelaj)** çalışmaları yapılır.

## Neden Mix Art?
Farklı malzeme ve tekniklerle tanışan çocuk, kendi ifade biçimini keşfeder. Atölye; yaratıcılığı, el becerisini ve estetik algıyı birlikte geliştirir.`,
    ageRange: "5–12 yaş",
    duration: "Haftada 1 gün · 90 dk",
    format: "Grup dersi",
    schedule: "Hafta içi 16:00–18:00 · Cumartesi 10:00–14:00",
    highlights: ["6 farklı sanat tekniği", "Tüm malzemeler dahil", "Proje bazlı çalışma", "Dönem sonu sergisi"],
    color: "#db2777",
    icon: "Brush",
    packages: groupPackages(3400),
  },
  {
    slug: "jimnastik",
    title: "Jimnastik",
    category: "Hareket & Spor",
    shortDesc: "Esneklik, denge ve kuvveti eğlenceli bir şekilde geliştiren artistik jimnastik dersleri.",
    content: `Jimnastik derslerimiz çocukların **esneklik, denge, kuvvet ve koordinasyon** becerilerini güvenli bir ortamda geliştirir.

## Program
- Temel jimnastik hareketleri: takla, köprü, amut, çember
- Denge ve esneklik çalışmaları
- Mini koreografiler
- Yaşa uygun kuvvet egzersizleri

Dersler, branşında lisanslı antrenörler eşliğinde ve tam donanımlı minderli salonda yapılır.`,
    ageRange: "4–12 yaş",
    duration: "Haftada 2 gün · 60 dk",
    format: "Grup dersi",
    schedule: "Hafta içi 16:00–19:00 · Cumartesi 10:00–14:00",
    highlights: ["Lisanslı antrenörler", "Güvenli minderli salon", "Gelişim takibi", "Gösteri programı"],
    color: "#16a34a",
    icon: "Footprints",
    packages: groupPackages(3200),
  },
  {
    slug: "aikido",
    title: "Aikido",
    category: "Hareket & Spor",
    shortDesc: "Saldırı değil uyum felsefesine dayanan; öz disiplin, denge ve öz güven kazandıran Japon savunma sanatı.",
    content: `Aikido, **rakibin enerjisini yönlendirme** prensibine dayanan bir Japon savunma sanatıdır. Rekabet yerine uyumu ve karşılıklı saygıyı ön plana çıkarır.

## Kazanımlar
- Öz disiplin ve sabır
- Denge, koordinasyon ve esneklik
- Düşme teknikleri (ukemi) ile güvenli hareket
- Öz güven ve stres yönetimi

Öğrencilerimiz belirli dönemlerde kuşak sınavlarına girer.`,
    ageRange: "6 yaş ve üzeri",
    duration: "Haftada 2 gün · 60 dk",
    format: "Grup dersi",
    schedule: "Salı & Perşembe 17:00–19:00 · Cumartesi 11:00–13:00",
    highlights: ["Kuşak sınavları", "Çocuk & yetişkin grupları", "Uyum felsefesi", "Güvenli düşme teknikleri"],
    color: "#1e293b",
    icon: "Shield",
    packages: groupPackages(3200),
  },
  {
    slug: "yaz-okulu",
    title: "Yaz Okulu",
    category: "Yaz Okulu",
    shortDesc:
      "4–7, 8–11 ve 12+ yaş gruplarına özel; yaratıcı drama, aikido, akıl oyunları, bilim atölyesi ve botanik içeren yaz programı.",
    content: `Yaz okulumuz, okulların tatile girmesiyle başlayan ve çocukların yazı **üretken, eğlenceli ve sosyal** geçirmesini sağlayan kapsamlı bir programdır. Gruplar **4–7 yaş, 8–11 yaş ve 12+ yaş** olarak ayrı ayrı düzenlenir.

## Atölyeler
- Yaratıcı drama
- Aikido
- Akıl ve zeka oyunları
- Bilim atölyesi
- Botanik ve doğa çalışmaları
- Resim, seramik ve müzik atölyeleri

## Günlük Akış
Program hafta içi her gün 09:00–16:00 saatleri arasındadır. Öğle yemeği ve ara öğünler programa dahildir. Haftalık veya tüm yaz için kayıt yapılabilir.`,
    ageRange: "4–15 yaş",
    duration: "Hafta içi her gün · 09:00–16:00",
    format: "Yaş gruplarına göre",
    schedule: "Haziran – Ağustos",
    highlights: ["3 ayrı yaş grubu", "Öğle yemeği dahil", "Haftalık kayıt imkânı", "Yaz sonu gösterisi"],
    color: "#f59e0b",
    icon: "Sun",
    featured: true,
    packages: [
      { name: "1 Hafta", description: "5 gün tam gün program", price: 6500, months: 0 },
      { name: "4 Hafta", description: "20 gün · %12 indirimli", price: 22900, months: 1, popular: true },
      { name: "Tüm Yaz (8 Hafta)", description: "40 gün · %20 indirimli", price: 41500, months: 2 },
    ],
  },
];
