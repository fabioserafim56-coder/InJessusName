import type { Metadata } from "next";
import Link from "next/link";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { readOwnLearningProfile } from "@/lib/onboarding";
import { buildLearningPath } from "@/lib/learning-path";
import { LearningPathView } from "@/components/learning-path-view";
import { AccountControls } from "@/components/auth/account-controls";
import { getCurriculumStage } from "@/content/curriculum";
import type { LearningProfileInput } from "@/lib/learning-path";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Seu percurso — InJessusName", robots: { index: false, follow: false } };

export default async function MyLearningPathPage({ searchParams }: { searchParams: Promise<{ etapa?: string | string[] }> }) {
  const query = await searchParams;
  const requestedStage = typeof query.etapa === "string" ? getCurriculumStage(query.etapa)?.id : undefined;
  const user = await getCurrentUser();
  let profile: LearningProfileInput | null = null;
  let unavailable = false;
  if (user) {
    try { const client = await createClient(); profile = await readOwnLearningProfile(client, user.id); }
    catch { unavailable = true; }
  }
  const path = buildLearningPath(profile || { ageBand: "18_plus", traditionCode: null, baptismStatus: "not_informed", goal: "bible_foundations" });
  return <LearningPathView path={path} saved={Boolean(profile)} currentStageId={requestedStage}>
    {unavailable && <div className="lp-privacy-note" role="status"><p>Não conseguimos consultar suas escolhas agora. Nenhuma resposta foi alterada. O mapa público continua disponível.</p><Link className="text-link" href="/meu-percurso">Tentar consultar meu perfil novamente</Link></div>}
    {!profile && <div className="lp-privacy-note"><p>{user ? "Você ainda não tem uma personalização salva." : "Você pode explorar o percurso sem criar uma conta."} Este é o roteiro público para adultos. As práticas podem marcar o mapa apenas na memória desta visita. Nenhuma resposta é salva.</p><Link className="button button-primary" href="/comecar">Escolher meu percurso</Link></div>}
    {user && <AccountControls hasProfile={Boolean(profile)} />}
  </LearningPathView>;
}
