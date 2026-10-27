import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = new URL("../", import.meta.url);
const exhibits = JSON.parse(await readFile(new URL("src/content/museum/exhibits.json", root), "utf8"));
const bible = JSON.parse(await readFile(new URL("src/content/bible/blivre-tr-2018.json", root), "utf8"));
assert.ok(exhibits.length >= 4, "O acervo inicial deve conter ao menos quatro peças documentadas.");
assert.equal(new Set(exhibits.map((item) => item.id)).size, exhibits.length, "IDs repetidos.");
let references = 0;
for (const exhibit of exhibits) {
  assert.match(exhibit.id, /^[a-z0-9-]+$/);
  assert.match(exhibit.image.src, /^\/museum\/[a-z0-9-]+\.jpg$/);
  const picture = await readFile(new URL(`public${exhibit.image.src}`, root));
  assert.equal(createHash("sha256").update(picture).digest("hex"), exhibit.image.sha256, `Original alterado: ${exhibit.id}`);
  const metadata = await sharp(picture).metadata();
  assert.equal(metadata.width, exhibit.image.width, `Largura incorreta: ${exhibit.id}`);
  assert.equal(metadata.height, exhibit.image.height, `Altura incorreta: ${exhibit.id}`);
  assert.equal(metadata.format, "jpeg");
  assert.ok(exhibit.image.alt.length > 30 && exhibit.image.credit.includes("1917"));
  assert.ok(exhibit.whatItShows.length && exhibit.limits.length && exhibit.story.length);
  assert.ok(exhibit.startYear <= exhibit.endYear);
  for (const source of [...exhibit.sources, { url: exhibit.image.sourceUrl }, { url: exhibit.image.licenseUrl }]) {
    assert.equal(new URL(source.url).protocol, "https:");
  }
  for (const reference of exhibit.bibleConnections) {
    const book = bible.books.find((item) => item.id === reference.book);
    assert.ok(book, `Livro inexistente em ${exhibit.id}`);
    const chapter = book.chapters[reference.chapter - 1];
    assert.ok(chapter, `Capítulo inexistente em ${exhibit.id}`);
    assert.ok(reference.startVerse >= 1 && reference.endVerse >= reference.startVerse && reference.endVerse <= chapter.length, `Versículos inválidos em ${exhibit.id}`);
    references++;
  }
}
console.log(`${exhibits.length} peças: fotografias originais, SHA-256, dimensões, fontes e ${references} conexões bíblicas verificados em ${fileURLToPath(root)}.`);
