import type { Metadata, Viewport } from "next";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/manrope";
import "./globals.css";
import { siteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Ragıp Savaş Sanat Akademisi | Bale, Tiyatro, Müzik ve Resim Eğitimi · Göktürk",
    template: "%s | Ragıp Savaş Sanat Akademisi",
  },
  description:
    "2007'den bu yana Göktürk'te çocuk ve yetişkinlere klasik bale, müzikal tiyatro, yaratıcı drama, piyano, keman, gitar, şan, resim, seramik ve daha fazlasında sanat eğitimi.",
  keywords: ["sanat akademisi", "Göktürk", "bale kursu", "müzikal tiyatro", "piyano dersi", "resim kursu", "yaratıcı drama", "Ragıp Savaş"],
  openGraph: { type: "website", locale: "tr_TR", siteName: "Ragıp Savaş Sanat Akademisi" },
};

export const viewport: Viewport = { themeColor: "#17121f" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
