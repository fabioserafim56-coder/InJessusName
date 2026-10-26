import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
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
    <main className="auth-page">
      <header className="auth-page-header"><Link href="/" className="auth-brand">InJessusName<span>CONHECER · COMPREENDER · VIVER</span></Link><Link href="/comecar" className="auth-quiet-link">Explorar como visitante <span aria-hidden="true">↗</span></Link></header>
      <div className="auth-page-grid">
        <section className="auth-introduction" aria-labelledby="auth-page-title"><span className="auth-eyebrow">UM CAMINHO QUE RESPEITA O SEU TEMPO</span><h1 id="auth-page-title">Um lugar para<br /><em>continuar.</em></h1><p>Suas perguntas, suas descobertas e o desejo de aprender têm lugar aqui. Entre para guardar seu percurso ou siga conhecendo a jornada como visitante.</p><div className="auth-intro-detail"><span aria-hidden="true">✦</span><p>A conta ajuda a guardar suas escolhas.<br /><strong>O acolhimento começa antes do cadastro.</strong></p></div><Link href="/">← Voltar ao início</Link></section>
        <AuthForm configured={configured} next={next} />
      </div>
      <footer className="auth-footer"><p>Uma iniciativa educacional cristã independente, sem vínculo institucional oficial com igrejas ou denominações.</p><Link href="/privacidade">Privacidade e escolhas</Link></footer>
    </main>
  );
}
