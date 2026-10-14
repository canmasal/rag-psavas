import type { Metadata } from "next";
import { CheckCircle2, Gift } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { TrialForm } from "@/components/forms/TrialForm";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Ücretsiz Deneme Dersi", description: "Tüm branşlarda ücretsiz deneme dersi için hemen başvurun." };

export default async function TrialPage({ searchParams }: { searchParams: Promise<{ brans?: string }> }) {
  const { brans } = await searchParams;
  const courses = await db.course.findMany({ where: { active: true }, orderBy: { order: "asc" }, select: { slug: true, title: true } });
  return (
    <>
      <PageHero eyebrow="İlk ders bizden" title="Ücretsiz Deneme Dersi" description="Çocuğunuzun ya da kendinizin ilgi duyduğu branşı ücretsiz deneyimleyin; eğitmenlerimizle tanışın, akademimizi yakından görün." crumbs={[{ label: "Ücretsiz Deneme Dersi" }]} />
      <section className="py-16 md:py-24">
        <div className="container-rs grid gap-10 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-accent text-white"><Gift className="h-6 w-6" /></span>
            <h2 className="mt-6 text-3xl">Deneme dersinde neler olur?</h2>
            <ul className="mt-6 space-y-4">
              {[
                "Öğrenci, branşın gerçek bir dersine misafir olarak katılır.",
                "Eğitmenimiz, öğrencinin ilgisini ve seviyesini gözlemler.",
                "Ders sonrası veliyle kısa bir değerlendirme görüşmesi yapılır.",
                "Size en uygun grup, gün ve saat önerilir.",
                "Hiçbir ücret veya kayıt zorunluluğu yoktur.",
              ].map((t) => (
                <li key={t} className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" /><span className="text-muted">{t}</span></li>
              ))}
            </ul>
          </div>
          <div className="card p-6 md:p-10">
            <TrialForm courses={courses} defaultCourse={brans} />
          </div>
        </div>
      </section>
    </>
  );
}
