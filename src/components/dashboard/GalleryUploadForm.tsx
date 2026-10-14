"use client";

import { useActionState, useEffect, useRef } from "react";
import { addGalleryItem } from "@/app/actions/admin";
import { FormAlert, type FormState } from "@/components/ui/FormAlert";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function GalleryUploadForm({ categories }: { categories: string[] }) {
  const [state, action] = useActionState<FormState, FormData>(addGalleryItem, undefined);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => { if (state?.ok) ref.current?.reset(); }, [state]);
  return (
    <form ref={ref} action={action} className="space-y-4">
      <div><label className="label" htmlFor="title">Başlık</label><input id="title" name="title" className="input" placeholder="Yıl sonu bale gösterisi" /></div>
      <div>
        <label className="label" htmlFor="category">Kategori</label>
        <input id="category" name="category" list="gcats" className="input" defaultValue={categories[0]} />
        <datalist id="gcats">{categories.map((c) => <option key={c} value={c} />)}</datalist>
      </div>
      <div><label className="label" htmlFor="file">Fotoğraf</label><input id="file" type="file" name="file" accept="image/*" className="block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-sm file:font-bold file:text-white" /></div>
      <div><label className="label" htmlFor="imageUrl">veya görsel adresi</label><input id="imageUrl" name="imageUrl" className="input" placeholder="https://…" /></div>
      <div><label className="label" htmlFor="videoUrl">YouTube video bağlantısı (isteğe bağlı)</label><input id="videoUrl" name="videoUrl" className="input" placeholder="https://youtube.com/watch?v=…" /></div>
      <div><label className="label" htmlFor="order">Sıra</label><input id="order" name="order" defaultValue={0} className="input" inputMode="numeric" /></div>
      <FormAlert state={state} />
      <SubmitButton className="w-full" pendingText="Yükleniyor…">Galeriye Ekle</SubmitButton>
    </form>
  );
}
