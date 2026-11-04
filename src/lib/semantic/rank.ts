import type { SemanticDocument, SemanticResult } from "./types";

/** Actual cosine retrieval over L2-normalized E5 embeddings, with one result per passage. */
export function rankSemanticDocuments(query: ArrayLike<number>, vectors: Float32Array, documents: readonly SemanticDocument[], dimensions = 384, limit = 6): SemanticResult[] {
  if (query.length !== dimensions || vectors.length !== documents.length * dimensions) throw new Error("O índice de leituras está incompleto.");
  let norm = 0;
  for (let index = 0; index < dimensions; index++) {
    if (!Number.isFinite(query[index])) throw new Error("Não foi possível compreender esta consulta.");
    norm += query[index] * query[index];
  }
  norm = Math.sqrt(norm);
  if (!norm) throw new Error("Escreva uma pergunta para procurar uma leitura.");
  const ranked = documents.map((document, index) => {
    let similarity = 0;
    for (let dimension = 0; dimension < dimensions; dimension++) similarity += query[dimension] / norm * vectors[index * dimensions + dimension];
    return { ...document, similarity };
  }).sort((first, second) => second.similarity - first.similarity || first.id.localeCompare(second.id));
  const seen = new Set<string>();
  return ranked.filter(document => {
    if (seen.has(document.href)) return false;
    seen.add(document.href);
    return true;
  }).slice(0, limit);
}
