"use client";

import { useActionState, useEffect, useRef } from "react";
import { saveAnnouncement } from "@/app/actions/admin";
import { FormAlert, type FormState } from "@/components/ui/FormAlert";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function AnnouncementForm() {
  const [state, action] = useActionState<FormState, FormData>(saveAnnouncement, undefined);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => { if (state?.ok) ref.current?.reset(); }, [state]);
  return (
    <form ref={ref} action={action} className="space-y-3">
      <input name="title" className="input" placeholder="Başlık" />
      <textarea name="content" rows={5} className="input" placeholder="Duyuru metni" />
      <FormAlert state={state} />
      <SubmitButton className="w-full">Yayınla</SubmitButton>
    </form>
  );
}
