import type { Metadata } from "next";
import { FocusShell } from "@/components/focus-shell";
import { LearningSanctuary } from "@/components/learning-sanctuary/learning-sanctuary";
import { getCourseCatalog } from "@/lib/course-catalog";
import { curriculumStages } from "@/content/curriculum";
import { StudyPrayerAudio } from "@/components/scripture-audio/study-prayer";
import { MultimodalEntry } from "@/components/multimodal/multimodal-entry";

export const metadata: Metadata = { title: "Aprender na Palavra — InJessusName", description: "Um caminho de estudo bíblico com propósito, passagens, exemplos, prática e aplicação à vida. Prepare o coração e abra a Palavra." };

export default function LearningPage() {
  return <FocusShell title="Seu lugar na Palavra" subtitle="Conhecer. Crescer. Viver o amor." backHref="/" backLabel="Início" className="learning-focus-shell"><LearningSanctuary lessons={getCourseCatalog()} stages={curriculumStages.map(({ id, number, title }) => ({ id, number, title }))} prayer={<StudyPrayerAudio />} /><MultimodalEntry /></FocusShell>;
}
