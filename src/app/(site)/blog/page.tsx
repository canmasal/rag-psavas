import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { PageHero } from "@/components/ui/PageHero";
import { PostCard } from "@/components/site/PostCard";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Blog", description: "Sanat eğitimi, veli rehberi, müzik ve sahne sanatları üzerine yazılar ve akademiden haberler." };

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ kategori?: string }> }) {
  const { kategori } = await searchParams;
  const [posts, cats] = await Promise.all([
    db.post.findMany({ where: { published: true, ...(kategori ? { category: kategori } : {}) }, orderBy: { publishedAt: "desc" } }),
    db.post.groupBy({ by: ["category"], where: { published: true }, _count: true }),
  ]);
  const [first, ...rest] = posts;
  return (
    <>
      <PageHero eyebrow="Blog" title="Sanat, eğitim ve sahne üzerine" description="Eğitmenlerimizden veli rehberleri, branş yazıları ve akademiden haberler." crumbs={[{ label: "Blog" }]} />
      <section className="py-14 md:py-20">
        <div className="container-rs">
          <div className="flex flex-wrap gap-2">
            <Link href="/blog" className={cn("rounded-full border px-4 py-2 text-sm font-bold", !kategori ? "border-ink bg-ink text-white" : "border-line bg-white")}>Tümü</Link>
            {cats.map((c) => (
              <Link key={c.category} href={`/blog?kategori=${encodeURIComponent(c.category)}`} className={cn("rounded-full border px-4 py-2 text-sm font-bold", kategori === c.category ? "border-ink bg-ink text-white" : "border-line bg-white")}>
                {c.category} <span className="opacity-50">({c._count})</span>
              </Link>
            ))}
          </div>
          {first && (
            <div className="mt-10 grid gap-10 border-b border-line pb-14 lg:grid-cols-1">
              <div className="[&_h3]:text-3xl md:[&_h3]:text-4xl"><PostCard post={first} /></div>
            </div>
          )}
          <div className="mt-14 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => <PostCard key={p.slug} post={p} />)}
          </div>
          {posts.length === 0 && <p className="py-20 text-center text-muted">Henüz yazı bulunmuyor.</p>}
        </div>
      </section>
    </>
  );
}
