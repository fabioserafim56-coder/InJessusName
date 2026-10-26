export class RequestError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export function privateJson(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "private, no-cache, no-store, must-revalidate, max-age=0",
      "Pragma": "no-cache",
      "Expires": "0",
      "Vary": "Cookie"
    }
  });
}

export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) throw new RequestError(403, "Reabra o aplicativo para continuar com segurança.");
  try {
    const source = new URL(origin);
    const target = new URL(request.url);
    const host = request.headers.get("host");
    const protocol = request.headers.get("x-forwarded-proto")?.split(",")[0].trim() === "https"
      ? "https:" : target.protocol;
    const forwardedOrigin = host ? `${protocol}//${host}` : target.origin;
    if (source.origin !== new URL(forwardedOrigin).origin) {
      throw new Error("Origem diferente");
    }
  } catch {
    throw new RequestError(403, "Reabra o aplicativo para continuar com segurança.");
  }
}

export async function readJsonObject(request: Request): Promise<Record<string, unknown>> {
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    throw new RequestError(415, "Envie os dados pelo formulário do aplicativo.");
  }
  const reader = request.body?.getReader();
  if (!reader) throw new RequestError(400, "Não recebemos os dados do formulário.");
  let length = 0;
  let text = "";
  const decoder = new TextDecoder();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.length;
      if (length > 8192) {
        await reader.cancel();
        throw new RequestError(413, "O formulário excedeu o tamanho permitido.");
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    const parsed: unknown = JSON.parse(text);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Objeto esperado");
    return parsed as Record<string, unknown>;
  } catch (error) {
    if (error instanceof RequestError) throw error;
    throw new RequestError(400, "Não foi possível ler o formulário. Confira e tente novamente.");
  }
}

export function requestFailure(error: unknown) {
  return error instanceof RequestError
    ? privateJson({ error: error.message }, error.status)
    : privateJson({ error: "Não conseguimos acessar o serviço agora. Suas respostas não foram confirmadas como salvas." }, 503);
}
