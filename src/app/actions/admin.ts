"use server";

import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin, hashPassword } from "@/lib/auth";
import { markPaymentPaid } from "@/lib/payment";
import { defaultSettings, type SettingKey } from "@/lib/settings";
import { slugify } from "@/lib/utils";
import { UPLOAD_DIR } from "@/lib/uploads";
import type { FormState } from "@/components/ui/FormAlert";

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();
const int = (fd: FormData, key: string, fallback = 0) => {
  const n = parseInt(String(fd.get(key) ?? "").replace(/\D/g, ""), 10);
  return Number.isFinite(n) ? n : fallback;
};

const ALLOWED = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
  ["image/avif", ".avif"],
]);

/** Yüklenen görseli kaydeder ve herkese açık adresini döndürür. */
async function saveUpload(file: FormDataEntryValue | null): Promise<string | null> {
  if (!file || typeof file === "string" || file.size === 0) return null;
  const ext = ALLOWED.get(file.type);
  if (!ext) throw new Error("Yalnızca JPG, PNG, WEBP, GIF veya AVIF görseller yüklenebilir.");
  if (file.size > 8 * 1024 * 1024) throw new Error("Görsel en fazla 8 MB olabilir.");
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const name = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}${ext}`;
  await fs.writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
  return `/medya/${name}`;
}

async function imageFrom(fd: FormData, fileKey: string, urlKey: string, current?: string | null) {
  const uploaded = await saveUpload(fd.get(fileKey));
  if (uploaded) return uploaded;
  if (fd.get(`${urlKey}_clear`) === "on") return null;
  const url = str(fd, urlKey);
  return url || current || null;
}

function revalidateSite() {
  revalidatePath("/", "layout");
}

/* ---------------------------- Eğitimler ---------------------------- */

export async function saveCourse(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(fd, "id");
  const title = str(fd, "title");
  if (title.length < 2) return { error: "Eğitim adı gerekli." };
  const slug = slugify(str(fd, "slug") || title);
  const clash = await db.course.findFirst({ where: { slug, NOT: id ? { id } : undefined } });
  if (clash) return { error: "Bu bağlantı adı (slug) başka bir eğitimde kullanılıyor." };
  const existing = id ? await db.course.findUnique({ where: { id } }) : null;
  let image: string | null;
  try {
    image = await imageFrom(fd, "imageFile", "image", existing?.image);
  } catch (e) {
    return { error: (e as Error).message };
  }
  const data = {
    title,
    slug,
    category: str(fd, "category") || "Sahne Sanatları",
    shortDesc: str(fd, "shortDesc"),
    content: str(fd, "content"),
    ageRange: str(fd, "ageRange"),
    duration: str(fd, "duration"),
    format: str(fd, "format"),
    schedule: str(fd, "schedule"),
    highlights: str(fd, "highlights"),
    color: str(fd, "color") || "#b8242f",
    icon: str(fd, "icon") || "Sparkles",
    image,
    featured: fd.get("featured") === "on",
    active: fd.get("active") === "on",
    order: int(fd, "order"),
  };
  const course = id ? await db.course.update({ where: { id }, data }) : await db.course.create({ data });
  revalidateSite();
  if (!id) redirect(`/yonetim/egitimler/${course.id}?kaydedildi=1`);
  return { ok: true, message: "Eğitim kaydedildi." };
}

export async function deleteCourse(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  const used = await db.enrollment.count({ where: { courseId: id } });
  if (used > 0) await db.course.update({ where: { id }, data: { active: false } });
  else await db.course.delete({ where: { id } });
  revalidateSite();
  redirect("/yonetim/egitimler");
}

export async function savePackage(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  const courseId = str(fd, "courseId");
  const data = {
    name: str(fd, "name") || "Paket",
    description: str(fd, "description") || null,
    price: int(fd, "price"),
    months: int(fd, "months", 1),
    popular: fd.get("popular") === "on",
    order: int(fd, "order"),
  };
  if (id) await db.coursePackage.update({ where: { id }, data });
  else await db.coursePackage.create({ data: { ...data, courseId } });
  revalidateSite();
}

export async function deletePackage(fd: FormData) {
  await requireAdmin();
  await db.coursePackage.delete({ where: { id: str(fd, "id") } });
  revalidateSite();
}

/* ------------------------------ Blog ------------------------------ */

export async function savePost(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(fd, "id");
  const title = str(fd, "title");
  if (title.length < 3) return { error: "Başlık gerekli." };
  const slug = slugify(str(fd, "slug") || title);
  const clash = await db.post.findFirst({ where: { slug, NOT: id ? { id } : undefined } });
  if (clash) return { error: "Bu bağlantı adı (slug) başka bir yazıda kullanılıyor." };
  const existing = id ? await db.post.findUnique({ where: { id } }) : null;
  let cover: string | null;
  try {
    cover = await imageFrom(fd, "coverFile", "cover", existing?.cover);
  } catch (e) {
    return { error: (e as Error).message };
  }
  const content = str(fd, "content");
  const data = {
    title,
    slug,
    excerpt: str(fd, "excerpt"),
    content,
    category: str(fd, "category") || "Akademiden Haberler",
    authorName: str(fd, "authorName") || "Ragıp Savaş Sanat Akademisi",
    cover,
    published: fd.get("published") === "on",
    readMinutes: Math.max(1, Math.round(content.split(/\s+/).length / 200)),
    publishedAt: fd.get("publishedAt") ? new Date(str(fd, "publishedAt")) : existing?.publishedAt ?? new Date(),
  };
  const post = id ? await db.post.update({ where: { id }, data }) : await db.post.create({ data });
  revalidateSite();
  if (!id) redirect(`/yonetim/blog/${post.id}?kaydedildi=1`);
  return { ok: true, message: "Yazı kaydedildi." };
}

export async function deletePost(fd: FormData) {
  await requireAdmin();
  await db.post.delete({ where: { id: str(fd, "id") } });
  revalidateSite();
  redirect("/yonetim/blog");
}

/* ----------------------------- Galeri ----------------------------- */

export async function addGalleryItem(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const title = str(fd, "title");
  let imageUrl: string | null;
  try {
    imageUrl = await imageFrom(fd, "file", "imageUrl");
  } catch (e) {
    return { error: (e as Error).message };
  }
  const videoUrl = str(fd, "videoUrl") || null;
  if (!imageUrl && videoUrl) {
    const m = /(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/.exec(videoUrl);
    if (m) imageUrl = `https://i.ytimg.com/vi/${m[1]}/hqdefault.jpg`;
  }
  if (!imageUrl) return { error: "Bir görsel yükleyin, görsel adresi veya YouTube bağlantısı girin." };
  await db.galleryItem.create({
    data: { title: title || "Akademiden", category: str(fd, "category") || "Etkinlikler", imageUrl, videoUrl, order: int(fd, "order") },
  });
  revalidateSite();
  return { ok: true, message: "Galeriye eklendi." };
}

