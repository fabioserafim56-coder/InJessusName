import "server-only";
import { createClient } from "@/lib/supabase/server";
import { RequestError } from "@/lib/http";
import type { LearningProfileInput } from "@/lib/learning-path";

const traditions = ["ccb", "roman_catholic", "evangelical_protestant"] as const;
const baptisms = ["not_informed", "not_baptized", "baptized"] as const;
const goals = ["bible_foundations", "christian_service", "theology_history"] as const;

export function validateInterview(body: Record<string, unknown>): LearningProfileInput {
  const allowed = ["ageBand", "traditionCode", "baptismStatus", "goal", "consent"];
  if (Object.keys(body).some((key) => !allowed.includes(key))) {
    throw new RequestError(400, "O formulário contém campos que não pertencem à entrevista.");
  }
  if (body.ageBand !== "18_plus") {
    throw new RequestError(403, "O perfil salvo está disponível para adultos. Para menores, explore o percurso público com apoio de um responsável.");
  }
  if (body.consent !== true) {
    throw new RequestError(422, "A personalização só pode ser salva com sua autorização específica.");
  }
  if ((body.traditionCode !== null && !traditions.includes(body.traditionCode as typeof traditions[number]))
    || !baptisms.includes(body.baptismStatus as typeof baptisms[number])
    || !goals.includes(body.goal as typeof goals[number])) {
    throw new RequestError(422, "Escolha uma resposta válida para cada pergunta.");
  }
  return {
    ageBand: "18_plus",
    traditionCode: body.traditionCode as LearningProfileInput["traditionCode"],
    baptismStatus: body.baptismStatus as LearningProfileInput["baptismStatus"],
    goal: body.goal as LearningProfileInput["goal"]
  };
}

export async function readOwnLearningProfile(client: Awaited<ReturnType<typeof createClient>>, userId: string): Promise<LearningProfileInput | null> {
  const { data, error } = await client.from("learning_profiles")
    .select("age_band,tradition_id,baptism_status,learning_goal")
    .eq("user_id", userId).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  let traditionCode: LearningProfileInput["traditionCode"] = null;
  if (data.tradition_id) {
    const tradition = await client.from("traditions").select("code")
      .eq("id", data.tradition_id).maybeSingle();
    if (tradition.error) throw tradition.error;
    const code = tradition.data?.code;
    if (traditions.includes(code)) traditionCode = code;
  }
  return { ageBand: data.age_band, traditionCode, baptismStatus: data.baptism_status, goal: data.learning_goal };
}
