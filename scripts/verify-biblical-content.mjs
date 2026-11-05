import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = fileURLToPath(new URL("../", import.meta.url));
const require = createRequire(import.meta.url);
const readJson = (relative) => JSON.parse(readFileSync(path.join(root, relative), "utf8"));
const corpus = readJson("src/content/bible/blivre-tr-2018.json");
const edition = readJson("src/content/bible/edition.json");
const books = new Map(corpus.books.map(book => [book.id, book]));
const loaded = new Map();

// Evaluate the actual editorial data modules using the installed TS compiler.
// No mock chapters, synthetic verses, Next runtime, or downloaded material.
function loadContent(relative) {
  const file = path.isAbsolute(relative) ? relative : path.join(root, relative);
  if (loaded.has(file)) return loaded.get(file).exports;
  if (file.endsWith(".json")) return JSON.parse(readFileSync(file, "utf8"));
  const contentModule = { exports: {} };
  loaded.set(file, contentModule);
  const source = readFileSync(file, "utf8");
  const code = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
    fileName: file,
  }).outputText;
  const localRequire = (specifier) => {
    if (!specifier.startsWith(".")) return require(specifier);
    const candidate = path.resolve(path.dirname(file), specifier);
    const resolved = [candidate, `${candidate}.ts`, `${candidate}.json`, path.join(candidate, "index.ts")]
      .find(name => existsSync(name) && /\.(ts|json)$/.test(name));
    if (!resolved) throw new Error(`Cannot resolve ${specifier} from ${file}`);
    return loadContent(resolved);
  };
  new Function("require", "module", "exports", code)(localRequire, contentModule, contentModule.exports);
  return contentModule.exports;
}

const stories = loadContent("src/content/stories/index.ts").biblicalStories;
const gameData = loadContent("src/content/games/index.ts");
const datasets = [
  ["primeira-aula", loadContent("src/content/lessons/primeiros-passos.ts").firstLesson],
  ["curso", loadContent("src/content/courses/introductory-course.ts").additionalLessons],
  ["temas", loadContent("src/content/bible/topics.ts").bibleTopics],
  ["historias", stories],
  ["percurso", readJson("src/content/curriculum/stages.json")],
  ["museu", readJson("src/content/museum/exhibits.json")],
  ["narracoes", readJson("src/content/narration/passages.json")],
  ["jogos", gameData.gameReferences],
  ["guias-dos-livros", readJson("src/content/book-guides/guides.json").flatMap(guide =>
    guide.readings.map(reading => ({ ...reading, book: guide.id })))],
];
const errors = [];
const counts = {};
const unique = new Set();

function checkReference(reference, location) {
  const id = reference.book ?? reference.bookId;
  const chapterNumber = reference.chapter;
  const start = reference.startVerse ?? reference.start ?? reference.verse ?? 1;
  const book = books.get(id);
  const chapter = book?.chapters[chapterNumber - 1];
  const end = reference.endVerse ?? reference.end ?? reference.verse ?? (reference.startVerse || reference.start ? start : chapter?.length);
  if (!book || !Number.isInteger(chapterNumber) || !chapter || !Number.isInteger(start) ||
    !Number.isInteger(end) || start < 1 || end < start || end > chapter.length) {
    errors.push(`${location}: referência inválida (${id} ${chapterNumber}:${start}–${end}).`);
    return;
  }
  if (chapter.slice(start - 1, end).some(text => typeof text !== "string" || !text.trim())) {
    errors.push(`${location}: texto bíblico vazio na passagem.`);
  }
  unique.add(`${id}:${chapterNumber}:${start}:${end}`);
  const group = location.split(".")[0];
  counts[group] = (counts[group] ?? 0) + 1;
}

function walk(value, location) {
  if (!value || typeof value !== "object") return;
  if (typeof (value.book ?? value.bookId) === "string" && "chapter" in value) checkReference(value, location);
  for (const [key, child] of Object.entries(value)) if (child && typeof child === "object") walk(child, `${location}.${key}`);
}
for (const [name, value] of datasets) walk(value, name);

const readings = new Map(gameData.gameReferences.map(reading => [reading.id, reading]));
function checkGameVerse(readingId, verse, location) {
  const reading = readings.get(readingId);
  if (!reading || verse < reading.start || verse > reading.end) {
    errors.push(`${location}: versículo fora da leitura do jogo.`);
    return;
  }
  checkReference({ book: reading.bookId, chapter: reading.chapter, verse }, location);
}
for (const step of gameData.compassionSteps) checkGameVerse("samaritano", step.verse, `pistas-samaritano.${step.id}`);
for (const connection of gameData.passageConnections) for (const verse of connection.verses) {
  checkGameVerse(connection.reading, verse, `conexoes.${connection.id}`);
}
for (const clue of gameData.breadClues) {
  checkGameVerse("paes", clue.verse, `pistas-paes.${clue.id}`);
  if (clue.options.filter(option => option.correct).length !== 1) errors.push(`pistas-paes.${clue.id}: deve haver uma resposta correta.`);
}
if (gameData.breadConclusion.options.filter(option => option.correct).length !== 1) errors.push("Conclusão dos pães sem resposta correta única.");
if (new Set(gameData.compassionTray).size !== gameData.compassionSteps.length ||
  gameData.compassionSteps.some(step => !gameData.compassionTray.includes(step.id))) {
  errors.push("A bandeja de gestos do samaritano não corresponde aos gestos cadastrados.");
}
for (const game of gameData.games) if (!readings.has(game.reading)) errors.push(`Jogo ${game.id}: leitura inexistente.`);
for (const story of stories) if (story.scenes.length !== 4) errors.push(`História ${story.id}: não tem quatro cenas.`);
if (new Set(stories.map(story => story.id)).size !== stories.length) errors.push("IDs de histórias repetidos.");

