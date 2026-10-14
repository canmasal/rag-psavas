"use server";

import crypto from "node:crypto";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { checkPassword, createSession, destroySession, hashPassword, requireUser } from "@/lib/auth";
import { sendMail } from "@/lib/mail";
import { siteUrl } from "@/lib/utils";
import type { FormState } from "@/components/ui/FormAlert";

function safeRedirect(target: unknown, fallback: string) {
  const t = typeof target === "string" ? target : "";
  return t.startsWith("/") && !t.startsWith("//") ? t : fallback;
}

const password = z.string().min(8, "Şifre en az 8 karakter olmalı").max(100);

export async function login(_: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const pass = String(formData.get("password") ?? "");
  if (!email || !pass) return { error: "E-posta ve şifrenizi girin." };
  const user = await db.user.findUnique({ where: { email } });
  if (!user || !(await checkPassword(pass, user.passwordHash))) return { error: "E-posta veya şifre hatalı." };
  await createSession(user);
  redirect(safeRedirect(formData.get("redirect"), user.role === "ADMIN" ? "/yonetim" : "/panel"));
}

const registerSchema = z
  .object({
    name: z.string().trim().min(3, "Ad soyad girin").max(100),
    email: z.string().trim().toLowerCase().email("Geçerli bir e-posta girin"),
    phone: z.string().trim().min(10, "Geçerli bir telefon girin").max(20),
    password,
    password2: z.string(),
    terms: z.literal("on", { errorMap: () => ({ message: "Üyelik koşullarını onaylamanız gerekir" }) }),
  })
  .refine((d) => d.password === d.password2, { message: "Şifreler eşleşmiyor", path: ["password2"] });

export async function register(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    parsed.error.issues.forEach((i) => (fieldErrors[String(i.path[0])] ??= i.message));
    return { error: "Lütfen bilgileri kontrol edin.", fieldErrors };
  }
  const { name, email, phone } = parsed.data;
  if (await db.user.findUnique({ where: { email } })) {
    return { error: "Bu e-posta adresiyle kayıtlı bir hesap var.", fieldErrors: { email: "Bu e-posta zaten kayıtlı" } };
  }
  const user = await db.user.create({
    data: { name, email, phone, passwordHash: await hashPassword(parsed.data.password) },
  });
  await createSession(user);
  await sendMail({
    to: email,
    subject: "Ragıp Savaş Sanat Akademisi'ne hoş geldiniz",
    html: `<p>Merhaba ${name},</p><p>Üyeliğiniz başarıyla oluşturuldu. Üye panelinize <a href="${siteUrl()}/panel">buradan</a> ulaşabilirsiniz.</p>`,
  }).catch(() => undefined);
  redirect(safeRedirect(formData.get("redirect"), "/panel?hosgeldin=1"));
}

export async function logout() {
  await destroySession();
  redirect("/");
}

export async function requestPasswordReset(_: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const done: FormState = { ok: true, message: "Bu e-posta adresi kayıtlıysa, şifre sıfırlama bağlantısı gönderildi. Lütfen gelen kutunuzu kontrol edin." };
  if (!z.string().email().safeParse(email).success) return { error: "Geçerli bir e-posta girin." };
  const user = await db.user.findUnique({ where: { email } });
  if (!user) return done;
  const token = crypto.randomBytes(32).toString("hex");
  await db.passwordResetToken.create({ data: { token, userId: user.id, expiresAt: new Date(Date.now() + 60 * 60 * 1000) } });
  const link = `${siteUrl()}/sifre-sifirla/${token}`;
  await sendMail({
    to: user.email,
    subject: "Şifre sıfırlama talebiniz",
    html: `<p>Merhaba ${user.name},</p><p>Şifrenizi sıfırlamak için <a href="${link}">bu bağlantıya</a> tıklayın. Bağlantı 1 saat geçerlidir.</p><p>Bu talebi siz yapmadıysanız bu e-postayı dikkate almayın.</p>`,
  });
  return done;
}

export async function resetPassword(_: FormState, formData: FormData): Promise<FormState> {
  const token = String(formData.get("token") ?? "");
  const p = password.safeParse(formData.get("password"));
  if (!p.success) return { error: p.error.issues[0].message };
  if (p.data !== formData.get("password2")) return { error: "Şifreler eşleşmiyor." };
  const record = await db.passwordResetToken.findUnique({ where: { token }, include: { user: true } });
  if (!record || record.usedAt || record.expiresAt < new Date()) return { error: "Bağlantı geçersiz veya süresi dolmuş. Lütfen yeni bir talep oluşturun." };
  await db.$transaction([
    db.user.update({ where: { id: record.userId }, data: { passwordHash: await hashPassword(p.data) } }),
    db.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
  ]);
  await createSession(record.user);
  redirect("/panel?sifre=guncellendi");
}

export async function changePassword(_: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const current = String(formData.get("current") ?? "");
  if (!(await checkPassword(current, user.passwordHash))) return { error: "Mevcut şifreniz hatalı." };
  const p = password.safeParse(formData.get("password"));
  if (!p.success) return { error: p.error.issues[0].message };
  if (p.data !== formData.get("password2")) return { error: "Yeni şifreler eşleşmiyor." };
  await db.user.update({ where: { id: user.id }, data: { passwordHash: await hashPassword(p.data) } });
  return { ok: true, message: "Şifreniz güncellendi." };
}
