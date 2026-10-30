"use client";

import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useJourneySession } from "@/components/journey-session";

type AgeBand = "6_9" | "10_12" | "13_17" | "18_plus";
type TraditionChoice = "ccb" | "roman_catholic" | "evangelical_protestant" | "seeker";
type BaptismStatus = "not_informed" | "not_baptized" | "baptized";
type LearningGoal = "bible_foundations" | "christian_service" | "theology_history";
type Screen = 0 | 1 | 2 | 3 | "review" | "minor";
type Choice = { value: string; title: string; description: string };

const ageChoices: Choice[] = [
  { value: "6_9", title: "6 a 9 anos", description: "Histórias, descobertas e um primeiro contato com a Bíblia." },
  { value: "10_12", title: "10 a 12 anos", description: "Um caminho de investigação, mapas e perguntas para explorar." },
  { value: "13_17", title: "13 a 17 anos", description: "Contexto bíblico e reflexões que conversam com a juventude." },
  { value: "18_plus", title: "18 anos ou mais", description: "Um percurso de estudo, contexto e aprofundamento da fé." },
];

const traditionChoices: Choice[] = [
  { value: "ccb", title: "Congregação Cristã no Brasil", description: "Estudo bíblico e zelo doutrinário, com atenção às fontes da CCB." },
  { value: "roman_catholic", title: "Igreja Católica", description: "Escritura, tradição e vivência cristã na perspectiva católica." },
  { value: "evangelical_protestant", title: "Evangélica / Protestante", description: "Bíblia, discipulado e perspectivas das tradições protestantes." },
  { value: "seeker", title: "Estou conhecendo / Sem igreja definida", description: "Um começo acolhedor pelo núcleo cristão comum." },
];

const baptismChoices: Choice[] = [
  { value: "not_baptized", title: "Ainda não fui batizado(a)", description: "Começar pelos fundamentos e pelo significado do batismo." },
  { value: "baptized", title: "Já fui batizado(a)", description: "Conectar os fundamentos ao estudo e à vida em comunidade." },
  { value: "not_informed", title: "Prefiro não informar", description: "Você pode continuar sem compartilhar essa informação." },
];

const goalChoices: Choice[] = [
  { value: "bible_foundations", title: "Aprender a Bíblia desde o começo", description: "Conhecer a grande narrativa, os livros e seus contextos." },
  { value: "christian_service", title: "Aprofundar a fé e servir com cuidado", description: "Conhecimento, bom testemunho e vivência cristã na comunidade." },
  { value: "theology_history", title: "Estudar teologia e história", description: "Investigar o Cristianismo, suas fontes e o caminho até os dias atuais." },
];

const questions = [
  { title: "Em qual fase da vida você está?", description: "Cada fase merece um jeito próprio de aprender. Não precisamos da sua data de nascimento.", name: "ageBand", choices: ageChoices },
  { title: "Como você se identifica hoje?", description: "Sua escolha ajuda a apresentar as perspectivas com clareza e respeito. Você poderá revisá-la depois.", name: "traditionCode", choices: traditionChoices },
  { title: "Quer nos contar sobre o seu batismo?", description: "Essa resposta orienta sugestões de estudo. Todos os começos têm lugar aqui.", name: "baptismStatus", choices: baptismChoices },
  { title: "O que você deseja aprender primeiro?", description: "Escolha o que faz sentido neste momento. O percurso pode mudar junto com as suas perguntas.", name: "goal", choices: goalChoices },
] as const;

const publicRoutes: Record<AgeBand, string> = {
  "6_9": "/jornada/infantil",
  "10_12": "/jornada/ponte",
  "13_17": "/jornada/jovens",
  "18_plus": "/jornada/adultos",
};

const publicTitles: Record<AgeBand, string> = {
  "6_9": "Conhecer o caminho infantil",
  "10_12": "Conhecer a trilha Ponte",
  "13_17": "Conhecer o caminho dos jovens",
  "18_plus": "Conhecer o caminho de estudo",
};

