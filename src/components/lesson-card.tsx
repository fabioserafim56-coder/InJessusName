import Link from "next/link";
import { AppIcon } from "@/components/app-shell";
import type { CatalogLesson } from "@/lib/course-catalog";

export function LessonCard({ lesson }: { lesson: CatalogLesson }) {
  return <Link href={lesson.href} className={`lesson-card lesson-color-${lesson.color}`} aria-label={`Abrir aula: ${lesson.title}`}>
    <div className="lesson-card-art" aria-hidden="true"><span className="lesson-art-orbit" /><span className="lesson-art-mark"><AppIcon name={lesson.icon} /></span><span className="lesson-art-reference">{lesson.reference}</span><span className="lesson-art-index">{String(lesson.number).padStart(2, "0")}</span></div>
    <div className="lesson-card-body"><div className="lesson-card-meta"><span>{lesson.category}</span><span><AppIcon name="clock" />{lesson.minutes} min</span></div><h3>{lesson.title}</h3><p>{lesson.description}</p><div className="lesson-card-bottom"><span>{lesson.activityCount} atividades para praticar</span><span className="lesson-open-arrow"><AppIcon name="arrow" /></span></div></div>
  </Link>;
}
