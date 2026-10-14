import { cache } from "react";
import { db } from "./db";

export const defaultSettings = {
  siteName: "Ragıp Savaş Sanat Akademisi",
  phone: "+90 (212) 322 80 80",
  phone2: "+90 (212) 322 90 90",
  gsm: "+90 (541) 322 90 90",
  whatsapp: "905413229090",
  email: "istanbul@ragipsavassanat.com",
  address: "İstanbul Caddesi, Sinasos AVM Kat: 2, Göktürk – Eyüpsultan / İstanbul",
  workingHours: "Hafta içi 10:00 – 20:00 · Hafta sonu 10:00 – 18:00",
  mapQuery: "Sinasos AVM Göktürk İstanbul",
  instagram: "https://www.instagram.com/ragipsavassanatakademisi",
  facebook: "https://www.facebook.com/ragipsavassanatakademisi",
  youtube: "https://www.youtube.com/@ragipsavassanatakademisi",
  bankName: "Örnek Bankası",
  bankAccountName: "Ragıp Savaş Sanat Akademisi",
  bankIban: "TR00 0000 0000 0000 0000 0000 00",
  announcementBar: "Yeni dönem kayıtları başladı · Dönemlik kayıtlarda %10 indirim",
};

export type SiteSettings = typeof defaultSettings;
export type SettingKey = keyof SiteSettings;

export const settingLabels: Record<SettingKey, string> = {
  siteName: "Site adı",
  phone: "Telefon",
  phone2: "Telefon 2",
  gsm: "GSM",
  whatsapp: "WhatsApp numarası (ülke koduyla, boşluksuz)",
  email: "E-posta",
  address: "Adres",
  workingHours: "Çalışma saatleri",
  mapQuery: "Harita arama ifadesi",
  instagram: "Instagram adresi",
  facebook: "Facebook adresi",
  youtube: "YouTube adresi",
  bankName: "Banka adı (Havale/EFT)",
  bankAccountName: "Hesap sahibi",
  bankIban: "IBAN",
  announcementBar: "Üst duyuru şeridi (boş bırakılırsa gizlenir)",
};

export const getSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const rows = await db.setting.findMany();
    const result = { ...defaultSettings };
    for (const row of rows) {
      if (row.key in result) result[row.key as SettingKey] = row.value;
    }
    return result;
  } catch {
    return defaultSettings;
  }
});
