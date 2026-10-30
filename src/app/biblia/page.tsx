import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BibleReader } from "@/components/bible-reader";
import { getBibleBooks, getBibleChapter } from "@/lib/bible";
import { getBibleSearch } from "@/lib/bible-search";
import { BibleSearch } from "@/components/bible/bible-search";
import corpus from "@/content/bible/blivre-tr-2018.json";

export const metadata: Metadata = {
  title: "Leia a Bíblia — InJessusName",
  description: "Pesquise palavras e temas nos 66 livros desta edição, confira passagens e leia a Bíblia com texto ajustável."
};

type QueryValue = string | string[] | undefined;

function single(value: QueryValue, fallback?: string): string | undefined {
  if (value === undefined) return fallback;
  if (typeof value !== "string" || value.length === 0) notFound();
  return value;
}

function positiveInteger(value: string | undefined): number | undefined {
  if (value === undefined) return undefined;
  if (!/^[1-9]\d{0,2}$/.test(value)) notFound();
  return Number(value);
}

export default async function BiblePage({ searchParams }: {
  searchParams: Promise<Record<string, QueryValue>>;
}) {
  const query = await searchParams;
  const bookId = single(query.livro, "JHN")!;
  const chapterNumber = positiveInteger(single(query.capitulo, "1"))!;
  const highlightedVerse = positiveInteger(single(query.versiculo));
  const books = getBibleBooks();
  if (!books.some((book) => book.id === bookId)) notFound();
  const chapter = getBibleChapter(bookId, chapterNumber);
  if (!chapter) notFound();
  if (highlightedVerse !== undefined && !chapter.verses.some((verse) => verse.number === highlightedVerse)) notFound();

  const churchMode = query.modo === "igreja";
  const initialBookOpen = query.livroaberto === "1";
  const initialTheme = query.tema === "sepia" || query.tema === "noturno" ? query.tema : "claro";
  const requestedFont = typeof query.fonte === "string" ? Number(query.fonte) : 24;
  const initialFontSize = Number.isInteger(requestedFont) ? Math.max(20, Math.min(38, requestedFont)) : 24;
  const verseCounts = Object.fromEntries(corpus.books.map(book => [book.id, book.chapters.map(verses => verses.length)]));
  const searchQuery = typeof query.busca === "string" ? query.busca : "";
  const searchPage = typeof query.pagina === "string" && /^[1-9]\d{0,5}$/.test(query.pagina) ? Number(query.pagina) : 1;
  const search = churchMode ? null : getBibleSearch(searchQuery, searchPage);
  return <BibleReader key={`${bookId}-${chapterNumber}-${churchMode}-${initialBookOpen}`} books={books} chapter={chapter} highlightedVerse={highlightedVerse} churchMode={churchMode} initialBookOpen={initialBookOpen} initialTheme={initialTheme} initialFontSize={initialFontSize} verseCounts={verseCounts} searchPanel={search ? <BibleSearch search={search} /> : null} />;
}
