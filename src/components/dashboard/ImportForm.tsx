"use client";

import { useActionState } from "react";
import { runWordPressImport } from "@/app/actions/admin";
import { FormAlert, type FormState } from "@/components/ui/FormAlert";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function ImportForm() {
  const [state, action] = useActionState<FormState, FormData>(runWordPressImport, undefined);
  return (
    <form action={action} className="space-y-5">
      <div>
        <label className="label" htmlFor="url">Eski site adresi</label>
        <input id="url" name="url" defaultValue="https://www.ragipsavassanat.com" className="input" />
      </div>
      <fieldset className="space-y-3">
        <legend className="label">Aktarılacaklar</legend>
        {[
          ["gallery", "Fotoğraflar → Galeri", true],
          ["posts", "Yazılar → Blog", true],
          ["courseImages", "Eğitim ve kurumsal sayfa görselleri", true],
          ["courseTexts", "Eğitim açıklama metinleri (mevcut metinlerin yerine geçer)", false],
        ].map(([name, label, checked]) => (
          <label key={name as string} className="flex items-center gap-3 rounded-xl border border-line p-3 text-sm font-semibold">
            <input type="checkbox" name={name as string} defaultChecked={checked as boolean} className="h-4 w-4" /> {label}
          </label>
        ))}
      </fieldset>
      <FormAlert state={state} />
      <SubmitButton pendingText="Aktarılıyor… (birkaç dakika sürebilir)">Aktarımı Başlat</SubmitButton>
    </form>
  );
}
