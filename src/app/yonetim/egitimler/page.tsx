import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { PanelHeader } from "@/components/dashboard/Shell";
import { Badge } from "@/components/ui/Badge";
import { CourseIcon } from "@/components/icons";
import { formatPrice } from "@/lib/utils";

export default async function AdminCourses() {
  const courses = await db.course.findMany({ orderBy: { order: "asc" }, include: { packages: true, _count: { select: { enrollments: { where: { status: "ACTIVE" } } } } } });
  return (
    <>
      <PanelHeader title="Eğitimler" description="Branşları, içeriklerini ve fiyat paketlerini yönetin." action={<Link href="/yonetim/egitimler/yeni" className="btn btn-primary"><Plus className="h-4 w-4" /> Yeni Eğitim</Link>} />
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="border-b border-line text-left text-xs uppercase tracking-wider text-muted">
            <tr><th className="p-4">Eğitim</th><th className="p-4">Kategori</th><th className="p-4">Paketler</th><th className="p-4">Aktif öğrenci</th><th className="p-4">Durum</th><th className="p-4" /></tr>
          </thead>
          <tbody className="divide-y divide-line">
            {courses.map((c) => (
              <tr key={c.id}>
                <td className="p-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl text-white" style={{ background: c.color }}><CourseIcon name={c.icon} className="h-4 w-4" /></span><div><p className="font-bold">{c.title}</p><p className="text-xs text-muted">/{c.slug}</p></div></div></td>
                <td className="p-4 text-muted">{c.category}</td>
                <td className="p-4 text-muted">{c.packages.length} paket{c.packages.length > 0 && ` · ${formatPrice(Math.min(...c.packages.map((p) => p.price)))}+`}</td>
                <td className="p-4 font-semibold">{c._count.enrollments}</td>
                <td className="p-4 space-x-1">{c.active ? <Badge tone="green">Yayında</Badge> : <Badge>Pasif</Badge>}{c.featured && <Badge tone="amber">Öne çıkan</Badge>}</td>
                <td className="p-4 text-right"><Link href={`/yonetim/egitimler/${c.id}`} className="font-bold text-accent">Düzenle</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
