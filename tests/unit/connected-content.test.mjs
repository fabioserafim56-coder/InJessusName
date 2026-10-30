import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createHash } from "node:crypto";
import ts from "typescript";

// Compile the checked-in content modules without the browser or RSC runtime.
// The adapter only supplies their real local JSON inputs; it does not rewrite
// source strings, replace Scripture or invent fixtures for invalid references.
const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const nativeRequire = createRequire(import.meta.url);
const cache = new Map();
function loadLocal(relative) {
  if (cache.has(relative)) return cache.get(relative);
  if (relative.endsWith(".json")) return JSON.parse(readFileSync(join(root, relative), "utf8"));
  const compiled = ts.transpileModule(readFileSync(join(root, relative), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true }
  }).outputText;
  const loaded = { exports: {} };
  const requireLocal = specifier => {
    if (specifier === "server-only") return {};
    if (specifier === "./stages.json") return loadLocal("src/content/curriculum/stages.json");
    if (specifier === "./miracle-stories") return loadLocal("src/content/stories/miracle-stories.ts");
    if (specifier === "@/content/bible/blivre-tr-2018.json") return loadLocal("src/content/bible/blivre-tr-2018.json");
    if (specifier === "@/content/bible/edition.json") return loadLocal("src/content/bible/edition.json");
    return nativeRequire(specifier);
  };
  new Function("require", "module", "exports", compiled)(requireLocal, loaded, loaded.exports);
  cache.set(relative, loaded.exports);
  return loaded.exports;
}

const corpus = loadLocal("src/content/bible/blivre-tr-2018.json");
const { getBibleChapter } = loadLocal("src/lib/bible.ts");
const { curriculumStages, scriptureLink } = loadLocal("src/content/curriculum/index.ts");
const { biblicalStories, storyBibleUrl, storyStageIds } = loadLocal("src/content/stories/index.ts");
const { churches, people, relationships, historySources } = loadLocal("src/content/church-history/index.ts");
const historicalPhotos = loadLocal("src/content/church-history/photos.json");

function assertPassage(bookId, chapter, verse) {
  const original = corpus.books.find(book => book.id === bookId)?.chapters[chapter - 1]?.[verse - 1];
  assert.ok(typeof original === "string" && original.length > 0, `Reference exists: ${bookId} ${chapter}:${verse}`);
  const reading = getBibleChapter(bookId, chapter);
  assert.equal(reading?.verses[verse - 1]?.number, verse);
  assert.equal(reading?.verses[verse - 1]?.text, original, "The reader preserves the original edition exactly");
}
function assertBibleLink(href, book, chapter, verse) {
  const link = new URL(href, "https://example.test");
  assert.equal(link.pathname, "/biblia");
  assert.equal(link.searchParams.get("livro"), book);
  assert.equal(link.searchParams.get("capitulo"), String(chapter));
  if (verse !== undefined) {
    assert.equal(link.searchParams.get("versiculo"), String(verse));
    assert.equal(link.hash, `#versiculo-${verse}`);
  }
}

