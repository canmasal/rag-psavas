import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { PanelHeader } from "@/components/dashboard/Shell";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

export default async function AdminBlog() {
  const posts = await db.post.findMany({ orderBy: { publishedAt: "desc" } });
  return (
    <>
      <PanelHeader title="Blog" description="Yazıları oluşturun, düzenleyin ve yayınlayın." action={<Link href="/yonetim/blog/yeni" className="btn btn-primary"><Plus className="h-4 w-4" /> Yeni Yazı</Link>} />
      <div className="card divide-y divide-line">
        {posts.map((p) => (
          <Link key={p.id} href={`/yonetim/blog/${p.id}`} className="flex items-center gap-4 p-5 hover:bg-sand/50">
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold">{p.title}</p>
              <p className="text-xs text-muted">{p.category} · {formatDate(p.publishedAt)} · {p.readMinutes} dk</p>
            </div>
            {p.published ? <Badge tone="green">Yayında</Badge> : <Badge>Taslak</Badge>}
          </Link>
        ))}
        {posts.length === 0 && <p className="p-10 text-center text-muted">Henüz yazı yok.</p>}
      </div>
    </>
  );
}
