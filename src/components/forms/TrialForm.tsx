"use client";

import { useActionState } from "react";
import Link from "next/link";
import { CalendarCheck } from "lucide-react";
import { requestTrialLesson } from "@/app/actions/public";
import { FieldError, FormAlert, type FormState } from "@/components/ui/FormAlert";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function TrialForm({ courses, defaultCourse }: { courses: { slug: string; title: string }[]; defaultCourse?: string }) {
  const [state, action] = useActionState<FormState, FormData>(requestTrialLesson, undefined);
  if (state?.ok)
    return (
      <div className="py-6 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-600"><CalendarCheck className="h-8 w-8" /></span>
        <p className="mt-5 font-display text-2xl">Talebiniz alındı!</p>
        <p className="mx-auto mt-2 max-w-md text-muted">{state.message}</p>
      </div>
    );
  return (
    <form action={action} className="grid gap-5 sm:grid-cols-2" noValidate>
      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />
      <div>
        <label className="label" htmlFor="parentName">Veli Ad Soyad *</label>
        <input id="parentName" name="parentName" className="input" autoComplete="name" />
        <FieldError state={state} name="parentName" />
      </div>
      <div>
        <label className="label" htmlFor="phone">Telefon *</label>
        <input id="phone" name="phone" type="tel" className="input" autoComplete="tel" placeholder="05xx xxx xx xx" />
        <FieldError state={state} name="phone" />
      </div>
      <div className="sm:col-span-2">
        <label className="label" htmlFor="email">E-posta</label>
        <input id="email" name="email" type="email" className="input" autoComplete="email" />
        <FieldError state={state} name="email" />
      </div>
      <div>
        <label className="label" htmlFor="studentName">Öğrenci Ad Soyad *</label>
        <input id="studentName" name="studentName" className="input" />
        <FieldError state={state} name="studentName" />
      </div>
      <div>
        <label className="label" htmlFor="studentAge">Öğrenci Yaşı *</label>
        <input id="studentAge" name="studentAge" className="input" inputMode="numeric" placeholder="Örn. 7 veya Yetişkin" />
        <FieldError state={state} name="studentAge" />
      </div>
      <div>
        <label className="label" htmlFor="courseSlug">Branş *</label>
        <select id="courseSlug" name="courseSlug" className="input" defaultValue={defaultCourse ?? ""}>
          <option value="" disabled>Seçiniz</option>
          {courses.map((c) => <option key={c.slug} value={c.slug}>{c.title}</option>)}
          <option value="kararsiz">Henüz karar vermedim</option>
        </select>
        <FieldError state={state} name="courseSlug" />
      </div>
      <div>
        <label className="label" htmlFor="preferred">Tercih edilen gün/saat</label>
        <select id="preferred" name="preferred" className="input" defaultValue="Fark etmez">
          <option>Fark etmez</option>
          <option>Hafta içi öğleden sonra</option>
          <option>Hafta içi akşam</option>
          <option>Cumartesi</option>
          <option>Pazar</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className="label" htmlFor="note">Eklemek istedikleriniz</label>
        <textarea id="note" name="note" rows={3} className="input" />
      </div>
      <label className="flex items-start gap-3 text-sm text-muted sm:col-span-2">
        <input type="checkbox" name="kvkk" className="mt-1 h-4 w-4 accent-[var(--color-accent)]" />
        <span>
          <Link href="/yasal/kvkk" className="font-semibold text-ink underline" target="_blank">KVKK Aydınlatma Metni</Link>&apos;ni okudum ve kabul ediyorum.
        </span>
      </label>
      <div className="sm:col-span-2"><FieldError state={state} name="kvkk" /></div>
      <FormAlert state={state} className="sm:col-span-2" />
      <div className="sm:col-span-2">
        <SubmitButton className="w-full sm:w-auto">Deneme Dersi Talep Et</SubmitButton>
      </div>
    </form>
  );
}