test("24 ordered stages keep every entry addressable and every answer explainable", () => {
  assert.equal(curriculumStages.length, 24);
  assert.equal(new Set(curriculumStages.map(stage => stage.id)).size, 24);
  assert.deepEqual(curriculumStages.map(stage => stage.number), Array.from({ length: 24 }, (_, index) => index + 1));
  for (const stage of curriculumStages) {
    assert.match(stage.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.equal(stage.teaching.length, 3);
    assert.equal(stage.question.options.filter(option => option.correct).length, 1, `${stage.id} has one correct explanation`);
    for (const option of stage.question.options) assert.ok(option.feedback.trim().length > 0, `${stage.id} explains each answer`);
  }
});

test("all 72 stage references resolve to exact Scripture and the context chapter", () => {
  const references = curriculumStages.flatMap(stage => stage.passages);
  assert.equal(references.length, 72);
  for (const passage of references) {
    assertPassage(passage.book, passage.chapter, passage.verse);
    assertBibleLink(scriptureLink(passage), passage.book, passage.chapter, passage.verse);
  }
});

test("the curriculum and its book index cover exactly the 66-book edition", () => {
  const canon = corpus.books.map(book => book.id).sort();
  const covered = new Set(curriculumStages.flatMap(stage => stage.books));
  assert.deepEqual([...covered].sort(), canon);
  // These four stops revisit books already indexed with their main teaching
  // group. Indexing them twice would make the 66-book navigation misleading.
  const indexed = curriculumStages.filter(stage => ![2, 15, 16, 18].includes(stage.number)).flatMap(stage => stage.books);
  assert.equal(indexed.length, 66);
  assert.equal(new Set(indexed).size, 66);
  assert.deepEqual([...indexed].sort(), canon);
});

test("15 four-scene stories keep all passages and curriculum connections valid", () => {
  assert.equal(biblicalStories.length, 15);
  assert.equal(new Set(biblicalStories.map(story => story.id)).size, 15);
  const stages = new Set(curriculumStages.map(stage => stage.id));
  assert.deepEqual(Object.keys(storyStageIds).sort(), biblicalStories.map(story => story.id).sort());
  for (const story of biblicalStories) {
    assert.equal(story.scenes.length, 4);
    assert.ok(stages.has(storyStageIds[story.id]), `${story.id} connects to an existing curriculum stop`);
    for (const reference of [...story.scenes.map(scene => scene.reference), story.nextReading]) {
      assertPassage(reference.book, reference.chapter, reference.verse ?? 1);
      assertBibleLink(storyBibleUrl(reference), reference.book, reference.chapter, reference.verse);
    }
  }
});

test("historical fiches and every connection resolve both people and identified sources", () => {
  assert.equal(churches.length + people.length, 38);
  const entities = [...churches, ...people];
  const nodes = new Set(entities.map(entity => entity.id));
  const sourceIds = new Set(historySources.map(source => source.id));
  assert.equal(nodes.size, entities.length, "Church and person routes do not collide");
  assert.equal(sourceIds.size, historySources.length, "Source identifiers are unique");
  const usedNodes = new Set();
  const usedSources = new Set();
  const assertSources = (ids, subject) => {
    assert.ok(ids.length > 0, `${subject} identifies at least one source`);
    for (const id of ids) {
      assert.ok(sourceIds.has(id), `${subject} refers to a known source: ${id}`);
      usedSources.add(id);
    }
  };
  for (const entity of entities) assertSources(entity.sourceIds, entity.id);
  for (const church of churches) for (const event of church.events) assertSources(event.sourceIds, `${church.id}: ${event.year}`);
  const connections = new Set();
  for (const edge of relationships) {
    assert.ok(nodes.has(edge.from) && nodes.has(edge.to), `${edge.from} → ${edge.to} resolves both endpoints`);
    assert.notEqual(edge.from, edge.to);
    const id = `${edge.from}:${edge.to}:${edge.kind}`;
    assert.ok(!connections.has(id), `A connection is not duplicated: ${id}`);
    connections.add(id);
    usedNodes.add(edge.from); usedNodes.add(edge.to);
    assertSources(edge.sourceIds, id);
  }
  assert.deepEqual([...usedNodes].sort(), [...nodes].sort(), "Every historical fiche has an explained connection");
  assert.deepEqual([...usedSources].sort(), [...sourceIds].sort(), "Every source belongs to a fiche, event or relationship");
  for (const source of historySources) {
    const url = new URL(source.url);
    assert.equal(url.protocol, "https:");
    assert.equal(url.username, "");
    assert.equal(url.password, "");
    assert.ok(source.title && source.publisher, "A source includes title and publisher");
  }
});

test("historical image originals match their preserved files, entity links and rights records", async () => {
  const entities = new Set([...churches, ...people].map(entity => entity.id));
  const photoIds = new Set(historicalPhotos.map(photo => photo.id));
  assert.equal(photoIds.size, historicalPhotos.length, "Each image record is addressable without duplicate identifiers");
  assert.ok(historicalPhotos.some(photo => photo.kind === "photograph"));
  assert.ok(historicalPhotos.some(photo => photo.kind === "document" || photo.kind === "historical-portrait"));
  const sharp = nativeRequire("sharp");
  for (const photo of historicalPhotos) {
    assert.ok(photo.entityIds.length > 0);
    for (const entityId of photo.entityIds) assert.ok(entities.has(entityId), `${photo.id} belongs to an existing biography or church`);
    assert.match(photo.src, /^\/church-history\/[a-z0-9/-]+\.(jpg|jpeg|png)$/);
    const bytes = readFileSync(join(root, "public", photo.src));
    assert.equal(bytes.length, photo.bytes, `${photo.id} preserves the recorded file size`);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), photo.sha256, `${photo.id} preserves the exact original bytes`);
    const metadata = await sharp(bytes).metadata();
    assert.equal(metadata.width, photo.width, `${photo.id} has the documented native width`);
    assert.equal(metadata.height, photo.height, `${photo.id} has the documented native height`);
    for (const field of ["creator", "license", "rightsEvidence", "dateLabel", "changes"]) assert.ok(photo[field].trim().length > 0, `${photo.id} identifies ${field}`);
    for (const field of ["licenseUrl", "sourceUrl", "originalUrl"]) {
      const url = new URL(photo[field]);
      assert.equal(url.protocol, "https:");
      assert.equal(url.username, "");
      assert.equal(url.password, "");
    }
  }
});

