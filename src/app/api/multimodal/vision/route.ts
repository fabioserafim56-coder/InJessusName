import { readFile } from "node:fs/promises";
import path from "node:path";
import { getMuseumExhibit } from "@/content/museum";
import { museumContext } from "@/content/multimodal/museum";
import { assertSameOrigin, privateJson, readJsonObject, RequestError } from "@/lib/http";
import { MultimodalServiceError } from "@/lib/multimodal-service";
import { requestVision, visionAvailability } from "@/lib/cloud-vision";

export const runtime = "nodejs";
export const maxDuration = 60;

export function GET() {
  return privateJson({ ...visionAvailability(), mode: "image-and-documentation", receivesPersonalImages: false });
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const data = await readJsonObject(request);
    const exhibitId = typeof data.exhibitId === "string" ? data.exhibitId : "";
    const question = typeof data.question === "string" ? data.question.trim().replace(/[\u0000-\u001f\u007f]/g, " ") : "";
    const exhibit = getMuseumExhibit(exhibitId);
    if (!exhibit || !question || question.length > 500) throw new RequestError(400, "Escolha uma peça e escreva uma pergunta de até 500 caracteres.");
    if (!visionAvailability().available) return privateJson({ available: false, error: "As perguntas livres com análise de imagem ainda não estão disponíveis. Você pode explorar os pontos da visita guiada e suas fontes." }, 503);
    // The browser chooses only an allowlisted exhibit. It cannot submit image URLs,
    // file paths or private photographs to this endpoint.
    const image = await readFile(path.join(process.cwd(), "public/museum", path.basename(exhibit.image.src)));
    if (image.byteLength > 2 * 1024 * 1024) throw new RequestError(413, "Esta imagem não está disponível para análise.");
    const response = await requestVision({ imageBase64: image.toString("base64"), mimeType: "image/jpeg", question, context: museumContext(exhibitId) }, request.signal);
    return privateJson({ ...response, exhibitId, sources: exhibit.sources, bibleConnections: exhibit.bibleConnections, notice: "Resposta assistida por IA. Confira as afirmações na ficha e nas fontes; a imagem não autentica sozinha uma inscrição ou um acontecimento." });
  } catch (error) {
    if (error instanceof RequestError) return privateJson({ error: error.message }, error.status);
    if (error instanceof MultimodalServiceError) return privateJson({ error: error.message, code: error.code }, error.code === "timeout" ? 504 : 503);
    return privateJson({ error: "Não conseguimos analisar a imagem agora. A ficha e a visita guiada continuam disponíveis." }, 503);
  }
}
