import Link from "next/link";
import { db } from "@/lib/db";
import { PanelHeader } from "@/components/dashboard/Shell";
import { FilterTabs } from "@/components/dashboard/FilterTabs";
import { Badge } from "@/components/ui/Badge";
import { setEnrollmentStatus } from "@/app/actions/admin";
import { enrollmentStatus, formatDate } from "@/lib/utils";

export default async function AdminEnrollments({ searchParams }: { searchParams: Promise<{ durum?: string; kurs?: string }> }) {
  const { durum, kurs } = await searchParams;
  const [items, counts, courses] = await Promise.all([
    db.enrollment.findMany({
      where: { ...(durum ? { status: durum } : {}), ...(kurs ? { courseId: kurs } : {}) },
      include: { user: true, student: true, course: true, package: true },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    db.enrollment.groupBy({ by: ["status"], _count: true }),
    db.course.findMany({ orderBy: { order: "asc" }, select: { id: true, title: true } }),
  ]);
  const c = Object.fromEntries(counts.map((x) => [x.status, x._count]));
  return (
    <>
      <PanelHeader title="Kayıtlar" description="Tüm eğitim kayıtlarını görüntüleyin ve durumlarını yönetin." />
      <FilterTabs base="/yonetim/kayitlar" current={durum} options={[{ label: "Tümü" }, ...Object.entries(enrollmentStatus).map(([value, s]) => ({ value, label: s.label, count: c[value] ?? 0 }))]} />
      <form className="mb-4 flex gap-2">
        {durum && <input type="hidden" name="durum" value={durum} />}
        <select name="kurs" defaultValue={kurs ?? ""} className="input max-w-xs">
          <option value="">Tüm eğitimler</option>
          {courses.map((x) => <option key={x.id} value={x.id}>{x.title}</option>)}
        </select>
        <button className="btn btn-dark btn-sm" type="submit">Filtrele</button>
      </form>
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[860px] text-sm">
          <thead className="border-b border-line text-left text-xs uppercase tracking-wider text-muted">
            <tr><th className="p-4">Öğrenci / Veli</th><th className="p-4">Eğitim</th><th className="p-4">Tarih</th><th className="p-4">Geçerlilik</th><th className="p-4">Durum</th><th className="p-4">İşlem</th></tr>
          </thead>
          <tbody className="divide-y divide-line">
            {items.map((e) => (
              <tr key={e.id} className="align-top">
                <td className="p-4"><p className="font-semibold">{e.student?.name ?? e.user.name}</p><Link href={`/yonetim/uyeler/${e.userId}`} className="text-xs text-muted hover:text-accent">{e.user.name} · {e.user.phone}</Link>{e.note && <p className="mt-1 max-w-xs text-xs italic text-muted">“{e.note}”</p>}</td>
                <td className="p-4"><p className="font-semibold">{e.course.title}</p><p className="text-xs text-muted">{e.package?.name}</p></td>
                <td className="p-4 text-muted">{formatDate(e.createdAt)}</td>
                <td className="p-4 text-muted">{e.endDate ? formatDate(e.endDate) : "—"}</td>
                <td className="p-4"><Badge tone={enrollmentStatus[e.status]?.tone}>{enrollmentStatus[e.status]?.label}</Badge></td>
                <td className="p-4">
                  <form action={setEnrollmentStatus} className="flex gap-1.5">
                    <input type="hidden" name="id" value={e.id} />
                    <select name="status" defaultValue={e.status} className="input !py-1.5 !text-xs">
                      {Object.entries(enrollmentStatus).map(([v, s]) => <option key={v} value={v}>{s.label}</option>)}
                    </select>
                    <button type="submit" className="btn btn-dark btn-sm !px-3">Kaydet</button>
                  </form>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={6} className="p-10 text-center text-muted">Kayıt bulunamadı.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
