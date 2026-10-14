"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";

const KEY = "rs-cerez-onay";

export function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    try { setShow(!localStorage.getItem(KEY)); } catch { /* gizli mod */ }
  }, []);
  if (!show) return null;
  const accept = (v: string) => { try { localStorage.setItem(KEY, v); } catch {} setShow(false); };
  return (
    <div role="dialog" aria-label="Çerez bildirimi" className="fixed inset-x-3 bottom-3 z-[55] mx-auto max-w-3xl rounded-2xl border border-line bg-white p-5 shadow-2xl shadow-black/15 sm:inset-x-6 sm:bottom-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Cookie className="hidden h-8 w-8 shrink-0 text-gold sm:block" />
        <p className="flex-1 text-sm leading-relaxed text-muted">
          Sitemizde deneyiminizi iyileştirmek için zorunlu çerezler kullanıyoruz. Detaylı bilgi için{" "}
          <Link href="/yasal/gizlilik" className="font-semibold text-ink underline">Gizlilik Politikası</Link> ve{" "}
          <Link href="/yasal/kvkk" className="font-semibold text-ink underline">KVKK Aydınlatma Metni</Link>&apos;ni inceleyebilirsiniz.
        </p>
        <div className="flex gap-2">
          <button type="button" onClick={() => accept("zorunlu")} className="btn btn-sm hover:bg-sand">Yalnızca zorunlu</button>
          <button type="button" onClick={() => accept("tumu")} className="btn btn-dark btn-sm">Kabul et</button>
        </div>
      </div>
    </div>
  );
}
