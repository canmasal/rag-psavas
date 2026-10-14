"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, Phone, UserRound, X, LayoutDashboard } from "lucide-react";
import { Logo } from "./Logo";
import { CourseIcon } from "../icons";
import { cn } from "@/lib/utils";

type NavCourse = { slug: string; title: string; category: string; icon: string; color: string };

export function Header({
  courses,
  user,
  phone,
  announcement,
}: {
  courses: NavCourse[];
  user: { name: string; role: string } | null;
  phone: string;
  announcement: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mega, setMega] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMega(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const grouped = courses.reduce<Record<string, NavCourse[]>>((acc, c) => {
    (acc[c.category] ??= []).push(c);
    return acc;
  }, {});

  const links = [
    { href: "/hakkimizda", label: "Kurumsal" },
    { href: "/egitimlerimiz", label: "Eğitimlerimiz", mega: true },
    { href: "/rehber", label: "Rehber" },
    { href: "/blog", label: "Blog" },
    { href: "/galeri", label: "Galeri" },
    { href: "/iletisim", label: "İletişim" },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {announcement && (
        <div className="bg-ink text-[0.8rem] text-white/85">
          <div className="container-rs flex h-9 items-center justify-between gap-4">
            <p className="truncate">
              <span className="mr-2 inline-block h-1.5 w-1.5 -translate-y-0.5 rounded-full bg-gold" />
              {announcement}
            </p>
            <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="hidden items-center gap-1.5 font-semibold text-white sm:flex">
              <Phone className="h-3.5 w-3.5 text-gold" /> {phone}
            </a>
          </div>
        </div>
      )}
      <header
        className={cn(
          "sticky top-0 z-40 border-b transition-all duration-300",
          scrolled ? "border-line bg-paper/90 backdrop-blur-xl shadow-[0_8px_30px_-20px_rgba(0,0,0,0.3)]" : "border-transparent bg-paper",
        )}
        onMouseLeave={() => setMega(false)}
      >
        <div className="container-rs flex h-20 items-center justify-between gap-6">
          <Logo />
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Ana menü">
            {links.map((l) =>
              l.mega ? (
                <button
                  key={l.href}
                  type="button"
                  onMouseEnter={() => setMega(true)}
                  onClick={() => setMega((v) => !v)}
                  aria-expanded={mega}
                  className={cn(
                    "flex items-center gap-1 rounded-full px-4 py-2 text-[0.92rem] font-semibold transition hover:bg-sand",
                    isActive(l.href) && "text-accent",
                  )}
                >
                  {l.label}
                  <ChevronDown className={cn("h-4 w-4 transition", mega && "rotate-180")} />
                </button>
              ) : (
                <Link
                  key={l.href}
                  href={l.href}
                  onMouseEnter={() => setMega(false)}
                  className={cn(
                    "rounded-full px-4 py-2 text-[0.92rem] font-semibold transition hover:bg-sand",
                    (isActive(l.href) || (l.href === "/hakkimizda" && pathname === "/ragip-savas-kimdir")) && "text-accent",
                  )}
                >
                  {l.label}
                </Link>
              ),
            )}
          </nav>
          <div className="hidden items-center gap-2 lg:flex">
            {user ? (
              <Link href={user.role === "ADMIN" ? "/yonetim" : "/panel"} className="btn btn-outline btn-sm">
                <LayoutDashboard className="h-4 w-4" />
                {user.role === "ADMIN" ? "Yönetim" : "Panelim"}
              </Link>
            ) : (
              <Link href="/giris" className="btn btn-sm hover:bg-sand">
                <UserRound className="h-4 w-4" /> Üye Girişi
              </Link>
            )}
            <Link href="/ucretsiz-deneme-dersi" className="btn btn-primary btn-sm">
              Ücretsiz Deneme Dersi
            </Link>
          </div>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Menüyü aç"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Mega menü */}
        <div
          className={cn(
            "absolute inset-x-0 top-full hidden border-b border-line bg-white shadow-2xl shadow-black/5 transition-all duration-200 lg:block",
            mega ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0",
          )}
        >
          <div className="container-rs grid grid-cols-[repeat(5,minmax(0,1fr))_16rem] gap-6 py-8">
            {Object.entries(grouped).map(([cat, items]) => (
              <div key={cat}>
                <p className="mb-3 text-[0.7rem] font-extrabold uppercase tracking-[0.18em] text-muted">{cat}</p>
                <ul className="space-y-1">
                  {items.map((c) => (
                    <li key={c.slug}>
                      <Link href={`/egitimlerimiz/${c.slug}`} className="group flex items-center gap-3 rounded-xl px-2 py-1.5 hover:bg-sand">
                        <span className="grid h-8 w-8 place-items-center rounded-lg text-white" style={{ background: c.color }}>
                          <CourseIcon name={c.icon} className="h-4 w-4" />
                        </span>
                        <span className="text-[0.92rem] font-semibold group-hover:text-accent">{c.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="rounded-2xl bg-ink p-6 text-white">
              <p className="font-display text-xl">Hangi branş size uygun?</p>
              <p className="mt-2 text-sm text-white/70">Yaşa ve ilgi alanına göre branş seçim rehberimize göz atın.</p>
              <Link href="/rehber" className="btn btn-light btn-sm mt-5">
                Rehberi incele
              </Link>
              <Link href="/egitimlerimiz" className="mt-3 block text-sm font-semibold text-gold hover:underline">
                Tüm eğitimler →
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobil menü */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", open ? "visible" : "invisible")}>
        <div className={cn("absolute inset-0 bg-ink/50 transition-opacity", open ? "opacity-100" : "opacity-0")} onClick={() => setOpen(false)} />
        <div
          className={cn(
            "absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-paper shadow-2xl transition-transform duration-300",
            open ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex h-20 items-center justify-between border-b border-line px-5">
            <Logo />
            <button type="button" onClick={() => setOpen(false)} className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white" aria-label="Menüyü kapat">
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-5 py-6" aria-label="Mobil menü">
            <ul className="space-y-1">
              {[{ href: "/", label: "Ana Sayfa" }, { href: "/hakkimizda", label: "Hakkımızda" }, { href: "/ragip-savas-kimdir", label: "Ragıp Savaş Kimdir?" }, ...links.slice(1)].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={cn("block rounded-xl px-3 py-3 font-display text-xl", pathname === l.href ? "bg-sand text-accent" : "hover:bg-sand")}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-8 px-3 text-[0.7rem] font-extrabold uppercase tracking-[0.18em] text-muted">Eğitimler</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {courses.map((c) => (
                <Link key={c.slug} href={`/egitimlerimiz/${c.slug}`} className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2 text-sm font-semibold">
                  <span className="h-2 w-2 rounded-full" style={{ background: c.color }} />
                  {c.title}
                </Link>
              ))}
            </div>
          </nav>
          <div className="space-y-2 border-t border-line p-5">
            <Link href="/ucretsiz-deneme-dersi" className="btn btn-primary w-full">
              Ücretsiz Deneme Dersi
            </Link>
            <Link href={user ? (user.role === "ADMIN" ? "/yonetim" : "/panel") : "/giris"} className="btn btn-outline w-full">
              {user ? (user.role === "ADMIN" ? "Yönetim Paneli" : "Üye Panelim") : "Üye Girişi / Kayıt"}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
