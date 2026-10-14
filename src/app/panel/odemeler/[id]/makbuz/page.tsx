import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { LogoMark } from "@/components/site/Logo";
import { PrintButton } from "@/components/dashboard/PrintButton";
import { formatDate, formatPrice, paymentMethod } from "@/lib/utils";

export default async function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const payment = await db.payment.findFirst({ where: { id, userId: user.id, status: "PAID" }, include: { enrollment: { include: { student: true } } } });
  if (!payment) notFound();
  const s = await getSettings();
  const net = payment.amount / 1.1;
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex justify-end print:hidden"><PrintButton /></div>
      <div className="card p-10 print:border-0 print:p-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3"><LogoMark className="h-12 w-12 text-ink" /><div><p className="font-display text-xl">{s.siteName}</p><p className="text-xs text-muted">{s.address}</p></div></div>
          <div className="text-right"><p className="text-xs font-bold uppercase tracking-wider text-muted">Ödeme Makbuzu</p><p className="font-display text-xl">#{payment.id.slice(-8).toUpperCase()}</p></div>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-6 text-sm">
          <div><p className="text-xs font-semibold text-muted">Ödeyen</p><p className="font-semibold">{user.name}</p><p className="text-muted">{user.email}</p></div>
          <div className="text-right"><p className="text-xs font-semibold text-muted">Ödeme tarihi</p><p className="font-semibold">{formatDate(payment.paidAt!, true)}</p><p className="text-muted">{paymentMethod[payment.method]}</p></div>
        </div>
        <table className="mt-10 w-full text-sm">
          <thead className="border-b border-line text-left text-xs uppercase tracking-wider text-muted"><tr><th className="py-3">Hizmet</th><th className="py-3 text-right">Tutar</th></tr></thead>
          <tbody>
            <tr className="border-b border-line"><td className="py-4">{payment.description}</td><td className="py-4 text-right">{formatPrice(payment.amount)}</td></tr>
          </tbody>
          <tfoot className="text-sm">
            <tr><td className="pt-4 text-right text-muted">Ara toplam (KDV hariç)</td><td className="pt-4 text-right">{new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(net)}</td></tr>
            <tr><td className="pt-1 text-right text-muted">KDV (%10)</td><td className="pt-1 text-right">{new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(payment.amount - net)}</td></tr>
            <tr><td className="pt-3 text-right font-bold">Toplam</td><td className="pt-3 text-right font-display text-2xl">{formatPrice(payment.amount)}</td></tr>
          </tfoot>
        </table>
        <p className="mt-12 text-xs text-muted">Bu belge bilgilendirme amaçlıdır. Resmi faturanız ayrıca e-fatura / e-arşiv olarak iletilecektir.</p>
      </div>
    </div>
  );
}
