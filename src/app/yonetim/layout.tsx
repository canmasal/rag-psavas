import type { Metadata } from "next";
import { Shell, type NavItem } from "@/components/dashboard/Shell";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Yönetim Paneli", robots: { index: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  const [messages, trials, transfers] = await Promise.all([
    db.message.count({ where: { read: false } }),
    db.trialRequest.count({ where: { status: "NEW" } }),
    db.payment.count({ where: { status: "PENDING", method: "BANK_TRANSFER", enrollment: { status: "PENDING_PAYMENT" } } }),
  ]);
  const nav: NavItem[] = [
    { href: "/yonetim", label: "Genel Bakış", icon: "LayoutDashboard", exact: true },
    { href: "/yonetim/kayitlar", label: "Kayıtlar", icon: "GraduationCap" },
    { href: "/yonetim/odemeler", label: "Ödemeler", icon: "CreditCard", badge: transfers },
    { href: "/yonetim/deneme-dersleri", label: "Deneme Dersleri", icon: "CalendarCheck", badge: trials },
    { href: "/yonetim/mesajlar", label: "Mesajlar", icon: "Mail", badge: messages },
    { href: "/yonetim/uyeler", label: "Üyeler", icon: "Users" },
    { href: "/yonetim/egitimler", label: "Eğitimler", icon: "BookOpen" },
    { href: "/yonetim/blog", label: "Blog", icon: "FileText" },
    { href: "/yonetim/galeri", label: "Galeri", icon: "ImageIcon" },
    { href: "/yonetim/duyurular", label: "Duyurular", icon: "Megaphone" },
    { href: "/yonetim/ayarlar", label: "Site Ayarları", icon: "Settings" },
  ];
  return (
    <Shell title="Yönetim Paneli" accent="Yönetim Paneli" nav={nav} user={{ name: user.name, email: user.email }}>
      {children}
    </Shell>
  );
}
