import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/AuthForms";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Üye Ol" };

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ yonlendir?: string }> }) {
  const { yonlendir: raw } = await searchParams;
  const yonlendir = raw && raw.startsWith("/") && !raw.startsWith("//") ? raw : undefined;
  if (await getSession()) redirect(yonlendir ?? "/panel");
  return (
    <>
      <p className="eyebrow">Ücretsiz Üyelik</p>
      <h1 className="mt-3 text-4xl font-medium">Hesap oluşturun</h1>
      <p className="mt-2 text-muted">Online kayıt ve ödeme için birkaç saniyede üye olun.</p>
      <div className="mt-8"><RegisterForm redirectTo={yonlendir} /></div>
      <p className="mt-8 text-center text-sm text-muted">
        Zaten üye misiniz? <Link href={`/giris${yonlendir ? `?yonlendir=${encodeURIComponent(yonlendir)}` : ""}`} className="font-bold text-accent hover:underline">Giriş yapın</Link>
      </p>
    </>
  );
}
