import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/AuthForms";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Üye Girişi" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ yonlendir?: string }> }) {
  const { yonlendir: raw } = await searchParams;
  const yonlendir = raw && raw.startsWith("/") && !raw.startsWith("//") ? raw : undefined;
  const session = await getSession();
  if (session) redirect(yonlendir ?? (session.role === "ADMIN" ? "/yonetim" : "/panel"));
  return (
    <>
      <p className="eyebrow">Üye Paneli</p>
      <h1 className="mt-3 text-4xl font-medium">Tekrar hoş geldiniz</h1>
      <p className="mt-2 text-muted">Kayıtlarınızı, ödemelerinizi ve duyuruları görüntülemek için giriş yapın.</p>
      <div className="mt-8"><LoginForm redirectTo={yonlendir} /></div>
      <p className="mt-8 text-center text-sm text-muted">
        Hesabınız yok mu? <Link href={`/kayit${yonlendir ? `?yonlendir=${encodeURIComponent(yonlendir)}` : ""}`} className="font-bold text-accent hover:underline">Ücretsiz üye olun</Link>
      </p>
    </>
  );
}
