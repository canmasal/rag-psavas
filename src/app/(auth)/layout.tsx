import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { ArtCover } from "@/components/art";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-5 py-8 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between">
          <Logo />
          <Link href="/" className="flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink"><ArrowLeft className="h-4 w-4" /> Siteye dön</Link>
        </div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">{children}</div>
      </div>
      <div className="relative hidden overflow-hidden bg-ink lg:block">
        <ArtCover seed="auth-panel" color="#3a1d4a" icon="Drama" className="absolute inset-0 opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-16 text-white">
          <p className="font-display text-4xl leading-tight">Kayıt, ödeme ve ders takibi<br />tek bir panelde.</p>
          <ul className="mt-8 space-y-3 text-white/80">
            {["Birden fazla öğrenciyi tek hesaptan yönetin", "Kredi kartı ile taksitli online ödeme", "Ödeme geçmişi ve kayıt durumları", "Akademiden duyurular ve bilgilendirmeler"].map((t) => (
              <li key={t} className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-gold" />{t}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
