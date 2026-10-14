"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Send } from "lucide-react";
import { sendContactMessage } from "@/app/actions/public";
import { FieldError, FormAlert, type FormState } from "@/components/ui/FormAlert";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function ContactForm() {
  const [state, action] = useActionState<FormState, FormData>(sendContactMessage, undefined);
  if (state?.ok) return <FormAlert state={state} className="text-base" />;
  return (
    <form action={action} className="grid gap-5 sm:grid-cols-2" noValidate>
      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />
      <div>
        <label className="label" htmlFor="name">Ad Soyad *</label>
        <input id="name" name="name" className="input" autoComplete="name" required />
        <FieldError state={state} name="name" />
      </div>
      <div>
        <label className="label" htmlFor="email">E-posta *</label>
        <input id="email" name="email" type="email" className="input" autoComplete="email" required />
        <FieldError state={state} name="email" />
      </div>
      <div>
        <label className="label" htmlFor="phone">Telefon</label>
        <input id="phone" name="phone" type="tel" className="input" autoComplete="tel" placeholder="05xx xxx xx xx" />
      </div>
      <div>
        <label className="label" htmlFor="subject">Konu *</label>
        <select id="subject" name="subject" className="input" defaultValue="Bilgi almak istiyorum">
          <option>Bilgi almak istiyorum</option>
          <option>Kayıt ve ücretler</option>
          <option>Ödeme / fatura</option>
          <option>Öneri / şikâyet</option>
          <option>İş başvurusu</option>
          <option>Diğer</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className="label" htmlFor="message">Mesajınız *</label>
        <textarea id="message" name="message" rows={5} className="input" required />
        <FieldError state={state} name="message" />
      </div>
      <label className="flex items-start gap-3 text-sm text-muted sm:col-span-2">
        <input type="checkbox" name="kvkk" className="mt-1 h-4 w-4 accent-[var(--color-accent)]" />
        <span>
          <Link href="/yasal/kvkk" className="font-semibold text-ink underline" target="_blank">KVKK Aydınlatma Metni</Link>&apos;ni okudum, kişisel verilerimin
          iletişim amacıyla işlenmesini kabul ediyorum.
        </span>
      </label>
      <div className="sm:col-span-2"><FieldError state={state} name="kvkk" /></div>
      <FormAlert state={state} className="sm:col-span-2" />
      <div className="sm:col-span-2">
        <SubmitButton>Mesajı Gönder <Send className="h-4 w-4" /></SubmitButton>
      </div>
    </form>
  );
}
