import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { AppShell } from "@/components/app-shell";
import { getCurrentUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Entrar — InJessusName",
  description: "Continue seu percurso de estudo e vivência cristã.",
  robots: { index: false, follow: false }
};

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ next?: string | string[] }> }) {
  const params = await searchParams;
  const next = params.next === "/meu-percurso" ? "/meu-percurso" : "/comecar";
  const user = await getCurrentUser();
  if (user) redirect(params.next === "/comecar" ? "/comecar" : "/meu-percurso");
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim());

  return (
    <AppShell active="profile" title="Sua conta" subtitle="Seu percurso e suas escolhas"><div className="auth-page app-auth-page">
      <div className="auth-page-grid">
        <section className="auth-introduction" aria-labelledby="auth-page-title"><span className="auth-eyebrow">SEU CAMINHO TEM CONTINUIDADE</span><h1 id="auth-page-title">Que bom ter você por aqui.</h1><p>Entre para guardar seu percurso e voltar ao que está cultivando. A Palavra e os estudos também estão abertos para quem prefere chegar sem uma conta.</p><Link href="/aprender">Conhecer os estudos sem conta →</Link></section>
        <AuthForm configured={configured} next={next} />
      </div>
      <footer className="auth-footer"><p>Uma iniciativa educacional cristã independente, sem vínculo institucional oficial com igrejas ou denominações.</p><Link href="/privacidade">Privacidade e escolhas</Link></footer>
    </div></AppShell>
  );
}
