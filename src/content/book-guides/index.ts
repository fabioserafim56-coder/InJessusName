import "server-only";
import data from "./guides.json";
import { getBibleBooks } from "@/lib/bible";

export type BookGuide = {
  id: string; number: number; name: string; chapters: number; genre: string; themes: string[];
  category: string; testament: string; overview: string[]; connection: string; example: string;
  question: { prompt: string; answer: string };
  readings: { chapter: number; verse: number; endVerse: number; note: string }[];
};
export type BookGuideSummary = Pick<BookGuide, "id" | "number" | "name" | "chapters" | "genre" | "themes" | "category" | "testament">;
const books = getBibleBooks();
const guides: BookGuide[] = data.map(guide => {
  const book = books.find(item => item.id === guide.id);
  if (!book) throw new Error(`Unknown book guide: ${guide.id}`);
  return { ...guide, name: book.name, chapters: book.chapters };
});
export function getBookGuide(id: string): BookGuide | undefined { return guides.find(guide => guide.id === id); }
export function getBookGuideSummaries(): BookGuideSummary[] {
  return guides.map(({ id, number, name, chapters, genre, themes, category, testament }) => ({ id, number, name, chapters, genre, themes, category, testament }));
}
