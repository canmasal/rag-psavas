import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { PageHero } from "@/components/ui/PageHero";
import { CourseCard } from "@/components/site/CourseCard";
import { CATEGORIES } from "@/data/courses";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Eğitimlerimiz",
  description: "Klasik bale, müzikal tiyatro, yaratıcı drama, dans, piyano, keman, gitar, bateri, şan, yan flüt, resim, seramik, Mix Art, jimnastik, aikido ve yaz okulu.",
};

export default async function CoursesPage({ searchParams }: { searchParams: Promise<{ kategori?: string }> }) {
  const { kategori } = await searchParams;
  const courses = await db.course.findMany({
    where: { active: true, ...(kategori ? { category: kategori } : {}) },
    orderBy: { order: "asc" },
    include: { packages: { orderBy: { price: "asc" } } },
  });

  return (
    <>
      <PageHero
        eyebrow="Eğitimlerimiz"
        title="Sahne, müzik ve görsel sanatlarda 15+ branş"
        description="Çocuk, genç ve yetişkinlere yönelik tüm programlarımızı inceleyin; size en uygun eğitimi seçip online kaydınızı oluşturun."
        crumbs={[{ label: "Eğitimlerimiz" }]}
      />
      <section className="py-14 md:py-20">
        <div className="container-rs">
          <div className="flex flex-wrap gap-2">
            {[undefined, ...CATEGORIES].map((c) => (
              <Link
                key={c ?? "all"}
                href={c ? `/egitimlerimiz?kategori=${encodeURIComponent(c)}` : "/egitimlerimiz"}
                className={cn(
                  "rounded-full border px-5 py-2.5 text-sm font-bold transition",
                  kategori === c ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink",
                )}
              >
                {c ?? "Tümü"}
              </Link>
            ))}
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => (
              <CourseCard key={c.slug} course={{ ...c, minPrice: c.packages.find((p) => p.months === 1)?.price }} />
            ))}
          </div>
          {courses.length === 0 && <p className="py-20 text-center text-muted">Bu kategoride henüz eğitim bulunmuyor.</p>}
        </div>
      </section>
    </>
  );
}
