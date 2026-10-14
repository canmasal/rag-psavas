import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { PanelHeader } from "@/components/dashboard/Shell";
import { CourseForm } from "@/components/dashboard/CourseForm";
import { deleteCourse, deletePackage, savePackage } from "@/app/actions/admin";

export default async function EditCourse({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ kaydedildi?: string }> }) {
  const [{ id }, { kaydedildi }] = await Promise.all([params, searchParams]);
  const isNew = id === "yeni";
  const course = isNew ? null : await db.course.findUnique({ where: { id }, include: { packages: { orderBy: [{ order: "asc" }, { price: "asc" }] } } });
  if (!isNew && !course) notFound();

  return (
    <>
      <Link href="/yonetim/egitimler" className="mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-muted hover:text-ink"><ArrowLeft className="h-4 w-4" /> Eğitimler</Link>
      <PanelHeader
        title={course ? course.title : "Yeni Eğitim"}
        action={course && <Link href={`/egitimlerimiz/${course.slug}`} target="_blank" className="btn btn-outline btn-sm"><ExternalLink className="h-4 w-4" /> Sitede gör</Link>}
      />
      {kaydedildi && <div className="mb-6 rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-900">Eğitim oluşturuldu. Şimdi fiyat paketlerini ekleyebilirsiniz.</div>}
      <CourseForm course={course ?? undefined} />

      {course && (
        <section className="card mt-6 p-6">
          <p className="font-display text-xl">Fiyat paketleri</p>
          <p className="mt-1 text-sm text-muted">Fiyatlar TL ve KDV dahil girilir. &quot;Ay&quot; alanı kaydın geçerlilik süresini belirler.</p>
          <div className="mt-5 space-y-3">
            {course.packages.map((p) => (
              <div key={p.id} className="flex flex-wrap items-end gap-2 rounded-xl border border-line p-3">
                <form action={savePackage} className="flex flex-1 flex-wrap items-end gap-2">
                  <input type="hidden" name="id" value={p.id} />
                  <input type="hidden" name="courseId" value={course.id} />
                  <label className="min-w-[8rem] flex-1"><span className="label">Paket adı</span><input name="name" defaultValue={p.name} className="input" /></label>
                  <label className="min-w-[12rem] flex-[2]"><span className="label">Açıklama</span><input name="description" defaultValue={p.description ?? ""} className="input" /></label>
                  <label className="w-28"><span className="label">Fiyat (₺)</span><input name="price" defaultValue={p.price} className="input" inputMode="numeric" /></label>
                  <label className="w-20"><span className="label">Ay</span><input name="months" defaultValue={p.months} className="input" inputMode="numeric" /></label>
                  <label className="w-16"><span className="label">Sıra</span><input name="order" defaultValue={p.order} className="input" inputMode="numeric" /></label>
                  <label className="flex items-center gap-2 pb-3 text-sm font-semibold"><input type="checkbox" name="popular" defaultChecked={p.popular} className="h-4 w-4" /> Popüler</label>
                  <button type="submit" className="btn btn-dark btn-sm mb-1">Kaydet</button>
                </form>
                <form action={deletePackage}><input type="hidden" name="id" value={p.id} /><button type="submit" className="mb-1 grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-red-50 hover:text-red-700" aria-label="Paketi sil"><Trash2 className="h-4 w-4" /></button></form>
              </div>
            ))}
            <form action={savePackage} className="flex flex-wrap items-end gap-2 rounded-xl border border-dashed border-ink/30 bg-sand/50 p-3">
              <input type="hidden" name="courseId" value={course.id} />
              <label className="min-w-[8rem] flex-1"><span className="label">Yeni paket adı</span><input name="name" className="input" placeholder="Örn. Aylık" required /></label>
              <label className="min-w-[12rem] flex-[2]"><span className="label">Açıklama</span><input name="description" className="input" placeholder="Ayda 4 ders" /></label>
              <label className="w-28"><span className="label">Fiyat (₺)</span><input name="price" className="input" inputMode="numeric" required /></label>
              <label className="w-20"><span className="label">Ay</span><input name="months" defaultValue={1} className="input" inputMode="numeric" /></label>
              <label className="w-16"><span className="label">Sıra</span><input name="order" defaultValue={course.packages.length} className="input" inputMode="numeric" /></label>
              <label className="flex items-center gap-2 pb-3 text-sm font-semibold"><input type="checkbox" name="popular" className="h-4 w-4" /> Popüler</label>
              <button type="submit" className="btn btn-primary btn-sm mb-1">Paket Ekle</button>
            </form>
          </div>
        </section>
      )}

      {course && (
        <form action={deleteCourse} className="mt-6 flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 p-5">
          <input type="hidden" name="id" value={course.id} />
          <p className="text-sm text-red-900">Eğitimi sil. (Kaydı olan eğitimler silinmez, pasife alınır.)</p>
          <button type="submit" className="btn btn-sm bg-red-700 text-white hover:bg-red-800">Eğitimi Sil</button>
        </form>
      )}
    </>
  );
}
