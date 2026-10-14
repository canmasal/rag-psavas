import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { PanelHeader, EmptyState } from "@/components/dashboard/Shell";
import { Badge } from "@/components/ui/Badge";
import { formatDate, formatPrice, paymentMethod, paymentStatus } from "@/lib/utils";

export default async function PaymentsPage() {
  const user = await requireUser();
  const payments = await db.payment.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } });
  return (
    <>
      <PanelHeader title="Ödemelerim" description="Tüm ödeme hareketleriniz." />
      {payments.length === 0 ? (
        <EmptyState title="Henüz ödeme yok" />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b border-line text-left text-xs uppercase tracking-wider text-muted">
              <tr><th className="p-4">Açıklama</th><th className="p-4">Tarih</th><th className="p-4">Yöntem</th><th className="p-4 text-right">Tutar</th><th className="p-4">Durum</th><th className="p-4" /></tr>
            </thead>
            <tbody className="divide-y divide-line">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-sand/50">
                  <td className="p-4 font-semibold">{p.description}</td>
                  <td className="p-4 text-muted">{formatDate(p.createdAt)}</td>
                  <td className="p-4 text-muted">{paymentMethod[p.method]}</td>
                  <td className="p-4 text-right font-bold">{formatPrice(p.amount)}</td>
                  <td className="p-4"><Badge tone={paymentStatus[p.status]?.tone}>{paymentStatus[p.status]?.label}</Badge></td>
                  <td className="p-4 text-right"><Link href={`/panel/odemeler/${p.id}`} className="font-bold text-accent">Detay</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
