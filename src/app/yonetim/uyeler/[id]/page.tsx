import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { PanelHeader } from "@/components/dashboard/Shell";
import { Badge } from "@/components/ui/Badge";
import { setUserRole } from "@/app/actions/admin";
import { enrollmentStatus, formatDate, formatPrice, paymentStatus } from "@/lib/utils";

export default async function MemberDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [user, session] = await Promise.all([
    db.user.findUnique({
      where: { id },
      include: {
        students: true,
        enrollments: { include: { course: true, student: true, package: true }, orderBy: { createdAt: "desc" } },
        payments: { orderBy: { createdAt: "desc" } },
      },
    }),
    getSession(),
  ]);
  if (!user) notFound();
  const paid = user.payments.filter((p) => p.status === "PAID").reduce((s, p) => s + p.amount, 0);
  return (
    <>
      <Link href="/yonetim/uyeler" className="mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-muted hover:text-ink"><ArrowLeft className="h-4 w-4" /> Üyeler</Link>
      <PanelHeader title={user.name} description={`Üyelik: ${formatDate(user.createdAt)} · Toplam ödeme: ${formatPrice(paid)}`} />
      <div className="grid gap-6 lg:grid-cols-[20rem_1fr]">
        <div className="space-y-6">
          <div className="card space-y-3 p-6 text-sm">
            <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted" /><a href={`mailto:${user.email}`} className="hover:text-accent">{user.email}</a></p>
            {user.phone && <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted" /><a href={`tel:${user.phone}`} className="hover:text-accent">{user.phone}</a></p>}
            {user.address && <p className="text-muted">{user.address} {user.city}</p>}
            {session?.uid !== user.id && (
              <form action={setUserRole} className="border-t border-line pt-3">
                <input type="hidden" name="id" value={user.id} />
                <input type="hidden" name="role" value={user.role === "ADMIN" ? "MEMBER" : "ADMIN"} />
                <button type="submit" className="btn btn-outline btn-sm w-full">{user.role === "ADMIN" ? "Yönetici yetkisini kaldır" : "Yönetici yap"}</button>
              </form>
            )}
          </div>
          <div className="card p-6">
            <p className="font-display text-lg">Öğrenciler</p>
            <ul className="mt-3 space-y-2 text-sm">
              {user.students.map((s) => <li key={s.id} className="flex justify-between"><span className="font-semibold">{s.name}</span><span className="text-muted">{s.birthDate ? formatDate(s.birthDate) : ""}</span></li>)}
              {user.students.length === 0 && <li className="text-muted">Öğrenci eklenmemiş.</li>}
            </ul>
          </div>
        </div>
        <div className="space-y-6">
          <div className="card">
            <p className="border-b border-line p-5 font-display text-lg">Kayıtlar</p>
            <ul className="divide-y divide-line text-sm">
              {user.enrollments.map((e) => (
                <li key={e.id} className="flex items-center gap-3 p-4">
                  <span className="h-3 w-3 rounded-full" style={{ background: e.course.color }} />
                  <span className="flex-1"><b>{e.course.title}</b> · {e.package?.name} <span className="text-muted">({e.student?.name ?? user.name})</span></span>
                  <Badge tone={enrollmentStatus[e.status]?.tone}>{enrollmentStatus[e.status]?.label}</Badge>
                </li>
              ))}
              {user.enrollments.length === 0 && <li className="p-4 text-muted">Kayıt yok.</li>}
            </ul>
          </div>
          <div className="card">
            <p className="border-b border-line p-5 font-display text-lg">Ödemeler</p>
            <ul className="divide-y divide-line text-sm">
              {user.payments.map((p) => (
                <li key={p.id} className="flex items-center gap-3 p-4">
                  <span className="flex-1">{p.description}<span className="block text-xs text-muted">{formatDate(p.createdAt, true)}</span></span>
                  <b>{formatPrice(p.amount)}</b>
                  <Badge tone={paymentStatus[p.status]?.tone}>{paymentStatus[p.status]?.label}</Badge>
                </li>
              ))}
              {user.payments.length === 0 && <li className="p-4 text-muted">Ödeme yok.</li>}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