export async function deleteGalleryItem(fd: FormData) {
  await requireAdmin();
  const item = await db.galleryItem.delete({ where: { id: str(fd, "id") } });
  if (item.imageUrl.startsWith("/medya/")) {
    await fs.unlink(path.join(UPLOAD_DIR, path.basename(item.imageUrl))).catch(() => undefined);
  }
  revalidateSite();
}

/* --------------------------- Duyurular --------------------------- */

export async function saveAnnouncement(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const title = str(fd, "title");
  const content = str(fd, "content");
  if (!title || !content) return { error: "Başlık ve içerik gerekli." };
  await db.announcement.create({ data: { title, content, published: true } });
  revalidatePath("/panel", "layout");
  revalidatePath("/yonetim/duyurular");
  return { ok: true, message: "Duyuru yayınlandı." };
}

export async function toggleAnnouncement(fd: FormData) {
  await requireAdmin();
  const a = await db.announcement.findUniqueOrThrow({ where: { id: str(fd, "id") } });
  await db.announcement.update({ where: { id: a.id }, data: { published: !a.published } });
  revalidatePath("/yonetim/duyurular");
}

export async function deleteAnnouncement(fd: FormData) {
  await requireAdmin();
  await db.announcement.delete({ where: { id: str(fd, "id") } });
  revalidatePath("/yonetim/duyurular");
}

/* ----------------------- Kayıt & ödeme yönetimi ----------------------- */

