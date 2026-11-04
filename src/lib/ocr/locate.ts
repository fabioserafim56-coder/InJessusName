import "server-only";
import corpus from "@/content/bible/blivre-tr-2018.json";
import type { LocatedPassage, LocateResponse } from "./types";

const aliases: Record<string, readonly string[]> = {
  GEN: ["gn", "gen"], EXO: ["ex", "exo"], LEV: ["lv", "lev"], NUM: ["nm", "num"], DEU: ["dt", "deut"],
  JOS: ["js", "jos"], JDG: ["jz", "juizes"], RUT: ["rt", "rute"], "1SA": ["1 sm", "1 samuel"], "2SA": ["2 sm", "2 samuel"],
  "1KI": ["1 rs", "1 reis"], "2KI": ["2 rs", "2 reis"], "1CH": ["1 cr", "1 cronicas"], "2CH": ["2 cr", "2 cronicas"],
  EZR: ["ed", "esd", "esdras"], NEH: ["ne", "neemias"], EST: ["et", "ester"], JOB: ["jo", "job"], PSA: ["sl", "salmo", "salmos", "ps"],
  PRO: ["pv", "proverbios"], ECC: ["ec", "eclesiastes"], SNG: ["ct", "cantares", "canticos", "cantico dos canticos"], ISA: ["is", "isaias"],
  JER: ["jr", "jeremias"], LAM: ["lm", "lamentacoes"], EZK: ["ez", "ezequiel"], DAN: ["dn", "daniel"], HOS: ["os", "oseias"],
  JOL: ["jl", "joel"], AMO: ["am", "amos"], OBA: ["ob", "obadias"], JON: ["jn", "jonas"], MIC: ["mq", "miqueias"],
  NAM: ["na", "naum"], HAB: ["hc", "habacuque"], ZEP: ["sf", "sofonias"], HAG: ["ag", "ageu"], ZEC: ["zc", "zacarias"], MAL: ["ml", "malaquias"],
  MAT: ["mt", "mateus"], MRK: ["mc", "marcos"], LUK: ["lc", "lucas"], JHN: ["jo", "joao", "joh"], ACT: ["at", "atos"],
  ROM: ["rm", "romanos"], "1CO": ["1 co", "1 corintios"], "2CO": ["2 co", "2 corintios"], GAL: ["gl", "galatas"], EPH: ["ef", "efesios"],
  PHP: ["fp", "filipenses"], COL: ["cl", "colossenses"], "1TH": ["1 ts", "1 tessalonicenses"], "2TH": ["2 ts", "2 tessalonicenses"],
  "1TI": ["1 tm", "1 timoteo"], "2TI": ["2 tm", "2 timoteo"], TIT: ["tt", "tito"], PHM: ["fm", "filemom", "filemon"],
  HEB: ["hb", "hebreus"], JAS: ["tg", "tiago"], "1PE": ["1 pe", "1 pedro"], "2PE": ["2 pe", "2 pedro"],
  "1JN": ["1 jo", "1 joao"], "2JN": ["2 jo", "2 joao"], "3JN": ["3 jo", "3 joao"], JUD: ["jd", "judas"], REV: ["ap", "apocalipse"]
};

export function normalizeOcrText(text: string): string {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/\b(iii|ii|i)\s+(?=(?:joao|pedro|timoteo|corintios|tessalonicenses|reis|cronicas|samuel)\b)/g, prefix => `${prefix.trim().length} `)
    .replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();
}

