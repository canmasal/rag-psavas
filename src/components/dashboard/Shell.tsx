"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bell, BookOpen, CalendarCheck, CreditCard, FileText, GraduationCap, Home, Image as ImageIcon, LayoutDashboard, LogOut,
  Mail, Menu, Megaphone, PlusCircle, Settings, Sparkles, UserRound, Users, X, ExternalLink,
} from "lucide-react";
import { LogoMark } from "@/components/site/Logo";
import { logout } from "@/app/actions/auth";
import { cn } from "@/lib/utils";

const icons = {
  Bell, BookOpen, CalendarCheck, CreditCard, FileText, GraduationCap, Home, ImageIcon, LayoutDashboard, Mail, Megaphone,
  PlusCircle, Settings, Sparkles, UserRound, Users,
};
export type NavIcon = keyof typeof icons;
export type NavItem = { href: string; label: string; icon: NavIcon; badge?: number; exact?: boolean };

export function Shell({
  title,
  nav,
  user,
  children,
  accent = "Üye Paneli",
}: {
  title: string;
  nav: NavItem[];
  user: { name: string; email: string };
  children: React.ReactNode;
  accent?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (item: NavItem) => (item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + "/"));

  const sidebar = (
    <div className="flex h-full flex-col">
      <Link href="/" className="flex items-center gap-3 px-6 py-6">
        <LogoMark className="h-10 w-10 text-accent" />
        <span className="leading-none">
          <span className="block font-display text-lg text-white">Ragıp Savaş</span>
          <span className="mt-1 block text-[0.6rem] font-extrabold tracking-[0.25em] text-gold">{accent.toLocaleUpperCase("tr-TR")}</span>
        </span>
      </Link>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2" aria-label={title}>
        {nav.map((item) => {
          const Icon = icons[item.icon];
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                active ? "bg-white text-ink" : "text-white/70 hover:bg-white/10 hover:text-white",
              )}
            >
              <Icon className={cn("h-[18px] w-[18px]", active ? "text-accent" : "")} />
              <span className="flex-1">{item.label}</span>
              {item.badge ? <span className="rounded-full bg-accent px-2 py-0.5 text-[0.7rem] font-bold text-white">{item.badge}</span> : null}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-4">
        <Link href="/" className="mb-2 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-white/60 hover:text-white">
          <ExternalLink className="h-4 w-4" /> Web sitesine git
        </Link>
        <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold font-bold text-ink">{user.name.charAt(0).toLocaleUpperCase("tr-TR")}</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-bold text-white">{user.name}</span>
            <span className="block truncate text-xs text-white/50">{user.email}</span>
          </span>
          <form action={logout}>
            <button type="submit" className="grid h-8 w-8 place-items-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white" aria-label="Çıkış yap" title="Çıkış yap">
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f6f3ee]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 bg-ink lg:block">{sidebar}</aside>
      <div className={cn("fixed inset-0 z-50 lg:hidden", open ? "visible" : "invisible")}>
        <div className={cn("absolute inset-0 bg-black/50 transition-opacity", open ? "opacity-100" : "opacity-0")} onClick={() => setOpen(false)} />
        <aside className={cn("absolute inset-y-0 left-0 w-72 bg-ink transition-transform", open ? "translate-x-0" : "-translate-x-full")}>
          <button type="button" onClick={() => setOpen(false)} className="absolute right-3 top-6 grid h-9 w-9 place-items-center rounded-lg text-white/70" aria-label="Menüyü kapat"><X className="h-5 w-5" /></button>
          {sidebar}
        </aside>
      </div>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-[#f6f3ee]/90 px-4 backdrop-blur sm:px-8 lg:hidden">
          <button type="button" onClick={() => setOpen(true)} className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-white" aria-label="Menüyü aç"><Menu className="h-5 w-5" /></button>
          <p className="font-display text-lg">{title}</p>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8 lg:py-10">{children}</main>
      </div>
    </div>
  );
}

export function PanelHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h1 className="text-3xl font-medium md:text-4xl">{title}</h1>
        {description && <p className="mt-1.5 text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({ label, value, hint, tone = "ink" }: { label: string; value: React.ReactNode; hint?: string; tone?: "ink" | "accent" | "gold" | "green" }) {
  const toneCls = { ink: "bg-ink text-gold", accent: "bg-accent text-white", gold: "bg-gold-soft text-gold", green: "bg-emerald-50 text-emerald-700" }[tone];
  return (
    <div className="card p-5">
      <span className={cn("inline-block h-2 w-8 rounded-full", toneCls)} />
      <p className="mt-4 text-sm font-semibold text-muted">{label}</p>
      <p className="mt-1 font-display text-3xl">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="card flex flex-col items-center px-6 py-14 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-sand"><Sparkles className="h-6 w-6 text-gold" /></span>
      <p className="mt-4 font-display text-xl">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
