import { createClient } from "@/lib/supabase/server";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { assertSameOrigin, privateJson, readJsonObject, requestFailure, RequestError } from "@/lib/http";
import { readOwnLearningProfile, validateInterview } from "@/lib/onboarding";

export const dynamic = "force-dynamic";

async function authenticatedClient() {
  if (!getSupabaseConfig()) throw new RequestError(503, "A conexão de contas ainda não está configurada. Você pode explorar sem salvar.");
  const client = await createClient();
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) throw new RequestError(401, "Entre na sua conta para salvar ou consultar o seu percurso.");
  return { client, user: data.user };
}

export async function GET() {
  try {
    const { client, user } = await authenticatedClient();
    return privateJson({ profile: await readOwnLearningProfile(client, user.id) });
  } catch (error) { return requestFailure(error); }
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const { client } = await authenticatedClient();
    const profile = validateInterview(await readJsonObject(request));
    const { error } = await client.rpc("save_learning_profile", {
      p_age_band: profile.ageBand,
      p_tradition_code: profile.traditionCode,
      p_baptism_status: profile.baptismStatus,
      p_learning_goal: profile.goal,
      p_consent: true
    });
    if (error) {
      if (error.code === "42501") throw new RequestError(403, "Este perfil requer uma verificação adicional antes de salvar. Continue pelo percurso público.");
      throw error;
    }
    return privateJson({ redirect: "/meu-percurso" });
  } catch (error) { return requestFailure(error); }
}

export async function DELETE(request: Request) {
  try {
    assertSameOrigin(request);
    const { client } = await authenticatedClient();
    const { error } = await client.rpc("revoke_learning_personalization");
    if (error) throw error;
    return privateJson({ redirect: "/jornada/adultos" });
  } catch (error) { return requestFailure(error); }
}