const sceneProvenancePath = path.join(root, "public/visuals/scenes/proveniencia.json");
let illustrations = 0;
if (existsSync(sceneProvenancePath)) {
  const provenance = JSON.parse(readFileSync(sceneProvenancePath, "utf8"));
  for (const scene of provenance.files) {
    const location = `cenas-artisticas.${scene.storyId}.${scene.sceneIndex}`;
    const story = stories.find(item => item.id === scene.storyId);
    if (!story || !Number.isInteger(scene.sceneIndex) || !story.scenes[scene.sceneIndex]) errors.push(`${location}: história/cena inexistente.`);
    const book = corpus.books.find(item => scene.reference.startsWith(`${item.name} `));
    const range = book && scene.reference.slice(book.name.length).trim().match(/^(\d+):(\d+)(?:[–-](\d+))?$/);
    if (!range) errors.push(`${location}: referência da ilustração não reconhecida.`);
    else checkReference({ book: book.id, chapter: Number(range[1]), startVerse: Number(range[2]), endVerse: Number(range[3] ?? range[2]) }, location);
    if (!/^\/visuals\/scenes\/[a-z0-9-]+\.png$/.test(scene.path)) {
      errors.push(`${location}: caminho de imagem inválido.`);
      continue;
    }
    try {
      const image = readFileSync(path.join(root, "public", scene.path));
      if (image.length !== scene.bytes || createHash("sha256").update(image).digest("hex") !== scene.sha256) errors.push(`${location}: bytes/hash da ilustração divergem da proveniência.`);
      if (image.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a" || image.readUInt32BE(16) !== scene.width || image.readUInt32BE(20) !== scene.height) errors.push(`${location}: formato/dimensões da ilustração divergem da proveniência.`);
      illustrations++;
    } catch (error) {
      errors.push(`${location}: imagem indisponível (${error.code ?? error.message}).`);
    }
  }
}

const actualCounts = {
  books: corpus.books.length,
  chapters: corpus.books.reduce((total, book) => total + book.chapters.length, 0),
  verses: corpus.books.reduce((total, book) => total + book.chapters.reduce((sum, chapter) => sum + chapter.length, 0), 0),
};
for (const [actual, expected] of [[actualCounts.books, edition.bookCount], [actualCounts.chapters, edition.chapterCount], [actualCounts.verses, edition.verseCount]]) {
  if (actual !== expected) errors.push(`Contagem do acervo diverge da edição: ${actual} em vez de ${expected}.`);
}
const archive = readFileSync(path.join(root, "src/content/bible/source/bliv-tr_vpl.zip"));
if (createHash("sha256").update(archive).digest("hex") !== edition.sourceArchiveSha256) errors.push("SHA-256 do ZIP de origem da Bíblia diverge da edição.");

const result = {
  edition: edition.id,
  corpus: actualCounts,
  referenceOccurrences: Object.values(counts).reduce((sum, count) => sum + count, 0),
  uniqueStructuredReferences: unique.size,
  occurrencesByGroup: counts,
  stories: stories.length,
  scenes: stories.reduce((count, story) => count + story.scenes.length, 0),
  games: gameData.games.length,
  illustrations,
  errors,
  limits: "Confere referências estruturadas, existência do texto, integridade do ZIP, vínculos das atividades e proveniência técnica das novas ilustrações. Não interpreta teologia, não certifica pedagogia, não verifica cada referência em prosa nem a fidelidade visual das imagens.",
};
if (process.argv.includes("--json")) console.log(JSON.stringify(result, null, 2));
else {
  console.log(`${result.referenceOccurrences} ocorrências de referências (${unique.size} referências estruturadas distintas), ${result.stories} histórias/${result.scenes} cenas e ${result.games} jogos conferidos contra ${edition.id}.`);
  console.log(`${actualCounts.books} livros, ${actualCounts.chapters} capítulos e ${actualCounts.verses} versículos; SHA-256 do ZIP de origem conferido.`);
  console.log(result.limits);
  for (const error of errors) console.error(`• ${error}`);
}
if (errors.length) process.exitCode = 1;
