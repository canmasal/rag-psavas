"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton({ value }: { value: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => { await navigator.clipboard.writeText(value.replace(/\s/g, "")); setDone(true); setTimeout(() => setDone(false), 1500); }}
      className="grid h-7 w-7 place-items-center rounded-md text-muted hover:bg-sand hover:text-ink"
      aria-label="Kopyala"
    >
      {done ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}
