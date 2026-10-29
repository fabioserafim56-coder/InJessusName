import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
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
    if (specifier.startsWith("@/")) {
      const local = `src/${specifier.slice(2)}`;
      return load(local.endsWith(".json") ? local : `${local}.ts`);
    }
    return nativeRequire(specifier);
  };
  new Function("require", "module", "exports", output)(requireLocal, localModule, localModule.exports);
  cache.set(relative, localModule.exports);
  return localModule.exports;
}
const { getDailyVerse } = load("src/lib/daily-verse.ts");
const { getBibleChapter } = load("src/lib/bible.ts");

test("daily reading follows midnight in Brasília, not UTC or build time", () => {
  const evening = getDailyVerse(new Date("2026-10-29T02:59:59Z"));
  const midnight = getDailyVerse(new Date("2026-10-29T03:00:00Z"));
  assert.equal(evening.date, "2026-10-28");
  assert.equal(midnight.date, "2026-10-29");
  assert.equal(midnight.timeZone, "America/Sao_Paulo");
  assert.notEqual(evening.reference, midnight.reference);
  assert.deepEqual(getDailyVerse(new Date("2026-10-29T23:59:59Z")), midnight);
  assert.equal(getDailyVerse(new Date("2027-01-01T02:59:59Z")).date, "2026-12-31");
  assert.equal(getDailyVerse(new Date("2027-01-01T03:00:00Z")).date, "2027-01-01");
});

test("a full year's readings preserve the exact licensed verse and context link", () => {
  const seen = new Set();
  for (let day = 0; day < 366; day++) {
    const entry = getDailyVerse(new Date(Date.UTC(2026, 0, 1 + day, 12)));
    const url = new URL(entry.href, "https://example.test");
    const chapter = getBibleChapter(url.searchParams.get("livro"), Number(url.searchParams.get("capitulo")));
    const number = Number(url.searchParams.get("versiculo"));
    assert.equal(entry.text, chapter.verses[number - 1].text);
    assert.equal(entry.reference, `${chapter.book.name} ${chapter.chapter}:${number}`);
    assert.equal(url.hash, `#versiculo-${number}`);
    assert.ok(entry.context.length > 80);
    assert.match(entry.attribution, /Diego Santos.*Mario Sérgio.*Marco Teles/);
    assert.equal(entry.licenseUrl, "https://creativecommons.org/licenses/by/3.0/br/");
    seen.add(entry.reference);
  }
  assert.equal(seen.size, 55);
});
