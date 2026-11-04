import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = fileURLToPath(new URL("../", import.meta.url));
const require = createRequire(import.meta.url);
const modelRoot = process.env.INJESSUS_E5_MODEL_DIR || "/tmp/injessus-e5-model";
const out = path.join(root, "public/semantic");
const hash = value => createHash("sha256").update(value).digest("hex");
const json = async relative => JSON.parse(await readFile(path.join(root, relative), "utf8"));
const corpus = await json("src/content/bible/blivre-tr-2018.json");
const guides = await json("src/content/book-guides/guides.json");
const stages = await json("src/content/curriculum/stages.json");
const compiled = new Map();
async function loadContent(relative) {
  if (compiled.has(relative)) return compiled.get(relative);
  const source = await readFile(path.join(root, relative), "utf8");
  const javascript = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  const loaded = { exports: {} };
  const miracles = relative.endsWith("stories/index.ts") ? await loadContent("src/content/stories/miracle-stories.ts") : null;
  new Function("require", "module", "exports", javascript)(specifier => specifier === "./miracle-stories" ? miracles : require(specifier), loaded, loaded.exports);
  compiled.set(relative, loaded.exports);
  return loaded.exports;
}
const { bibleTopics } = await loadContent("src/content/bible/topics.ts");
const { biblicalStories } = await loadContent("src/content/stories/index.ts");
const documents = [];
function add(kind, id, title, context, sourceHref, reference) {
  const bookId = reference.bookId || reference.book;
  const book = corpus.books.find(item => item.id === bookId);
  const chapter = book?.chapters[reference.chapter - 1];
  const verse = reference.verse || 1;
  const endVerse = reference.endVerse || verse;
  if (!chapter || verse < 1 || endVerse < verse || endVerse > chapter.length) throw new Error(`Passagem inválida: ${id}`);
  documents.push({ id, kind, title, context, keywords: reference.keywords || [], sourceHref, reference: `${book.name} ${reference.chapter}:${verse}${endVerse > verse ? `–${endVerse}` : ""}`, bookId, chapter: reference.chapter, verse, endVerse, text: chapter.slice(verse - 1, endVerse).join(" "), href: `/biblia?livro=${bookId}&capitulo=${reference.chapter}&versiculo=${verse}#versiculo-${verse}` });
}
for (const topic of bibleTopics) topic.passages.forEach((reference, index) => add("topic", `topic-${topic.id}-${index}`, topic.title, `${topic.introduction} ${reference.note}`, `/biblia?busca=${encodeURIComponent(topic.title)}#busca-biblica`, { ...reference, keywords: topic.aliases }));
for (const guide of guides) {
  const book = corpus.books.find(item => item.id === guide.id);
  guide.readings.forEach((reference, index) => add("book", `book-${guide.id}-${index}`, `${book.name}: ${guide.themes.join(", ")}`, `${reference.note} ${guide.connection}`, `/biblioteca/${guide.id}`, { ...reference, bookId: guide.id, keywords: guide.themes }));
}
for (const stage of stages) stage.passages.forEach((reference, index) => add("stage", `stage-${stage.id}-${index}`, stage.title, `${stage.objective} ${stage.context}`, `/percurso/${stage.id}`, reference));
for (const story of biblicalStories) story.scenes.forEach((scene, index) => add("story", `story-${story.id}-${index}`, `${story.title}: ${scene.title}`, `${scene.text} ${scene.observe}`, `/historias/${story.id}`, { ...scene.reference, keywords: [story.theme] }));

