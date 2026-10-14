import { Phone, Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { PanelHeader } from "@/components/dashboard/Shell";
import { FilterTabs } from "@/components/dashboard/FilterTabs";
import { Badge } from "@/components/ui/Badge";
import { deleteTrial, setTrialStatus } from "@/app/actions/admin";
import { formatDate, trialStatus } from "@/lib/utils";

export default async function AdminTrials({ searchParams }: { searchParams: Promise<{ durum?: string }> }) {
  const { durum } = await searchParams;
  const [items, courses] = await Promise.all([
    db.trialRequest.findMany({ where: durum ? { status: durum } : {}, orderBy: { createdAt: "desc" } }),
    db.course.findMany({ select: { slug: true, title: true } }),
  ]);
  const names = Object.fromEntries(courses.map((c) => [c.slug, c.title]));
  return (
    <>
      <PanelHeader title="Deneme Dersi Talepleri" description="Web sitesinden gelen ücretsiz deneme dersi başvuruları." />
      <FilterTabs base="/yonetim/deneme-dersleri" current={durum} options={[{ label: "Tümü" }, ...Object.entries(trialStatus).map(([value, s]) => ({ value, label: s.label }))]} />
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((t) => (
          <div key={t.id} className="card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold">{t.studentName} <span className="font-normal text-muted">({t.studentAge})</span></p>
                <p className="text-sm text-muted">Veli: {t.parentName}</p>
              </div>
              <Badge tone={trialStatus[t.status]?.tone}>{trialStatus[t.status]?.label}</Badge>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div><dt className="text-xs text-muted">Branş</dt><dd className="font-semibold">{names[t.courseSlug] ?? "Kararsız"}</dd></div>
              <div><dt className="text-xs text-muted">Tercih</dt><dd className="font-semibold">{t.preferred ?? "—"}</dd></div>
              <div><dt className="text-xs text-muted">Telefon</dt><dd><a href={`tel:${t.phone}`} className="flex items-center gap-1 font-semibold text-accent"><Phone className="h-3.5 w-3.5" />{t.phone}</a></dd></div>
              <div><dt className="text-xs text-muted">Tarih</dt><dd className="font-semibold">{formatDate(t.createdAt, true)}</dd></div>
            </dl>
            {t.email && <p className="mt-2 text-sm text-muted">{t.email}</p>}
            {t.note && <p className="mt-3 rounded-xl bg-sand p-3 text-sm">{t.note}</p>}
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
              {Object.entries(trialStatus).filter(([v]) => v !== t.status).map(([v, s]) => (
                <form key={v} action={setTrialStatus}><input type="hidden" name="id" value={t.id} /><input type="hidden" name="status" value={v} /><button type="submit" className="btn btn-outline btn-sm">{s.label} olarak işaretle</button></form>
              ))}
              <form action={deleteTrial} className="ml-auto"><input type="hidden" name="id" value={t.id} /><button type="submit" className="grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-red-50 hover:text-red-700" aria-label="Sil"><Trash2 className="h-4 w-4" /></button></form>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && <div className="card p-10 text-center text-muted">Talep bulunamadı.</div>}
    </>
  );
}
