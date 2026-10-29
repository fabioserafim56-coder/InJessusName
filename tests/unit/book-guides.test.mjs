import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, normalize } from "node:path";
import ts from "typescript";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const nativeRequire = createRequire(import.meta.url);
const cache = new Map();
function load(relative) {
  if (cache.has(relative)) return cache.get(relative);
  if (relative.endsWith(".json")) return JSON.parse(readFileSync(join(root, relative), "utf8"));
  const output = ts.transpileModule(readFileSync(join(root, relative), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  const localModule = { exports: {} };
  const requireLocal = specifier => {
    if (specifier === "server-only") return {};
    if (specifier.startsWith("@/")) { const local = `src/${specifier.slice(2)}`; return load(local.endsWith(".json") ? local : `${local}.ts`); }
    if (specifier.startsWith(".")) { const local = normalize(join(dirname(relative), specifier)); return load(local.endsWith(".json") ? local : `${local}.ts`); }
    return nativeRequire(specifier);
  };
  new Function("require", "module", "exports", output)(requireLocal, localModule, localModule.exports);
  cache.set(relative, localModule.exports);
  return localModule.exports;
}
const { getBookGuide, getBookGuideSummaries } = load("src/content/book-guides/index.ts");
const { getBibleChapter } = load("src/lib/bible.ts");
const corpus = load("src/content/bible/blivre-tr-2018.json");
const { curriculumStages } = load("src/content/curriculum/index.ts");

test("every canonical book has one substantive guide in the same order", () => {
  const summaries = getBookGuideSummaries();
  assert.deepEqual(summaries.map(book => book.id), corpus.books.map(book => book.id));
  const prompts = new Set();
  for (const summary of summaries) {
    const guide = getBookGuide(summary.id);
    assert.equal(guide.name, corpus.books.find(book => book.id === guide.id).name);
    assert.equal(guide.chapters, corpus.books.find(book => book.id === guide.id).chapters.length);
    assert.equal(guide.overview.length, 2);
    guide.overview.forEach(paragraph => assert.ok(paragraph.length > 200, `${guide.id}: substantive introduction`));
    assert.equal(guide.themes.length, 3);
    assert.ok(guide.genre.length > 15);
    assert.ok(guide.connection.length > 70);
    assert.ok(guide.example.length > 90);
    assert.ok(guide.question.prompt.length > 25);
    assert.ok(guide.question.answer.length > 90);
    assert.ok(!prompts.has(guide.question.prompt), `duplicate question ${guide.id}`);
    prompts.add(guide.question.prompt);
    assert.ok(curriculumStages.some(stage => stage.books.includes(guide.id)), `connected stage ${guide.id}`);
  }
  assert.equal(getBookGuide("not-a-book"), undefined);
});

test("all 132 guide readings resolve to exact verses in the licensed edition", () => {
  let count = 0;
  for (const summary of getBookGuideSummaries()) {
    const guide = getBookGuide(summary.id);
    const original = corpus.books.find(book => book.id === guide.id);
    assert.equal(guide.readings.length, 2);
    const unique = new Set();
    for (const reading of guide.readings) {
      const chapter = getBibleChapter(guide.id, reading.chapter);
      assert.ok(chapter, `${guide.id} ${reading.chapter}`);
      assert.ok(reading.verse >= 1 && reading.endVerse >= reading.verse && reading.endVerse <= chapter.verses.length);
      const verses = chapter.verses.filter(verse => verse.number >= reading.verse && verse.number <= reading.endVerse);
      assert.equal(verses.length, reading.endVerse - reading.verse + 1);
      for (const verse of verses) assert.equal(verse.text, original.chapters[reading.chapter - 1][verse.number - 1]);
      assert.ok(reading.note.length > 40);
      unique.add(`${reading.chapter}.${reading.verse}.${reading.endVerse}`);
      count++;
    }
    assert.equal(unique.size, 2, `${guide.id}: distinct reading entry points`);
  }
  assert.equal(count, 132);
});
