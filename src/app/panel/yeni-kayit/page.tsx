import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { PanelHeader } from "@/components/dashboard/Shell";
import { EnrollmentForm } from "@/components/dashboard/EnrollmentForm";
import { isIyzicoEnabled } from "@/lib/payment";

export default async function NewEnrollmentPage({ searchParams }: { searchParams: Promise<{ kurs?: string; paket?: string }> }) {
  const { kurs, paket } = await searchParams;
  const user = await requireUser();
  const [courses, students] = await Promise.all([
    db.course.findMany({ where: { active: true }, orderBy: { order: "asc" }, include: { packages: { orderBy: [{ order: "asc" }, { price: "asc" }] } } }),
    db.student.findMany({ where: { userId: user.id }, orderBy: { createdAt: "asc" } }),
  ]);
  return (
    <>
      <PanelHeader title="Yeni Kayıt" description="Eğitim, paket ve öğrenci seçerek kaydınızı oluşturun." />
      <EnrollmentForm
        courses={courses.map((c) => ({
          id: c.id, slug: c.slug, title: c.title, category: c.category, color: c.color, icon: c.icon, schedule: c.schedule,
          packages: c.packages.map((p) => ({ id: p.id, name: p.name, description: p.description, price: p.price, months: p.months, popular: p.popular })),
        }))}
        students={students.map((s) => ({ id: s.id, name: s.name }))}
        defaultCourseSlug={kurs}
        defaultPackageId={paket}
        testMode={!isIyzicoEnabled()}
      />
    </>
  );
}
