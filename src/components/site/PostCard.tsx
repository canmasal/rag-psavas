import Link from "next/link";
import { ArtCover } from "../art";
import { formatDate } from "@/lib/utils";

const catColors: Record<string, string> = {
  "Veli Rehberi": "#b8242f",
  Müzik: "#1f3a8a",
  "Sahne Sanatları": "#c2477a",
  "Akademiden Haberler": "#a16207",
  "Görsel Sanatlar": "#2563eb",
};

export function PostCard({
  post,
}: {
  post: { slug: string; title: string; excerpt: string; category: string; cover: string | null; publishedAt: Date; readMinutes: number };
}) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex h-full flex-col">
      <ArtCover
        seed={post.slug}
        color={catColors[post.category] ?? "#2a2236"}
        icon={post.category === "Müzik" ? "Music" : post.category === "Sahne Sanatları" ? "Drama" : "Sparkles"}
        image={post.cover}
        alt={post.title}
        className="aspect-[16/10] rounded-[1.2rem] transition duration-500 group-hover:shadow-xl"
      />
      <div className="mt-5 flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-muted">
        <span className="text-accent">{post.category}</span>
        <span className="h-1 w-1 rounded-full bg-line" />
        <span>{formatDate(post.publishedAt)}</span>
      </div>
      <h3 className="mt-2 font-display text-2xl font-medium leading-snug group-hover:text-accent">{post.title}</h3>
      <p className="mt-2 line-clamp-2 text-[0.95rem] leading-relaxed text-muted">{post.excerpt}</p>
      <span className="mt-4 text-sm font-bold">Devamını oku · {post.readMinutes} dk</span>
    </Link>
  );
}
