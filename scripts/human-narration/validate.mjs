import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// This checks release metadata and file integrity. It cannot replace listening,
// biblical review, or the rights holder's actual recording authorization.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const manifestPath = path.join(root, "src/content/human-narration/manifest.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const failures = [];
const allowedLicenses = new Set(["CC0-1.0", "CC-BY-4.0", "CC-BY-SA-4.0"]);
const ids = new Set();
const check = (condition, message) => { if (!condition) failures.push(message); };
const hasText = (value) => typeof value === "string" && value.trim().length > 0;
const isUrl = (value) => {
  try { return new URL(value).protocol === "https:"; } catch { return false; }
};
const isDate = (value) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
const isPositive = (value) => typeof value === "number" && Number.isFinite(value) && value > 0;

check(manifest.schemaVersion === 1, "schemaVersion deve ser 1.");
check(manifest.locale === "pt-BR", "O catálogo deve identificar português brasileiro (pt-BR).");
check(manifest.contentKind === "biblical-retelling", "Este catálogo é de reconto bíblico, não de versículos de uma tradução.");
check(Array.isArray(manifest.recordings), "recordings deve ser uma lista.");

for (const recording of Array.isArray(manifest.recordings) ? manifest.recordings : []) {
  const label = hasText(recording.id) ? recording.id : "Gravação sem id";
  check(hasText(recording.id) && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(recording.id), `${label}: id inválido.`);
  check(!ids.has(recording.id), `${label}: id repetido.`);
  ids.add(recording.id);
  check(hasText(recording.storyId), `${label}: storyId ausente.`);
  check(hasText(recording.title), `${label}: título ausente.`);
  check(recording.voiceKind === "human-recording", `${label}: somente gravação realizada por uma pessoa pode entrar neste catálogo.`);
  check(recording.locale === "pt-BR" && hasText(recording.localeEvidence), `${label}: falta evidência de português brasileiro.`);
  check(hasText(recording.narratorCredit), `${label}: crédito do narrador ausente.`);
  check(isUrl(recording.sourceUrl), `${label}: falta URL de origem/proveniência em HTTPS.`);
  check(isPositive(recording.durationSeconds), `${label}: duração inválida.`);
  check(Number.isSafeInteger(recording.bytes) && recording.bytes > 0, `${label}: tamanho inválido.`);
  check(typeof recording.sha256 === "string" && /^[a-f0-9]{64}$/.test(recording.sha256), `${label}: SHA-256 inválido.`);

  for (const kind of ["audioRights", "textRights"]) {
    const rights = recording[kind];
    check(rights && allowedLicenses.has(rights.license), `${label}: ${kind} requer CC0, CC BY 4.0 ou CC BY-SA 4.0.`);
    check(isUrl(rights?.licenseUrl) && isUrl(rights?.evidenceUrl), `${label}: ${kind} sem licença e evidência publicadas.`);
    check(hasText(rights?.attribution), `${label}: ${kind} sem atribuição.`);
  }

  for (const kind of ["rights", "listening", "biblical", "transcriptAlignment"]) {
    const review = recording.reviews?.[kind];
    check(hasText(review?.reviewer) && isDate(review?.date) && review?.approved === true,
      `${label}: revisão ${kind} ainda não aprovada e identificada.`);
  }

  const frames = Array.isArray(recording.frames) ? recording.frames : [];
  check(frames.length > 0, `${label}: falta a transcrição correspondente à gravação.`);
  let previousEnd = 0;
  for (const [index, frame] of frames.entries()) {
    const prefix = `${label}, trecho ${index + 1}`;
    check(hasText(frame.text) && hasText(frame.reference), `${prefix}: faltam transcrição/referência bíblica.`);
    check(typeof frame.startSeconds === "number" && Number.isFinite(frame.startSeconds) && frame.startSeconds >= previousEnd,
      `${prefix}: início inválido ou trechos sobrepostos.`);
    check(typeof frame.endSeconds === "number" && Number.isFinite(frame.endSeconds) && frame.endSeconds > frame.startSeconds && frame.endSeconds <= recording.durationSeconds,
      `${prefix}: fim inválido ou fora da gravação.`);
    previousEnd = frame.endSeconds;
  }

  const validAudioPath = typeof recording.src === "string" && /^\/audio\/human\/[a-z0-9-]+\.mp3$/.test(recording.src);
  check(validAudioPath, `${label}: o MP3 deve estar em /audio/human/, com nome simples e sem caminhos externos.`);
  if (validAudioPath) {
    try {
      const audioPath = path.join(root, "public", recording.src);
      const info = await stat(audioPath);
      check(info.isFile() && info.size === recording.bytes, `${label}: tamanho do MP3 diverge do manifesto.`);
      const sha256 = createHash("sha256").update(await readFile(audioPath)).digest("hex");
      check(sha256 === recording.sha256, `${label}: SHA-256 do MP3 diverge do manifesto.`);
    } catch (error) {
      failures.push(`${label}: não foi possível conferir o MP3 (${error.code ?? error.message}).`);
    }
  }
}

if (process.argv.includes("--require-recordings")) {
  check(manifest.recordings?.length > 0, "Nenhuma gravação humana aprovada foi incorporada. Não anunciar narração humana disponível.");
}

if (failures.length) {
  for (const message of failures) console.error(`• ${message}`);
  process.exitCode = 1;
} else {
  console.log(`${manifest.recordings.length} gravação(ões) humana(s) cadastrada(s). Metadados e integridade conferidos; a qualidade depende das revisões identificadas.`);
}
