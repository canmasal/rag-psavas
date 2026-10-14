"use client";

import { useState } from "react";
import { Check, Facebook, Link2, MessageCircle, Twitter } from "lucide-react";

export function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const share = (base: string) => {
    const url = encodeURIComponent(window.location.href);
    window.open(base.replace("{url}", url).replace("{title}", encodeURIComponent(title)), "_blank", "noopener,width=600,height=500");
  };
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-2 text-sm font-bold">Paylaş:</span>
      <button type="button" onClick={() => share("https://wa.me/?text={title}%20{url}")} className="grid h-10 w-10 place-items-center rounded-full border border-line hover:border-ink" aria-label="WhatsApp"><MessageCircle className="h-4 w-4" /></button>
      <button type="button" onClick={() => share("https://www.facebook.com/sharer/sharer.php?u={url}")} className="grid h-10 w-10 place-items-center rounded-full border border-line hover:border-ink" aria-label="Facebook"><Facebook className="h-4 w-4" /></button>
      <button type="button" onClick={() => share("https://twitter.com/intent/tweet?text={title}&url={url}")} className="grid h-10 w-10 place-items-center rounded-full border border-line hover:border-ink" aria-label="X"><Twitter className="h-4 w-4" /></button>
      <button
        type="button"
        onClick={async () => { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
        className="grid h-10 w-10 place-items-center rounded-full border border-line hover:border-ink"
        aria-label="Bağlantıyı kopyala"
      >
        {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Link2 className="h-4 w-4" />}
      </button>
    </div>
  );
}
