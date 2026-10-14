import Link from "next/link";
import { ArrowRight, CalendarDays, CreditCard, Megaphone, PlusCircle } from "lucide-react";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { PanelHeader, StatCard, EmptyState } from "@/components/dashboard/Shell";
import { Badge } from "@/components/ui/Badge";
import { CourseIcon } from "@/components/icons";
import { enrollmentStatus, formatDate, formatPrice } from "@/lib/utils";

export default async function PanelHome({ searchParams }: { searchParams: Promise<{ hosgeldin?: string; sifre?: string }> }) {
  const sp = await searchParams;
  const user = await requireUser();
  const [enrollments, students, payments, announcements] = await Promise.all([
    db.enrollment.findMany({ where: { userId: user.id, status: { not: "CANCELLED" } }, include: { course: true, student: true, package: true }, orderBy: { createdAt: "desc" } }),
    db.student.count({ where: { userId: user.id } }),
    db.payment.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } }),
    db.announcement.findMany({ where: { published: true }, orderBy: { createdAt: "desc" }, take: 3 }),
  ]);
  const active = enrollments.filter((e) => e.status === "ACTIVE");
  const pendingPayments = payments.filter((p) => p.status === "PENDING" || p.status === "FAILED");
  const totalPaid = payments.filter((p) => p.status === "PAID").reduce((s, p) => s + p.amount, 0);
  const firstName = user.name.split(" ")[0];

  return (
    <>
      {sp.hosgeldin && (
        <div className="mb-6 rounded-2xl bg-ink p-6 text-white">
          <p className="font-display text-2xl">Aramıza hoş geldiniz, {firstName}! 🎭</p>
          <p className="mt-1 text-white/70">Önce öğrenci bilgilerinizi ekleyin, ardından dilediğiniz eğitime online kayıt oluşturun.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/panel/ogrenciler" className="btn btn-light btn-sm">Öğrenci Ekle</Link>
            <Link href="/egitimlerimiz" className="btn btn-ghost-light btn-sm">Eğitimleri İncele</Link>
          </div>
        </div>
      )}
      {sp.sifre && <div className="mb-6 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-900">Şifreniz başarıyla güncellendi.</div>}
      <PanelHeader
        title={`Merhaba, ${firstName}`}
        description="Kayıtlarınızı, ödemelerinizi ve akademiden duyuruları buradan takip edebilirsiniz."
        action={<Link href="/panel/yeni-kayit" className="btn btn-primary"><PlusCircle className="h-4 w-4" /> Yeni Kayıt</Link>}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Aktif kayıt" value={active.length} tone="green" />
        <StatCard label="Öğrenci" value={students} tone="ink" />
        <StatCard label="Bekleyen ödeme" value={pendingPayments.length} hint={pendingPayments.length ? formatPrice(pendingPayments.reduce((s, p) => s + p.amount, 0)) : undefined} tone="accent" />
        <StatCard label="Toplam ödenen" value={formatPrice(totalPaid)} tone="gold" />
      </div>

      {pendingPayments.length > 0 && (
        <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <CreditCard className="mt-0.5 h-5 w-5 text-amber-700" />
            <div>
              <p className="font-bold text-amber-900">Tamamlanmamış ödemeniz var</p>
              <p className="text-sm text-amber-800">{pendingPayments[0].description} — {formatPrice(pendingPayments[0].amount)}</p>
            </div>
          </div>
          <Link href={`/panel/odemeler/${pendingPayments[0].id}`} className="btn btn-dark btn-sm">Ödemeyi Tamamla</Link>
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl">Kayıtlarım</h2>
            <Link href="/panel/kayitlarim" className="text-sm font-bold text-accent">Tümü →</Link>
          </div>
          {enrollments.length === 0 ? (
            <EmptyState title="Henüz bir kaydınız yok" description="Eğitimlerimizi inceleyip ilk kaydınızı birkaç adımda oluşturabilirsiniz." action={<Link href="/panel/yeni-kayit" className="btn btn-primary btn-sm">Kayıt Oluştur</Link>} />
          ) : (
            <div className="space-y-3">
              {enrollments.slice(0, 4).map((e) => (
                <div key={e.id} className="card flex items-center gap-4 p-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-white" style={{ background: e.course.color }}><CourseIcon name={e.course.icon} className="h-5 w-5" /></span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold">{e.course.title} <span className="font-normal text-muted">· {e.package?.name}</span></p>
                    <p className="flex items-center gap-1.5 text-xs text-muted"><CalendarDays className="h-3.5 w-3.5" />{e.student?.name ?? user.name} · {e.endDate ? `${formatDate(e.endDate)} tarihine kadar` : formatDate(e.createdAt)}</p>
                  </div>
                  <Badge tone={enrollmentStatus[e.status]?.tone}>{enrollmentStatus[e.status]?.label}</Badge>
                </div>
              ))}
            </div>
          )}
        </section>
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl">Duyurular</h2>
            <Link href="/panel/duyurular" className="text-sm font-bold text-accent">Tümü →</Link>
          </div>
          <div className="space-y-3">
            {announcements.map((a) => (
              <div key={a.id} className="card p-5">
                <p className="flex items-center gap-2 text-xs font-bold text-muted"><Megaphone className="h-3.5 w-3.5 text-accent" />{formatDate(a.createdAt)}</p>
                <p className="mt-2 font-bold">{a.title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-muted">{a.content}</p>
              </div>
            ))}
            {announcements.length === 0 && <p className="text-sm text-muted">Şu an duyuru bulunmuyor.</p>}
          </div>
          <Link href="/ucretsiz-deneme-dersi" className="mt-4 flex items-center justify-between rounded-2xl bg-ink p-5 text-white">
            <span><span className="block font-display text-lg">Yeni bir branş denemek ister misiniz?</span><span className="text-sm text-white/60">Ücretsiz deneme dersi planlayın</span></span>
            <ArrowRight className="h-5 w-5 text-gold" />
          </Link>
        </section>
      </div>
    </>
  );
}
