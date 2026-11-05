import Fuse from "fuse.js";
import { getMuseumExhibit } from "@/content/museum";
import { getMuseumObservations } from "@/content/multimodal/museum";

export type CatalogueMatch = { id: string; title: string; text: string; sourceIndexes: readonly number[] };
const stopWords = new Set("a o as os de da do das dos um uma uns umas que qual quais quem como quando onde essa esse esta este isso isto ela ele na no nas nos e em para por com sobre foi ser tem posso quero saber me minha meu imagem peca fotografia".split(" "));
const normalize = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

/** Retrieves existing editorial paragraphs; never constructs a historical answer. */
export function searchMuseumCatalogue(exhibitId: string, question: string): CatalogueMatch[] {
  const exhibit = getMuseumExhibit(exhibitId);
  if (!exhibit) return [];
  const allSources = exhibit.sources.map((_, index) => index);
  const entries: CatalogueMatch[] = [
    { id: "identificacao", title: "Data, lugar e coleção", text: `${exhibit.approxDate}. ${exhibit.period}. ${exhibit.place}. ${exhibit.collection}. ${exhibit.introduction}`, sourceIndexes: allSources },
    ...getMuseumObservations(exhibitId).map(point => ({ id: point.id, title: point.label, text: `${point.explanation} ${point.answer}`, sourceIndexes: point.sourceIndexes })),
    ...exhibit.whatItShows.map((text, index) => ({ id: `evidencia-${index}`, title: "O que a documentação permite dizer", text, sourceIndexes: allSources })),
    ...exhibit.limits.map((text, index) => ({ id: `limite-${index}`, title: "Um cuidado ao interpretar a peça", text, sourceIndexes: allSources })),
    ...exhibit.bibleConnections.map((connection, index) => ({ id: `biblia-${index}`, title: connection.label, text: connection.explanation, sourceIndexes: allSources }))
  ];
  const words = [...new Set(normalize(question.slice(0, 500)).match(/[a-z0-9]+/g) ?? [])].filter(word => word.length > 2 && !stopWords.has(word));
  if (!words.length) return [];
  const normalized = entries.map(entry => ({ ...entry, searchable: normalize(`${entry.title} ${entry.text}`) }));
  const search = new Fuse(normalized, { keys: ["searchable"], includeScore: true, threshold: .24, ignoreLocation: true, minMatchCharLength: 3 });
  const matches = new Map<string, { entry: CatalogueMatch; hits: number; score: number }>();
  for (const word of words) for (const result of search.search(word)) {
    const current = matches.get(result.item.id);
    matches.set(result.item.id, { entry: result.item, hits: (current?.hits ?? 0) + 1, score: Math.min(current?.score ?? 1, result.score ?? 1) });
  }
  return [...matches.values()].sort((a, b) => b.hits - a.hits || a.score - b.score).slice(0, 3).map(match => match.entry);
}
