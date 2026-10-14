import Link from "next/link";
import { db } from "@/lib/db";
import { PanelHeader, StatCard } from "@/components/dashboard/Shell";
import { FilterTabs } from "@/components/dashboard/FilterTabs";
import { Badge } from "@/components/ui/Badge";
import { approvePayment, setPaymentStatus } from "@/app/actions/admin";
import { formatDate, formatPrice, paymentMethod, paymentStatus } from "@/lib/utils";

export default async function AdminPayments({ searchParams }: { searchParams: Promise<{ durum?: string }> }) {
  const { durum } = await searchParams;
  const [items, sums] = await Promise.all([
    db.payment.findMany({ where: durum ? { status: durum } : {}, include: { user: true }, orderBy: { createdAt: "desc" }, take: 200 }),
    db.payment.groupBy({ by: ["status"], _sum: { amount: true }, _count: true }),
  ]);
  const s = Object.fromEntries(sums.map((x) => [x.status, x]));
  return (
    <>
      <PanelHeader title="Ödemeler" description="Kart ödemeleri ve havale/EFT onayları." />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Toplam tahsilat" value={formatPrice(s.PAID?._sum.amount ?? 0)} hint={`${s.PAID?._count ?? 0} ödeme`} tone="green" />
        <StatCard label="Bekleyen" value={formatPrice(s.PENDING?._sum.amount ?? 0)} hint={`${s.PENDING?._count ?? 0} ödeme`} tone="accent" />
        <StatCard label="İade edilen" value={formatPrice(s.REFUNDED?._sum.amount ?? 0)} hint={`${s.REFUNDED?._count ?? 0} ödeme`} tone="ink" />
      </div>
      <FilterTabs base="/yonetim/odemeler" current={durum} options={[{ label: "Tümü" }, ...Object.entries(paymentStatus).map(([value, x]) => ({ value, label: x.label, count: s[value]?._count ?? 0 }))]} />
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="border-b border-line text-left text-xs uppercase tracking-wider text-muted">
            <tr><th className="p-4">No</th><th className="p-4">Üye</th><th className="p-4">Açıklama</th><th className="p-4">Yöntem</th><th className="p-4 text-right">Tutar</th><th className="p-4">Durum</th><th className="p-4">İşlem</th></tr>
          </thead>
          <tbody className="divide-y divide-line">
            {items.map((p) => (
              <tr key={p.id} className="align-top">
                <td className="p-4 font-mono text-xs">#{p.id.slice(-8).toUpperCase()}<p className="font-sans text-muted">{formatDate(p.createdAt)}</p></td>
                <td className="p-4"><Link href={`/yonetim/uyeler/${p.userId}`} className="font-semibold hover:text-accent">{p.user.name}</Link><p className="text-xs text-muted">{p.user.email}</p></td>
                <td className="p-4">{p.description}{p.errorMessage && <p className="text-xs text-red-700">{p.errorMessage}</p>}</td>
                <td className="p-4 text-muted">{paymentMethod[p.method]}<p className="text-xs">{p.provider}</p></td>
                <td className="p-4 text-right font-bold">{formatPrice(p.amount)}</td>
                <td className="p-4"><Badge tone={paymentStatus[p.status]?.tone}>{paymentStatus[p.status]?.label}</Badge></td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1.5">
                    {(p.status === "PENDING" || p.status === "FAILED") && (
                      <form action={approvePayment}><input type="hidden" name="id" value={p.id} /><button className="btn btn-primary btn-sm !px-3" type="submit">Ödendi olarak onayla</button></form>
                    )}
                    {p.status === "PAID" && (
                      <form action={setPaymentStatus}><input type="hidden" name="id" value={p.id} /><input type="hidden" name="status" value="REFUNDED" /><button className="btn btn-outline btn-sm !px-3" type="submit">İade edildi</button></form>
                    )}
                    {p.status === "PENDING" && (
                      <form action={setPaymentStatus}><input type="hidden" name="id" value={p.id} /><input type="hidden" name="status" value="CANCELLED" /><button className="btn btn-sm !px-3 text-muted hover:bg-sand" type="submit">İptal</button></form>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={7} className="p-10 text-center text-muted">Ödeme bulunamadı.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
