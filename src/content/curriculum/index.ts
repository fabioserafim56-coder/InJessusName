import stages from "./stages.json";

export type CurriculumStage = {
  id: string; number: number; era: string; title: string; subtitle: string; books: string[];
  objective: string; context: string; passages: { book: string; chapter: number; verse: number; label: string }[];
  teaching: { title: string; text: string; example: string }[];
  question: { prompt: string; options: { text: string; feedback: string; correct: boolean }[] };
  connection: string;
};

export const curriculumStages: CurriculumStage[] = stages;
export function getCurriculumStage(id: string) { return curriculumStages.find(stage => stage.id === id); }
export function scriptureLink(passage: CurriculumStage["passages"][number]) {
  return `/biblia?livro=${passage.book}&capitulo=${passage.chapter}&versiculo=${passage.verse}#versiculo-${passage.verse}`;
}
