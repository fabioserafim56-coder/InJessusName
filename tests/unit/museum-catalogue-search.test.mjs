import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

// Load the real editorial modules and the installed Fuse implementation.
// These tests neither mock search results nor contact an AI service.
const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const nativeRequire = createRequire(import.meta.url);
const modules = new Map();
function load(relative) {
  const filename = resolve(root, relative);
  if (modules.has(filename)) return modules.get(filename).exports;
  if (filename.endsWith(".json")) return JSON.parse(readFileSync(filename, "utf8"));
  const compiled = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  const loaded = { exports: {} };
  modules.set(filename, loaded);
  const require = name => {
    if (!name.startsWith(".") && !name.startsWith("@/")) return nativeRequire(name);
    const candidate = name.startsWith("@/") ? join(root, "src", name.slice(2)) : resolve(dirname(filename), name);
    const dependency = [candidate, `${candidate}.ts`, `${candidate}.json`, join(candidate, "index.ts")]
      .find(value => existsSync(value) && statSync(value).isFile());
    assert.ok(dependency, `Real catalogue dependency exists: ${name}`);
    return load(dependency);
  };
  new Function("module", "exports", "require", compiled)(loaded, loaded.exports, require);
  return loaded.exports;
}

const { searchMuseumCatalogue } = load("src/lib/museum-catalogue-search.ts");
const { museumExhibits } = load("src/content/museum/index.ts");
const { getMuseumObservations } = load("src/content/multimodal/museum/index.ts");

test("date questions retrieve the selected exhibit's actual published date and collection", () => {
  for (const exhibit of museumExhibits) {
    const matches = searchMuseumCatalogue(exhibit.id, "Qual é a data desta peça?");
    const identification = matches.find(match => match.id === "identificacao");
    assert.ok(identification, exhibit.title);
    assert.ok(identification.text.includes(exhibit.approxDate), exhibit.title);
    assert.ok(identification.text.includes(exhibit.collection), exhibit.title);
  }
});

test("Israel search retrieves the Merneptah documentation and its attested limits", () => {
  const matches = searchMuseumCatalogue("estela-merneptah", "Israel");
  assert.ok(matches.length > 0);
  assert.ok(matches.some(match => /Israel/.test(match.text)));
  const inscription = getMuseumObservations("estela-merneptah").find(point => point.id === "escrita");
  const limits = searchMuseumCatalogue("estela-merneptah", "Israel faraó Êxodo");
  assert.ok(limits.some(match => match.text.includes(inscription.answer)), "A specific query retrieves the published distinction between Israel's mention and identifying the Exodus pharaoh");
});

test("mentioning the museum does not suppress relevant Rosetta documentation", () => {
  const matches = searchMuseumCatalogue("pedra-roseta", "A Pedra de Roseta prova o Êxodo no museu?");
  const limits = getMuseumObservations("pedra-roseta").find(point => point.id === "fragmento");
  assert.ok(matches.some(match => match.text.includes(limits.answer)), "The existing explanation about the stone's limits remains retrievable when the question contains 'museu'");

  const purpose = searchMuseumCatalogue("pedra-roseta", "Por que a Pedra de Roseta está no museu bíblico?");
  assert.ok(purpose.some(match => match.id !== "identificacao"), "A museum-related question must not be short-circuited into metadata only");
});

test("empty, stopword-only, unknown and invalid-exhibit searches return no invented answer", () => {
  for (const query of ["", "  ", "?!", "de da do para como", "qzxqzxqzxqzx"]) {
    assert.deepEqual(searchMuseumCatalogue("pedra-roseta", query), [], query);
  }
  assert.deepEqual(searchMuseumCatalogue("peca-inexistente", "Israel"), []);
  assert.deepEqual(searchMuseumCatalogue("", "data"), []);
});

test("accent and case variations find the same published catalogue entries", () => {
  assert.deepEqual(
    searchMuseumCatalogue("estela-merneptah", "INSCRICAO").map(match => match.id),
    searchMuseumCatalogue("estela-merneptah", "inscrição").map(match => match.id),
  );
});

test("every result preserves published paragraphs and valid source references for its own exhibit", () => {
  const before = JSON.stringify(museumExhibits);
  for (const exhibit of museumExhibits) {
    const publishedTexts = new Set([
      `${exhibit.approxDate}. ${exhibit.period}. ${exhibit.place}. ${exhibit.collection}. ${exhibit.introduction}`,
      ...getMuseumObservations(exhibit.id).map(point => `${point.explanation} ${point.answer}`),
      ...exhibit.whatItShows,
      ...exhibit.limits,
      ...exhibit.bibleConnections.map(connection => connection.explanation),
    ]);
    for (const query of ["data", "Israel", "inscrição", "Egito", "limites", "Bíblia", "museu", "fotografia original"]) {
      const matches = searchMuseumCatalogue(exhibit.id, query);
      assert.ok(matches.length <= 3);
      assert.equal(new Set(matches.map(match => match.id)).size, matches.length);
      for (const match of matches) {
        assert.ok(publishedTexts.has(match.text), `${exhibit.id}: result is an exact published paragraph, not a generated historical answer`);
        assert.ok(match.sourceIndexes.length > 0);
        for (const index of match.sourceIndexes) {
          assert.ok(Number.isInteger(index) && index >= 0 && index < exhibit.sources.length, `${exhibit.id}: source belongs to selected exhibit`);
          assert.equal(new URL(exhibit.sources[index].url).protocol, "https:");
          assert.ok(exhibit.sources[index].label.trim());
        }
      }
    }
  }
  assert.equal(JSON.stringify(museumExhibits), before, "Searching never mutates the published collection");
});
