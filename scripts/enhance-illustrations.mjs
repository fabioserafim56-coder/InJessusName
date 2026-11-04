import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const execute = promisify(execFile);
const root = fileURLToPath(new URL("../", import.meta.url));
const directory = path.join(root, "public/visuals/enhanced");
const cache = process.env.INJESSUS_SWIN_MODEL_DIR || "/tmp/injessus-swin-model";
const python = process.env.INJESSUS_SWIN_PYTHON || "/tmp/injessus-kokoro-venv/bin/python";
const sourcePath = "/visuals/story-multiplicacao-dos-paes.png";
const source = await readFile(path.join(root, "public", sourcePath));
const digest = value => createHash("sha256").update(value).digest("hex");
const expectedSource = "9520767b8756eda3e6109d68110b026a400a8452fa2326c5472771704b740f32";
if (digest(source) !== expectedSource) throw new Error("A ilustração de origem não corresponde ao registro fixado.");
const crop = { left: 775, top: 555, width: 240, height: 192 };
await mkdir(directory, { recursive: true });
const temporary = await mkdtemp(path.join(os.tmpdir(), "injessus-swin-detail-"));
const inputPath = path.join(temporary, "source.rgb"), outputPath = path.join(temporary, "enhanced.rgb");
const detail = sharp(source).extract(crop).removeAlpha().toColourspace("srgb");
const original = await detail.clone().png().toBuffer();
await writeFile(inputPath, await detail.clone().raw().toBuffer());
const { stdout } = await execute(python, [path.join(root, "scripts/enhance-illustrations.py"), "--model", path.join(cache, "model.onnx"), "--input", inputPath, "--output", outputPath, "--width", String(crop.width), "--height", String(crop.height)], { timeout: 600000, maxBuffer: 2 * 1024 * 1024 });
const generation = JSON.parse(stdout.trim().split("\n").at(-1));
if (generation.width !== crop.width * 2 || generation.height !== crop.height * 2) throw new Error("Dimensões inesperadas na ampliação.");
const enhanced = await sharp(await readFile(outputPath), { raw: { width: generation.width, height: generation.height, channels: 3 } }).png().toBuffer();
const files = [
  { role: "artistic-source-crop", src: "/visuals/enhanced/bread-detail-original.png", width: crop.width, height: crop.height, bytes: original.length, sha256: digest(original) },
  { role: "model-estimated-upscale", src: "/visuals/enhanced/bread-detail-swin2sr-x2.png", width: generation.width, height: generation.height, bytes: enhanced.length, sha256: digest(enhanced) }
];
await writeFile(path.join(root, "public", files[0].src), original);
await writeFile(path.join(root, "public", files[1].src), enhanced);
const provenance = {
  title: "Ampliação experimental de um detalhe artístico: os pães",
  createdAt: new Date().toISOString(),
  status: "Experimento real de super-resolução x2. O modelo estima novos pixels. Não constitui recuperação autenticada de detalhes, reconstrução histórica, fotografia documental nem prova de melhoria percentual.",
  source: { src: sourcePath, sha256: expectedSource, type: "Ilustração interpretativa gerada para o projeto; não fotografia histórica", crop },
  model: { id: "caidas/swin2SR-classical-sr-x2-64", revision: "cee1c923c6a37361c6e5650b65dcf4be821e5d52", url: "https://huggingface.co/caidas/swin2SR-classical-sr-x2-64", license: "Apache-2.0" },
  conversion: { id: "Xenova/swin2SR-classical-sr-x2-64", revision: "93dfc9089abda257351d3a58d5771e2c1ff69442", url: "https://huggingface.co/Xenova/swin2SR-classical-sr-x2-64", file: "onnx/model.onnx", bytes: 54428699, sha256: generation.modelSha256, licensing: "Conversão ONNX que identifica o modelo de origem Apache-2.0; não foi presumida uma licença independente para o autor da conversão." },
  generation, recipe: "node scripts/enhance-illustrations.mjs; scripts/enhance-illustrations.py exige o SHA-256 fixado, usa uma thread CPU e não baixa nem executa pickle.",
  privacy: "Somente uma arte local do projeto foi processada antecipadamente. Nenhuma imagem de visitante ou fotografia de acervo foi enviada a um serviço.",
  files
};
await writeFile(path.join(directory, "swin2sr-proveniencia.json"), JSON.stringify(provenance, null, 2) + "\n");
console.log(JSON.stringify({ status: "generated", files, generation }, null, 2));
