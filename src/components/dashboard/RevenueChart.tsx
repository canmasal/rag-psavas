import { formatPrice } from "@/lib/utils";

/** Bağımlılıksız, erişilebilir sütun grafiği */
export function RevenueChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="mt-6">
      <div className="flex h-56 items-end gap-3 border-b border-line" role="img" aria-label="Aylık tahsilat grafiği">
        {data.map((d, i) => (
          <div key={d.label} className="group relative flex h-full flex-1 flex-col justify-end">
            <span className="pointer-events-none absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[0.7rem] font-bold text-white opacity-0 transition group-hover:opacity-100">
              {formatPrice(d.value)}
            </span>
            <div
              className="rounded-t-lg transition-all group-hover:opacity-80"
              style={{ height: `${Math.max((d.value / max) * 100, d.value ? 3 : 1)}%`, background: i === data.length - 1 ? "var(--color-accent)" : "var(--color-ink)" }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-3">
        {data.map((d) => <span key={d.label} className="flex-1 text-center text-xs font-semibold capitalize text-muted">{d.label}</span>)}
      </div>
    </div>
  );
}
