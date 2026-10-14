import type { Metadata } from "next";
import { Shell, type NavItem } from "@/components/dashboard/Shell";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Üye Paneli", robots: { index: false } };

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const pending = await db.payment.count({ where: { userId: user.id, status: { in: ["PENDING", "FAILED"] }, enrollment: { status: "PENDING_PAYMENT" } } });
  const nav: NavItem[] = [
    { href: "/panel", label: "Genel Bakış", icon: "LayoutDashboard", exact: true },
    { href: "/panel/yeni-kayit", label: "Yeni Kayıt", icon: "PlusCircle" },
    { href: "/panel/kayitlarim", label: "Kayıtlarım", icon: "GraduationCap" },
    { href: "/panel/ogrenciler", label: "Öğrencilerim", icon: "Users" },
    { href: "/panel/odemeler", label: "Ödemelerim", icon: "CreditCard", badge: pending },
    { href: "/panel/duyurular", label: "Duyurular", icon: "Megaphone" },
    { href: "/panel/profil", label: "Profil & Güvenlik", icon: "UserRound" },
  ];
  if (user.role === "ADMIN") nav.push({ href: "/yonetim", label: "Yönetim Paneli", icon: "Settings" });
  return (
    <Shell title="Üye Paneli" nav={nav} user={{ name: user.name, email: user.email }}>
      {children}
    </Shell>
  );
}