function BookIcon() {
  return <svg aria-hidden="true" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M16 9c-4-3-8-3-12-1v18c4-2 8-2 12 1 4-3 8-3 12-1V8c-4-2-8-2-12 1Zm0 0v18M16 2v4M9 3l2 3m12-3-2 3" /></svg>;
}

function Arrow({ back = false }: { back?: boolean }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={back ? "M20 12H5m6 6-6-6 6-6" : "M4 12h15m-6-6 6 6-6 6"} /></svg>;
}

function ChoiceGroup({ name, label, options, value, onChange }: {
  name: string;
  label: string;
  options: readonly Choice[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset className="onboarding-choices">
      <legend className="onboarding-sr-only">{label}</legend>
      {options.map((option) => (
        <label className={`onboarding-choice${value === option.value ? " is-selected" : ""}`} key={option.value}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
          />
          <span className="onboarding-radio" aria-hidden="true"><span /></span>
          <span className="onboarding-choice-copy"><span className="onboarding-choice-title">{option.title}</span><span className="onboarding-choice-description">{option.description}</span></span>
        </label>
      ))}
    </fieldset>
  );
}

function selectedTitle(choices: Choice[], value: string) {
  return choices.find((choice) => choice.value === value)?.title || "Não informado";
}

export function OnboardingFlow({ authenticated = false }: { authenticated?: boolean }) {
  const router = useRouter();
  const { visualProfile, updateVisualProfile } = useJourneySession();
  const [screen, setScreen] = useState<Screen>(0);
  const [ageBand, setAgeBand] = useState<AgeBand | "">("");
  const [tradition, setTradition] = useState<TraditionChoice | "">("");
  const [baptism, setBaptism] = useState<BaptismStatus | "">("");
  const [goal, setGoal] = useState<LearningGoal | "">("");
  const [consent, setConsent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [needsSignIn, setNeedsSignIn] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const pendingRequest = useRef<AbortController | null>(null);
  const questionIndex = typeof screen === "number" ? screen : 3;
  const question = questions[questionIndex];
  const values = [ageBand, tradition, baptism, goal];
  const progress = typeof screen === "number" ? screen + 1 : screen === "minor" ? 1 : 4;
  const publicRoute = publicRoutes[ageBand || "18_plus"];

  useEffect(() => {
    heading.current?.focus();
  }, [screen]);

  useEffect(() => () => pendingRequest.current?.abort(), []);

  function changeScreen(next: Screen) {
    setError("");
    setNeedsSignIn(false);
    setConsent(false);
    setScreen(next);
  }

  function selectAnswer(value: string) {
    setError("");
    setConsent(false);
    if (screen === 0) {
      setAgeBand(value as AgeBand);
      updateVisualProfile({ ageBand: value === "6_9" || value === "10_12" ? "child" : value === "13_17" ? "youth" : "adult" });
      if (value !== "18_plus") {
        setTradition("");
        setBaptism("");
        setGoal("");
      }
    } else if (screen === 1) setTradition(value as TraditionChoice);
    else if (screen === 2) setBaptism(value as BaptismStatus);
    else if (screen === 3) setGoal(value as LearningGoal);
  }

  async function savePath() {
    if (!consent || saving || ageBand !== "18_plus" || !tradition || !baptism || !goal) return;
    setSaving(true);
    setError("");
    setNeedsSignIn(false);
    const controller = new AbortController();
    pendingRequest.current = controller;
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          ageBand,
          traditionCode: tradition === "seeker" ? null : tradition,
          baptismStatus: baptism,
          goal,
          consent: true,
        }),
      });

      if (response.status === 401) {
        setNeedsSignIn(true);
        setError("Para guardar seu percurso, entre na sua conta. Suas respostas continuam nesta tela enquanto ela estiver aberta.");
        return;
      }
      if (response.status === 403) {
        setError("Não foi possível salvar este perfil. Se a conta precisa da participação de um responsável, use o percurso público enquanto essa proteção é preparada.");
        return;
      }
      if (response.status === 400) {
        setError("Confira as suas respostas e a autorização para personalização antes de tentar novamente.");
        return;
      }
      if (!response.ok) {
        setError("O serviço de perfis não está disponível agora. Você pode tentar novamente ou explorar sem salvar.");
        return;
      }
      const result: { redirect?: string } = await response.json();
      if (result.redirect !== "/meu-percurso") throw new Error("Resposta inesperada");
      router.push("/meu-percurso");
    } catch {
      setError("Não conseguimos confirmar o salvamento. Suas respostas continuam nesta tela; tente novamente quando a conexão estiver disponível.");
    } finally {
      clearTimeout(timeout);
      pendingRequest.current = null;
      setSaving(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (screen === "review") {
      void savePath();
      return;
    }
    if (typeof screen !== "number" || !values[screen]) return;
    if (screen === 0 && ageBand !== "18_plus") changeScreen("minor");
    else changeScreen(screen === 3 ? "review" : ((screen + 1) as Screen));
  }

  const summary = [
    { label: "Sua fase da vida", value: selectedTitle(ageChoices, ageBand), step: 0 },
    { label: "Sua perspectiva de fé", value: selectedTitle(traditionChoices, tradition), step: 1 },
    { label: "Sobre o batismo", value: selectedTitle(baptismChoices, baptism), step: 2 },
    { label: "Seu primeiro objetivo", value: selectedTitle(goalChoices, goal), step: 3 },
  ];

  return (
    <AppShell active="profile" title="Seu percurso" subtitle="Um caminho para a sua fase da vida"><div className="onboarding-page">
      <a className="skip-link" href="#sua-conversa">Pular para a conversa</a>


      <div className="onboarding-shell" id="sua-conversa">
        <aside className="onboarding-introduction">
          <span className="onboarding-eyebrow">SEU PRIMEIRO PASSO</span>
          <h1>Vamos encontrar<br />{" "}o seu caminho<br />{" "}<em>de estudo.</em></h1>
          <p>Cada caminhada começa de um jeito. Algumas perguntas ajudam a preparar um percurso que respeite a sua história e o que você deseja aprender.</p>
          <div className="onboarding-promise"><span className="onboarding-promise-icon"><BookIcon /></span><div><strong>Com liberdade e acolhimento.</strong><p>Você pode revisar suas escolhas ou conhecer o percurso público sem criar um perfil.</p></div></div>
          <div className="onboarding-aside-note"><span aria-hidden="true">✧</span><p>Conhecimento para compreender.<br />Tempo para refletir e viver.</p></div>
        </aside>

        <section className="onboarding-card" aria-labelledby="onboarding-question">
          <div className="onboarding-progress" aria-label="Progresso da conversa">
            <div><span>{screen === "review" ? "SEU PERCURSO" : screen === "minor" ? "UM COMEÇO COM CUIDADO" : `PASSO ${progress} DE 4`}</span><small>{screen === "review" ? "Confira suas escolhas" : screen === "minor" ? "Sua privacidade vem primeiro" : "No seu tempo"}</small></div>
            <progress value={progress} max={screen === "minor" ? 1 : 4} aria-label={screen === "minor" ? "Escolha da faixa etária concluída" : `${progress} de 4 passos`} />
          </div>

          {screen === "minor" ? (
            <div className="onboarding-minor">
              <span className="onboarding-minor-emblem" aria-hidden="true"><BookIcon /></span>
              <h2 id="onboarding-question" ref={heading} tabIndex={-1}>Há um caminho para a sua fase da vida.</h2>
              <p>Um perfil salvo para crianças e adolescentes precisa da participação de um responsável. Estamos preparando essa proteção com cuidado.</p>
              <p>Por enquanto, você pode conhecer o percurso público da sua faixa etária. Não vamos perguntar nem guardar informações sobre a sua igreja ou seu batismo nesta conversa.</p>
              <Link className="onboarding-primary" href={publicRoute}>{publicTitles[ageBand || "18_plus"]}<Arrow /></Link>
              <button className="onboarding-back" type="button" onClick={() => changeScreen(0)}><Arrow back />Alterar faixa etária</button>
            </div>
          ) : (
            <form onSubmit={submit} aria-busy={saving}>
              <h2 id="onboarding-question" ref={heading} tabIndex={-1}>{screen === "review" ? "Este começo combina com você?" : question.title}</h2>
              <p className="onboarding-question-description">{screen === "review" ? "Confira suas respostas. Elas serão usadas para sugerir temas e perspectivas de estudo, e você poderá alterá-las depois." : question.description}</p>

              {typeof screen === "number" ? (
                <>
                  <ChoiceGroup name={question.name} label={question.title} options={question.choices} value={values[screen]} onChange={selectAnswer} />
                  {screen === 0 && <details className="onboarding-visual-preferences"><summary>Prepare também sua jornada visual <span>Opcional</span></summary><p>Seu conhecimento ajuda a sugerir um começo. A representação muda apenas o personagem, sem definir sua vocação ou o valor da sua fé.</p><fieldset><legend>Como está seu conhecimento da Bíblia?</legend>{[{ value: "starting", label: "Estou começando" }, { value: "some", label: "Já conheço algumas passagens" }, { value: "experienced", label: "Já estudo e quero aprofundar" }].map(choice => <label key={choice.value}><input type="radio" name="visualKnowledge" value={choice.value} checked={visualProfile.knowledge === choice.value} onChange={() => updateVisualProfile({ knowledge: choice.value as typeof visualProfile.knowledge })} />{choice.label}</label>)}</fieldset><fieldset><legend>Como você prefere aparecer na jornada?</legend>{[{ value: "neutral", label: "Sem preferência" }, { value: "masculine", label: "Representação masculina" }, { value: "feminine", label: "Representação feminina" }].map(choice => <label key={choice.value}><input type="radio" name="visualAppearance" value={choice.value} checked={visualProfile.appearance === choice.value} onChange={() => updateVisualProfile({ appearance: choice.value as typeof visualProfile.appearance })} />{choice.label}</label>)}</fieldset><small>Essas preferências ficam apenas nesta visita. Não são enviadas ao perfil da conta. Você poderá mudá-las no cenário do percurso.</small></details>}
                </>
              ) : (
                <>
                  <dl className="onboarding-summary">
                    {summary.map((item) => <div key={item.label}><div><dt>{item.label}</dt><dd>{item.value}</dd></div><button type="button" disabled={saving} onClick={() => changeScreen(item.step as Screen)} aria-label={`Alterar ${item.label.toLocaleLowerCase("pt-BR")}`}>Alterar</button></div>)}
                  </dl>
                  <label className="onboarding-consent"><input type="checkbox" checked={consent} disabled={saving} onChange={(event) => setConsent(event.target.checked)} /><span>Autorizo o uso destas respostas, incluindo informações sobre minha crença religiosa, para personalizar meu percurso de estudo. Posso retirar essa autorização e apagar a personalização depois.</span></label>
                  {!authenticated && <div className="onboarding-signin-note"><p>Para salvar, você precisa entrar em uma conta adulta. Ao sair desta tela, as respostas ainda não salvas serão descartadas.</p><Link href="/entrar?next=/comecar">Entrar antes de salvar <Arrow /></Link></div>}
                </>
              )}

              {error && <div className="onboarding-error" role="alert"><p>{error}</p>{needsSignIn && <Link href="/entrar?next=/comecar">Entrar na minha conta <Arrow /></Link>}</div>}

              <div className="onboarding-actions">
                {screen !== 0 && <button className="onboarding-back" type="button" disabled={saving} onClick={() => changeScreen(screen === "review" ? 3 : ((screen as number) - 1) as Screen)}><Arrow back />Voltar</button>}
                <button className="onboarding-primary" type="submit" disabled={saving || (screen === "review" ? !consent : !values[screen])}>{saving ? "Salvando seu percurso…" : screen === "review" ? "Salvar meu percurso" : "Continuar"}{!saving && <Arrow />}</button>
              </div>
              <div className="onboarding-visitor"><Link href={publicRoute}>Explorar sem salvar</Link><span>As respostas ficam somente nesta conversa até você decidir salvar.</span></div>
            </form>
          )}
        </section>
      </div>

      <footer className="onboarding-footer"><p>Plataforma educacional cristã independente. Aprender aqui não confere cargo nem reconhecimento ministerial.</p><Link href="/">Voltar ao início</Link></footer>
    </div></AppShell>
  );
}