const aliasBooks = new Map<string, typeof corpus.books>();
for (const book of corpus.books) {
  for (const alias of new Set([book.name, book.id, ...(aliases[book.id] ?? [])].map(normalizeOcrText))) {
    aliasBooks.set(alias, [...(aliasBooks.get(alias) ?? []), book]);
  }
}
const escapedAliases = [...aliasBooks.keys()].sort((a, b) => b.length - a.length)
  .map(alias => alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s*"));
const referencePattern = new RegExp(`(?:^|[^\\p{L}\\p{N}])(${escapedAliases.join("|")})\\s*(?:cap(?:itulo)?\\.?\\s*)?(\\d{1,3})(?:\\s*(?::|\\.|,|v(?:ersiculo)?s?\\.?)\\s*(\\d{1,3})(?:\\s*[-–—]\\s*(\\d{1,3}))?)?(?!\\d)`, "gu");
const edition = "Bíblia Livre · TR 2018 · CC BY 3.0 Brasil";

function passage(book: typeof corpus.books[number], chapter: number, verse: number, endVerse: number, reason: string): LocatedPassage {
  return {
    bookId: book.id, bookName: book.name, chapter, verse, endVerse,
    reference: `${book.name} ${chapter}:${verse}${endVerse > verse ? `–${endVerse}` : ""}`,
    href: `/biblia?livro=${book.id}&capitulo=${chapter}&versiculo=${verse}#versiculo-${verse}`,
    reason,
    verses: book.chapters[chapter - 1].slice(verse - 1, Math.min(endVerse, verse + 2)).map((text, index) => ({ number: verse + index, text }))
  };
}

const stopwords = new Set("a o as os e de da do das dos em na no nas nos um uma uns umas que por para com se ao aos sua suas seu seus lhe lhes ele ela eles elas eu tu nos vos meu meus minha minhas este esta isto esse essa isso aquele aquela porque como nao mas mais foi era sao ser tem uma muito todo todos toda todas pelo pela pelos pelas".split(" "));
const words = (text: string) => normalizeOcrText(text).replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(word => word.length > 2 && !stopwords.has(word));
type SearchableVerse = { book: typeof corpus.books[number]; chapter: number; verse: number; normalized: string; words: readonly string[]; tokens: Set<string>; pairs: Set<string> };
let textIndex: readonly SearchableVerse[] | undefined;
function index(): readonly SearchableVerse[] {
  if (!textIndex) textIndex = corpus.books.flatMap(book => book.chapters.flatMap((chapter, chapterIndex) => chapter.map((text, verseIndex) => {
    const terms = words(text);
    return { book, chapter: chapterIndex + 1, verse: verseIndex + 1, normalized: normalizeOcrText(text).replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " "), words: terms, tokens: new Set(terms), pairs: new Set(terms.slice(1).map((term, i) => `${terms[i]} ${term}`)) };
  })));
  return textIndex;
}

export function locateScripture(raw: string): LocateResponse {
  const text = raw.slice(0, 4000).trim();
  const empty: LocateResponse = { method: "none", candidates: [], edition, message: "Não encontramos uma correspondência segura. Confira o texto reconhecido ou escreva uma referência, como João 3:16." };
  if (!text) return { ...empty, message: "Reconheça uma imagem ou escreva o trecho que deseja encontrar." };
  const normalized = normalizeOcrText(text);
  const references = [...normalized.matchAll(referencePattern)];
  if (references.length > 0) {
    const found = new Map<string, LocatedPassage>();
    for (const match of references) {
      const alias = match[1].replace(/\s+/g, " ");
      let books = aliasBooks.get(alias) ?? [...aliasBooks.entries()].find(([key]) => key.replace(/\s/g, "") === alias.replace(/\s/g, ""))?.[1] ?? [];
      if (alias === "jo" && /\bjó\s*\d/iu.test(text)) books = books.filter(book => book.id === "JOB");
      const chapter = Number(match[2]);
      for (const book of books) {
        const verses = book.chapters[chapter - 1];
        const verse = match[3] ? Number(match[3]) : 1;
        const endVerse = match[4] ? Number(match[4]) : match[3] ? verse : verses?.length ?? 0;
        if (!verses || verse < 1 || endVerse < verse || endVerse > verses.length) continue;
        const result = passage(book, chapter, verse, endVerse, match[3] ? "Referência encontrada no texto reconhecido." : "Capítulo encontrado; abra para acompanhar a leitura inteira.");
        found.set(`${book.id}.${chapter}.${verse}`, result);
      }
    }
    const candidates = [...found.values()].slice(0, 5);
    return candidates.length ? { method: "reference", candidates, edition, message: candidates.length > 1 ? "Confira qual destas passagens corresponde à sua página." : "Encontramos esta referência. Compare o trecho antes de abrir." } : { ...empty, message: "A referência reconhecida não existe nesta edição. Confira o nome do livro e os números do capítulo e do versículo." };
  }
  const terms = words(text);
  const tokens = new Set(terms);
  if (tokens.size < 5 || text.length < 28) return empty;
  const query = normalized.replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ");
  const pairs = new Set(terms.slice(1).map((term, i) => `${terms[i]} ${term}`));
  const ranked = index().flatMap(row => {
    const direct = row.normalized.length >= 28 && query.includes(row.normalized);
    const shared = [...row.tokens].filter(token => tokens.has(token)).length;
    const sharedPairs = [...row.pairs].filter(pair => pairs.has(pair)).length;
    const coverage = shared / Math.min(tokens.size, row.tokens.size || 1);
    if (!direct && (shared < 5 || sharedPairs < 3 || coverage < .7)) return [];
    return [{ row, score: direct ? 2 + row.words.length / 1000 : coverage + sharedPairs / Math.max(row.pairs.size, 1) }];
  }).sort((a, b) => b.score - a.score).slice(0, 5);
  const candidates = ranked.map(({ row }) => passage(row.book, row.chapter, row.verse, row.verse, "Trecho semelhante encontrado na edição do aplicativo. Confira a correspondência."));
  return candidates.length ? { method: "text", candidates, edition, message: "Estas são correspondências prováveis de texto. A tradução fotografada pode usar outras palavras; compare as passagens." } : empty;
}
