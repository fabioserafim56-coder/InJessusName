import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";

const root = new URL("../../", import.meta.url);
const read = path => readFileSync(new URL(path, root));
const json = path => JSON.parse(read(path).toString("utf8"));
const recordings = json("src/content/narration/recordings.json");
const catalog = json("src/content/narration/passages.json");
const corpus = json("src/content/bible/blivre-tr-2018.json");

test("each narrated verse preserves the licensed edition and its declared passage boundaries", () => {
  assert.equal(recordings.passages.length, 6);
  assert.equal(recordings.passages.flatMap(passage => passage.verses).length, 49);
  assert.equal(recordings.sourceCorpusSha256, createHash("sha256").update(read("src/content/bible/blivre-tr-2018.json")).digest("hex"));
  for (const passage of recordings.passages) {
    const declared = catalog.find(item => item.id === passage.id);
    assert.ok(declared);
    for (const field of ["bookId", "chapter", "startVerse", "endVerse"]) assert.equal(passage[field], declared[field]);
    const book = corpus.books.find(item => item.id === passage.bookId);
    assert.equal(passage.bookName, book.name);
    assert.deepEqual(passage.verses.map(verse => verse.number), Array.from({ length: passage.endVerse - passage.startVerse + 1 }, (_, index) => passage.startVerse + index));
    for (const verse of passage.verses) assert.equal(verse.text, book.chapters[passage.chapter - 1][verse.number - 1], `${passage.id}:${verse.number} preserves the exact source text`);
  }
});

test("the narrated audio collection contains only documented MP3 files with intact hashes", () => {
  assert.deepEqual(json("public/audio/scripture/proveniencia.json"), recordings);
  assert.equal(recordings.voice, "pm_alex");
  assert.equal(recordings.model.license, "Apache-2.0");
  assert.equal(recordings.edition.licenseUrl, "https://creativecommons.org/licenses/by/3.0/br/");
  const recordedPaths = new Set();
  for (const passage of recordings.passages) for (const verse of passage.verses) {
    assert.match(verse.src, /^\/audio\/scripture\/[a-z0-9]+-\d+-\d+\.mp3$/);
    assert.ok(!recordedPaths.has(verse.src));
    recordedPaths.add(verse.src);
    const bytes = read(`public${verse.src}`);
    assert.equal(bytes.length, verse.bytes);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), verse.sha256);
    assert.ok(bytes.subarray(0, 3).toString() === "ID3" || (bytes[0] === 255 && (bytes[1] & 224) === 224), "The delivery is an actual MP3 container");
    assert.ok(verse.durationSeconds > 0 && verse.durationSeconds < 180);
  }
  const actual = readdirSync(new URL("public/audio/scripture/", root)).filter(file => file.endsWith(".mp3")).map(file => `/audio/scripture/${file}`);
  assert.deepEqual(actual.sort(), [...recordedPaths].sort());
});
