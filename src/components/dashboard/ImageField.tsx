/* eslint-disable @next/next/no-img-element */
export function ImageField({ name, fileName, current, label = "Görsel" }: { name: string; fileName: string; current?: string | null; label?: string }) {
  return (
    <div>
      <span className="label">{label}</span>
      <div className="flex flex-wrap items-start gap-4 rounded-xl border border-line bg-white p-4">
        {current ? <img src={current} alt="" className="h-24 w-32 rounded-lg object-cover" /> : <div className="grid h-24 w-32 place-items-center rounded-lg bg-sand text-xs text-muted">Görsel yok</div>}
        <div className="min-w-[12rem] flex-1 space-y-2">
          <input type="file" name={fileName} accept="image/jpeg,image/png,image/webp,image/gif,image/avif" className="block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-sm file:font-bold file:text-white" />
          <input name={name} defaultValue={current ?? ""} className="input !text-sm" placeholder="veya görsel adresi (https://…)" />
          {current && <label className="flex items-center gap-2 text-xs font-semibold text-muted"><input type="checkbox" name={`${name}_clear`} /> Görseli kaldır</label>}
        </div>
      </div>
    </div>
  );
}
