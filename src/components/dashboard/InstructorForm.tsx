"use client";

import { useActionState, useEffect, useRef } from "react";
import { saveInstructor } from "@/app/actions/admin";
import { FormAlert, type FormState } from "@/components/ui/FormAlert";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { ImageField } from "./ImageField";

type Instructor = { id: string; name: string; title: string; bio: string; photo: string | null; branches: string; order: number; active: boolean };

export function InstructorForm({ instructor }: { instructor?: Instructor }) {
  const [state, action] = useActionState<FormState, FormData>(saveInstructor, undefined);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => { if (state?.ok && !instructor) ref.current?.reset(); }, [state, instructor]);
  return (
    <form ref={ref} action={action} className="space-y-3">
      {instructor && <input type="hidden" name="id" value={instructor.id} />}
      <input name="name" defaultValue={instructor?.name} className="input" placeholder="Ad Soyad" />
      <input name="title" defaultValue={instructor?.title} className="input" placeholder="Unvan (örn. Klasik Bale Eğitmeni)" />
      <input name="branches" defaultValue={instructor?.branches} className="input" placeholder="Branşlar (virgülle: Bale, Dans)" />
      <textarea name="bio" defaultValue={instructor?.bio} rows={4} className="input" placeholder="Kısa özgeçmiş (eğitim, deneyim)" />
      <ImageField name="photo" fileName="photoFile" current={instructor?.photo} label="Fotoğraf" />
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" name="active" defaultChecked={instructor?.active ?? true} className="h-4 w-4" /> Sitede göster</label>
        <label className="flex items-center gap-2 text-sm"><span className="font-semibold">Sıra</span><input name="order" defaultValue={instructor?.order ?? 0} className="input w-20" inputMode="numeric" /></label>
      </div>
      <FormAlert state={state} />
      <SubmitButton className="w-full">{instructor ? "Kaydet" : "Eğitmen Ekle"}</SubmitButton>
    </form>
  );
}
