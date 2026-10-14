"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { login, register, requestPasswordReset, resetPassword } from "@/app/actions/auth";
import { FieldError, FormAlert, type FormState } from "@/components/ui/FormAlert";
import { SubmitButton } from "@/components/ui/SubmitButton";

function PasswordInput({ name, id, autoComplete }: { name: string; id: string; autoComplete: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input id={id} name={name} type={show ? "text" : "password"} className="input pr-11" autoComplete={autoComplete} required />
      <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" aria-label={show ? "Şifreyi gizle" : "Şifreyi göster"}>
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const [state, action] = useActionState<FormState, FormData>(login, undefined);
  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="redirect" value={redirectTo ?? ""} />
      <div>
        <label className="label" htmlFor="email">E-posta</label>
        <input id="email" name="email" type="email" className="input" autoComplete="email" required />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <label className="label" htmlFor="password">Şifre</label>
          <Link href="/sifremi-unuttum" className="mb-1.5 text-xs font-bold text-accent hover:underline">Şifremi unuttum</Link>
        </div>
        <PasswordInput id="password" name="password" autoComplete="current-password" />
      </div>
      <FormAlert state={state} />
      <SubmitButton className="w-full" pendingText="Giriş yapılıyor…">Giriş Yap</SubmitButton>
    </form>
  );
}

export function RegisterForm({ redirectTo }: { redirectTo?: string }) {
  const [state, action] = useActionState<FormState, FormData>(register, undefined);
  return (
    <form action={action} className="space-y-4" noValidate>
      <input type="hidden" name="redirect" value={redirectTo ?? ""} />
      <div>
        <label className="label" htmlFor="name">Ad Soyad (veli)</label>
        <input id="name" name="name" className="input" autoComplete="name" />
        <FieldError state={state} name="name" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="email">E-posta</label>
          <input id="email" name="email" type="email" className="input" autoComplete="email" />
          <FieldError state={state} name="email" />
        </div>
        <div>
          <label className="label" htmlFor="phone">Telefon</label>
          <input id="phone" name="phone" type="tel" className="input" autoComplete="tel" placeholder="05xx xxx xx xx" />
          <FieldError state={state} name="phone" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="password">Şifre</label>
          <PasswordInput id="password" name="password" autoComplete="new-password" />
          <FieldError state={state} name="password" />
        </div>
        <div>
          <label className="label" htmlFor="password2">Şifre (tekrar)</label>
          <PasswordInput id="password2" name="password2" autoComplete="new-password" />
          <FieldError state={state} name="password2" />
        </div>
      </div>
      <label className="flex items-start gap-3 text-sm text-muted">
        <input type="checkbox" name="terms" className="mt-1 h-4 w-4 accent-[var(--color-accent)]" />
        <span>
          <Link href="/yasal/kvkk" target="_blank" className="font-semibold text-ink underline">KVKK Aydınlatma Metni</Link> ve{" "}
          <Link href="/yasal/gizlilik" target="_blank" className="font-semibold text-ink underline">Gizlilik Politikası</Link>&apos;nı okudum, kabul ediyorum.
        </span>
      </label>
      <FieldError state={state} name="terms" />
      <FormAlert state={state} />
      <SubmitButton className="w-full" pendingText="Hesap oluşturuluyor…">Üye Ol</SubmitButton>
    </form>
  );
}

export function ForgotForm() {
  const [state, action] = useActionState<FormState, FormData>(requestPasswordReset, undefined);
  return (
    <form action={action} className="space-y-5">
      <div>
        <label className="label" htmlFor="email">E-posta</label>
        <input id="email" name="email" type="email" className="input" autoComplete="email" required />
      </div>
      <FormAlert state={state} />
      <SubmitButton className="w-full">Sıfırlama Bağlantısı Gönder</SubmitButton>
    </form>
  );
}

export function ResetForm({ token }: { token: string }) {
  const [state, action] = useActionState<FormState, FormData>(resetPassword, undefined);
  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="token" value={token} />
      <div>
        <label className="label" htmlFor="password">Yeni şifre</label>
        <PasswordInput id="password" name="password" autoComplete="new-password" />
      </div>
      <div>
        <label className="label" htmlFor="password2">Yeni şifre (tekrar)</label>
        <PasswordInput id="password2" name="password2" autoComplete="new-password" />
      </div>
      <FormAlert state={state} />
      <SubmitButton className="w-full">Şifremi Güncelle</SubmitButton>
    </form>
  );
}
