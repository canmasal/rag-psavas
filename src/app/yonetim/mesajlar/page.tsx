import { Mail, Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { PanelHeader } from "@/components/dashboard/Shell";
import { deleteMessage, toggleMessageRead } from "@/app/actions/admin";
import { cn, formatDate } from "@/lib/utils";

export default async function AdminMessages() {
  const items = await db.message.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <>
      <PanelHeader title="Mesajlar" description="İletişim formundan gelen mesajlar." />
      <div className="space-y-3">
        {items.map((m) => (
          <article key={m.id} className={cn("card p-5", !m.read && "border-l-4 border-l-accent")}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-bold">{m.subject} {!m.read && <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-[0.65rem] font-bold text-white">YENİ</span>}</p>
                <p className="text-sm text-muted">{m.name} · <a href={`mailto:${m.email}`} className="hover:text-accent">{m.email}</a>{m.phone && ` · ${m.phone}`}</p>
              </div>
              <p className="text-xs text-muted">{formatDate(m.createdAt, true)}</p>
            </div>
            <p className="mt-3 whitespace-pre-line text-[0.95rem] leading-relaxed">{m.message}</p>
            <div className="mt-4 flex gap-2">
              <a href={`mailto:${m.email}?subject=${encodeURIComponent("Re: " + m.subject)}`} className="btn btn-dark btn-sm"><Mail className="h-4 w-4" /> Yanıtla</a>
              <form action={toggleMessageRead}><input type="hidden" name="id" value={m.id} /><button type="submit" className="btn btn-outline btn-sm">{m.read ? "Okunmadı yap" : "Okundu yap"}</button></form>
              <form action={deleteMessage} className="ml-auto"><input type="hidden" name="id" value={m.id} /><button type="submit" className="grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-red-50 hover:text-red-700" aria-label="Sil"><Trash2 className="h-4 w-4" /></button></form>
            </div>
          </article>
        ))}
        {items.length === 0 && <div className="card p-10 text-center text-muted">Henüz mesaj yok.</div>}
      </div>
    </>
  );
}
