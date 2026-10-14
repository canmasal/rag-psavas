import Link from "next/link";
import { cn } from "@/lib/utils";

export function FilterTabs({ base, current, options }: { base: string; current?: string; options: { value?: string; label: string; count?: number }[] }) {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {options.map((o) => (
        <Link
          key={o.label}
          href={o.value ? `${base}?durum=${o.value}` : base}
          className={cn("rounded-full border px-4 py-2 text-sm font-bold transition", current === o.value ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink")}
        >
          {o.label}{o.count !== undefined && <span className="ml-1 opacity-60">({o.count})</span>}
        </Link>
      ))}
    </div>
  );
}
