export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(amount: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(amount);
}

export function formatDate(date: Date | string, withTime = false) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
    timeZone: "Europe/Istanbul",
  }).format(new Date(date));
}

export function slugify(text: string) {
  const map: Record<string, string> = { ç: "c", ğ: "g", ı: "i", İ: "i", ö: "o", ş: "s", ü: "u", Ç: "c", Ğ: "g", Ö: "o", Ş: "s", Ü: "u" };
  return text
    .replace(/[çğıİöşüÇĞÖŞÜ]/g, (c) => map[c] ?? c)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export const enrollmentStatus: Record<string, { label: string; tone: string }> = {
  PENDING_PAYMENT: { label: "Ödeme Bekleniyor", tone: "amber" },
  ACTIVE: { label: "Aktif", tone: "green" },
  COMPLETED: { label: "Tamamlandı", tone: "slate" },
  CANCELLED: { label: "İptal Edildi", tone: "red" },
};

export const paymentStatus: Record<string, { label: string; tone: string }> = {
  PENDING: { label: "Bekliyor", tone: "amber" },
  PAID: { label: "Ödendi", tone: "green" },
  FAILED: { label: "Başarısız", tone: "red" },
  REFUNDED: { label: "İade Edildi", tone: "slate" },
  CANCELLED: { label: "İptal", tone: "slate" },
};

export const paymentMethod: Record<string, string> = {
  CARD: "Kredi / Banka Kartı",
  BANK_TRANSFER: "Havale / EFT",
};

export const trialStatus: Record<string, { label: string; tone: string }> = {
  NEW: { label: "Yeni", tone: "amber" },
  CONTACTED: { label: "Arandı", tone: "blue" },
  DONE: { label: "Tamamlandı", tone: "green" },
};

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}
