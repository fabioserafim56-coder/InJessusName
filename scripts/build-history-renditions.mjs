import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = fileURLToPath(new URL("../", import.meta.url));
const publicRoot = path.join(root, "public");
const metadataPath = path.join(root, "src/content/church-history/photo-renditions.json");
const provenancePath = path.join(publicRoot, "church-history/proveniencia-rendicoes.json");
const directory = path.join(publicRoot, "church-history/renditions");
const photos = JSON.parse(await readFile(path.join(root, "src/content/church-history/photos.json"), "utf8"));
const widths = [480, 960, 1440, 2048, 3840];
const digest = data => createHash("sha256").update(data).digest("hex");
const checking = process.argv.includes("--check");
const expected = photos.flatMap(photo => widths.filter(width => width < photo.width).map(width => ({ photo, width })));

if (checking) {
  const manifest = JSON.parse(await readFile(metadataPath, "utf8"));
  const provenance = JSON.parse(await readFile(provenancePath, "utf8"));
  if (manifest.format !== "webp" || manifest.quality !== 95 || manifest.files.length !== expected.length) throw new Error("Metadados de rendições incompletos.");
  for (const key of ["generatedAt", "format", "quality", "files"]) {
    if (JSON.stringify(manifest[key]) !== JSON.stringify(provenance[key])) throw new Error(`Proveniência pública divergente: ${key}`);
  }
  for (const photo of photos) {
    const source = await readFile(path.join(publicRoot, photo.src));
    if (digest(source) !== photo.sha256) throw new Error(`Original alterado: ${photo.id}`);
  }
  for (const { photo, width } of expected) {
    const item = manifest.files.find(file => file.photoId === photo.id && file.width === width);
    if (!item || item.sourceSha256 !== photo.sha256) throw new Error(`Rendição sem vínculo com o original: ${photo.id} ${width}`);
    const data = await readFile(path.join(publicRoot, item.src));
    const image = await sharp(data).metadata();
    if (digest(data) !== item.sha256 || data.length !== item.bytes || image.width !== item.width || image.height !== item.height || image.format !== "webp") throw new Error(`Rendição divergente: ${item.src}`);
  }
  const actual = (await readdir(directory)).filter(name => name.endsWith(".webp")).sort();
  const tracked = manifest.files.map(item => path.basename(item.src)).sort();
  if (JSON.stringify(actual) !== JSON.stringify(tracked)) throw new Error("Há rendições ausentes ou sem registro.");
  console.log(`${manifest.files.length} rendições conferidas; originais preservados.`);
  process.exit(0);
}

await mkdir(directory, { recursive: true });
const files = [];
for (const photo of photos) {
  const source = await readFile(path.join(publicRoot, photo.src));
  const sourceSha256 = digest(source);
  if (sourceSha256 !== photo.sha256) throw new Error(`Original alterado: ${photo.id}`);
  for (const width of widths.filter(width => width < photo.width)) {
    const { data, info } = await sharp(source)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 95, effort: 6 })
      .toBuffer({ resolveWithObject: true });
    const src = `/church-history/renditions/${photo.id}-${width}.webp`;
    await writeFile(path.join(publicRoot, src), data);
    files.push({ photoId: photo.id, src, width: info.width, height: info.height, bytes: data.length, sha256: digest(data), sourceSha256 });
  }
  console.log(`${photo.id}: rendições geradas sem ampliar o original.`);
}

const metadata = { generatedAt: new Date().toISOString(), format: "webp", quality: 95, files };
await writeFile(metadataPath, JSON.stringify(metadata, null, 2) + "\n");
const provenance = {
  ...metadata,
  collection: "Rendições para exibição de fotografias e documentos históricos",
  process: "Redimensionamento proporcional e codificação WebP com Sharp. Sem retoques, restauração, geração por IA, recorte ou ampliação. Os arquivos originais continuam preservados e acessíveis por seus links.",
  recipe: { command: "node scripts/build-history-renditions.mjs", verifyCommand: "node scripts/build-history-renditions.mjs --check", widths, withoutEnlargement: true, effort: 6, sharp: sharp.versions.sharp, libvips: sharp.versions.vips },
  rights: "Autoria, licença e fonte de cada imagem continuam em /church-history/proveniencia.json. Estas cópias mudam apenas as dimensões e a codificação; sua publicação mantém os créditos e as condições da respectiva licença.",
  sourceManifest: "/church-history/proveniencia.json"
};
await writeFile(provenancePath, JSON.stringify(provenance, null, 2) + "\n");
console.log(`${files.length} rendições geradas; originais preservados.`);