const embeddedText = document => `passage: ${document.title}. Assuntos: ${document.keywords.join(", ")}. ${document.context.slice(0, 700)} ${document.reference}. ${document.text}`;
const model = {
  id: "Xenova/multilingual-e5-small", revision: "761b726dd34fb83930e26aab4e9ac3899aa1fa78",
  original: "intfloat/multilingual-e5-small", originalRevision: "614241f622f53c4eeff9890bdc4f31cfecc418b3",
  dtype: "q8", dimensions: 384, pooling: "mean", normalize: true,
  weightsSha256: "f80102d3f2a1229f387d3c81909990d8945513e347b0eab049f7de3c6f98c193",
  tokenizerSha256: "0b44a9d7b51c3c62626640cda0e2c2f70fdacdc25bbbd68038369d14ebdf4c39"
};
const testQueries = [
  { query: "Como perdoar alguém que me machucou?", expectedBooks: ["MAT", "LUK", "EPH"] },
  { query: "Estou muito preocupado e não consigo descansar.", expectedBooks: ["MAT", "PHP", "1PE", "PSA"] },
  { query: "Por que Jesus multiplicou os pães?", expectedBooks: ["JHN", "MRK", "MAT"] },
  { query: "Como a Bíblia ensina a cuidar dos pobres?", expectedBooks: ["MIC", "ISA", "MAT", "JAM", "DEU"] },
  { query: "Perdi alguém querido e preciso de consolo.", expectedBooks: ["JHN", "PSA", "1TH", "REV"] },
  { query: "O que significa ser batizado?", expectedBooks: ["MAT", "ACT", "ROM"] },
  { query: "Como aprender a orar a Deus?", expectedBooks: ["MAT", "LUK", "PHP", "PSA"] },
  { query: "Quem criou o mundo e a humanidade?", expectedBooks: ["GEN", "PSA", "JHN"] },
  { query: "Jesus tem poder sobre a tempestade?", expectedBooks: ["MRK", "MAT", "LUK", "PSA"] },
  { query: "Como amar e ajudar uma pessoa ferida?", expectedBooks: ["LUK", "MAT", "1CO", "JAM"] }
];
await mkdir(out, { recursive: true });
const docsBytes = Buffer.from(JSON.stringify(documents));
await writeFile(path.join(out, "documents.json"), docsBytes);
if (process.argv.includes("--documents-only")) {
  console.log(JSON.stringify({ documents: documents.length, books: new Set(documents.map(item => item.bookId)).size }));
  process.exit(0);
}
if (hash(await readFile(path.join(modelRoot, "onnx/model_quantized.onnx"))) !== model.weightsSha256 || hash(await readFile(path.join(modelRoot, "tokenizer.json"))) !== model.tokenizerSha256) throw new Error("Modelo ou tokenizer divergem da revisão documentada.");
const { pipeline, env } = await import("@huggingface/transformers");
env.allowRemoteModels = false;
env.allowLocalModels = true;
const encoder = await pipeline("feature-extraction", modelRoot, { dtype: "q8", device: "cpu", local_files_only: true });
const vectors = new Float32Array(documents.length * model.dimensions);
const started = Date.now();
for (let offset = 0; offset < documents.length; offset += 4) {
  const batch = documents.slice(offset, offset + 4).map(embeddedText);
  const output = await encoder(batch, { pooling: "mean", normalize: true, truncation: true, max_length: 512 });
  if (output.dims[1] !== model.dimensions) throw new Error("Dimensão E5 inesperada.");
  vectors.set(output.data, offset * model.dimensions);
  if (offset % 40 === 0) console.log(`E5: ${Math.min(offset + 4, documents.length)}/${documents.length} entradas`, ((Date.now() - started) / 1000).toFixed(1), "s");
}
const vectorsBytes = Buffer.from(vectors.buffer);
await writeFile(path.join(out, "vectors.f32"), vectorsBytes);
const checks = [];
for (const item of testQueries) {
  const output = await encoder(`query: ${item.query}`, { pooling: "mean", normalize: true });
  const results = documents.map((document, index) => ({ id: document.id, bookId: document.bookId, reference: document.reference, title: document.title, score: output.data.reduce((sum, value, dimension) => sum + value * vectors[index * model.dimensions + dimension], 0) })).sort((a, b) => b.score - a.score).slice(0, 6);
  checks.push({ ...item, top6: results, expectedBookInTop6: results.some(result => item.expectedBooks.includes(result.bookId)) });
}
const manifest = {
  generatedAt: new Date().toISOString(), model, count: documents.length, books: [...new Set(documents.map(item => item.bookId))],
  scope: "Seleção identificada de passagens dos 52 guias temáticos, 66 guias de livros, 24 etapas e 15 histórias. Não é um índice semântico integral dos 31.102 versículos.",
  quoteSource: "Bíblia Livre TR, fevereiro de 2018; texto preservado; CC BY 3.0 Brasil.",
  embeddingInput: "passage: título. assuntos dos temas/guias existentes. contexto editorial (até 700 caracteres) referência. texto original; mean pooling, L2; limite 512 tokens.",
  queryInput: "query: pergunta em português; mean pooling e L2 com o mesmo modelo q8.",
  files: { documents: { path: "/semantic/documents.json", bytes: docsBytes.length, sha256: hash(docsBytes) }, vectors: { path: "/semantic/vectors.f32", bytes: vectorsBytes.length, sha256: hash(vectorsBytes) } },
  validation: { queries: checks.length, expectedBookInTop6: checks.filter(check => check.expectedBookInTop6).length, limitation: "Checagem técnica inicial de recuperação, sem avaliação com estudantes ou revisão humana especializada dos resultados." },
  generationSeconds: Math.round((Date.now() - started) / 1000),
  privacy: "Perguntas são processadas no navegador e não são enviadas ao Hugging Face. O download do modelo só começa após escolha explícita; o navegador pode conservar os pesos no cache. Consultas e resultados não são gravados pelo app.",
  licenses: { originalModel: "MIT, Microsoft; declaração do repositório intfloat", conversion: "Conversão ONNX da comunidade Xenova, identifica intfloat como base; não declara licença adicional no card", runtime: "Transformers.js Apache-2.0", bible: "CC BY 3.0 Brasil" }
};
await writeFile(path.join(out, "proveniencia.json"), JSON.stringify(manifest, null, 2) + "\n");
await writeFile(path.join(out, "validacao.json"), JSON.stringify(checks, null, 2) + "\n");
console.log(JSON.stringify({ count: documents.length, expectedBookInTop6: manifest.validation.expectedBookInTop6, queries: checks.length, seconds: manifest.generationSeconds }));
