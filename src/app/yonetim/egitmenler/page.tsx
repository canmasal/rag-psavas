/* eslint-disable @next/next/no-img-element */
import { Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { PanelHeader } from "@/components/dashboard/Shell";
import { Badge } from "@/components/ui/Badge";
import { InstructorForm } from "@/components/dashboard/InstructorForm";
import { deleteInstructor } from "@/app/actions/admin";

export default async function AdminInstructors() {
  const items = await db.instructor.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  return (
    <>
      <PanelHeader title="Eğitmenler" description="Eğitmen kadrosu sitede 'Eğitmenlerimiz' sayfasında ve ana sayfada gösterilir." />
      <div className="grid gap-6 lg:grid-cols-[1fr_24rem]">
        <div className="space-y-3">
          {items.map((t) => (
            <details key={t.id} className="card group">
              <summary className="flex cursor-pointer list-none items-center gap-4 p-4 [&::-webkit-details-marker]:hidden">
                {t.photo ? <img src={t.photo} alt="" className="h-14 w-14 rounded-full object-cover" /> : <span className="grid h-14 w-14 place-items-center rounded-full bg-sand font-display text-xl">{t.name.charAt(0)}</span>}
                <div className="flex-1"><p className="font-bold">{t.name} {!t.active && <Badge>Gizli</Badge>}</p><p className="text-sm text-muted">{t.title}</p></div>
                <span className="text-sm font-bold text-accent group-open:hidden">Düzenle</span>
              </summary>
              <div className="border-t border-line p-4">
                <InstructorForm instructor={t} />
                <form action={deleteInstructor} className="mt-3 text-right"><input type="hidden" name="id" value={t.id} /><button type="submit" className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-700"><Trash2 className="h-4 w-4" /> Eğitmeni sil</button></form>
              </div>
            </details>
          ))}
          {items.length === 0 && <div className="card p-10 text-center text-muted">Henüz eğitmen eklenmedi. Sağdaki formdan ekleyebilirsiniz.</div>}
        </div>
        <div className="card self-start p-6"><p className="font-display text-xl">Yeni eğitmen</p><div className="mt-5"><InstructorForm /></div></div>
      </div>
    </>
  );
}
