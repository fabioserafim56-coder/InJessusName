import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BibleReader } from "@/components/bible-reader";
import { getBibleBooks, getBibleChapter } from "@/lib/bible";
import { getBibleSearch } from "@/lib/bible-search";
import { BibleSearch } from "@/components/bible/bible-search";

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

  const searchQuery = typeof query.busca === "string" ? query.busca : "";
  const searchPage = typeof query.pagina === "string" && /^[1-9]\d{0,5}$/.test(query.pagina) ? Number(query.pagina) : 1;
  const search = getBibleSearch(searchQuery, searchPage);
  return <BibleReader key={`${bookId}-${chapterNumber}`} books={books} chapter={chapter} highlightedVerse={highlightedVerse} searchPanel={<BibleSearch search={search} />} />;
}
