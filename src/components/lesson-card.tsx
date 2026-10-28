import Link from "next/link";
import { ArrowUpRight, Clock } from "@phosphor-icons/react/ssr";
import { AppIcon } from "@/components/app-shell";
import type { CatalogLesson } from "@/lib/course-catalog";

export function LessonCard({ lesson }: { lesson: CatalogLesson }) {
  const referenceBreak = lesson.reference.lastIndexOf(" ");
  const referenceBook = referenceBreak < 0 ? "" : lesson.reference.slice(0, referenceBreak);
  const referencePassage = referenceBreak < 0 ? lesson.reference : lesson.reference.slice(referenceBreak + 1);
  return <Link href={lesson.href} className={`lesson-card lesson-color-${lesson.color}`} aria-label={`Abrir estudo: ${lesson.title}`}>
    <div className="lesson-card-art" aria-hidden="true"><span className="lesson-art-lines" /><span className="lesson-art-index">{String(lesson.number).padStart(2, "0")}</span><span className="lesson-art-mark"><AppIcon name={lesson.icon} /></span><span className="lesson-art-reference">{referenceBook}{referenceBook && " "}<span className="lesson-art-passage">{referencePassage}</span></span><span className="lesson-art-caption">ENCONTROS NA PALAVRA</span></div>
    <div className="lesson-card-body"><div className="lesson-card-meta"><span>{lesson.category}</span><span title="Uma estimativa para organizar seu tempo; você pode permanecer e reler."><Clock size={14} aria-hidden="true" />{lesson.minutes} min</span></div><h3>{lesson.title}</h3><p>{lesson.description}</p><div className="lesson-card-bottom"><span>{lesson.activityCount} momentos para participar</span><span className="lesson-open-arrow"><ArrowUpRight size={19} aria-hidden="true" /></span></div></div>
  </Link>;
}
