import { rankSemanticDocuments } from "@/lib/semantic/rank";
import { semanticModel, type SemanticDocument, type SemanticWorkerReply } from "@/lib/semantic/types";

type Encoder = (text: string, options: { pooling: "mean"; normalize: true }) => Promise<{ data: ArrayLike<number> }>;
type WorkerScope = { postMessage: (value: SemanticWorkerReply) => void; onmessage: ((event: MessageEvent<{ type: "load" | "search"; query?: string }>) => void) | null };
const scope = self as unknown as WorkerScope;
let encoder: Encoder | null = null;
let documents: SemanticDocument[] = [];
let vectors: Float32Array | null = null;
let loading: Promise<void> | null = null;

async function load() {
  if (encoder && vectors) return;
  if (loading) return loading;
  loading = (async () => {
    scope.postMessage({ type: "progress", message: "Preparando as leituras e o modelo de busca…" });
    const [{ pipeline, env }, documentResponse, vectorResponse] = await Promise.all([
      import("@huggingface/transformers"), fetch("/semantic/documents.json"), fetch("/semantic/vectors.f32")
    ]);
    if (!documentResponse.ok || !vectorResponse.ok) throw new Error("Não foi possível carregar as leituras. Verifique a conexão e tente novamente.");
    documents = await documentResponse.json();
    vectors = new Float32Array(await vectorResponse.arrayBuffer());
    if (vectors.length !== documents.length * semanticModel.dimensions) throw new Error("O arquivo das leituras está incompleto. Tente novamente.");
    env.allowLocalModels = false;
    env.allowRemoteModels = true;
    // Transformers.js 4 also preflights model files; pin those requests as well.
    env.remotePathTemplate = `{model}/resolve/${semanticModel.revision}/`;
    if (env.backends.onnx.wasm) {
      env.backends.onnx.wasm.numThreads = 1;
      env.backends.onnx.wasm.wasmPaths = new URL("/models/runtime/", self.location.origin).href;
    }
    encoder = await pipeline("feature-extraction", semanticModel.id, {
      revision: semanticModel.revision,
      dtype: semanticModel.dtype,
      device: "wasm",
      progress_callback: (value: unknown) => {
        const event = value as { status?: string; file?: string; progress?: number };
        if (event.status === "progress") scope.postMessage({ type: "progress", message: event.file?.endsWith(".onnx") ? "Baixando o modelo. Este passo só é necessário na primeira preparação." : "Preparando os arquivos da busca…", ...(Number.isFinite(event.progress) ? { progress: Math.max(0, Math.min(100, event.progress!)) } : {}) });
        if (event.status === "done" && event.file?.endsWith(".onnx")) scope.postMessage({ type: "progress", message: "Modelo recebido. Preparando a primeira consulta…" });
      }
    }) as unknown as Encoder;
  })().finally(() => { loading = null; });
  return loading;
}

scope.onmessage = event => {
  void (async () => {
    if (event.data.type === "load") {
      await load();
      scope.postMessage({ type: "ready", count: documents.length });
      return;
    }
    const query = event.data.query?.replace(/\s+/g, " ").trim() || "";
    if (query.length < 4 || query.length > 280) throw new Error("Escreva uma pergunta entre 4 e 280 caracteres.");
    await load();
    if (!encoder || !vectors) throw new Error("A busca ainda está sendo preparada.");
    const output = await encoder(`query: ${query}`, { pooling: "mean", normalize: true });
    scope.postMessage({ type: "results", query, results: rankSemanticDocuments(output.data, vectors, documents, semanticModel.dimensions) });
  })().catch(error => scope.postMessage({ type: "error", message: error instanceof Error && !/fetch|network|onnx|wasm|model|timed|failed/i.test(error.message) ? error.message : "Não conseguimos preparar a busca neste dispositivo ou conexão. Você pode tentar novamente ou usar a pesquisa por palavras." }));
};
