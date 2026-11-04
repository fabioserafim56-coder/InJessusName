import { env, pipeline, type AutomaticSpeechRecognitionPipeline, type ProgressInfo } from "@huggingface/transformers";
import { voiceModel, type VoiceWorkerRequest, type VoiceWorkerResponse } from "@/lib/voice/model";

env.allowLocalModels = false;
env.useBrowserCache = true;
// Transformers.js 4's file-size discovery omits the pipeline revision option.
// Keep even those preliminary requests on the exact reviewed model snapshot.
env.remotePathTemplate = `{model}/resolve/${voiceModel.revision}/`;
// One thread also works without cross-origin isolation headers on hosted pages.
if (env.backends.onnx.wasm) {
  env.backends.onnx.wasm.numThreads = 1;
  env.backends.onnx.wasm.wasmPaths = new URL("/models/runtime/", self.location.origin).href;
}

const scope = self as unknown as {
  postMessage: (message: VoiceWorkerResponse) => void;
  addEventListener: (type: "message", callback: (event: MessageEvent<VoiceWorkerRequest>) => void) => void;
};
let recognizer: Promise<AutomaticSpeechRecognitionPipeline> | undefined;
let busy = false;
let currentId = 0;
const files = new Map<string, { loaded: number; total: number }>();

function progress(info: ProgressInfo) {
  if (info.status === "progress" && typeof info.loaded === "number" && typeof info.total === "number") files.set(info.file, { loaded: info.loaded, total: info.total });
  const values = [...files.values()];
  const total = values.reduce((sum, value) => sum + value.total, 0);
  const loaded = values.reduce((sum, value) => sum + value.loaded, 0);
  scope.postMessage({ type: "progress", id: currentId, progress: total ? Math.min(99, Math.round(loaded / total * 100)) : null });
}

async function prepare() {
  if (!recognizer) {
    files.clear();
    recognizer = pipeline("automatic-speech-recognition", voiceModel.id, {
      revision: voiceModel.revision,
      dtype: "q8",
      device: "wasm",
      progress_callback: progress
    });
  }
  return recognizer;
}

scope.addEventListener("message", async ({ data }) => {
  if (busy || !data || (data.type !== "prepare" && data.type !== "transcribe")) return;
  busy = true;
  currentId = data.id;
  try {
    const transcribe = await prepare();
    scope.postMessage({ type: "ready", id: data.id });
    if (data.type === "transcribe") {
      if (!(data.samples instanceof Float32Array) || !data.samples.length || data.samples.length > voiceModel.samplingRate * (voiceModel.maximumSeconds + .1)) throw new Error("Áudio fora do limite.");
      scope.postMessage({ type: "transcribing", id: data.id });
      const result = await transcribe(data.samples, {
        language: voiceModel.language,
        task: "transcribe",
        chunk_length_s: 20,
        stride_length_s: 3,
        return_timestamps: false,
        max_new_tokens: 256,
        do_sample: false
      });
      const text = (Array.isArray(result) ? result.map(part => part.text).join(" ") : result.text).replace(/\s+/g, " ").trim();
      scope.postMessage({ type: "transcript", id: data.id, text });
    }
  } catch (error) {
    recognizer = undefined;
    console.error("Falha no reconhecimento local de voz:", error instanceof Error ? error.message : "erro desconhecido");
    scope.postMessage({ type: "error", id: data.id, message: "Não foi possível preparar ou transcrever o áudio agora. Confira a conexão e tente novamente. Você também pode escrever sua pergunta." });
  } finally { busy = false; }
});
