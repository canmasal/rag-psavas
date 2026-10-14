import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { PanelHeader, EmptyState } from "@/components/dashboard/Shell";
import { Badge } from "@/components/ui/Badge";
import { CourseIcon } from "@/components/icons";
import { cancelEnrollment } from "@/app/actions/member";
import { enrollmentStatus, formatDate, formatPrice } from "@/lib/utils";

export default async function EnrollmentsPage() {
  const user = await requireUser();
  const enrollments = await db.enrollment.findMany({
    where: { userId: user.id },
    include: { course: true, student: true, package: true, payments: { orderBy: { createdAt: "desc" } } },
    orderBy: { createdAt: "desc" },
  });
  return (
    <>
      <PanelHeader title="Kayıtlarım" description="Tüm eğitim kayıtlarınız ve durumları." action={<Link href="/panel/yeni-kayit" className="btn btn-primary">Yeni Kayıt</Link>} />
      {enrollments.length === 0 ? (
        <EmptyState title="Kayıt bulunamadı" description="Henüz bir eğitime kayıt olmadınız." action={<Link href="/egitimlerimiz" className="btn btn-dark btn-sm">Eğitimleri İncele</Link>} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {enrollments.map((e) => {
            const payment = e.payments[0];
            return (
              <div key={e.id} className="card overflow-hidden">
                <div className="flex items-center gap-4 p-5" style={{ background: `${e.course.color}12` }}>
                  <span className="grid h-12 w-12 place-items-center rounded-xl text-white" style={{ background: e.course.color }}><CourseIcon name={e.course.icon} className="h-5 w-5" /></span>
                  <div className="flex-1">
                    <p className="font-display text-xl">{e.course.title}</p>
                    <p className="text-sm text-muted">{e.package?.name}</p>
                  </div>
                  <Badge tone={enrollmentStatus[e.status]?.tone}>{enrollmentStatus[e.status]?.label}</Badge>
                </div>
                <dl className="grid grid-cols-2 gap-4 p-5 text-sm">
                  <div><dt className="text-xs font-semibold text-muted">Öğrenci</dt><dd className="font-semibold">{e.student?.name ?? user.name}</dd></div>
                  <div><dt className="text-xs font-semibold text-muted">Tutar</dt><dd className="font-semibold">{payment ? formatPrice(payment.amount) : "—"}</dd></div>
                  <div><dt className="text-xs font-semibold text-muted">Kayıt tarihi</dt><dd className="font-semibold">{formatDate(e.createdAt)}</dd></div>
                  <div><dt className="text-xs font-semibold text-muted">Geçerlilik</dt><dd className="font-semibold">{e.endDate ? `${formatDate(e.endDate)}'e kadar` : "—"}</dd></div>
                </dl>
                {e.status === "PENDING_PAYMENT" && payment && (
                  <div className="flex flex-wrap gap-2 border-t border-line p-4">
                    <Link href={`/panel/odemeler/${payment.id}`} className="btn btn-primary btn-sm">Ödemeyi Tamamla</Link>
                    <form action={cancelEnrollment}>
                      <input type="hidden" name="id" value={e.id} />
                      <button type="submit" className="btn btn-sm text-muted hover:bg-sand">Kaydı İptal Et</button>
                    </form>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
