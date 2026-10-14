import { Megaphone } from "lucide-react";
import { db } from "@/lib/db";
import { PanelHeader, EmptyState } from "@/components/dashboard/Shell";
import { formatDate } from "@/lib/utils";

export default async function AnnouncementsPage() {
  const items = await db.announcement.findMany({ where: { published: true }, orderBy: { createdAt: "desc" } });
  return (
    <>
      <PanelHeader title="Duyurular" description="Akademiden güncel duyurular ve bilgilendirmeler." />
      {items.length === 0 ? <EmptyState title="Şu an duyuru yok" /> : (
        <div className="space-y-4">
          {items.map((a) => (
            <article key={a.id} className="card flex gap-5 p-6">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent/10 text-accent"><Megaphone className="h-5 w-5" /></span>
              <div>
                <p className="text-xs font-bold text-muted">{formatDate(a.createdAt)}</p>
                <h2 className="mt-1 text-xl">{a.title}</h2>
                <p className="mt-2 whitespace-pre-line leading-relaxed text-muted">{a.content}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
