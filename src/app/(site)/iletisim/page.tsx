import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "İletişim", description: "Ragıp Savaş Sanat Akademisi iletişim bilgileri, adres ve yol tarifi." };

export default async function ContactPage() {
  const s = await getSettings();
  return (
    <>
      <PageHero eyebrow="İletişim" title="Size nasıl yardımcı olabiliriz?" description="Sorularınız, kayıt talepleriniz veya önerileriniz için bize ulaşın. Akademimizi ziyaret etmekten de mutluluk duyarız." crumbs={[{ label: "İletişim" }]} />
      <section className="py-16 md:py-24">
        <div className="container-rs grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-4">
            {[
              { Icon: MapPin, t: "Adres", body: <p>{s.address}</p> },
              {
                Icon: Phone,
                t: "Telefon",
                body: [s.phone, s.phone2, s.gsm].filter(Boolean).map((p) => (
                  <a key={p} href={`tel:${p.replace(/[^\d+]/g, "")}`} className="block hover:text-accent">{p}</a>
                )),
              },
              { Icon: Mail, t: "E-posta", body: <a href={`mailto:${s.email}`} className="hover:text-accent">{s.email}</a> },
              { Icon: Clock, t: "Çalışma Saatleri", body: <p>{s.workingHours}</p> },
            ].map(({ Icon, t, body }) => (
              <div key={t} className="card flex gap-4 p-6">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-ink text-gold"><Icon className="h-5 w-5" /></span>
                <div>
                  <p className="font-display text-lg">{t}</p>
                  <div className="mt-1 text-[0.95rem] leading-relaxed text-muted">{body}</div>
                </div>
              </div>
            ))}
            {s.whatsapp && (
              <a href={`https://wa.me/${s.whatsapp}`} target="_blank" rel="noreferrer" className="btn w-full bg-[#25D366] text-white hover:brightness-95">
                <MessageCircle className="h-5 w-5" /> WhatsApp ile yazın
              </a>
            )}
          </div>
          <div className="card p-6 md:p-10">
            <h2 className="text-3xl">Bize mesaj gönderin</h2>
            <p className="mt-2 text-muted">Mesajınıza en geç 1 iş günü içinde yanıt veriyoruz.</p>
            <div className="mt-8"><ContactForm /></div>
          </div>
        </div>
        <div className="container-rs mt-10">
          <div className="overflow-hidden rounded-[1.4rem] border border-line">
            <iframe
              title="Akademi konumu"
              src={`https://www.google.com/maps?q=${encodeURIComponent(s.mapQuery)}&output=embed`}
              className="h-[420px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
}
