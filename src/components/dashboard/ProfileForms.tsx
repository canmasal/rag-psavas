"use client";

import { useActionState, useEffect, useRef } from "react";
import { updateProfile } from "@/app/actions/member";
import { changePassword } from "@/app/actions/auth";
import { FormAlert, type FormState } from "@/components/ui/FormAlert";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function ProfileForm({ user }: { user: { name: string; email: string; phone: string; address: string; city: string; identityNo: string } }) {
  const [state, action] = useActionState<FormState, FormData>(updateProfile, undefined);
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <div><label className="label" htmlFor="name">Ad Soyad</label><input id="name" name="name" defaultValue={user.name} className="input" /></div>
      <div><label className="label" htmlFor="email">E-posta</label><input id="email" value={user.email} className="input bg-sand" disabled /></div>
      <div><label className="label" htmlFor="phone">Telefon</label><input id="phone" name="phone" defaultValue={user.phone} className="input" /></div>
      <div><label className="label" htmlFor="identityNo">T.C. Kimlik No (fatura için)</label><input id="identityNo" name="identityNo" defaultValue={user.identityNo} className="input" inputMode="numeric" maxLength={11} /></div>
      <div className="sm:col-span-2"><label className="label" htmlFor="address">Adres</label><textarea id="address" name="address" defaultValue={user.address} rows={2} className="input" /></div>
      <div><label className="label" htmlFor="city">Şehir</label><input id="city" name="city" defaultValue={user.city} className="input" /></div>
      <FormAlert state={state} className="sm:col-span-2" />
      <div className="sm:col-span-2"><SubmitButton pendingText="Kaydediliyor…">Bilgileri Kaydet</SubmitButton></div>
    </form>
  );
}

export function PasswordForm() {
  const [state, action] = useActionState<FormState, FormData>(changePassword, undefined);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => { if (state?.ok) ref.current?.reset(); }, [state]);
  return (
    <form ref={ref} action={action} className="space-y-4">
      <div><label className="label" htmlFor="current">Mevcut şifre</label><input id="current" name="current" type="password" className="input" autoComplete="current-password" /></div>
      <div><label className="label" htmlFor="password">Yeni şifre</label><input id="password" name="password" type="password" className="input" autoComplete="new-password" /></div>
      <div><label className="label" htmlFor="password2">Yeni şifre (tekrar)</label><input id="password2" name="password2" type="password" className="input" autoComplete="new-password" /></div>
      <FormAlert state={state} />
      <SubmitButton className="w-full btn-dark" pendingText="Güncelleniyor…">Şifreyi Güncelle</SubmitButton>
    </form>
  );
}
