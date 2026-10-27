import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CourseLessonPlayer, type CoursePassage } from "@/components/course-lesson-player";
import { additionalLessons, getCourseLesson, type ScriptureReference } from "@/content/courses";
import { getBibleChapter, getBibleEdition } from "@/lib/bible";

type LessonPageProps = { params: Promise<{ lessonId: string }> };

export function generateStaticParams() {
  return additionalLessons.map((lesson) => ({ lessonId: lesson.id }));
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const lesson = getCourseLesson((await params).lessonId);
  return lesson ? { title: `${lesson.title} — InJessusName`, description: lesson.subtitle } : { title: "Estudo não encontrado — InJessusName" };
}

function passage(reference: ScriptureReference): CoursePassage {
  const chapter = getBibleChapter(reference.book, reference.chapter);
  if (!chapter) throw new Error("A referência da aula precisa existir na edição bíblica local.");
  const verses = chapter.verses.filter((verse) => verse.number >= reference.startVerse && verse.number <= reference.endVerse);
  if (!verses.length || verses[0].number !== reference.startVerse || verses.at(-1)?.number !== reference.endVerse) throw new Error("O intervalo da aula precisa existir na edição bíblica local.");
  return { ...reference, verses };
}

export default async function CourseLessonPage({ params }: LessonPageProps) {
  const lesson = getCourseLesson((await params).lessonId);
  if (!lesson) notFound();
  const references = [...lesson.passages, ...lesson.workedExample.sourceRefs, ...lesson.guidedPractice.sourceRefs, ...lesson.cards.flatMap((card) => card.sourceRefs), ...lesson.activities.flatMap((activity) => activity.sourceRefs)];
  const unique = new Map(references.map((reference) => [`${reference.book}-${reference.chapter}-${reference.startVerse}-${reference.endVerse}`, reference]));
  const index = additionalLessons.findIndex((candidate) => candidate.id === lesson.id);
  const next = additionalLessons[index + 1];
  return <CourseLessonPlayer key={lesson.id} lesson={lesson} passages={[...unique.values()].map(passage)} edition={getBibleEdition()} nextLesson={next ? { id: next.id, title: next.title } : null} />;
}
