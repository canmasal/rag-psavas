import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { db } from "@/lib/db";
import { PanelHeader } from "@/components/dashboard/Shell";
import { PostForm } from "@/components/dashboard/PostForm";
import { deletePost } from "@/app/actions/admin";

export default async function EditPost({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ kaydedildi?: string }> }) {
  const [{ id }, { kaydedildi }] = await Promise.all([params, searchParams]);
  const post = id === "yeni" ? null : await db.post.findUnique({ where: { id } });
  if (id !== "yeni" && !post) notFound();
  const categories = (await db.post.findMany({ distinct: ["category"], select: { category: true } })).map((c) => c.category);
  return (
    <>
      <Link href="/yonetim/blog" className="mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-muted hover:text-ink"><ArrowLeft className="h-4 w-4" /> Blog</Link>
      <PanelHeader title={post ? "Yazıyı düzenle" : "Yeni yazı"} action={post && <Link href={`/blog/${post.slug}`} target="_blank" className="btn btn-outline btn-sm"><ExternalLink className="h-4 w-4" /> Sitede gör</Link>} />
      {kaydedildi && <div className="mb-6 rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-900">Yazı oluşturuldu.</div>}
      <PostForm post={post ?? undefined} categories={categories} />
      {post && (
        <form action={deletePost} className="mt-6 flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 p-5">
          <input type="hidden" name="id" value={post.id} />
          <p className="text-sm text-red-900">Bu yazıyı kalıcı olarak sil.</p>
          <button type="submit" className="btn btn-sm bg-red-700 text-white hover:bg-red-800">Yazıyı Sil</button>
        </form>
      )}
    </>
  );
}
