"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { markPaymentPaid, startCardPayment } from "@/lib/payment";
import type { FormState } from "@/components/ui/FormAlert";

async function clientIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip") || "85.34.78.112";
}

export async function addStudent(_: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const name = String(formData.get("name") ?? "").trim();
  const birth = String(formData.get("birthDate") ?? "");
  const notes = String(formData.get("notes") ?? "").trim();
  if (name.length < 2) return { error: "Öğrencinin adını girin." };
  await db.student.create({
    data: { userId: user.id, name, birthDate: birth ? new Date(birth) : null, notes: notes || null },
  });
  revalidatePath("/panel/ogrenciler");
  return { ok: true, message: `${name} öğrenci listenize eklendi.` };
}

export async function deleteStudent(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id"));
  await db.student.deleteMany({ where: { id, userId: user.id } });
  revalidatePath("/panel/ogrenciler");
}

const profileSchema = z.object({
  name: z.string().trim().min(3, "Ad soyad girin").max(100),
  phone: z.string().trim().min(10, "Geçerli bir telefon girin").max(20),
  address: z.string().trim().max(300).optional(),
  city: z.string().trim().max(60).optional(),
  identityNo: z.string().trim().regex(/^(\d{11})?$/, "T.C. kimlik no 11 haneli olmalı").optional(),
});

export async function updateProfile(_: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const d = parsed.data;
  await db.user.update({
    where: { id: user.id },
    data: { name: d.name, phone: d.phone, address: d.address || null, city: d.city || null, identityNo: d.identityNo || null },
  });
  revalidatePath("/panel", "layout");
  return { ok: true, message: "Bilgileriniz güncellendi." };
}

export async function createEnrollment(_: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const courseId = String(formData.get("courseId") ?? "");
  const packageId = String(formData.get("packageId") ?? "");
  const studentChoice = String(formData.get("studentId") ?? "");
  const newStudentName = String(formData.get("newStudentName") ?? "").trim();
  const method = String(formData.get("method") ?? "CARD");
  const note = String(formData.get("note") ?? "").trim();

  if (formData.get("contract") !== "on") return { error: "Devam etmek için Mesafeli Satış Sözleşmesi'ni onaylayın." };
  if (!["CARD", "BANK_TRANSFER"].includes(method)) return { error: "Geçersiz ödeme yöntemi." };

  const pkg = await db.coursePackage.findFirst({ where: { id: packageId, courseId }, include: { course: true } });
  if (!pkg || !pkg.course.active) return { error: "Lütfen bir eğitim ve paket seçin." };

  let studentId: string | null = null;
  let studentName = user.name;
  if (studentChoice === "new") {
    if (newStudentName.length < 2) return { error: "Yeni öğrencinin adını girin." };
    const s = await db.student.create({ data: { userId: user.id, name: newStudentName } });
    studentId = s.id;
    studentName = s.name;
  } else if (studentChoice && studentChoice !== "self") {
    const s = await db.student.findFirst({ where: { id: studentChoice, userId: user.id } });
    if (!s) return { error: "Öğrenci bulunamadı." };
    studentId = s.id;
    studentName = s.name;
  }

  const enrollment = await db.enrollment.create({
    data: { userId: user.id, studentId, courseId: pkg.courseId, packageId: pkg.id, note: note || null },
  });
  const payment = await db.payment.create({
    data: {
      userId: user.id,
      enrollmentId: enrollment.id,
      amount: pkg.price,
      description: `${pkg.course.title} – ${pkg.name} (${studentName})`,
      method,
      provider: method === "BANK_TRANSFER" ? "manual" : null,
    },
  });

  if (method === "BANK_TRANSFER") redirect(`/panel/odemeler/${payment.id}?durum=havale`);
  redirect(await startCardPayment(payment.id, await clientIp()));
}

export async function payWithCard(formData: FormData) {
  const user = await requireUser();
  const payment = await db.payment.findFirst({ where: { id: String(formData.get("paymentId")), userId: user.id } });
  if (!payment || payment.status === "PAID") redirect("/panel/odemeler");
  await db.payment.update({ where: { id: payment.id }, data: { method: "CARD", status: "PENDING", errorMessage: null } });
  redirect(await startCardPayment(payment.id, await clientIp()));
}

export async function cancelEnrollment(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id"));
  const enrollment = await db.enrollment.findFirst({ where: { id, userId: user.id, status: "PENDING_PAYMENT" } });
  if (!enrollment) return;
  await db.$transaction([
    db.enrollment.update({ where: { id }, data: { status: "CANCELLED" } }),
    db.payment.updateMany({ where: { enrollmentId: id, status: { in: ["PENDING", "FAILED"] } }, data: { status: "CANCELLED" } }),
  ]);
  revalidatePath("/panel", "layout");
}

/** Yalnızca TEST MODUNDA (iyzico anahtarları yokken) kullanılan simüle kart ödemesi. */
export async function completeTestPayment(_: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  if (process.env.IYZICO_API_KEY) return { error: "Test ödemesi canlı modda kullanılamaz." };
  const payment = await db.payment.findFirst({ where: { id: String(formData.get("paymentId")), userId: user.id } });
  if (!payment) return { error: "Ödeme bulunamadı." };
  if (payment.status === "PAID") redirect(`/panel/odemeler/${payment.id}?durum=basarili`);

  const card = String(formData.get("card") ?? "").replace(/\D/g, "");
  const luhn = (n: string) =>
    n.split("").reverse().map(Number).reduce((sum, d, i) => sum + (i % 2 ? (d * 2 > 9 ? d * 2 - 9 : d * 2) : d), 0) % 10 === 0;
  if (card.length < 15 || !luhn(card)) return { error: "Kart numarası geçersiz." };
  if (card.endsWith("0002")) {
    await db.payment.update({ where: { id: payment.id }, data: { status: "FAILED", errorMessage: "Kart sahibi bankası işlemi onaylamadı (test)." } });
    redirect(`/panel/odemeler/${payment.id}?durum=hata`);
  }
  await markPaymentPaid(payment.id, `TEST-${Date.now()}`);
  redirect(`/panel/odemeler/${payment.id}?durum=basarili`);
}
