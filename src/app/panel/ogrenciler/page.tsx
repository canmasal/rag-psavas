import { Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { PanelHeader } from "@/components/dashboard/Shell";
import { StudentForm } from "@/components/dashboard/StudentForm";
import { deleteStudent } from "@/app/actions/member";
import { formatDate } from "@/lib/utils";

function age(d: Date | null) {
  if (!d) return null;
  const diff = Date.now() - d.getTime();
  return Math.floor(diff / (365.25 * 24 * 3600 * 1000));
}

export default async function StudentsPage() {
  const user = await requireUser();
  const students = await db.student.findMany({
    where: { userId: user.id },
    include: { enrollments: { where: { status: "ACTIVE" }, include: { course: true } } },
    orderBy: { createdAt: "asc" },
  });
  return (
    <>
      <PanelHeader title="Öğrencilerim" description="Hesabınıza bağlı öğrencileri yönetin. Kardeş kayıtlarında indirim uygulanır." />
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-3">
          {students.map((s) => (
            <div key={s.id} className="card flex items-center gap-4 p-5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gold-soft font-display text-xl text-ink">{s.name.charAt(0)}</span>
              <div className="min-w-0 flex-1">
                <p className="font-bold">{s.name}</p>
                <p className="text-xs text-muted">
                  {s.birthDate ? `${formatDate(s.birthDate)} · ${age(s.birthDate)} yaş` : "Doğum tarihi girilmedi"}
                </p>
                {s.enrollments.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {s.enrollments.map((e) => (
                      <span key={e.id} className="rounded-full px-2 py-0.5 text-[0.7rem] font-bold text-white" style={{ background: e.course.color }}>{e.course.title}</span>
                    ))}
                  </div>
                )}
              </div>
              <form action={deleteStudent}>
                <input type="hidden" name="id" value={s.id} />
                <button type="submit" className="grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-red-50 hover:text-red-700" aria-label={`${s.name} öğrencisini sil`}><Trash2 className="h-4 w-4" /></button>
              </form>
            </div>
          ))}
          {students.length === 0 && <div className="card p-8 text-center text-muted">Henüz öğrenci eklemediniz.</div>}
        </div>
        <div className="card p-6">
          <p className="font-display text-xl">Öğrenci ekle</p>
          <div className="mt-5"><StudentForm /></div>
        </div>
      </div>
    </>
  );
}
