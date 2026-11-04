import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = path.join(root, "public/models/runtime");
const info = JSON.parse(await readFile(path.join(root, "node_modules/onnxruntime-web/package.json"), "utf8"));
const names = ["ort-wasm-simd-threaded.mjs", "ort-wasm-simd-threaded.wasm", "ort-wasm-simd-threaded.asyncify.mjs", "ort-wasm-simd-threaded.asyncify.wasm"];
const digest = bytes => createHash("sha256").update(bytes).digest("hex");
const checking = process.argv.includes("--check");
await mkdir(output, { recursive: true });
for (const name of names) {
  const bytes = await readFile(path.join(root, "node_modules/onnxruntime-web/dist", name));
  if (checking) {
    if (digest(await readFile(path.join(output, name))) !== digest(bytes)) throw new Error(`Runtime diferente do lockfile: ${name}`);
  } else await writeFile(path.join(output, name), bytes);
}
const files = [];
for (const name of [...names, "ONNXRUNTIME-LICENSE.txt"]) {
  const bytes = await readFile(path.join(output, name));
  files.push({ path: `/models/runtime/${name}`, bytes: bytes.length, sha256: digest(bytes) });
}
const provenance = { runtime: "onnxruntime-web", version: info.version, source: "https://github.com/microsoft/onnxruntime", license: "MIT", licenseSource: "https://raw.githubusercontent.com/microsoft/onnxruntime/main/LICENSE", files, usage: "Arquivos WASM/ESM para processamento local, carregados somente ao preparar voz ou busca por significado. Não são pesos de modelos nem gravações de visitantes." };
if (checking) {
  const saved = JSON.parse(await readFile(path.join(output, "proveniencia.json"), "utf8"));
  if (JSON.stringify(saved) !== JSON.stringify(provenance)) throw new Error("A proveniência do runtime não corresponde aos arquivos distribuídos.");
} else await writeFile(path.join(output, "proveniencia.json"), JSON.stringify(provenance, null, 2) + "\n");
console.log(`${names.length} arquivos do runtime ${info.version} conferidos; licença MIT preservada.`);
