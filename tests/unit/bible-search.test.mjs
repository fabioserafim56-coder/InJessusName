import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import ts from "typescript";

// Load the server-only search without a browser/RSC runtime. Only these local,
// reviewed inputs are provided to the module; no source text is rewritten.
const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const nativeRequire = createRequire(import.meta.url);
const cache = new Map();
function loadLocal(relative) {
  if (cache.has(relative)) return cache.get(relative);
  if (relative.endsWith(".json")) return JSON.parse(readFileSync(join(root, relative), "utf8"));
  const output = ts.transpileModule(readFileSync(join(root, relative), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  const loadedModule = { exports: {} };
  const requireLocal = specifier => {
    if (specifier === "server-only") return {};
    if (specifier === "@/content/bible/blivre-tr-2018.json") return loadLocal("src/content/bible/blivre-tr-2018.json");
    if (specifier === "@/content/bible/topics") return loadLocal("src/content/bible/topics.ts");
    return nativeRequire(specifier);
  };
  new Function("require", "module", "exports", output)(requireLocal, loadedModule, loadedModule.exports);
  cache.set(relative, loadedModule.exports);
  return loadedModule.exports;
}
const { getBibleSearch, validateBibleTopicReferences } = loadLocal("src/lib/bible-search.ts");
const corpus = loadLocal("src/content/bible/blivre-tr-2018.json");
function assertExactVerse(verse) {
  const book = corpus.books.find(book => book.id === verse.bookId);
  assert.ok(book, "book exists in this edition");
  assert.equal(verse.text, book.chapters[verse.chapter - 1][verse.verse - 1]);
  assert.match(verse.href, new RegExp(`livro=${verse.bookId}&capitulo=${verse.chapter}&versiculo=${verse.verse}#versiculo-${verse.verse}$`));
}

test("all editorial themes resolve to real chapter and verse ranges", () => {
  const integrity = validateBibleTopicReferences();
  assert.ok(integrity.topics >= 35);
  assert.ok(integrity.readings >= integrity.topics * 3);
  assert.ok(integrity.verses > integrity.readings);
});

test("batismo keeps literal matches and editorial passages distinct", () => {
  const result = getBibleSearch("batismo");
  assert.ok(result.total > 0);
  assert.equal(result.topics[0].id, "batismo");
  assert.equal(result.topics[0].readings.length, 4);
  for (const verse of result.results) { assertExactVerse(verse); assert.match(verse.text.toLowerCase(), /\bbatismo\b/); }
  for (const reading of result.topics[0].readings) for (const verse of reading.verses) assertExactVerse(verse);
  assert.ok(result.topics[0].readings.some(reading => reading.verses.some(verse => !/\bbatismo\b/.test(verse.text.toLowerCase()))));
  for (const alias of ["batizar", "batizado", "batizada", "batizai"]) assert.equal(getBibleSearch(alias).topics[0].id, "batismo");
});

test("accent and case folding return identical verse identities", () => {
  const accented = getBibleSearch("ESPÍRITO");
  const plain = getBibleSearch("espirito");
  assert.ok(accented.total > 20);
  assert.equal(accented.total, plain.total);
  assert.deepEqual(accented.results, plain.results);
  accented.results.forEach(assertExactVerse);
});

test("multiple words and exact phrases include the original John 11:35 text", () => {
  for (const query of ["Jesus chorou", '"Jesus chorou"', "“Jesus chorou”"]) {
    const result = getBibleSearch(query);
    const verse = result.results.find(verse => verse.bookId === "JHN" && verse.chapter === 11 && verse.verse === 35);
    assert.ok(verse, query);
    assertExactVerse(verse);
  }
  assert.deepEqual(getBibleSearch("O que a Bíblia fala sobre batismo?").terms, ["batismo"]);
  assert.equal(getBibleSearch("O que a Bíblia fala sobre batismo?").topics[0].id, "batismo");
});

test("pagination covers every literal result exactly once and clamps unsafe pages", () => {
  const first = getBibleSearch("amor");
  assert.ok(first.pageCount > 2);
  const seen = new Set();
  for (let page = 1; page <= first.pageCount; page++) {
    const result = getBibleSearch("amor", page);
    assert.equal(result.page, page);
    for (const verse of result.results) {
      assertExactVerse(verse);
      const id = `${verse.bookId}.${verse.chapter}.${verse.verse}`;
      assert.ok(!seen.has(id), `duplicate result ${id}`);
      seen.add(id);
    }
  }
  assert.equal(seen.size, first.total);
  assert.equal(getBibleSearch("amor", -5).page, 1);
  assert.equal(getBibleSearch("amor", 10000).page, first.pageCount);
  assert.equal(getBibleSearch("amor", NaN).page, 1);
});

test("empty, oversize and absent queries are handled without inventing results", () => {
  assert.equal(getBibleSearch("").searched, false);
  assert.equal(getBibleSearch("a").total, 0);
  assert.ok(getBibleSearch("a").message);
  assert.ok(getBibleSearch("x".repeat(121)).message);
  assert.equal(getBibleSearch("zxqvnonexistent").total, 0);
  assert.deepEqual(getBibleSearch("zxqvnonexistent").topics, []);
  assert.equal(getBibleSearch("Bíblia").topics[0].id, "palavra");
});
