import { createClient } from "@/lib/supabase/server";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { assertSameOrigin, privateJson, readJsonObject, requestFailure, RequestError } from "@/lib/http";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    if (!getSupabaseConfig()) throw new RequestError(503, "As contas ainda não estão conectadas. Você pode explorar os percursos públicos.");
    const body = await readJsonObject(request);
    if (body.mode !== "signin" && body.mode !== "signup") throw new RequestError(400, "Escolha entrar ou criar uma conta.");
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || password.length < 8 || password.length > 128) {
      throw new RequestError(422, "Informe um e-mail válido e uma senha de 8 a 128 caracteres.");
    }
    if (body.mode === "signup" && body.adultConfirmation !== true) {
      throw new RequestError(403, "As contas desta etapa são para maiores de 18 anos. Os percursos públicos continuam disponíveis.");
    }
    const client = await createClient();
    const result = body.mode === "signup"
      ? await client.auth.signUp({ email, password, options: { emailRedirectTo: new URL("/auth/callback", request.url).href } })
      : await client.auth.signInWithPassword({ email, password });
    if (result.error) {
      if (result.error.status === 429) throw new RequestError(429, "Muitas tentativas. Aguarde um pouco antes de tentar novamente.");
      throw new RequestError(400, body.mode === "signin"
        ? "Não foi possível entrar. Confira o e-mail e a senha."
        : "Não foi possível criar a conta. Confira os dados ou tente entrar se já possui uma conta.");
    }
    if (!result.data.session) return privateJson({ requiresEmailConfirmation: true, message: "Confira seu e-mail para confirmar a conta antes de entrar." }, 202);
    return privateJson({ redirect: body.next === "/meu-percurso" ? "/meu-percurso" : "/comecar" });
  } catch (error) { return requestFailure(error); }
}
