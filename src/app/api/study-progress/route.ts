import { createClient } from "@/lib/supabase/server";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { assertSameOrigin, privateJson, readJsonObject, requestFailure, RequestError } from "@/lib/http";
import { pilotLessonId, validateStudySubmission } from "@/lib/study-progress";

export const dynamic = "force-dynamic";

async function authenticatedClient() {
  if (!getSupabaseConfig()) throw new RequestError(503, "A conexão de contas ainda não está configurada. Você pode estudar sem salvar.");
  const client = await createClient();
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) throw new RequestError(401, "Entre na sua conta para guardar ou consultar o progresso.");
  return { client, user: data.user };
}

export async function GET() {
  try {
    const { client, user } = await authenticatedClient();
    const { data, error } = await client.from("pilot_study_progress")
      .select("summary,completed_at,updated_at")
      .eq("user_id", user.id).eq("lesson_id", pilotLessonId).maybeSingle();
    if (error) throw error;
    if (!data) return privateJson({ progress: null });
    const reviewDates = data.completed_at ? [1, 7].map((days) =>
      new Date(new Date(data.completed_at).getTime() + days * 86400000).toISOString()) : [];
    return privateJson({ progress: {
      ...data.summary, lessonId: pilotLessonId, completed: Boolean(data.completed_at),
      completedAt: data.completed_at, nextReviewAt: reviewDates[0] ?? null,
      reviewDates, updatedAt: data.updated_at
    } });
  } catch (error) { return requestFailure(error); }
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const { client } = await authenticatedClient();
    const input = validateStudySubmission(await readJsonObject(request));
    const { data, error } = await client.rpc("save_pilot_study_progress", {
      p_lesson_id: input.lessonId, p_answers: input.answers, p_completed: input.completed
    });
    if (error) {
      if (error.code === "42501") throw new RequestError(403, "Para guardar este progresso, é necessário um perfil adulto com autorização ativa para a personalização. Você pode continuar estudando sem salvar.");
      if (error.code === "22023") throw new RequestError(422, "O progresso não pôde substituir tentativas anteriores. Apague o progresso salvo para começar uma nova sessão.");
      throw error;
    }
    return privateJson({ progress: data });
  } catch (error) { return requestFailure(error); }
}

export async function DELETE(request: Request) {
  try {
    assertSameOrigin(request);
    const { client, user } = await authenticatedClient();
    const { error } = await client.from("pilot_study_progress").delete()
      .eq("user_id", user.id).eq("lesson_id", pilotLessonId);
    if (error) throw error;
    return privateJson({ progress: null });
  } catch (error) { return requestFailure(error); }
}
