import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync, gunzipSync } from "node:zlib";

const root = fileURLToPath(new URL("../../", import.meta.url));
const directory = path.join(root, "public/ocr");
const digest = bytes => createHash("sha256").update(bytes).digest("hex");
const revision = "65727574dfcd264acbb0c3e07860e4e9e9b22185";
const languageSha256 = "c4932b937207a9514b7514d518b931a99938c02a28a5a5a553f8599ed58b7deb";
const source = `https://raw.githubusercontent.com/tesseract-ocr/tessdata_fast/${revision}`;
const manifestPath = path.join(directory, "proveniencia.json");

if (process.argv.includes("--check")) {
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  for (const record of manifest.files) {
    const bytes = await readFile(path.join(root, "public", record.path));
    if (bytes.length !== record.bytes || digest(bytes) !== record.sha256) throw new Error(`Arquivo OCR divergente: ${record.path}`);
  }
  const traineddata = gunzipSync(await readFile(path.join(directory, "lang/por.traineddata.gz")));
  if (digest(traineddata) !== languageSha256) throw new Error("O modelo de português não corresponde à revisão fixada.");
  console.log(`${manifest.files.length} arquivos OCR conferidos; português e binários preservados.`);
  process.exit(0);
}

const tesseract = JSON.parse(await readFile(path.join(root, "node_modules/tesseract.js/package.json"), "utf8"));
const core = JSON.parse(await readFile(path.join(root, "node_modules/tesseract.js-core/package.json"), "utf8"));
if (tesseract.version !== "7.0.0" || core.version !== "7.0.0") throw new Error("Use as versões fixadas Tesseract.js/core7.0.0 antes de preparar os arquivos.");
await Promise.all(["core", "lang", "licenses"].map(sub => mkdir(path.join(directory, sub), { recursive: true })));
const files = [];
async function save(relative, bytes, original) {
  await writeFile(path.join(directory, relative), bytes);
  files.push({ path: `/ocr/${relative}`, bytes: bytes.length, sha256: digest(bytes), source: original });
}
const workerFiles = ["worker.min.js", "worker.min.js.LICENSE.txt"];
for (const file of workerFiles) await save(file, await readFile(path.join(root, "node_modules/tesseract.js/dist", file)), `tesseract.js@7.0.0/dist/${file}`);
for (const flavor of ["lstm", "simd-lstm", "relaxedsimd-lstm"]) {
  const name = `tesseract-core-${flavor}.wasm.js`;
  await save(`core/${name}`, await readFile(path.join(root, "node_modules/tesseract.js-core", name)), `tesseract.js-core@7.0.0/${name}`);
}
for (const [module, target] of [["tesseract.js", "TESSERACT-JS-APACHE-2.0.txt"], ["tesseract.js-core", "TESSERACT-CORE-APACHE-2.0.txt"]]) {
  const licenseFile = module === "tesseract.js" ? "LICENSE.md" : "LICENSE";
  await save(`licenses/${target}`, await readFile(path.join(root, "node_modules", module, licenseFile)), `${module}@7.0.0/${licenseFile}`);
}
let language;
try { language = gunzipSync(await readFile(path.join(directory, "lang/por.traineddata.gz"))); }
catch {
  const response = await fetch(`${source}/por.traineddata`);
  if (!response.ok) throw new Error(`Não foi possível adquirir o modelo português: HTTP${response.status}`);
  language = Buffer.from(await response.arrayBuffer());
}
if (digest(language) !== languageSha256) throw new Error("Modelo português divergente da revisão verificada.");
await save("lang/por.traineddata.gz", gzipSync(language, { level: 9 }), `${source}/por.traineddata`);
const license = await fetch(`${source}/LICENSE`);
if (!license.ok) throw new Error("Não foi possível conferir a licença do modelo português.");
await save("licenses/TESSDATA-APACHE-2.0.txt", Buffer.from(await license.arrayBuffer()), `${source}/LICENSE`);
const manifest = {
  preparedAt: new Date().toISOString(),
  task: "Reconhecimento óptico de texto em português no navegador",
  engine: { name: "Tesseract.js", version: tesseract.version, url: "https://github.com/naptha/tesseract.js", license: "Apache-2.0" },
  core: { name: "Tesseract.js-core", version: core.version, url: "https://github.com/naptha/tesseract.js-core", license: "Apache-2.0", runtime: "WebAssembly LSTM; o aparelho carrega somente a variante compatível" },
  language: { code: "por", repository: "https://github.com/tesseract-ocr/tessdata_fast", revision, sourceSha256: languageSha256, license: "Apache-2.0" },
  privacy: "Reconhecimento local, iniciado por escolha. Foto e modelo não são enviados a um serviço externo. O texto confirmado é enviado ao próprio app apenas para localizar passagens; não é salvo em conta ou banco. O cache de modelos em IndexedDB foi desativado.",
  paddle: "PaddleOCR é uma opção separada, disponível somente quando o serviço de reconhecimento está configurado. Não é o motor deste reconhecimento local.",
  reproduce: "node scripts/ocr/prepare-assets.mjs; node scripts/ocr/prepare-assets.mjs --check",
  files
};
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log(`${files.length} arquivos OCR preparados; modelo por verificado antes da distribuição.`);
