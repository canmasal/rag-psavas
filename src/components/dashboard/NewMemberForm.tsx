"use client";

import { useActionState, useEffect, useRef } from "react";
import { createMemberByAdmin } from "@/app/actions/admin";
import { FormAlert, type FormState } from "@/components/ui/FormAlert";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function NewMemberForm() {
  const [state, action] = useActionState<FormState, FormData>(createMemberByAdmin, undefined);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => { if (state?.ok) ref.current?.reset(); }, [state]);
  return (
    <form ref={ref} action={action} className="space-y-3">
      <input name="name" className="input" placeholder="Ad Soyad" />
      <input name="email" type="email" className="input" placeholder="E-posta" />
      <input name="phone" className="input" placeholder="Telefon" />
      <input name="password" className="input" placeholder="Geçici şifre (min. 8)" />
      <select name="role" className="input" defaultValue="MEMBER"><option value="MEMBER">Üye</option><option value="ADMIN">Yönetici</option></select>
      <FormAlert state={state} />
      <SubmitButton className="w-full">Oluştur</SubmitButton>
    </form>
  );
}
