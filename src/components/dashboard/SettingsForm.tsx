"use client";

import { useActionState } from "react";
import { saveSettings } from "@/app/actions/admin";
import { FormAlert, type FormState } from "@/components/ui/FormAlert";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { ImageField } from "./ImageField";

const groups: { title: string; keys: string[] }[] = [
  { title: "Genel", keys: ["siteName", "announcementBar", "workingHours", "heroVideo"] },
  { title: "İletişim", keys: ["phone", "phone2", "gsm", "whatsapp", "email", "address", "mapQuery"] },
  { title: "Sosyal medya", keys: ["instagram", "facebook", "youtube"] },
  { title: "Havale / EFT hesabı", keys: ["bankName", "bankAccountName", "bankIban"] },
];

export function SettingsForm({ settings, labels }: { settings: Record<string, string>; labels: Record<string, string> }) {
  const [state, action] = useActionState<FormState, FormData>(saveSettings, undefined);
  return (
    <form action={action} className="space-y-6">
      <fieldset className="card grid gap-5 p-6 md:grid-cols-3">
        <legend className="sr-only">Görseller</legend>
        <div className="md:col-span-3">
          <p className="font-display text-xl">Site görselleri</p>
          <p className="mt-1 text-sm text-muted">Yatay, en az 1600px genişliğinde, yüksek kaliteli fotoğraflar önerilir. Boş bırakılan alanlarda tasarım görseli kullanılır.</p>
        </div>
        {(["heroImage", "founderImage", "aboutImage"] as const).map((k) => (
          <ImageField key={k} name={k} fileName={`${k}File`} current={settings[k] || null} label={labels[k]} />
        ))}
      </fieldset>
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
