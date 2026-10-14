"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import type { FormState } from "@/components/ui/FormAlert";

function fieldErrors(error: z.ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0]);
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

const phone = z.string().trim().min(10, "Geçerli bir telefon numarası girin").max(20);

const contactSchema = z.object({
  name: z.string().trim().min(2, "Adınızı girin").max(100),
  email: z.string().trim().email("Geçerli bir e-posta girin"),
  phone: z.string().trim().max(20).optional(),
  subject: z.string().trim().min(2, "Konu seçin").max(120),
  message: z.string().trim().min(10, "Mesajınız en az 10 karakter olmalı").max(4000),
  kvkk: z.literal("on", { errorMap: () => ({ message: "KVKK metnini onaylamanız gerekir" }) }),
});

export async function sendContactMessage(_: FormState, formData: FormData): Promise<FormState> {
  if (formData.get("website")) return { ok: true, message: "Mesajınız alındı." }; // bot tuzağı
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Lütfen formdaki hataları düzeltin.", fieldErrors: fieldErrors(parsed.error) };
  const { kvkk: _k, ...data } = parsed.data;
  await db.message.create({ data: { ...data, phone: data.phone || null } });
  return { ok: true, message: "Mesajınız bize ulaştı. En kısa sürede size dönüş yapacağız. Teşekkür ederiz!" };
}

const trialSchema = z.object({
  parentName: z.string().trim().min(2, "Adınızı girin").max(100),
  phone,
  email: z.string().trim().email("Geçerli bir e-posta girin").optional().or(z.literal("")),
  studentName: z.string().trim().min(2, "Öğrenci adını girin").max(100),
  studentAge: z.string().trim().min(1, "Yaş girin").max(10),
  courseSlug: z.string().trim().min(1, "Branş seçin"),
  preferred: z.string().trim().max(100).optional(),
  note: z.string().trim().max(1000).optional(),
  kvkk: z.literal("on", { errorMap: () => ({ message: "KVKK metnini onaylamanız gerekir" }) }),
});

export async function requestTrialLesson(_: FormState, formData: FormData): Promise<FormState> {
  if (formData.get("website")) return { ok: true, message: "Talebiniz alındı." };
  const parsed = trialSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Lütfen formdaki hataları düzeltin.", fieldErrors: fieldErrors(parsed.error) };
  const { kvkk: _k, ...data } = parsed.data;
  await db.trialRequest.create({ data: { ...data, email: data.email || null } });
  return {
    ok: true,
    message: "Deneme dersi talebiniz alındı! Eğitim danışmanımız en geç 1 iş günü içinde sizi arayarak gün ve saat planlaması yapacak.",
  };
}
