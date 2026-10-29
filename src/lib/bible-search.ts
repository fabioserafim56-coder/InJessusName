import "server-only";
import corpus from "@/content/bible/blivre-tr-2018.json";
import { bibleTopics, type BibleTopic, type BibleTopicPassage } from "@/content/bible/topics";

export type BibleSearchVerse = Readonly<{ bookId: string; bookName: string; chapter: number; verse: number; text: string; reference: string; href: string }>;
export type BibleTopicReading = Readonly<{ reference: string; href: string; note: string; verses: readonly BibleSearchVerse[] }>;
export type BibleSearchTopic = Readonly<{ id: string; title: string; introduction: string; readings: readonly BibleTopicReading[] }>;
export type BibleSearchResponse = Readonly<{
  query: string;
  searched: boolean;
  message: string | null;
  terms: readonly string[];
  total: number;
  page: number;
  pageCount: number;
  pageSize: number;
  results: readonly BibleSearchVerse[];
  topics: readonly BibleSearchTopic[];
  topicCount: number;
}>;

const PAGE_SIZE = 20;
const MAX_QUERY = 120;
const ignored = new Set(["a", "o", "as", "os", "de", "da", "das", "do", "dos", "e", "em", "no", "nos", "na", "nas", "um", "uma", "uns", "umas", "que", "qual", "quais", "sobre", "acerca", "biblia", "fala", "falam", "diz", "dizem", "ensina", "ensinam", "quero", "saber", "para", "por", "com"]);

export function normalizeBibleSearch(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR").replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
}

type IndexedVerse = BibleSearchVerse & { normalized: string };
let verseIndex: readonly IndexedVerse[] | undefined;
function indexVerses(): readonly IndexedVerse[] {
  if (!verseIndex) verseIndex = corpus.books.flatMap(book => book.chapters.flatMap((chapter, chapterIndex) => chapter.map((text, verseIndex) => ({
    bookId: book.id, bookName: book.name, chapter: chapterIndex + 1, verse: verseIndex + 1, text,
    reference: `${book.name} ${chapterIndex + 1}:${verseIndex + 1}`,
    href: `/biblia?livro=${book.id}&capitulo=${chapterIndex + 1}&versiculo=${verseIndex + 1}#versiculo-${verseIndex + 1}`,
    normalized: ` ${normalizeBibleSearch(text)} `
  }))));
  return verseIndex;
}

function resolveReading(passage: BibleTopicPassage): BibleTopicReading {
  const book = corpus.books.find(book => book.id === passage.bookId);
  const chapter = book?.chapters[passage.chapter - 1];
  const end = passage.endVerse ?? passage.verse;
  if (!book || !chapter || passage.verse < 1 || end < passage.verse || end > chapter.length) throw new Error(`Invalid editorial Bible reference: ${passage.bookId} ${passage.chapter}:${passage.verse}-${end}`);
  const href = `/biblia?livro=${book.id}&capitulo=${passage.chapter}&versiculo=${passage.verse}#versiculo-${passage.verse}`;
  return {
    reference: `${book.name} ${passage.chapter}:${passage.verse}${end > passage.verse ? `–${end}` : ""}`, href, note: passage.note,
    verses: chapter.slice(passage.verse - 1, end).map((text, index) => ({ bookId: book.id, bookName: book.name, chapter: passage.chapter, verse: passage.verse + index, text, reference: `${book.name} ${passage.chapter}:${passage.verse + index}`, href: `/biblia?livro=${book.id}&capitulo=${passage.chapter}&versiculo=${passage.verse + index}#versiculo-${passage.verse + index}` }))
  };
}

function topicScore(topic: BibleTopic, query: string, terms: readonly string[]): number {
  const cleaned = terms.join(" ");
  return Math.max(0, ...topic.aliases.map(alias => {
    const normalized = normalizeBibleSearch(alias);
    if (normalized === query || normalized === cleaned) return 10;
    if (` ${query} `.includes(` ${normalized} `)) return normalized.split(" ").length + 2;
    return 0;
  }));
}

export function getBibleSearch(rawQuery: string, requestedPage = 1): BibleSearchResponse {
  const query = rawQuery.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();
  const empty: BibleSearchResponse = { query, searched: Boolean(query), message: null, terms: [], total: 0, page: 1, pageCount: 0, pageSize: PAGE_SIZE, results: [], topics: [], topicCount: 0 };
  if (!query) return empty;
  if (query.length > MAX_QUERY) return { ...empty, query: query.slice(0, MAX_QUERY), message: `Use até ${MAX_QUERY} caracteres para buscar uma palavra, expressão ou tema.` };
  const normalized = normalizeBibleSearch(query);
  const allTerms = normalized.split(" ").filter(Boolean);
  const terms = [...new Set(allTerms.filter(term => !ignored.has(term)))];
  if (!terms.length && normalized === "biblia") terms.push("biblia");
  if (!terms.length || terms.every(term => term.length < 2)) return { ...empty, message: "Conte uma palavra ou um tema com pelo menos duas letras, como fé, batismo ou oração." };
  const phrase = /^\s*["“].+["”]\s*$/.test(query) ? normalized : null;
  const matches = indexVerses().filter(row => phrase ? row.normalized.includes(` ${phrase} `) : terms.every(term => row.normalized.includes(` ${term} `)));
  const pageCount = Math.ceil(matches.length / PAGE_SIZE);
  const page = Number.isSafeInteger(requestedPage) ? Math.max(1, Math.min(requestedPage, pageCount || 1)) : 1;
  const topics = bibleTopics.map(topic => ({ topic, score: topicScore(topic, normalized, terms) })).filter(item => item.score > 0).sort((a, b) => b.score - a.score || a.topic.title.localeCompare(b.topic.title, "pt-BR"));
  return {
    ...empty, terms, total: matches.length, page, pageCount,
    results: matches.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map(verse => ({ bookId: verse.bookId, bookName: verse.bookName, chapter: verse.chapter, verse: verse.verse, text: verse.text, reference: verse.reference, href: verse.href })),
    topics: topics.slice(0, 5).map(({ topic }) => ({ id: topic.id, title: topic.title, introduction: topic.introduction, readings: topic.passages.map(resolveReading) })),
    topicCount: topics.length
  };
}

/** Useful for editorial integrity checks without changing any Scripture text. */
export function validateBibleTopicReferences(): { topics: number; readings: number; verses: number } {
  let readings = 0; let verses = 0;
  for (const topic of bibleTopics) for (const passage of topic.passages) { readings++; verses += resolveReading(passage).verses.length; }
  return { topics: bibleTopics.length, readings, verses };
}
