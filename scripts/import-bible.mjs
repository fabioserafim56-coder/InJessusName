import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { inflateRawSync } from "node:zlib";

// Offline and reproducible: never download a mutable artifact during setup.
// The archive and license below came from the translation project's own release.
const directory = new URL("../src/content/bible/", import.meta.url);
const expectedArchiveSha256 = "af8d9876919c4ca67195b8d8adcb9998a63f25ea4509750574ab6a7eedb9e2f1";
const archive = await readFile(new URL("source/bliv-tr_vpl.zip", directory));
const sha256 = (data) => createHash("sha256").update(data).digest("hex");
if (sha256(archive) !== expectedArchiveSha256) throw new Error("Bible source checksum mismatch; import stopped.");

// Read the single ZIP entry in memory; no filesystem extraction or path traversal.
if (archive.readUInt32LE(0) !== 0x04034b50 || archive.readUInt16LE(6) & 1) throw new Error("Unsupported source ZIP.");
const method = archive.readUInt16LE(8);
const length = archive.readUInt32LE(18);
const start = 30 + archive.readUInt16LE(26) + archive.readUInt16LE(28);
const compressed = archive.subarray(start, start + length);
const source = method === 8 ? inflateRawSync(compressed) : method === 0 ? compressed : null;
if (!source) throw new Error("Unsupported source compression.");
if (source.length !== 4225844) throw new Error("Unexpected source length.");

const bookDefinitions = [
  ["GEN", "GEN", "Gênesis", 50], ["EXO", "EXO", "Êxodo", 40], ["LEV", "LEV", "Levítico", 27],
  ["NUM", "NUM", "Números", 36], ["DEU", "DEU", "Deuteronômio", 34], ["JOS", "JOS", "Josué", 24],
  ["JDG", "JDG", "Juízes", 21], ["RUT", "RUT", "Rute", 4], ["1SA", "1SA", "1 Samuel", 31],
  ["2SA", "2SA", "2 Samuel", 24], ["1KI", "1KI", "1 Reis", 22], ["2KI", "2KI", "2 Reis", 25],
  ["1CH", "1CH", "1 Crônicas", 29], ["2CH", "2CH", "2 Crônicas", 36], ["EZR", "EZR", "Esdras", 10],
  ["NEH", "NEH", "Neemias", 13], ["EST", "EST", "Ester", 10], ["JOB", "JOB", "Jó", 42],
  ["PSA", "PSA", "Salmos", 150], ["PRO", "PRO", "Provérbios", 31], ["ECC", "ECC", "Eclesiastes", 12],
  ["SOL", "SNG", "Cântico dos Cânticos", 8], ["ISA", "ISA", "Isaías", 66], ["JER", "JER", "Jeremias", 52],
  ["LAM", "LAM", "Lamentações", 5], ["EZE", "EZK", "Ezequiel", 48], ["DAN", "DAN", "Daniel", 12],
  ["HOS", "HOS", "Oseias", 14], ["JOE", "JOL", "Joel", 3], ["AMO", "AMO", "Amós", 9],
  ["OBA", "OBA", "Obadias", 1], ["JON", "JON", "Jonas", 4], ["MIC", "MIC", "Miqueias", 7],
  ["NAH", "NAM", "Naum", 3], ["HAB", "HAB", "Habacuque", 3], ["ZEP", "ZEP", "Sofonias", 3],
  ["HAG", "HAG", "Ageu", 2], ["ZEC", "ZEC", "Zacarias", 14], ["MAL", "MAL", "Malaquias", 4],
  ["MAT", "MAT", "Mateus", 28], ["MAR", "MRK", "Marcos", 16], ["LUK", "LUK", "Lucas", 24],
  ["JOH", "JHN", "João", 21], ["ACT", "ACT", "Atos", 28], ["ROM", "ROM", "Romanos", 16],
  ["1CO", "1CO", "1 Coríntios", 16], ["2CO", "2CO", "2 Coríntios", 13], ["GAL", "GAL", "Gálatas", 6],
  ["EPH", "EPH", "Efésios", 6], ["PHI", "PHP", "Filipenses", 4], ["COL", "COL", "Colossenses", 4],
  ["1TH", "1TH", "1 Tessalonicenses", 5], ["2TH", "2TH", "2 Tessalonicenses", 3], ["1TI", "1TI", "1 Timóteo", 6],
  ["2TI", "2TI", "2 Timóteo", 4], ["TIT", "TIT", "Tito", 3], ["PHM", "PHM", "Filemom", 1],
  ["HEB", "HEB", "Hebreus", 13], ["JAM", "JAS", "Tiago", 5], ["1PE", "1PE", "1 Pedro", 5],
  ["2PE", "2PE", "2 Pedro", 3], ["1JO", "1JN", "1 João", 5], ["2JO", "2JN", "2 João", 1],
  ["3JO", "3JN", "3 João", 1], ["JUD", "JUD", "Judas", 1], ["REV", "REV", "Apocalipse", 22]
];
const books = bookDefinitions.map(([sourceId, id, name, chapterCount]) => ({
  sourceId, id, name, chapters: Array.from({ length: chapterCount }, () => [])
}));
const sourceBooks = new Map(books.map((book) => [book.sourceId, book]));
let verseCount = 0;
for (const line of source.toString("utf8").replace(/^\uFEFF/, "").split(/\r?\n/)) {
  if (!line) continue;
  const match = /^(\w{3}) ([1-9]\d*):([1-9]\d*) (.+)$/.exec(line);
  if (!match) throw new Error("Unrecognized source line; import stopped.");
  const [, sourceId, chapterString, verseString, text] = match;
  const book = sourceBooks.get(sourceId);
  const chapter = book?.chapters[Number(chapterString) - 1];
  if (!chapter || Number(verseString) !== chapter.length + 1 || !text.trim()) throw new Error("Missing, duplicate or unordered verse.");
  chapter.push(text); // Preserve every source character within the verse, including translator brackets.
  verseCount++;
}
if (books.length !== 66 || books.some((book) => book.chapters.some((chapter) => !chapter.length)) || verseCount !== 31102) throw new Error("Incomplete source corpus.");
const data = { books: books.map(({ id, name, chapters }) => ({ id, name, chapters })) };
const output = `${JSON.stringify(data)}\n`;
if (process.argv.includes("--check")) {
  const existing = await readFile(new URL("blivre-tr-2018.json", directory), "utf8");
  if (existing !== output) throw new Error("Generated Bible differs; run node scripts/import-bible.mjs.");
} else {
  await writeFile(new URL("blivre-tr-2018.json", directory), output);
}
console.log(`Bible source verified: 66 books, 1189 chapters, ${verseCount} verses. JSON SHA-256 ${sha256(output)}.`);
