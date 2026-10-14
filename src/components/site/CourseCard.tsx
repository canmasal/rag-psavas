import Link from "next/link";
import { ArrowUpRight, Clock, Users } from "lucide-react";
import { ArtCover } from "../art";
import { CourseIcon } from "../icons";
import { formatPrice } from "@/lib/utils";

export type CourseCardData = {
  slug: string;
  title: string;
  category: string;
  shortDesc: string;
  ageRange: string;
  duration: string;
  color: string;
  icon: string;
  image: string | null;
  minPrice?: number;
};

export function CourseCard({ course }: { course: CourseCardData }) {
  return (
    <Link
      href={`/egitimlerimiz/${course.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[1.4rem] border border-line bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(23,18,31,0.35)]"
    >
      <div className="relative">
        <ArtCover seed={course.slug} color={course.color} icon={course.icon} image={course.image} alt={course.title} className="aspect-[4/3]" />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[0.7rem] font-extrabold uppercase tracking-wider text-ink backdrop-blur">
          {course.category}
        </span>
        <span className="absolute -bottom-6 right-5 grid h-12 w-12 place-items-center rounded-2xl text-white shadow-lg ring-4 ring-white" style={{ background: course.color }}>
          <CourseIcon name={course.icon} className="h-5 w-5" />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6 pt-7">
        <h3 className="flex items-start justify-between gap-3 font-display text-2xl font-medium">
          {course.title}
          <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
        </h3>
        <p className="mt-2 line-clamp-3 text-[0.92rem] leading-relaxed text-muted">{course.shortDesc}</p>
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-5 text-xs font-semibold text-ink-2">
          <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-gold" />{course.ageRange}</span>
          <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-gold" />{course.duration}</span>
        </div>
        {course.minPrice ? (
          <p className="mt-4 border-t border-line pt-4 text-sm text-muted">
            Aylık <span className="font-display text-lg font-semibold text-ink">{formatPrice(course.minPrice)}</span>&apos;den başlayan
          </p>
        ) : null}
      </div>
    </Link>
  );
}
