"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { CreditCard, Landmark, ShieldCheck, Check } from "lucide-react";
import { createEnrollment } from "@/app/actions/member";
import { FormAlert, type FormState } from "@/components/ui/FormAlert";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { CourseIcon } from "@/components/icons";
import { cn, formatPrice } from "@/lib/utils";

type Pkg = { id: string; name: string; description: string | null; price: number; months: number; popular: boolean };
type Course = { id: string; slug: string; title: string; category: string; color: string; icon: string; schedule: string; packages: Pkg[] };

export function EnrollmentForm({
  courses, students, defaultCourseSlug, defaultPackageId, testMode,
}: {
  courses: Course[]; students: { id: string; name: string }[]; defaultCourseSlug?: string; defaultPackageId?: string; testMode: boolean;
}) {
  const [state, action] = useActionState<FormState, FormData>(createEnrollment, undefined);
  const initial = courses.find((c) => c.slug === defaultCourseSlug) ?? courses[0];
  const [courseId, setCourseId] = useState(initial?.id ?? "");
  const course = useMemo(() => courses.find((c) => c.id === courseId), [courses, courseId]);
  const [packageId, setPackageId] = useState(
    initial?.packages.find((p) => p.id === defaultPackageId)?.id ?? initial?.packages.find((p) => p.popular)?.id ?? initial?.packages[0]?.id ?? "",
  );
  const pkg = course?.packages.find((p) => p.id === packageId);
  const [student, setStudent] = useState(students[0]?.id ?? "new");
  const [method, setMethod] = useState("CARD");

  const selectCourse = (id: string) => {
    setCourseId(id);
    const c = courses.find((x) => x.id === id);
    setPackageId(c?.packages.find((p) => p.popular)?.id ?? c?.packages[0]?.id ?? "");
  };

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <input type="hidden" name="courseId" value={courseId} />
      <input type="hidden" name="packageId" value={packageId} />
      <div className="space-y-6">
        <section className="card p-6">
          <p className="text-xs font-extrabold uppercase tracking-wider text-muted">1. Eğitim</p>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {courses.map((c) => (
              <button
                type="button"
                key={c.id}
                onClick={() => selectCourse(c.id)}
                className={cn("flex items-center gap-2 rounded-xl border p-2.5 text-left text-sm font-semibold transition", c.id === courseId ? "border-ink bg-ink text-white" : "border-line hover:border-ink")}
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-white" style={{ background: c.color }}><CourseIcon name={c.icon} className="h-4 w-4" /></span>
                <span className="truncate">{c.title}</span>
              </button>
            ))}
          </div>
        </section>

        {course && (
          <section className="card p-6">
            <p className="text-xs font-extrabold uppercase tracking-wider text-muted">2. Paket</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {course.packages.map((p) => (
                <label key={p.id} className={cn("relative cursor-pointer rounded-xl border p-4 transition", p.id === packageId ? "border-ink ring-2 ring-ink" : "border-line hover:border-ink")}>
                  <input type="radio" name="_pkg" className="sr-only" checked={p.id === packageId} onChange={() => setPackageId(p.id)} />
                  {p.popular && <span className="absolute -top-2.5 right-3 rounded-full bg-accent px-2 py-0.5 text-[0.65rem] font-bold text-white">Popüler</span>}
                  <p className="font-bold">{p.name}</p>
                  <p className="mt-0.5 text-xs text-muted">{p.description}</p>
                  <p className="mt-3 font-display text-2xl">{formatPrice(p.price)}</p>
                </label>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted">Ders saatleri: {course.schedule}. Kesin gün/saat kayıt sonrası danışmanımız tarafından teyit edilir.</p>
          </section>
        )}

        <section className="card p-6">
          <p className="text-xs font-extrabold uppercase tracking-wider text-muted">3. Öğrenci</p>
          <select name="studentId" value={student} onChange={(e) => setStudent(e.target.value)} className="input mt-4">
            {students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            <option value="self">Kendim (yetişkin öğrenci)</option>
            <option value="new">+ Yeni öğrenci ekle</option>
          </select>
          {student === "new" && <input name="newStudentName" className="input mt-3" placeholder="Öğrencinin adı soyadı" />}
          <textarea name="note" rows={2} className="input mt-3" placeholder="Eklemek istediğiniz not (sağlık durumu, tercih edilen saat vb.)" />
        </section>

        <section className="card p-6">
          <p className="text-xs font-extrabold uppercase tracking-wider text-muted">4. Ödeme yöntemi</p>
          <input type="hidden" name="method" value={method} />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { v: "CARD", Icon: CreditCard, t: "Kredi / Banka Kartı", d: "3D Secure · taksit imkânı" },
              { v: "BANK_TRANSFER", Icon: Landmark, t: "Havale / EFT", d: "IBAN bilgileri sonraki adımda" },
            ].map(({ v, Icon, t, d }) => (
              <button type="button" key={v} onClick={() => setMethod(v)} className={cn("flex items-start gap-3 rounded-xl border p-4 text-left transition", method === v ? "border-ink ring-2 ring-ink" : "border-line hover:border-ink")}>
                <Icon className="mt-0.5 h-5 w-5 text-accent" />
                <span><span className="block font-bold">{t}</span><span className="text-xs text-muted">{d}</span></span>
                {method === v && <Check className="ml-auto h-5 w-5" />}
              </button>
            ))}
          </div>
          {testMode && method === "CARD" && (
            <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs font-semibold text-amber-900">
              Ödeme altyapısı şu an TEST MODUNDA. Gerçek bir çekim yapılmaz; iyzico anahtarları tanımlandığında canlı ödeme otomatik devreye girer.
            </p>
          )}
        </section>
      </div>

      <aside className="lg:sticky lg:top-10 lg:self-start">
        <div className="card overflow-hidden">
          <div className="bg-ink p-6 text-white">
            <p className="text-xs font-bold uppercase tracking-wider text-white/50">Sipariş özeti</p>
            <p className="mt-2 font-display text-2xl">{course?.title ?? "—"}</p>
            <p className="text-sm text-white/60">{pkg?.name}</p>
          </div>
          <div className="space-y-3 p-6 text-sm">
            <div className="flex justify-between"><span className="text-muted">Paket tutarı</span><span className="font-semibold">{pkg ? formatPrice(pkg.price) : "—"}</span></div>
            <div className="flex justify-between"><span className="text-muted">KDV</span><span className="font-semibold">Dahil</span></div>
            <div className="flex items-end justify-between border-t border-line pt-3"><span className="font-bold">Toplam</span><span className="font-display text-3xl">{pkg ? formatPrice(pkg.price) : "—"}</span></div>
            <label className="flex items-start gap-2.5 pt-3 text-xs text-muted">
              <input type="checkbox" name="contract" className="mt-0.5 h-4 w-4 accent-[var(--color-accent)]" />
              <span>
                <Link href="/yasal/mesafeli-satis-sozlesmesi" target="_blank" className="font-semibold text-ink underline">Mesafeli Satış Sözleşmesi</Link> ve{" "}
                <Link href="/yasal/iptal-iade" target="_blank" className="font-semibold text-ink underline">İptal & İade Politikası</Link>&apos;nı okudum, onaylıyorum.
              </span>
            </label>
            <FormAlert state={state} />
            <SubmitButton className="w-full" pendingText="Yönlendiriliyor…">
              {method === "CARD" ? "Güvenli Ödemeye Geç" : "Kaydı Oluştur"}
            </SubmitButton>
            <p className="flex items-center justify-center gap-1.5 text-xs text-muted"><ShieldCheck className="h-4 w-4 text-emerald-600" /> 256-bit SSL ile korunmaktadır</p>
          </div>
        </div>
      </aside>
    </form>
  );
}
