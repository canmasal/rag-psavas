"use client";

import { useActionState, useEffect, useRef } from "react";
import { addStudent } from "@/app/actions/member";
import { FormAlert, type FormState } from "@/components/ui/FormAlert";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function StudentForm() {
  const [state, action] = useActionState<FormState, FormData>(addStudent, undefined);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => { if (state?.ok) ref.current?.reset(); }, [state]);
  return (
    <form ref={ref} action={action} className="space-y-4">
      <div><label className="label" htmlFor="name">Ad Soyad *</label><input id="name" name="name" className="input" required /></div>
      <div><label className="label" htmlFor="birthDate">Doğum tarihi</label><input id="birthDate" name="birthDate" type="date" className="input" /></div>
      <div><label className="label" htmlFor="notes">Notlar</label><textarea id="notes" name="notes" rows={3} className="input" placeholder="Alerji, sağlık durumu vb." /></div>
      <FormAlert state={state} />
      <SubmitButton className="w-full">Öğrenciyi Ekle</SubmitButton>
    </form>
  );
}
