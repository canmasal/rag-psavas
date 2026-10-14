import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
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
  return (
    <>
      <Header
        courses={courses}
        user={session ? { name: session.name, role: session.role } : null}
        phone={settings.phone}
        announcement={settings.announcementBar}
      />
      <main>{children}</main>
      <Footer settings={settings} courses={courses} />
      <WhatsAppButton number={settings.whatsapp} />
    </>
  );
}
