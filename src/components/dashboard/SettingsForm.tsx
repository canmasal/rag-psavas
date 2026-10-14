"use client";

import { useActionState } from "react";
import { saveSettings } from "@/app/actions/admin";
import { FormAlert, type FormState } from "@/components/ui/FormAlert";
import { SubmitButton } from "@/components/ui/SubmitButton";

const groups: { title: string; keys: string[] }[] = [
  { title: "Genel", keys: ["siteName", "announcementBar", "workingHours"] },
  { title: "İletişim", keys: ["phone", "phone2", "gsm", "whatsapp", "email", "address", "mapQuery"] },
  { title: "Sosyal medya", keys: ["instagram", "facebook", "youtube"] },
  { title: "Havale / EFT hesabı", keys: ["bankName", "bankAccountName", "bankIban"] },
];

export function SettingsForm({ settings, labels }: { settings: Record<string, string>; labels: Record<string, string> }) {
  const [state, action] = useActionState<FormState, FormData>(saveSettings, undefined);
  return (
    <form action={action} className="space-y-6">
      {groups.map((g) => (
        <fieldset key={g.title} className="card grid gap-4 p-6 md:grid-cols-2">
          <legend className="sr-only">{g.title}</legend>
          <p className="font-display text-xl md:col-span-2">{g.title}</p>
          {g.keys.map((k) => (
            <div key={k} className={k === "address" || k === "announcementBar" ? "md:col-span-2" : ""}>
              <label className="label" htmlFor={k}>{labels[k]}</label>
              <input id={k} name={k} defaultValue={settings[k]} className="input" />
            </div>
          ))}
        </fieldset>
      ))}
      <FormAlert state={state} />
      <SubmitButton pendingText="Kaydediliyor…">Ayarları Kaydet</SubmitButton>
    </form>
  );
}
