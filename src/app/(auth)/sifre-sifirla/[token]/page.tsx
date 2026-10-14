import type { Metadata } from "next";
import { ResetForm } from "@/components/auth/AuthForms";

export const metadata: Metadata = { title: "Yeni Şifre Belirle" };

export default async function ResetPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return (
    <>
      <h1 className="text-4xl font-medium">Yeni şifre belirleyin</h1>
      <p className="mt-2 text-muted">En az 8 karakterden oluşan yeni bir şifre seçin.</p>
      <div className="mt-8"><ResetForm token={token} /></div>
    </>
  );
}
