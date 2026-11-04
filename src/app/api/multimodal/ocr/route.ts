import { assertSameOrigin, privateJson, RequestError } from "@/lib/http";
import { isMultimodalServiceConfigured, MultimodalServiceError, requestMultimodalForm } from "@/lib/multimodal-service";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

export function GET() {
  return privateJson({ available: isMultimodalServiceConfigured(), provider: "paddleocr", receivesPersonalImages: true });
}

async function boundedForm(request: Request): Promise<FormData> {
  const contentType = request.headers.get("content-type") || "";
  if (!/^multipart\/form-data\s*;/i.test(contentType)) throw new RequestError(415, "Escolha uma fotografia pelo aplicativo.");
  const reader = request.body?.getReader();
  if (!reader) throw new RequestError(400, "Não recebemos a fotografia.");
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const part = await reader.read();
    if (part.done) break;
    length += part.value.byteLength;
    if (length > 4 * 1024 * 1024 + 64 * 1024) { await reader.cancel(); throw new RequestError(413, "Para este serviço, use uma imagem de até 4 MB."); }
    chunks.push(part.value);
  }
  const body = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
  try { return await new Response(body, { headers: { "Content-Type": contentType } }).formData(); }
  catch { throw new RequestError(400, "Não conseguimos abrir a fotografia enviada."); }
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    if (!isMultimodalServiceConfigured()) throw new RequestError(503, "O serviço de leitura ainda não está disponível. Você pode reconhecer a foto neste aparelho.");
    const data = await boundedForm(request);
    const image = data.get("image");
    if (!(image instanceof File) || !["image/jpeg", "image/png", "image/webp"].includes(image.type) || image.size < 12 || image.size > 4 * 1024 * 1024) throw new RequestError(400, "Envie uma imagem JPEG, PNG ou WebP de até 4 MB.");
    const header = new Uint8Array(await image.slice(0, 12).arrayBuffer());
    const jpeg = header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;
    const png = header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4e && header[3] === 0x47;
    const webp = String.fromCharCode(...header.slice(0, 4)) === "RIFF" && String.fromCharCode(...header.slice(8, 12)) === "WEBP";
    if (!jpeg && !png && !webp) throw new RequestError(400, "O arquivo não corresponde a uma fotografia reconhecida.");
    const form = new FormData();
    form.set("image", image, `pagina.${jpeg ? "jpg" : png ? "png" : "webp"}`);
    const result = await requestMultimodalForm<{ text?: unknown; provider?: unknown; lines?: unknown }>("/ocr", form, request.signal);
    if (result.provider !== "paddleocr" || typeof result.text !== "string" || result.text.length > 20000) throw new MultimodalServiceError("invalid_response", "Não conseguimos conferir a leitura recebida do serviço.");
    return privateJson({ text: result.text.slice(0, 4000), provider: "paddleocr" });
  } catch (error) {
    if (error instanceof RequestError) return privateJson({ error: error.message }, error.status);
    if (error instanceof MultimodalServiceError) return privateJson({ error: error.message, code: error.code }, error.code === "timeout" ? 504 : 503);
    return privateJson({ error: "Não conseguimos reconhecer esta fotografia agora. Tente a leitura neste aparelho." }, 503);
  }
}
