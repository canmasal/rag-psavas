import Link from "next/link";
import { db } from "@/lib/db";
import { PanelHeader, StatCard } from "@/components/dashboard/Shell";
import { Badge } from "@/components/ui/Badge";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { formatDate, formatPrice, paymentStatus, trialStatus } from "@/lib/utils";
import { isIyzicoEnabled } from "@/lib/payment";

export default async function AdminHome() {
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const sixMonthsAgo = new Date(monthStart);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

  const [members, activeEnrollments, monthRevenue, pendingTransfers, payments, trials, paidRecent, popular] = await Promise.all([
    db.user.count({ where: { role: "MEMBER" } }),
    db.enrollment.count({ where: { status: "ACTIVE" } }),
    db.payment.aggregate({ where: { status: "PAID", paidAt: { gte: monthStart } }, _sum: { amount: true } }),
    db.payment.count({ where: { status: "PENDING", method: "BANK_TRANSFER" } }),
    db.payment.findMany({ orderBy: { createdAt: "desc" }, take: 6, include: { user: true } }),
    db.trialRequest.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    db.payment.findMany({ where: { status: "PAID", paidAt: { gte: sixMonthsAgo } }, select: { amount: true, paidAt: true } }),
    db.enrollment.groupBy({ by: ["courseId"], where: { status: "ACTIVE" }, _count: true, orderBy: { _count: { courseId: "desc" } }, take: 5 }),
  ]);

  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(sixMonthsAgo);
    d.setMonth(d.getMonth() + i);
    return { key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleDateString("tr-TR", { month: "short" }), value: 0 };
  });
  for (const p of paidRecent) {
    const d = p.paidAt!;
    const m = months.find((x) => x.key === `${d.getFullYear()}-${d.getMonth()}`);
    if (m) m.value += p.amount;
  }
  const allCourses = await db.course.findMany({ select: { slug: true, title: true } });
  const slugTitle = Object.fromEntries(allCourses.map((c) => [c.slug, c.title]));
  const courseNames = Object.fromEntries((await db.course.findMany({ where: { id: { in: popular.map((p) => p.courseId) } }, select: { id: true, title: true, color: true } })).map((c) => [c.id, c]));

  return (
    <>
      <PanelHeader title="Genel Bakış" description={`${formatDate(new Date())} · Akademinin güncel durumu`} />
      {!isIyzicoEnabled() && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <b>Ödeme altyapısı test modunda.</b> Canlı kart ödemesi almak için sunucudaki <code>.env</code> dosyasına <code>IYZICO_API_KEY</code> ve <code>IYZICO_SECRET_KEY</code> değerlerini girin (README&apos;de anlatılmıştır).
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Bu ay tahsilat" value={formatPrice(monthRevenue._sum.amount ?? 0)} tone="green" />
        <StatCard label="Aktif kayıt" value={activeEnrollments} tone="ink" />
        <StatCard label="Üye sayısı" value={members} tone="gold" />
        <StatCard label="Onay bekleyen havale" value={pendingTransfers} tone="accent" />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="card p-6">
          <p className="font-display text-xl">Son 6 ay tahsilat</p>
          <RevenueChart data={months.map(({ label, value }) => ({ label, value }))} />
        </div>
        <div className="card p-6">
          <p className="font-display text-xl">En popüler eğitimler</p>
          <ul className="mt-5 space-y-4">
            {popular.map((p) => {
              const c = courseNames[p.courseId];
              const max = popular[0]._count || 1;
              return (
                <li key={p.courseId}>
                  <div className="flex justify-between text-sm font-semibold"><span>{c?.title}</span><span>{p._count}</span></div>
                  <div className="mt-1.5 h-2 rounded-full bg-sand"><div className="h-2 rounded-full" style={{ width: `${(p._count / max) * 100}%`, background: c?.color }} /></div>
                </li>
              );
            })}
            {popular.length === 0 && <li className="text-sm text-muted">Henüz aktif kayıt yok.</li>}
          </ul>
        </div>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card">
          <div className="flex items-center justify-between border-b border-line p-5"><p className="font-display text-xl">Son ödemeler</p><Link href="/yonetim/odemeler" className="text-sm font-bold text-accent">Tümü →</Link></div>
          <ul className="divide-y divide-line">
            {payments.map((p) => (
              <li key={p.id} className="flex items-center gap-3 p-4 text-sm">
                <div className="min-w-0 flex-1"><p className="truncate font-semibold">{p.user.name}</p><p className="truncate text-xs text-muted">{p.description}</p></div>
                <span className="font-bold">{formatPrice(p.amount)}</span>
                <Badge tone={paymentStatus[p.status]?.tone}>{paymentStatus[p.status]?.label}</Badge>
              </li>
            ))}
            {payments.length === 0 && <li className="p-5 text-sm text-muted">Henüz ödeme yok.</li>}
          </ul>
        </div>
        <div className="card">
          <div className="flex items-center justify-between border-b border-line p-5"><p className="font-display text-xl">Deneme dersi talepleri</p><Link href="/yonetim/deneme-dersleri" className="text-sm font-bold text-accent">Tümü →</Link></div>
          <ul className="divide-y divide-line">
            {trials.map((t) => (
              <li key={t.id} className="flex items-center gap-3 p-4 text-sm">
                <div className="min-w-0 flex-1"><p className="truncate font-semibold">{t.parentName} <span className="font-normal text-muted">· {t.studentName} ({t.studentAge})</span></p><p className="text-xs text-muted">{slugTitle[t.courseSlug] ?? "Kararsız"} · {t.phone}</p></div>
                <Badge tone={trialStatus[t.status]?.tone}>{trialStatus[t.status]?.label}</Badge>
              </li>
            ))}
            {trials.length === 0 && <li className="p-5 text-sm text-muted">Henüz talep yok.</li>}
          </ul>
        </div>
      </div>
    </>
  );
}