export async function setEnrollmentStatus(fd: FormData) {
  await requireAdmin();
  const status = str(fd, "status");
  if (!["PENDING_PAYMENT", "ACTIVE", "COMPLETED", "CANCELLED"].includes(status)) return;
  const id = str(fd, "id");
  const e = await db.enrollment.findUniqueOrThrow({ where: { id }, include: { package: true } });
  const data: { status: string; startDate?: Date; endDate?: Date } = { status };
  if (status === "ACTIVE" && !e.startDate) {
    const start = new Date();
    const end = new Date(start);
    end.setMonth(end.getMonth() + Math.max(1, e.package?.months ?? 1));
    Object.assign(data, { startDate: start, endDate: end });
  }
  await db.enrollment.update({ where: { id }, data });
  revalidatePath("/yonetim", "layout");
}

export async function approvePayment(fd: FormData) {
  await requireAdmin();
  await markPaymentPaid(str(fd, "id"), `MANUEL-${Date.now()}`);
  await db.payment.update({ where: { id: str(fd, "id") }, data: { provider: "manual" } });
  revalidatePath("/yonetim", "layout");
}

export async function setPaymentStatus(fd: FormData) {
  await requireAdmin();
  const status = str(fd, "status");
  if (!["REFUNDED", "CANCELLED", "FAILED", "PENDING"].includes(status)) return;
  await db.payment.update({ where: { id: str(fd, "id") }, data: { status } });
  revalidatePath("/yonetim", "layout");
}

/* --------------------- Mesajlar & deneme dersleri --------------------- */

export async function toggleMessageRead(fd: FormData) {
  await requireAdmin();
  const m = await db.message.findUniqueOrThrow({ where: { id: str(fd, "id") } });
  await db.message.update({ where: { id: m.id }, data: { read: !m.read } });
  revalidatePath("/yonetim", "layout");
}

export async function deleteMessage(fd: FormData) {
  await requireAdmin();
  await db.message.delete({ where: { id: str(fd, "id") } });
  revalidatePath("/yonetim", "layout");
}

export async function setTrialStatus(fd: FormData) {
  await requireAdmin();
  const status = str(fd, "status");
  if (!["NEW", "CONTACTED", "DONE"].includes(status)) return;
  await db.trialRequest.update({ where: { id: str(fd, "id") }, data: { status } });
  revalidatePath("/yonetim", "layout");
}

export async function deleteTrial(fd: FormData) {
  await requireAdmin();
  await db.trialRequest.delete({ where: { id: str(fd, "id") } });
  revalidatePath("/yonetim", "layout");
}

/* ----------------------------- Üyeler ----------------------------- */

export async function setUserRole(fd: FormData) {
  const admin = await requireAdmin();
  const id = str(fd, "id");
  if (id === admin.id) return; // kendi yetkisini kaldıramaz
  const role = str(fd, "role") === "ADMIN" ? "ADMIN" : "MEMBER";
  await db.user.update({ where: { id }, data: { role } });
  revalidatePath(`/yonetim/uyeler/${id}`);
}

export async function createMemberByAdmin(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const email = str(fd, "email").toLowerCase();
  const name = str(fd, "name");
  const password = str(fd, "password");
  if (!name || !email.includes("@") || password.length < 8) return { error: "Ad, geçerli e-posta ve en az 8 karakterli şifre gerekli." };
  if (await db.user.findUnique({ where: { email } })) return { error: "Bu e-posta zaten kayıtlı." };
  await db.user.create({ data: { name, email, phone: str(fd, "phone") || null, passwordHash: await hashPassword(password), role: str(fd, "role") === "ADMIN" ? "ADMIN" : "MEMBER" } });
  revalidatePath("/yonetim/uyeler");
  return { ok: true, message: "Üye oluşturuldu." };
}

/* ----------------------------- Ayarlar ----------------------------- */

export async function saveSettings(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const keys = Object.keys(defaultSettings) as SettingKey[];
  await db.$transaction(
    keys.map((key) =>
      db.setting.upsert({ where: { key }, create: { key, value: str(fd, key) }, update: { value: str(fd, key) } }),
    ),
  );
  revalidateSite();
  return { ok: true, message: "Ayarlar kaydedildi." };
}
