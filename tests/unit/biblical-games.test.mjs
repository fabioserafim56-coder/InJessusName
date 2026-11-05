import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const root = new URL("../../", import.meta.url);
const source = readFileSync(new URL("src/content/games/index.ts", root), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const loaded = { exports: {} };
new Function("module", "exports", compiled)(loaded, loaded.exports);
const { gameReferences, games, compassionSteps, compassionTray, contextCategories, passageConnections, breadClues, breadConclusion, gameBibleLink } = loaded.exports;
const corpus = JSON.parse(readFileSync(new URL("src/content/bible/blivre-tr-2018.json", root), "utf8"));
const reading = id => gameReferences.find(reference => reference.id === id);
const verse = (id, number) => { const reference = reading(id); return corpus.books.find(book => book.id === reference.bookId).chapters[reference.chapter - 1][number - 1]; };

test("every game passage and evidence link resolves to the actual local edition", () => {
  assert.equal(new Set(games.map(game => game.id)).size, games.length);
  for (const reference of gameReferences) {
    const chapter = corpus.books.find(book => book.id === reference.bookId)?.chapters[reference.chapter - 1];
    assert.ok(chapter, reference.label);
    assert.ok(reference.start > 0 && reference.end >= reference.start && reference.end <= chapter.length, reference.label);
    for (let number = reference.start; number <= reference.end; number++) {
      assert.ok(verse(reference.id, number)?.trim().length > 0);
      const url = new URL(gameBibleLink(reference, number), "https://example.test");
      assert.equal(url.pathname, "/biblia");
      assert.equal(url.searchParams.get("livro"), reference.bookId);
      assert.equal(url.searchParams.get("capitulo"), String(reference.chapter));
      assert.equal(url.searchParams.get("versiculo"), String(number));
      assert.equal(url.hash, `#versiculo-${number}`);
    }
  }
  for (const game of games) assert.ok(reading(game.reading));
});

test("the compassion path preserves the order and distinct actions attested in Luke", () => {
  assert.equal(new Set(compassionSteps.map(step => step.id)).size, 4);
  assert.deepEqual([...compassionTray].sort(), compassionSteps.map(step => step.id).sort(), "Every action is available once, including after a retry");
  assert.notDeepEqual(compassionTray, compassionSteps.map(step => step.id), "The initial tray does not already give the sequence");
  assert.deepEqual(compassionSteps.map(step => step.verse), [33, 34, 34, 35]);
  assert.match(verse("samaritano", 33), /compaixão/);
  const treatment = verse("samaritano", 34);
  assert.ok(treatment.indexOf("feridas") < treatment.indexOf("hospedaria"), "Verse 34 first treats the wounds and then brings the man to the inn");
  assert.match(verse("samaritano", 35), /no outro dia/);
  assert.match(verse("samaritano", 37), /misericórdia/);
});

test("connections cover three different forms, with contextual evidence for each", () => {
  assert.equal(passageConnections.length, 3);
  assert.equal(new Set(passageConnections.map(passage => passage.id)).size, 3);
  assert.equal(new Set(passageConnections.map(passage => passage.category)).size, 3);
  for (const passage of passageConnections) {
    assert.ok(contextCategories.some(category => category.id === passage.category));
    const reference = reading(passage.reading);
    for (const number of passage.verses) assert.ok(number >= reference.start && number <= reference.end && verse(passage.reading, number));
    assert.ok(passage.feedback.length > 100, "Every context has an explanation, including for retries");
  }
  assert.equal(passageConnections.find(passage => passage.reading === "samaritano").category, "parabola");
  assert.equal(passageConnections.find(passage => passage.reading === "salmo").category, "salmo");
  assert.equal(passageConnections.find(passage => passage.reading === "paes").category, "sinal");
  assert.match(verse("salmo", 1), /Salmo/);
  assert.match(verse("paes", 14), /sinal/);
});

test("John's clues distinguish starting food, Jesus' action and the twelve baskets", () => {
  assert.equal(breadClues.length, 3);
  assert.equal(new Set(breadClues.map(clue => clue.id)).size, 3);
  for (const clue of [...breadClues, breadConclusion]) {
    assert.equal(clue.options.filter(option => option.correct).length, 1, "Only one conclusion is supported for each question");
    assert.equal(new Set(clue.options.map(option => option.id)).size, clue.options.length);
    for (const option of clue.options) assert.ok(option.feedback.length > 80, "A wrong answer receives a substantive explanation");
  }
  assert.match(verse("paes", 9), /cinco pães de cevada e dois peixinhos/);
  assert.match(verse("paes", 11), /Jesus os pães.*dado graças/);
  assert.match(verse("paes", 12), /nada se perca/);
  assert.match(verse("paes", 13), /doze cestos/);
  assert.equal(breadClues[0].options.find(option => option.correct).id, "cinco-dois");
  assert.equal(breadClues[1].options.find(option => option.correct).id, "jesus");
  assert.equal(breadClues[2].options.find(option => option.correct).id, "doze");
  assert.equal(breadConclusion.options.find(option => option.correct).id, "sinal");
});
