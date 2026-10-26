import "server-only";
import corpus from "@/content/bible/blivre-tr-2018.json";
import edition from "@/content/bible/edition.json";

export type BibleBook = { id: string; name: string; chapters: number };
export type BibleLocation = { bookId: string; chapter: number };
export type BibleChapter = {
  book: BibleBook;
  chapter: number;
  verses: { number: number; text: string }[];
  edition: typeof edition;
  prev: BibleLocation | null;
  next: BibleLocation | null;
};

const books: BibleBook[] = corpus.books.map((book) => ({ id: book.id, name: book.name, chapters: book.chapters.length }));

export function getBibleBooks(): BibleBook[] {
  return books.map((book) => ({ ...book }));
}

export function getBibleEdition() {
  return { ...edition };
}

export function getBibleChapter(bookId: string, chapter: number): BibleChapter | null {
  if (!Number.isSafeInteger(chapter) || chapter < 1) return null;
  const index = books.findIndex((book) => book.id === bookId);
  if (index < 0 || chapter > books[index].chapters) return null;
  const book = books[index];
  const prev = chapter > 1 ? { bookId, chapter: chapter - 1 } : index > 0 ? { bookId: books[index - 1].id, chapter: books[index - 1].chapters } : null;
  const next = chapter < book.chapters ? { bookId, chapter: chapter + 1 } : index < books.length - 1 ? { bookId: books[index + 1].id, chapter: 1 } : null;
  return {
    book: { ...book }, chapter,
    verses: corpus.books[index].chapters[chapter - 1].map((text, verseIndex) => ({ number: verseIndex + 1, text })),
    edition: getBibleEdition(), prev, next
  };
}
