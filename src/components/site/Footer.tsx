import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube, Clock } from "lucide-react";
import { Logo } from "./Logo";
import type { SiteSettings } from "@/lib/settings";

export function Footer({ settings, courses }: { settings: SiteSettings; courses: { slug: string; title: string }[] }) {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-ink text-white/75">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-accent/20 blur-3xl" />
      <div className="container-rs relative">
        <div className="grid gap-12 border-b border-white/10 py-16 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.3fr]">
          <div>
            <Logo light />
            <p className="mt-6 max-w-xs text-sm leading-relaxed">
              2007&apos;den bu yana Göktürk&apos;te çocuk ve yetişkinlere sahne sanatları, müzik ve görsel sanatlar alanında
              eğitim veriyoruz.
            </p>
            <div className="mt-6 flex gap-2">
              {[
                { href: settings.instagram, Icon: Instagram, label: "Instagram" },
                { href: settings.facebook, Icon: Facebook, label: "Facebook" },
                { href: settings.youtube, Icon: Youtube, label: "YouTube" },
              ]
                .filter((s) => s.href)
                .map(({ href, Icon, label }) => (
                  <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="grid h-10 w-10 place-items-center rounded-full border border-white/15 transition hover:border-gold hover:text-gold">
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
            </div>
          </div>
          <div>
            <p className="font-display text-lg text-white">Eğitimler</p>
            <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm lg:grid-cols-1">
              {courses.slice(0, 8).map((c) => (
                <li key={c.slug}>
                  <Link href={`/egitimlerimiz/${c.slug}`} className="hover:text-gold">{c.title}</Link>
                </li>
              ))}
              <li><Link href="/egitimlerimiz" className="font-semibold text-gold">Tümü →</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-display text-lg text-white">Akademi</p>
            <ul className="mt-5 space-y-2.5 text-sm">
              {[
                ["/hakkimizda", "Hakkımızda"],
                ["/ragip-savas-kimdir", "Ragıp Savaş Kimdir?"],
                ["/egitmenlerimiz", "Eğitmenlerimiz"],
                ["/rehber", "Rehber & SSS"],
                ["/blog", "Blog"],
                ["/galeri", "Galeri"],
                ["/ucretsiz-deneme-dersi", "Ücretsiz Deneme Dersi"],
                ["/panel", "Üye Paneli"],
                ["/iletisim", "İletişim"],
              ].map(([href, label]) => (
                <li key={href}><Link href={href} className="hover:text-gold">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-display text-lg text-white">İletişim</p>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />{settings.address}</li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span className="space-y-1">
                  {[settings.phone, settings.phone2, settings.gsm].filter(Boolean).map((p) => (
                    <a key={p} href={`tel:${p.replace(/[^\d+]/g, "")}`} className="block hover:text-gold">{p}</a>
                  ))}
                </span>
              </li>
              <li className="flex gap-3"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" /><a href={`mailto:${settings.email}`} className="hover:text-gold">{settings.email}</a></li>
              <li className="flex gap-3"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" />{settings.workingHours}</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-4 py-6 text-xs text-white/50 md:flex-row md:items-center md:justify-between">
          <p>© {year} {settings.siteName}. Tüm hakları saklıdır.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/yasal/kvkk" className="hover:text-white">KVKK Aydınlatma Metni</Link>
            <Link href="/yasal/gizlilik" className="hover:text-white">Gizlilik Politikası</Link>
            <Link href="/yasal/mesafeli-satis-sozlesmesi" className="hover:text-white">Mesafeli Satış Sözleşmesi</Link>
            <Link href="/yasal/iptal-iade" className="hover:text-white">İptal & İade</Link>
          </div>
          <div className="flex items-center gap-2 text-white/60">
            <span className="rounded bg-white/10 px-2 py-1 font-bold tracking-wider">VISA</span>
            <span className="rounded bg-white/10 px-2 py-1 font-bold tracking-wider">MasterCard</span>
            <span className="rounded bg-white/10 px-2 py-1 font-bold tracking-wider">TROY</span>
            <span className="rounded bg-white/10 px-2 py-1 font-bold">iyzico</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