test("responsive historical photographs are real bounded image files tied to intact originals", async () => {
  const manifest = loadLocal("src/content/church-history/photo-renditions.json");
  const publicManifest = loadLocal("public/church-history/proveniencia-rendicoes.json");
  assert.deepEqual(publicManifest.files, manifest.files, "The public provenance describes the distributed renditions exactly");
  for (const field of ["generatedAt", "format", "quality"]) assert.equal(publicManifest[field], manifest[field]);
  assert.equal(manifest.format, "webp");
  assert.equal(manifest.quality, 95);
  const photos = new Map(historicalPhotos.map(photo => [photo.id, photo]));
  const sharp = nativeRequire("sharp");
  const paths = new Set();
  for (const file of manifest.files) {
    const photo = photos.get(file.photoId);
    assert.ok(photo, "Each rendition belongs to a documented original");
    assert.equal(file.sourceSha256, photo.sha256, "The source is the preserved archival file");
    assert.ok(file.width < photo.width, "Delivery never enlarges an archival photograph");
    assert.ok([480, 960, 1440, 2048, 3840].includes(file.width));
    assert.ok(Math.abs(file.height - photo.height * file.width / photo.width) <= 1, "The complete image keeps its aspect ratio");
    assert.match(file.src, /^\/church-history\/renditions\/[a-z0-9/-]+\.webp$/);
    assert.ok(!paths.has(file.src), "Every file has a unique address");
    paths.add(file.src);
    const bytes = readFileSync(join(root, "public", file.src));
    assert.equal(bytes.length, file.bytes);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), file.sha256);
    const metadata = await sharp(bytes).metadata();
    assert.equal(metadata.format, "webp");
    assert.equal(metadata.width, file.width);
    assert.equal(metadata.height, file.height);
  }
  for (const photo of historicalPhotos) for (const width of [2048, 3840]) {
    if (photo.width > width) assert.ok(manifest.files.some(file => file.photoId === photo.id && file.width === width), `${photo.id} has a real ${width}px viewer delivery`);
  }
  const actualPaths = readdirSync(join(root, "public/church-history/renditions"), { recursive: true })
    .filter(path => path.endsWith(".webp")).map(path => `/church-history/renditions/${path}`);
  assert.deepEqual(actualPaths.sort(), [...paths].sort(), "No undocumented delivery file is distributed");
});
