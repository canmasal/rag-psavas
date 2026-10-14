import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}) {
  return (
    <div className={cn(align === "center" && "mx-auto text-center", "max-w-2xl", className)}>
      {eyebrow && <p className={cn("eyebrow", light && "text-gold", align === "center" && "justify-center")}>{eyebrow}</p>}
      <h2 className={cn("mt-3 text-3xl font-medium leading-tight md:text-5xl", light && "text-white")}>{title}</h2>
      {description && <p className={cn("mt-4 text-lg leading-relaxed", light ? "text-white/70" : "text-muted")}>{description}</p>}
    </div>
  );
}
