import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import ts from "typescript";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const read = relative => readFileSync(join(root, relative));
const json = relative => JSON.parse(read(relative));
const manifest = json("public/semantic/proveniencia.json");
const documents = json("public/semantic/documents.json");
const bytes = read("public/semantic/vectors.f32");
const vectors = new Float32Array(bytes.buffer, bytes.byteOffset, bytes.byteLength / 4);
const corpus = json("src/content/bible/blivre-tr-2018.json");

function loadRank() {
  const compiled = ts.transpileModule(read("src/lib/semantic/rank.ts").toString(), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const loaded = { exports: {} };
  new Function("module", "exports", compiled)(loaded, loaded.exports);
  return loaded.exports.rankSemanticDocuments;
}

test("semantic index preserves Scripture, covers the stated books and verifies generated vector bytes", () => {
  assert.equal(manifest.count, documents.length);
  assert.ok(documents.length >= 300 && documents.length < 1000, "This is an identified selection, not a claim of full-corpus semantics");
  assert.equal(new Set(documents.map(item => item.id)).size, documents.length);
  assert.deepEqual([...new Set(documents.map(item => item.bookId))].sort(), corpus.books.map(book => book.id).sort());
  assert.equal(manifest.model.dimensions, 384);
  assert.equal(vectors.length, documents.length * 384);
  for (const file of Object.values(manifest.files)) {
    const data = read(`public${file.path}`);
    assert.equal(data.length, file.bytes);
    assert.equal(createHash("sha256").update(data).digest("hex"), file.sha256);
  }
  for (let index = 0; index < documents.length; index++) {
    const document = documents[index];
    const chapter = corpus.books.find(book => book.id === document.bookId)?.chapters[document.chapter - 1];
    assert.ok(chapter && document.verse > 0 && document.endVerse >= document.verse && document.endVerse <= chapter.length, document.id);
    assert.equal(document.text, chapter.slice(document.verse - 1, document.endVerse).join(" "), `${document.id} preserves the quoted verses`);
    const href = new URL(document.href, "https://example.test");
    assert.equal(href.pathname, "/biblia");
    assert.equal(href.searchParams.get("livro"), document.bookId);
    assert.equal(href.searchParams.get("capitulo"), String(document.chapter));
    assert.equal(href.searchParams.get("versiculo"), String(document.verse));
    assert.match(document.sourceHref, /^\/(biblia\?|biblioteca\/|percurso\/|historias\/)/);
    let magnitude = 0;
    for (const value of vectors.subarray(index * 384, (index + 1) * 384)) {
      assert.ok(Number.isFinite(value));
      magnitude += value * value;
    }
    assert.ok(Math.abs(Math.sqrt(magnitude) - 1) < .0001, `${document.id} is an actual normalized vector`);
  }
});

test("cosine retrieval deduplicates passages and rejects malformed vectors", () => {
  const rank = loadRank();
  const first = vectors.slice(0, 384);
  const results = rank(first, vectors, documents, 384, 6);
  assert.ok(results[0].similarity > .9999, "The original vector is found by actual cosine similarity");
  assert.equal(results[0].href, documents[0].href);
  assert.equal(new Set(results.map(item => item.href)).size, results.length, "A reading is not repeated through different editorial contexts");
  assert.throws(() => rank([], vectors, documents));
  assert.throws(() => rank(new Float32Array(384), vectors, documents));
  assert.throws(() => rank(first, vectors.slice(0, 20), documents));
  const invalid = first.slice(); invalid[0] = NaN;
  assert.throws(() => rank(invalid, vectors, documents));
});

test("the initial Portuguese retrieval check uses the recorded E5 query outputs", () => {
  const checks = json("public/semantic/validacao.json");
  assert.equal(checks.length, 10);
  assert.equal(manifest.validation.queries, checks.length);
  for (const check of checks) {
    assert.ok(check.top6.length > 0 && check.top6.length <= 6);
    for (const hit of check.top6) {
      assert.ok(documents.some(document => document.id === hit.id && document.reference === hit.reference));
      assert.ok(Number.isFinite(hit.score));
    }
    assert.equal(check.expectedBookInTop6, check.top6.some(hit => check.expectedBooks.includes(hit.bookId)));
  }
  assert.equal(manifest.validation.expectedBookInTop6, checks.filter(check => check.expectedBookInTop6).length);
  assert.ok(manifest.validation.expectedBookInTop6 >= 8, "At least eight of the ten initial paraphrases retrieve an expected source book");
});
