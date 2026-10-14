import {
  Brush, Drama, Drum, Footprints, Guitar, MicVocal, Music, Palette, PersonStanding, Piano, Shapes, Shield,
  Sparkles, Sun, Theater, Wind, type LucideIcon,
} from "lucide-react";

export const courseIcons: Record<string, LucideIcon> = {
  Brush, Drama, Drum, Footprints, Guitar, MicVocal, Music, Palette, PersonStanding, Piano, Shapes, Shield,
  Sparkles, Sun, Theater, Wind,
};

export function CourseIcon({ name, className, strokeWidth }: { name: string; className?: string; strokeWidth?: number }) {
  const Icon = courseIcons[name] ?? Sparkles;
  return <Icon className={className} strokeWidth={strokeWidth ?? 1.75} />;
}
