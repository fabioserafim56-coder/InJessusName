import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import ts from "typescript";

const root = fileURLToPath(new URL("../../", import.meta.url));
const corpus = JSON.parse(readFileSync(path.join(root, "src/content/bible/blivre-tr-2018.json"), "utf8"));
const loaded = { exports: {} };
const nativeRequire = createRequire(import.meta.url);
const code = ts.transpileModule(readFileSync(path.join(root, "src/lib/ocr/locate.ts"), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
new Function("require", "module", "exports", code)(name => name === "server-only" ? {} : name === "@/content/bible/blivre-tr-2018.json" ? corpus : nativeRequire(name), loaded, loaded.exports);
const { locateScripture } = loaded.exports;

test("photographed references accept Portuguese names, accents, abbreviations and ranges", () => {
  for (const [query, id, chapter, verse, end] of [
    ["JOÃO 3:16", "JHN", 3, 16, 16], ["Sl 23", "PSA", 23, 1, 6], ["2 Timóteo 3.16–17", "2TI", 3, 16, 17],
    ["II Coríntios 5:17", "2CO", 5, 17, 17], ["Jó 3:16", "JOB", 3, 16, 16], ["1João 4:8", "1JN", 4, 8, 8]
  ]) {
    const result = locateScripture(query);
    assert.equal(result.method, "reference", query);
    const passage = result.candidates.find(item => item.bookId === id);
    assert.ok(passage, query);
    assert.deepEqual([passage.chapter, passage.verse, passage.endVerse], [chapter, verse, end], query);
  }
});

test("all 66 canonical book names resolve without replacing any verse text", () => {
  for (const book of corpus.books) {
    const result = locateScripture(`${book.name} 1:1`);
    const passage = result.candidates.find(item => item.bookId === book.id);
    assert.ok(passage, book.name);
    assert.equal(passage.verses[0].text, book.chapters[0][0]);
    assert.match(passage.href, new RegExp(`livro=${book.id}&capitulo=1&versiculo=1`));
  }
});

test("invalid OCR numbers never clamp to a different reference or invent a passage", () => {
  for (const query of ["João 99:999", "Salmos 0:1", "João 3:0", "Salmos 23:1–90", "João 3:18–16"]) {
    const result = locateScripture(query);
    assert.equal(result.method, "none", query);
    assert.deepEqual(result.candidates, [], query);
  }
});

test("an ambiguous unaccented abbreviation presents the plausible book choices", () => {
  const result = locateScripture("Jo 3:16");
  assert.deepEqual(result.candidates.map(item => item.bookId).sort(), ["JHN", "JOB"]);
});

test("a photographed verse without a reference matches real text and identifies possible translation differences", () => {
  const original = corpus.books.find(book => book.id === "JHN").chapters[2][15];
  const result = locateScripture(original);
  assert.equal(result.method, "text");
  assert.equal(result.candidates[0].bookId, "JHN");
  assert.equal(result.candidates[0].chapter, 3);
  assert.equal(result.candidates[0].verse, 16);
  assert.equal(result.candidates[0].verses[0].text, original);
  assert.ok(result.candidates.length <= 5);
  assert.match(result.message, /tradução/);
});

test("empty, generic and unrelated photographed text does not suggest arbitrary Scripture", () => {
  for (const query of ["", "fé", "Texto sem referência", "galáxia computador teclado impressora termodinâmica algoritmo fotossíntese"]) {
    assert.deepEqual(locateScripture(query).candidates, [], query);
  }
});
