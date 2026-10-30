import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { LearningSanctuary } from "@/components/learning-sanctuary/learning-sanctuary";
import { getCourseCatalog } from "@/lib/course-catalog";
import { curriculumStages } from "@/content/curriculum";
import { StudyPrayerAudio } from "@/components/scripture-audio/study-prayer";

export const metadata: Metadata = { title: "Aprender na Palavra — InJessusName", description: "Um caminho de estudo bíblico com propósito, passagens, exemplos, prática e aplicação à vida. Prepare o coração e abra a Palavra." };

export default function LearningPage() {
  return <AppShell active="learn" title="Seu lugar de estudo" subtitle="Conhecer a Palavra. Crescer na fé. Viver o amor."><LearningSanctuary lessons={getCourseCatalog()} stages={curriculumStages.map(({ id, number, title }) => ({ id, number, title }))} prayer={<StudyPrayerAudio />} /></AppShell>;
}
