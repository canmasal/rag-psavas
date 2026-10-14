import { Eye, EyeOff, Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { PanelHeader } from "@/components/dashboard/Shell";
import { Badge } from "@/components/ui/Badge";
import { AnnouncementForm } from "@/components/dashboard/AnnouncementForm";
import { deleteAnnouncement, toggleAnnouncement } from "@/app/actions/admin";
import { formatDate } from "@/lib/utils";

export default async function AdminAnnouncements() {
  const items = await db.announcement.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <>
      <PanelHeader title="Duyurular" description="Üye panelinde görünen duyuruları yönetin." />
      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-3">
          {items.map((a) => (
            <div key={a.id} className="card flex gap-4 p-5">
              <div className="flex-1">
                <p className="text-xs text-muted">{formatDate(a.createdAt)}</p>
                <p className="mt-1 font-bold">{a.title} {!a.published && <Badge>Gizli</Badge>}</p>
                <p className="mt-1 whitespace-pre-line text-sm text-muted">{a.content}</p>
              </div>
              <div className="flex flex-col gap-1">
                <form action={toggleAnnouncement}><input type="hidden" name="id" value={a.id} /><button type="submit" className="grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-sand" aria-label={a.published ? "Gizle" : "Yayınla"}>{a.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></form>
                <form action={deleteAnnouncement}><input type="hidden" name="id" value={a.id} /><button type="submit" className="grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-red-50 hover:text-red-700" aria-label="Sil"><Trash2 className="h-4 w-4" /></button></form>
              </div>
            </div>
          ))}
        </div>
        <div className="card self-start p-6"><p className="font-display text-xl">Yeni duyuru</p><div className="mt-5"><AnnouncementForm /></div></div>
      </div>
    </>
  );
}
