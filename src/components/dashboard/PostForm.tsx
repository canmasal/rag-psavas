"use client";

import { useActionState } from "react";
import { savePost } from "@/app/actions/admin";
import { FormAlert, type FormState } from "@/components/ui/FormAlert";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { ImageField } from "./ImageField";

type Post = { id: string; title: string; slug: string; excerpt: string; content: string; category: string; cover: string | null; authorName: string; published: boolean; publishedAt: Date };

export function PostForm({ post, categories }: { post?: Post; categories: string[] }) {
  const [state, action] = useActionState<FormState, FormData>(savePost, undefined);
  const cats = Array.from(new Set(["Veli Rehberi", "Sahne Sanatları", "Müzik", "Görsel Sanatlar", "Akademiden Haberler", ...categories]));
  return (
    <form action={action} className="card grid gap-5 p-6 md:grid-cols-2">
      {post && <input type="hidden" name="id" value={post.id} />}
      <div className="md:col-span-2"><label className="label" htmlFor="title">Başlık *</label><input id="title" name="title" defaultValue={post?.title} className="input !text-lg" required /></div>
      <div><label className="label" htmlFor="slug">Bağlantı adı (boşsa otomatik)</label><input id="slug" name="slug" defaultValue={post?.slug} className="input" /></div>
      <div>
        <label className="label" htmlFor="category">Kategori</label>
        <input id="category" name="category" list="cats" defaultValue={post?.category ?? "Akademiden Haberler"} className="input" />
        <datalist id="cats">{cats.map((c) => <option key={c} value={c} />)}</datalist>
      </div>
      <div className="md:col-span-2"><label className="label" htmlFor="excerpt">Özet</label><textarea id="excerpt" name="excerpt" defaultValue={post?.excerpt} rows={2} className="input" /></div>
      <div className="md:col-span-2">
        <label className="label" htmlFor="content">İçerik</label>
        <textarea id="content" name="content" defaultValue={post?.content} rows={18} className="input font-mono !text-sm" />
        <p className="mt-1 text-xs text-muted">Biçimlendirme: <code>## Başlık</code>, <code>- madde</code>, <code>1. numaralı</code>, <code>**kalın**</code>, <code>[metin](https://adres)</code>.</p>
      </div>
      <div><label className="label" htmlFor="authorName">Yazar</label><input id="authorName" name="authorName" defaultValue={post?.authorName ?? "Ragıp Savaş Sanat Akademisi"} className="input" /></div>
      <div><label className="label" htmlFor="publishedAt">Yayın tarihi</label><input id="publishedAt" name="publishedAt" type="date" defaultValue={(post?.publishedAt ?? new Date()).toISOString().slice(0, 10)} className="input" /></div>
      <div className="md:col-span-2"><ImageField name="cover" fileName="coverFile" current={post?.cover} label="Kapak görseli" /></div>
      <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" name="published" defaultChecked={post?.published ?? true} className="h-4 w-4" /> Yayında</label>
      <FormAlert state={state} className="md:col-span-2" />
      <div className="md:col-span-2"><SubmitButton pendingText="Kaydediliyor…">{post ? "Değişiklikleri Kaydet" : "Yazıyı Yayınla"}</SubmitButton></div>
    </form>
  );
}
