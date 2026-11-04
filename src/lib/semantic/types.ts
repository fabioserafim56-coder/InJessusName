export type SemanticDocument = Readonly<{
  id: string;
  kind: "topic" | "book" | "stage" | "story";
  title: string;
  context: string;
  keywords: readonly string[];
  reference: string;
  bookId: string;
  chapter: number;
  verse: number;
  endVerse: number;
  text: string;
  href: string;
  sourceHref: string;
}>;

export type SemanticResult = SemanticDocument & Readonly<{ similarity: number }>;
export type SemanticWorkerReply =
  | { type: "progress"; message: string; progress?: number }
  | { type: "ready"; count: number }
  | { type: "results"; query: string; results: SemanticResult[] }
  | { type: "error"; message: string };

export const semanticModel = {
  id: "Xenova/multilingual-e5-small",
  revision: "761b726dd34fb83930e26aab4e9ac3899aa1fa78",
  source: "intfloat/multilingual-e5-small",
  sourceRevision: "614241f622f53c4eeff9890bdc4f31cfecc418b3",
  dimensions: 384,
  dtype: "q8",
  downloadMegabytes: 140,
  sha256: "f80102d3f2a1229f387d3c81909990d8945513e347b0eab049f7de3c6f98c193"
} as const;
