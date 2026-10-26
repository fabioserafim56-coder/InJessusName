import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { readOwnLearningProfile } from "@/lib/onboarding";
import { buildLearningPath } from "@/lib/learning-path";
import { LearningPathView } from "@/components/learning-path-view";
import { AccountControls } from "@/components/auth/account-controls";
import type { LearningProfileInput } from "@/lib/learning-path";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Seu percurso — InJessusName",
  robots: { index: false, follow: false }
};

export default async function MyLearningPathPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/entrar?next=/meu-percurso");
  const client = await createClient();
  let profile: LearningProfileInput | null = null;
  let unavailable = false;
  try {
    profile = await readOwnLearningProfile(client, user.id);
  } catch {
    unavailable = true;
  }
  if (unavailable) return <main className="container" style={{ paddingBlock: 80 }}>
      <h1>Vamos retomar seu percurso.</h1>
      <p>Não conseguimos consultar suas escolhas agora. Nenhuma resposta foi alterada.</p>
      <Link className="button button-primary" href="/meu-percurso">Tentar novamente</Link>
      <Link className="text-link" href="/jornada/adultos">Explorar o roteiro público</Link>
  </main>;
  const path = buildLearningPath(profile || {
    ageBand: "18_plus", traditionCode: null, baptismStatus: "not_informed", goal: "bible_foundations"
  });
  return <LearningPathView path={path} saved={Boolean(profile)}>
    {!profile && <div className="lp-privacy-note"><p>Você ainda não tem uma personalização salva. Este é o roteiro público para adultos.</p><Link className="button button-primary" href="/comecar">Escolher meu percurso</Link></div>}
    <AccountControls hasProfile={Boolean(profile)} />
  </LearningPathView>;
}
