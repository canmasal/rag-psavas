import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { Lock } from "lucide-react";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { isIyzicoEnabled } from "@/lib/payment";
import { Logo } from "@/components/site/Logo";
import { TestCardForm } from "@/components/dashboard/TestCardForm";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Güvenli Ödeme", robots: { index: false } };

export default async function TestPaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  if (isIyzicoEnabled()) redirect(`/panel/odemeler/${id}`);
  const payment = await db.payment.findFirst({ where: { id, userId: user.id } });
  if (!payment) notFound();
  if (payment.status === "PAID") redirect(`/panel/odemeler/${id}`);

  return (
    <div className="min-h-screen bg-sand">
      <div className="bg-amber-400 px-4 py-2 text-center text-xs font-bold text-amber-950">
        TEST MODU — Gerçek ödeme alınmaz. Canlı ödeme için .env dosyasına iyzico API anahtarlarını ekleyin.
      </div>
      <div className="container-rs max-w-xl py-10">
        <div className="flex items-center justify-between"><Logo /><span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700"><Lock className="h-3.5 w-3.5" /> Güvenli Ödeme</span></div>
        <div className="card mt-8 overflow-hidden">
          <div className="flex items-center justify-between bg-ink p-6 text-white">
            <div><p className="text-xs font-bold uppercase tracking-wider text-white/50">Ödenecek tutar</p><p className="font-display text-3xl">{formatPrice(payment.amount)}</p></div>
            <p className="max-w-[12rem] text-right text-sm text-white/70">{payment.description}</p>
          </div>
          <div className="p-6"><TestCardForm paymentId={payment.id} amount={payment.amount} /></div>
        </div>
        <p className="mt-6 text-center text-xs text-muted">Başarılı test için <b>5528 7900 0000 0008</b> · Başarısız ödeme senaryosu için <b>4000 0000 0000 0002</b></p>
      </div>
    </div>
  );
}
