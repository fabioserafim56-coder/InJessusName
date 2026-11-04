import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

function compile(relative, inputs = {}) {
  const code = ts.transpileModule(readFileSync(new URL(`../../${relative}`, import.meta.url), "utf8"), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText;
  const loaded = { exports: {} };
  new Function("require", "module", "exports", code)(name => {
    assert.ok(name in inputs, `Only the real expected local module is loaded: ${name}`);
    return inputs[name];
  }, loaded, loaded.exports);
  return loaded.exports;
}

const model = compile("src/lib/voice/model.ts");
const { resampleMono, validateAudioFile } = compile("src/components/multimodal/voice-audio.ts", { "@/lib/voice/model": model });

test("voice preprocessing preserves a known 1kHz tone when downmixing stereo 48kHz to mono 16kHz", () => {
  const tone = Float32Array.from({ length: 48000 }, (_, sample) => .8 * Math.sin(2 * Math.PI * 1000 * sample / 48000));
  const silence = new Float32Array(48000);
  const mono = resampleMono([tone, silence], 48000);
  assert.equal(mono.length, 16000);
  let squareError = 0;
  for (let sample = 0; sample < mono.length; sample++) squareError += (mono[sample] - .4 * Math.sin(2 * Math.PI * 1000 * sample / 16000)) ** 2;
  assert.ok(Math.sqrt(squareError / mono.length) < .001, "The voice's audible frequency and channel-average gain are preserved");
});

test("voice preprocessing rejects silence, invalid samples and recordings longer than one minute", () => {
  assert.throws(() => resampleMono([new Float32Array(16000)], 16000), /silêncio/);
  const invalid = new Float32Array(16000).fill(.2); invalid[14] = NaN;
  assert.throws(() => resampleMono([invalid], 16000), /gravar novamente/);
  assert.throws(() => resampleMono([new Float32Array(16000 * 61).fill(.2)], 16000), /60 segundos/);
  assert.throws(() => resampleMono([new Float32Array(16000).fill(.2)], 0), /formato/);
  const valid = resampleMono([new Float32Array(16000 * 60).fill(.2)], 16000);
  assert.equal(valid.length, 960000);
});

test("voice upload rejects oversized, empty and non-audio files before decoding", () => {
  assert.throws(() => validateAudioFile(new Blob([], { type: "audio/wav" })), /vazio/);
  assert.throws(() => validateAudioFile(new Blob([new Uint8Array(8 * 1024 * 1024 + 1)], { type: "audio/wav" })), /8 MB/);
  assert.throws(() => validateAudioFile(new Blob(["image"], { type: "image/png" }), "pagina.png"), /arquivo de áudio/);
  assert.throws(() => validateAudioFile(new Blob(["text"]), "texto.txt"), /arquivo de áudio/);
  assert.doesNotThrow(() => validateAudioFile(new Blob(["container"], { type: "audio/webm;codecs=opus" }), "gravacao.webm"));
  assert.doesNotThrow(() => validateAudioFile(new Blob(["container"]), "gravacao.MP3"));
});
