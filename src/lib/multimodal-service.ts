import "server-only";

type ServicePath = "/vision" | "/ocr" | "/health";

export class MultimodalServiceError extends Error {
  constructor(public code: "not_configured" | "timeout" | "unavailable" | "invalid_response", message: string) { super(message); }
}

function serviceConfiguration() {
  const configured = process.env.INJESSUS_MULTIMODAL_SERVICE_URL?.trim();
  if (!configured) return null;
  try {
    const url = new URL(configured);
    const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
    const token = process.env.INJESSUS_MULTIMODAL_SERVICE_TOKEN?.trim();
    if (url.username || url.password || url.search || url.hash) return null;
    if (url.protocol !== "https:" && !(local && url.protocol === "http:")) return null;
    if (!local && !token) return null;
    return { url, token };
  } catch { return null; }
}

export function isMultimodalServiceConfigured() { return serviceConfiguration() !== null; }

async function serviceRequest<T>(path: ServicePath, body?: BodyInit, contentType?: string, signal?: AbortSignal): Promise<T> {
  const config = serviceConfiguration();
  if (!config) throw new MultimodalServiceError("not_configured", "A análise no servidor ainda não está disponível. A visita guiada continua aberta.");
  const endpoint = new URL(config.url);
  endpoint.pathname = `${endpoint.pathname.replace(/\/$/, "")}${path}`;
  const headers = new Headers({ Accept: "application/json" });
  if (config.token) headers.set("Authorization", `Bearer ${config.token}`);
  if (contentType) headers.set("Content-Type", contentType);
  try {
    const response = await fetch(endpoint, { method: body ? "POST" : "GET", headers, body, cache: "no-store", redirect: "error", signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(45000)]) : AbortSignal.timeout(45000) });
    if (!response.ok) throw new MultimodalServiceError("unavailable", "O serviço de análise não respondeu agora. Você pode continuar pela ficha e tentar novamente depois.");
    if (!response.headers.get("content-type")?.toLowerCase().includes("application/json")) throw new MultimodalServiceError("invalid_response", "Não conseguimos conferir a resposta do serviço de análise.");
    const reader = response.body?.getReader();
    if (!reader) throw new MultimodalServiceError("invalid_response", "Não recebemos uma resposta do serviço de análise.");
    const decoder = new TextDecoder();
    let length = 0, text = "";
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      length += part.value.byteLength;
      if (length > 128 * 1024) { await reader.cancel(); throw new MultimodalServiceError("invalid_response", "A resposta excedeu o tamanho permitido."); }
      text += decoder.decode(part.value, { stream: true });
    }
    text += decoder.decode();
    try { return JSON.parse(text) as T; }
    catch { throw new MultimodalServiceError("invalid_response", "Não conseguimos conferir a resposta do serviço de análise."); }
  } catch (error) {
    if (error instanceof MultimodalServiceError) throw error;
    if (error instanceof Error && ["TimeoutError", "AbortError"].includes(error.name)) throw new MultimodalServiceError("timeout", "A análise demorou mais que o esperado. Você pode tentar novamente ou continuar a visita guiada.");
    throw new MultimodalServiceError("unavailable", "Não conseguimos acessar o serviço de análise agora.");
  }
}

export function requestMultimodalJson<T>(path: ServicePath, payload: unknown, signal?: AbortSignal) {
  return serviceRequest<T>(path, JSON.stringify(payload), "application/json", signal);
}

export function requestMultimodalForm<T>(path: ServicePath, form: FormData, signal?: AbortSignal) {
  return serviceRequest<T>(path, form, undefined, signal);
}
