import "server-only";
import { firstLesson } from "@/content/lessons/primeiros-passos";
import { additionalLessons } from "@/content/courses/introductory-course";
import type { AppIconName } from "@/components/app-shell";

export type CatalogLesson = {
  id: string;
  number: number;
  title: string;
  description: string;
  minutes: number;
  category: "Fundamentos" | "Vida cristã";
  reference: string;
  activityCount: number;
  color: "mint" | "sand" | "blue" | "rose" | "lavender" | "peach";
  icon: AppIconName;
  href: string;
};

const lessonAppearance: { color: CatalogLesson["color"]; icon: AppIconName }[] = [
  { color: "blue", icon: "layers" },
  { color: "sand", icon: "spark" },
  { color: "rose", icon: "heart" },
  { color: "lavender", icon: "compass" },
  { color: "peach", icon: "profile" }
];

export function getCourseCatalog(): CatalogLesson[] {
  return [
    {
      id: "primeiros-passos", number: 1, title: "Leia com contexto", description: "Aprenda a encontrar uma passagem, conferir uma ideia e fazer boas perguntas.",
      minutes: firstLesson.estimatedMinutes.maximum, category: "Fundamentos", reference: "Atos 17:10–12", activityCount: firstLesson.game.missions.length + firstLesson.retrievalQuestions.length + 1,
      color: "mint", icon: "bible", href: "/aprender/primeiros-passos"
    },
    ...additionalLessons.map((lesson, index): CatalogLesson => ({
      id: lesson.id, number: index + 2, title: lesson.title, description: lesson.subtitle,
      minutes: lesson.estimatedMinutes, category: index < 2 ? "Fundamentos" : "Vida cristã",
      reference: lesson.passages[0].label, activityCount: lesson.activities.length,
      ...lessonAppearance[index % lessonAppearance.length], href: `/aprender/${lesson.id}`
    }))
  ];
}
