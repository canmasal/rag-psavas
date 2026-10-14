import Link from "next/link";
import { Search } from "lucide-react";
import { db } from "@/lib/db";
import { PanelHeader } from "@/components/dashboard/Shell";
import { Badge } from "@/components/ui/Badge";
import { NewMemberForm } from "@/components/dashboard/NewMemberForm";
import { formatDate } from "@/lib/utils";

export default async function AdminMembers({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const users = await db.user.findMany({
    where: q ? { OR: [{ name: { contains: q } }, { email: { contains: q } }, { phone: { contains: q } }] } : {},
    include: { _count: { select: { students: true, enrollments: { where: { status: "ACTIVE" } } } } },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return (
    <>
      <PanelHeader title="Üyeler" description={`${users.length} üye listeleniyor`} />
      <div className="grid gap-6 xl:grid-cols-[1fr_20rem]">
        <div>
          <form className="relative mb-4">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input name="q" defaultValue={q} className="input pl-11" placeholder="İsim, e-posta veya telefon ara…" />
          </form>
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="border-b border-line text-left text-xs uppercase tracking-wider text-muted">
                <tr><th className="p-4">Üye</th><th className="p-4">Telefon</th><th className="p-4">Öğrenci</th><th className="p-4">Aktif kayıt</th><th className="p-4">Üyelik</th></tr>
              </thead>
              <tbody className="divide-y divide-line">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-sand/50">
                    <td className="p-4"><Link href={`/yonetim/uyeler/${u.id}`} className="font-bold hover:text-accent">{u.name}</Link> {u.role === "ADMIN" && <Badge tone="blue">Yönetici</Badge>}<p className="text-xs text-muted">{u.email}</p></td>
                    <td className="p-4 text-muted">{u.phone ?? "—"}</td>
                    <td className="p-4">{u._count.students}</td>
                    <td className="p-4">{u._count.enrollments}</td>
                    <td className="p-4 text-muted">{formatDate(u.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card self-start p-6"><p className="font-display text-xl">Üye oluştur</p><p className="mt-1 text-sm text-muted">Akademide kayıt olan veliler için hesap açın.</p><div className="mt-5"><NewMemberForm /></div></div>
      </div>
    </>
  );
}
