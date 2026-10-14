import Link from "next/link";
import type { Metadata } from "next";
import { ForgotForm } from "@/components/auth/AuthForms";

export const metadata: Metadata = { title: "Şifremi Unuttum" };

export default function ForgotPage() {
  return (
    <>
      <h1 className="text-4xl font-medium">Şifrenizi mi unuttunuz?</h1>
      <p className="mt-2 text-muted">Üyelik e-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.</p>
      <div className="mt-8"><ForgotForm /></div>
      <p className="mt-8 text-center text-sm"><Link href="/giris" className="font-bold text-accent hover:underline">Girişe dön</Link></p>
    </>
  );
}
