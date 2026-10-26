import type { Metadata } from "next";
import { LessonPlayer, type LessonPassage } from "@/components/lesson-player";
import { getBibleChapter, getBibleEdition } from "@/lib/bible";

export const metadata: Metadata = { title: "Primeiros passos na Bíblia — InJessusName", description: "Pratique leitura bíblica com contexto, atividades comentadas e retomada." };

function excerpt(book: string, chapter: number, start: number, end: number, label: string): LessonPassage {
  const text = getBibleChapter(book, chapter);
  if (!text) throw new Error("A edição bíblica local precisa conter as passagens da aula.");
  return { book, chapter, label, verses: text.verses.filter((verse) => verse.number >= start && verse.number <= end) };
}

export default function FirstLessonPage() {
  return <LessonPlayer mainPassage={excerpt("ACT", 17, 10, 12, "Atos 17:10–12")} transferPassage={excerpt("LUK", 10, 25, 37, "Lucas 10:25–37")} edition={getBibleEdition()} />;
}
