import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { PageHero } from "@/components/ui/PageHero";
import { InstructorCard } from "@/components/site/InstructorCard";

export const metadata: Metadata = { title: "Eğitmenlerimiz", description: "Konservatuvar ve güzel sanatlar mezunu, alanında deneyimli eğitmen kadromuz." };

export default async function InstructorsPage() {
  const items = await db.instructor.findMany({ where: { active: true }, orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  return (
    <>
      <PageHero eyebrow="Kadromuz" title="Eğitmenlerimiz" description="Konservatuvar ve güzel sanatlar fakültesi mezunu, sahne ve eğitim deneyimine sahip uzman kadromuzla tanışın." crumbs={[{ href: "/hakkimizda", label: "Kurumsal" }, { label: "Eğitmenlerimiz" }]} />
      <section className="py-16 md:py-24">
        <div className="container-rs">
          {items.length > 0 ? (
            <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">{items.map((t) => <InstructorCard key={t.id} t={t} />)}</div>
          ) : (
            <div className="mx-auto max-w-xl text-center">
              <p className="font-display text-2xl">Eğitmen kadromuz çok yakında burada.</p>
              <p className="mt-2 text-muted">Eğitmenlerimiz hakkında bilgi almak için bizimle iletişime geçebilirsiniz.</p>
              <Link href="/iletisim" className="btn btn-dark mt-6">İletişim</Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
