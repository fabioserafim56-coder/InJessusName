import { assertSameOrigin, privateJson, readJsonObject, RequestError } from "@/lib/http";
import { locateScripture } from "@/lib/ocr/locate";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const body = await readJsonObject(request);
    if (typeof body.text !== "string" || body.text.length > 4000) throw new RequestError(400, "Use até 4.000 caracteres para localizar a passagem.");
    return privateJson(locateScripture(body.text));
  } catch (error) {
    return privateJson({ error: error instanceof RequestError ? error.message : "Não conseguimos procurar a passagem agora. Seu texto não foi salvo." }, error instanceof RequestError ? error.status : 503);
  }
}
