import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { RevealObserver } from "@/components/site/RevealObserver";
import { CookieBanner } from "@/components/site/CookieBanner";
import { siteUrl } from "@/lib/utils";
import { getSession } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { db } from "@/lib/db";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, session, courses] = await Promise.all([
    getSettings(),
    getSession(),
    db.course.findMany({
      where: { active: true },
      orderBy: [{ order: "asc" }],
      select: { slug: true, title: true, category: true, icon: true, color: true },
    }),
  ]);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "LocalBusiness"],
    name: settings.siteName,
    url: siteUrl(),
    logo: `${siteUrl()}/icon.svg`,
    telephone: settings.phone,
    email: settings.email,
    foundingDate: "2007",
    founder: { "@type": "Person", name: "Ragıp Savaş" },
    address: { "@type": "PostalAddress", streetAddress: settings.address, addressLocality: "Eyüpsultan", addressRegion: "İstanbul", addressCountry: "TR" },
    sameAs: [settings.instagram, settings.facebook, settings.youtube].filter(Boolean),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <RevealObserver />
      <Header
        courses={courses}
        user={session ? { name: session.name, role: session.role } : null}
        phone={settings.phone}
        announcement={settings.announcementBar}
      />
      <main>{children}</main>
      <Footer settings={settings} courses={courses} />
      <WhatsAppButton number={settings.whatsapp} />
      <CookieBanner />
    </>
  );
}
