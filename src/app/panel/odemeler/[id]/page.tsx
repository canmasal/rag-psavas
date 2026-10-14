import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Clock, Landmark, XCircle, Printer } from "lucide-react";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { payWithCard } from "@/app/actions/member";
import { Badge } from "@/components/ui/Badge";
import { CopyButton } from "@/components/dashboard/CopyButton";
import { formatDate, formatPrice, paymentMethod, paymentStatus } from "@/lib/utils";

export default async function PaymentDetail({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ durum?: string }> }) {
  const [{ id }, { durum }] = await Promise.all([params, searchParams]);
  const user = await requireUser();
  const payment = await db.payment.findFirst({ where: { id, userId: user.id }, include: { enrollment: { include: { course: true, student: true, package: true } } } });
  if (!payment) notFound();
  const settings = await getSettings();
  const ref = payment.id.slice(-8).toUpperCase();
  const open = payment.status === "PENDING" || payment.status === "FAILED";
  const canPay = open && payment.enrollment?.status === "PENDING_PAYMENT";

  return (
    <div className="mx-auto max-w-3xl">
      {payment.status === "PAID" && (
        <div className="card mb-6 flex flex-col items-center p-10 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-600"><CheckCircle2 className="h-9 w-9" /></span>
          <h1 className="mt-5 text-3xl">{durum === "basarili" ? "Ödemeniz başarıyla alındı!" : "Ödeme tamamlandı"}</h1>
          <p className="mt-2 max-w-md text-muted">Kaydınız aktifleştirildi. Ders gün ve saatinizi teyit etmek için eğitim danışmanımız sizinle iletişime geçecek.</p>
        </div>
      )}
      {payment.status === "FAILED" && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl bg-red-50 p-5 text-red-900">
          <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div><p className="font-bold">Ödeme tamamlanamadı</p><p className="text-sm">{payment.errorMessage ?? "Lütfen kart bilgilerinizi kontrol ederek tekrar deneyin."}</p></div>
        </div>
      )}
      {payment.status === "PENDING" && payment.method === "BANK_TRANSFER" && (
        <div className="card mb-6 overflow-hidden">
          <div className="flex items-center gap-3 bg-ink p-6 text-white">
            <Landmark className="h-6 w-6 text-gold" />
            <div><p className="font-display text-xl">Havale / EFT bilgileri</p><p className="text-sm text-white/60">Ödemeniz onaylandığında kaydınız aktifleşir.</p></div>
          </div>
          <dl className="divide-y divide-line text-sm">
            {[["Banka", settings.bankName], ["Hesap sahibi", settings.bankAccountName], ["IBAN", settings.bankIban], ["Tutar", formatPrice(payment.amount)], ["Açıklama", `KAYIT-${ref}`]].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between gap-4 px-6 py-4">
                <dt className="text-muted">{k}</dt>
                <dd className="flex items-center gap-2 text-right font-bold">{v}{(k === "IBAN" || k === "Açıklama") && <CopyButton value={v} />}</dd>
              </div>
            ))}
          </dl>
          <p className="flex items-start gap-2 bg-amber-50 px-6 py-4 text-xs font-semibold text-amber-900"><Clock className="h-4 w-4 shrink-0" />Lütfen açıklama alanına mutlaka <b>KAYIT-{ref}</b> yazınız. Ödemeniz 1 iş günü içinde kontrol edilerek onaylanır.</p>
        </div>
      )}

      <div className="card">
        <div className="flex items-center justify-between border-b border-line p-6">
          <div><p className="text-xs font-bold uppercase tracking-wider text-muted">Ödeme No</p><p className="font-display text-xl">#{ref}</p></div>
          <Badge tone={paymentStatus[payment.status]?.tone}>{paymentStatus[payment.status]?.label}</Badge>
        </div>
        <dl className="grid gap-5 p-6 text-sm sm:grid-cols-2">
          <div><dt className="text-xs font-semibold text-muted">Açıklama</dt><dd className="font-semibold">{payment.description}</dd></div>
          <div><dt className="text-xs font-semibold text-muted">Tutar</dt><dd className="font-display text-2xl">{formatPrice(payment.amount)}</dd></div>
          <div><dt className="text-xs font-semibold text-muted">Ödeme yöntemi</dt><dd className="font-semibold">{paymentMethod[payment.method]}</dd></div>
          <div><dt className="text-xs font-semibold text-muted">Oluşturulma</dt><dd className="font-semibold">{formatDate(payment.createdAt, true)}</dd></div>
          {payment.paidAt && <div><dt className="text-xs font-semibold text-muted">Ödeme tarihi</dt><dd className="font-semibold">{formatDate(payment.paidAt, true)}</dd></div>}
          {payment.enrollment?.endDate && <div><dt className="text-xs font-semibold text-muted">Kayıt geçerliliği</dt><dd className="font-semibold">{formatDate(payment.enrollment.endDate)}</dd></div>}
        </dl>
        <div className="flex flex-wrap gap-2 border-t border-line p-6">
          {canPay && (
            <form action={payWithCard}>
              <input type="hidden" name="paymentId" value={payment.id} />
              <button type="submit" className="btn btn-primary">{payment.method === "BANK_TRANSFER" ? "Kartla Öde" : "Tekrar Dene"}</button>
            </form>
          )}
          <Link href="/panel/odemeler" className="btn btn-outline">Tüm Ödemeler</Link>
          {payment.status === "PAID" && <Link href={`/panel/odemeler/${payment.id}/makbuz`} className="btn hover:bg-sand"><Printer className="h-4 w-4" /> Makbuz</Link>}
        </div>
      </div>
    </div>
  );
}
