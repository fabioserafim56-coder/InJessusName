import Link from "next/link";
import type { ReactNode } from "react";
import type { LearningPath } from "@/lib/learning-path";
import "./learning-path.css";

function PathBook() {
  return <svg aria-hidden="true" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 9c-4-3-8-3-12-1v18c4-2 8-2 12 1 4-3 8-3 12-1V8c-4-2-8-2-12 1Zm0 0v18M16 2v4M9 3l2 3m12-3-2 3" /></svg>;
}

function PathArrow() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h15m-6-6 6 6-6 6" /></svg>;
}

export function LearningPathView({
  path,
  saved = false,
  children
}: {
  path: LearningPath;
  saved?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className={`learning-path-page lp-${path.experience}`}>
      <a className="skip-link" href="#learning-path-content">Pular para o seu roteiro</a>
      <header className="lp-header">
        <div className="lp-container lp-header-inner">
          <Link className="lp-brand" href="/" aria-label="InJessusName, página inicial">
            <span className="lp-brand-icon"><PathBook /></span>
            <span>InJessusName<small>CONHECER · COMPREENDER · VIVER</small></span>
          </Link>
          <nav aria-label="Navegação do percurso">
            <Link href="/biblia">Bíblia</Link>
            <Link href="/comecar">{saved ? "Rever minhas escolhas" : "Conhecer a pré-entrevista"}<PathArrow /></Link>
          </nav>
        </div>
      </header>

      <main id="learning-path-content" className="lp-container">
        <section className="lp-hero" aria-labelledby="learning-path-title">
          <div className="lp-hero-copy">
            <p className="lp-kicker"><span aria-hidden="true" />{saved ? "PERCURSO SALVO NA SUA CONTA" : "UM CAMINHO PARA EXPLORAR"}</p>
            <p className="lp-greeting">{path.greeting}</p>
            <h1 id="learning-path-title">{path.title}</h1>
            <p className="lp-introduction">{path.introduction}</p>
            <div className="lp-audience"><span aria-hidden="true">✧</span>{path.audienceLabel}</div>
          </div>
          <aside className="lp-study-card" aria-labelledby="lp-study-invitation">
            <div className="lp-study-art" aria-hidden="true"><span /><PathBook /><span /></div>
            <p className="lp-small-label">ANTES DE COMEÇAR</p>
            <h2 id="lp-study-invitation">{path.studyInvitation.title}</h2>
            <p>{path.studyInvitation.description}</p>
          </aside>
        </section>

        {path.experience === "adult" && <aside className="lp-focus" aria-labelledby="lp-first-lesson-title"><div className="lp-focus-icon" aria-hidden="true">✧</div><div><h2 id="lp-first-lesson-title">Um primeiro estudo para experimentar.</h2><p>Pratique como localizar e conferir uma passagem. Esta aula introdutória é um piloto com revisão humana especializada pendente; as trilhas completas abaixo continuam em preparação.</p><Link className="lp-primary-link" href="/aprender/primeiros-passos">Abrir a aula piloto <PathArrow /></Link></div></aside>}

        <section className="lp-overview" aria-label="Como este roteiro foi organizado">
          <article>
            <span className="lp-card-number" aria-hidden="true">01</span>
            <p className="lp-small-label">SEU JEITO DE APRENDER</p>
            <h2>{path.formatLabel}</h2>
            <p>{path.formatDescription}</p>
          </article>
          <article>
            <span className="lp-card-number" aria-hidden="true">02</span>
            <p className="lp-small-label">O FOCO DO CAMINHO</p>
            <h2>{path.objective.label}</h2>
            <p>{path.objective.description}</p>
          </article>
          <article>
            <span className="lp-card-number" aria-hidden="true">03</span>
            <p className="lp-small-label">A PERSPECTIVA DO ESTUDO</p>
            <h2>{path.perspective.label}</h2>
            <p>{path.perspective.description}</p>
          </article>
        </section>

        <section className="lp-topics-section" aria-labelledby="lp-topics-title">
          <div className="lp-section-heading">
            <div><p className="lp-small-label">UMA PROPOSTA PARA OS PRÓXIMOS PASSOS</p><h2 id="lp-topics-title">Temas do seu roteiro.</h2></div>
            <span className="lp-preparation-badge">Aulas em preparação</span>
          </div>
          <p className="lp-planning-note">Estes temas organizam o caminho de estudo. As aulas ainda serão preparadas e revisadas; os cartões abaixo apresentam o planejamento.</p>
          <ol className="lp-topic-list">
            {path.topics.map((topic, index) => (
              <li key={topic.id}>
                <span className="lp-topic-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <div><h3>{topic.title}</h3><p>{topic.description}</p></div>
                <span className="lp-topic-mark" aria-hidden="true">✦</span>
              </li>
            ))}
          </ol>
        </section>

        <aside className="lp-focus" aria-labelledby="lp-focus-title">
          <div className="lp-focus-icon" aria-hidden="true">✧</div>
          <div><h2 id="lp-focus-title">{path.nextFocus.label}</h2><p>{path.nextFocus.description}</p></div>
        </aside>

        <section className="lp-choice-note" aria-label="Suas escolhas e sua privacidade">
          <p>{saved ? path.privacyNote : "Você está explorando um roteiro público. Nenhuma escolha de igreja, batismo ou objetivo é salva por esta página."}</p>
          <Link className="lp-primary-link" href="/comecar">{saved ? "Rever minhas escolhas" : "Voltar à conversa inicial"}<PathArrow /></Link>
        </section>

        {children ? <section className="lp-account-actions" aria-label="Gerenciar seu percurso">{children}</section> : null}
      </main>

      <footer className="lp-footer"><div className="lp-container"><p>Plataforma educacional independente, sem vínculo institucional oficial com a Congregação Cristã no Brasil ou com as demais igrejas mencionadas.</p><span>Aprender com contexto. Viver com cuidado.</span></div></footer>
    </div>
  );
}
