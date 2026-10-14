"use client";

import { useActionState } from "react";
import { saveCourse } from "@/app/actions/admin";
import { FormAlert, type FormState } from "@/components/ui/FormAlert";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { ImageField } from "./ImageField";
import { CourseIcon, courseIcons } from "@/components/icons";
import { CATEGORIES } from "@/data/courses";

type Course = {
  id: string; title: string; slug: string; category: string; shortDesc: string; content: string; ageRange: string; duration: string;
  format: string; schedule: string; highlights: string; color: string; icon: string; image: string | null; featured: boolean; active: boolean; order: number;
};

export function CourseForm({ course }: { course?: Course }) {
  const [state, action] = useActionState<FormState, FormData>(saveCourse, undefined);
  return (
    <form action={action} className="card grid gap-5 p-6 md:grid-cols-2">
      {course && <input type="hidden" name="id" value={course.id} />}
      <div><label className="label" htmlFor="title">Eğitim adı *</label><input id="title" name="title" defaultValue={course?.title} className="input" required /></div>
      <div><label className="label" htmlFor="slug">Bağlantı adı (boşsa otomatik)</label><input id="slug" name="slug" defaultValue={course?.slug} className="input" /></div>
      <div>
        <label className="label" htmlFor="category">Kategori</label>
        <select id="category" name="category" defaultValue={course?.category ?? CATEGORIES[0]} className="input">
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-[1fr_6rem_5rem] gap-3">
        <div>
          <label className="label" htmlFor="icon">İkon</label>
          <select id="icon" name="icon" defaultValue={course?.icon ?? "Sparkles"} className="input">
            {Object.keys(courseIcons).map((i) => <option key={i}>{i}</option>)}
          </select>
        </div>
        <div><label className="label" htmlFor="color">Renk</label><input id="color" name="color" type="color" defaultValue={course?.color ?? "#b8242f"} className="input h-[46px] !p-1" /></div>
        <div><label className="label" htmlFor="order">Sıra</label><input id="order" name="order" defaultValue={course?.order ?? 0} className="input" inputMode="numeric" /></div>
      </div>
      <div className="md:col-span-2"><label className="label" htmlFor="shortDesc">Kısa açıklama</label><textarea id="shortDesc" name="shortDesc" defaultValue={course?.shortDesc} rows={2} className="input" /></div>
      <div><label className="label" htmlFor="ageRange">Yaş grubu</label><input id="ageRange" name="ageRange" defaultValue={course?.ageRange} className="input" placeholder="4 yaş ve üzeri" /></div>
      <div><label className="label" htmlFor="duration">Ders süresi</label><input id="duration" name="duration" defaultValue={course?.duration} className="input" placeholder="Haftada 2 gün · 60 dk" /></div>
      <div><label className="label" htmlFor="format">Ders formatı</label><input id="format" name="format" defaultValue={course?.format} className="input" placeholder="Grup dersi" /></div>
      <div><label className="label" htmlFor="schedule">Ders saatleri</label><input id="schedule" name="schedule" defaultValue={course?.schedule} className="input" /></div>
      <div className="md:col-span-2">
        <label className="label" htmlFor="content">Detaylı içerik</label>
        <textarea id="content" name="content" defaultValue={course?.content} rows={14} className="input font-mono !text-sm" />
        <p className="mt-1 text-xs text-muted">Biçimlendirme: <code>## Başlık</code>, <code>- madde</code>, <code>**kalın**</code>, <code>*italik*</code>, <code>[metin](https://adres)</code>. Paragraflar arasında bir boş satır bırakın.</p>
      </div>
      <div className="md:col-span-2"><label className="label" htmlFor="highlights">Öne çıkanlar (her satıra bir madde)</label><textarea id="highlights" name="highlights" defaultValue={course?.highlights} rows={4} className="input" /></div>
      <div className="md:col-span-2"><ImageField name="image" fileName="imageFile" current={course?.image} label="Kapak görseli (boş bırakılırsa otomatik sanat kapağı kullanılır)" /></div>
      <div className="flex flex-wrap gap-6 md:col-span-2">
        <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" name="active" defaultChecked={course?.active ?? true} className="h-4 w-4" /> Yayında</label>
        <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" name="featured" defaultChecked={course?.featured ?? false} className="h-4 w-4" /> Ana sayfada öne çıkar</label>
        {course && <span className="flex items-center gap-2 text-sm text-muted">Önizleme: <span className="grid h-8 w-8 place-items-center rounded-lg text-white" style={{ background: course.color }}><CourseIcon name={course.icon} className="h-4 w-4" /></span></span>}
      </div>
      <FormAlert state={state} className="md:col-span-2" />
      <div className="md:col-span-2"><SubmitButton pendingText="Kaydediliyor…">{course ? "Değişiklikleri Kaydet" : "Eğitimi Oluştur"}</SubmitButton></div>
    </form>
  );
}
