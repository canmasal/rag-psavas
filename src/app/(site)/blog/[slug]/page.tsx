import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { Markdown } from "@/lib/markdown";
import { ArtCover } from "@/components/art";
import { PostCard } from "@/components/site/PostCard";
import { ShareButtons } from "@/components/site/ShareButtons";
import { formatDate } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await db.post.findUnique({ where: { slug } });
  if (!post) return {};
  return { title: post.title, description: post.excerpt, openGraph: { type: "article", title: post.title, description: post.excerpt } };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await db.post.findUnique({ where: { slug } });
  if (!post || !post.published) notFound();
  const more = await db.post.findMany({ where: { published: true, NOT: { id: post.id } }, orderBy: { publishedAt: "desc" }, take: 3 });

  return (
    <article>
      <header className="border-b border-line bg-sand">
        <div className="container-rs max-w-4xl py-14 md:py-20">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-muted hover:text-ink"><ArrowLeft className="h-4 w-4" /> Blog</Link>
          <p className="mt-8 text-xs font-extrabold uppercase tracking-[0.18em] text-accent">{post.category}</p>
          <h1 className="mt-3 text-4xl font-medium leading-tight md:text-6xl">{post.title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">{post.excerpt}</p>
          <p className="mt-6 text-sm font-semibold">{post.authorName} · {formatDate(post.publishedAt)} · {post.readMinutes} dk okuma</p>
        </div>
      </header>
      <div className="container-rs max-w-4xl">
        <ArtCover seed={post.slug} color="#2a2236" icon="Sparkles" image={post.cover} alt={post.title} className="-mt-0 mt-10 aspect-[16/8] rounded-[1.5rem]" />
        <div className="mx-auto max-w-3xl py-12">
          <Markdown source={post.content} />
          <div className="mt-12 border-t border-line pt-6"><ShareButtons title={post.title} /></div>
        </div>
      </div>
      {more.length > 0 && (
        <section className="border-t border-line bg-white py-16">
          <div className="container-rs">
            <h2 className="text-3xl">Diğer yazılar</h2>
            <div className="mt-10 grid gap-10 md:grid-cols-3">{more.map((p) => <PostCard key={p.slug} post={p} />)}</div>
          </div>
        </section>
      )}
    </article>
  );
}
