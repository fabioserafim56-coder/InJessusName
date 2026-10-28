"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { StudyProgressRing } from "@/components/ui/study-progress-ring";
import { StudyCelebration, StudyChapterArt, StudyTransition } from "@/components/ui/study-celebration";
import { courseEditorialNote, type CourseActivity, type CourseLesson, type ScriptureReference } from "@/content/courses";
import "./course-lesson-player.css";

export type CoursePassage = ScriptureReference & { verses: { number: number; text: string }[] };
export type CourseEdition = { name: string; attribution: string; license: string; licenseUrl: string; sourceUrl: string; canonNote: string; editorialNote: string };

type ActivityState = {
  choice: string;
  categories: Record<string, string>;
  order: string[];
  attempts: number;
  usedHint: boolean;
  consulted: boolean;
  revealed: boolean;
  feedbackShown: boolean;
  completed: boolean;
  firstIndependentCorrect: boolean;
};
type StudyStep = { kind: "reading" } | { kind: "card"; index: number } | { kind: "example" } | { kind: "guided" } | { kind: "activity"; index: number } | { kind: "reflection" };

function referenceKey(reference: ScriptureReference) {
  return `${reference.book}-${reference.chapter}-${reference.startVerse}-${reference.endVerse}`;
}

function ForwardIcon() {
  return <svg className="cl-forward-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" /></svg>;
}

function ReviewIcon() {
  return <svg className="cl-review-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9a7 7 0 1 1-1 6M5 9V4m0 5h5" /></svg>;
}

function QuietMoment() {
  const [open, setOpen] = useState(false);
  const contentId = useId();
  return <section className="cl-quiet-moment" aria-label="Um momento de recolhimento">
    <button type="button" className="cl-quiet-toggle" aria-expanded={open} aria-controls={contentId} onClick={() => setOpen((current) => !current)}><span aria-hidden="true">✧</span>Um momento com Deus, se desejar<span aria-hidden="true">{open ? "−" : "+"}</span></button>
    <div id={contentId} className="cl-quiet-content" hidden={!open}><h3>Há espaço para chegar com calma.</h3><p>Se o dia foi corrido, pare um pouco. Você não precisa encontrar palavras bonitas para falar com Deus. Pode permanecer em silêncio ou acompanhar esta oração.</p><blockquote>Senhor, aquieta nosso coração. Ajuda-nos a receber tua Palavra com humildade e a viver o que aprendermos. Que este tempo nos aproxime de ti e nos ensine a cuidar das pessoas. Amém.</blockquote><p>Ore com suas próprias palavras, se preferir. Quando estiver pronto, siga para a leitura, sem pressa.</p></div>
  </section>;
}

function initialActivityState(activity: CourseActivity, index: number): ActivityState {
  const ids = activity.kind === "order" ? activity.items.map((item) => item.id) : [];
  // Never hand the learner the correct order as the untouched initial arrangement.
  const order = activity.kind === "order" && ids.join("|") === activity.correctOrder.join("|")
    ? [...ids.slice(1), ids[0]] : ids;
  return { choice: "", categories: {}, order, attempts: 0, usedHint: false, consulted: false, revealed: index !== 2, feedbackShown: false, completed: false, firstIndependentCorrect: false };
}

function isAnswerComplete(activity: CourseActivity, state: ActivityState) {
  if (activity.kind === "choice") return Boolean(state.choice);
  if (activity.kind === "classify") return activity.items.every((item) => Boolean(state.categories[item.id]));
  return state.order.length === activity.items.length;
}

function isCorrect(activity: CourseActivity, state: ActivityState) {
  if (activity.kind === "choice") return state.choice === activity.correctOptionId;
  if (activity.kind === "classify") return activity.items.every((item) => state.categories[item.id] === item.categoryId);
  return state.order.join("|") === activity.correctOrder.join("|");
}

function optionOrder<T>(id: string, options: T[]) {
  const offset = [...id].reduce((value, letter) => (value * 31 + letter.charCodeAt(0)) >>> 0, 17) % options.length;
  return [...options.slice(offset), ...options.slice(0, offset)];
}

function EditionDetails({ edition }: { edition: CourseEdition }) {
  return <details className="cl-edition-details"><summary>Edição e fontes <span>BLIVRE · TR 2018 · CC BY 3.0 BR</span></summary><div><p>{edition.attribution}</p><p>{edition.canonNote} {edition.editorialNote}</p><p><a href={edition.sourceUrl} target="_blank" rel="noreferrer">Fonte da edição</a><span aria-hidden="true"> · </span><a href={edition.licenseUrl} target="_blank" rel="noreferrer">Ler licença</a></p></div></details>;
}

function PassageText({ passage }: { passage: CoursePassage }) {
  return <section className="cl-scripture" aria-label={`Texto de ${passage.label}`}><div className="cl-scripture-heading"><span>LEITURA BÍBLICA</span><h3>{passage.label}</h3></div>{passage.verses.map((verse) => <p key={verse.number}><sup>{verse.number}</sup> {verse.text}</p>)}<div className="cl-scripture-footer"><span>Bíblia Livre · TR 2018</span><Link href={`/biblia?livro=${passage.book}&capitulo=${passage.chapter}&versiculo=${passage.startVerse}`} target="_blank">Abrir capítulo completo <ForwardIcon /></Link></div></section>;
}

function ReferenceLinks({ references, onConsult }: { references: ScriptureReference[]; onConsult: (reference: ScriptureReference) => void }) {
  return <div className="cl-reference-links" aria-label="Passagens para conferir"><span>Veja comigo na Palavra</span><div>{references.map((reference) => <button type="button" className="cl-reference-pill" key={referenceKey(reference)} onClick={() => onConsult(reference)}>{reference.label}</button>)}</div></div>;
}

function ActivityControls({ activity, state, onChange }: { activity: CourseActivity; state: ActivityState; onChange: (changes: Partial<ActivityState>) => void }) {
  if (activity.kind === "choice") return <fieldset className="cl-choice-group" disabled={state.feedbackShown}><legend className="cl-sr-only">Escolha sua resposta</legend>{optionOrder(activity.id, activity.options).map((option) => <label className="cl-choice" key={option.id}><input type="radio" name={activity.id} value={option.id} checked={state.choice === option.id} onChange={() => onChange({ choice: option.id })} /><span>{option.text}</span></label>)}</fieldset>;
  if (activity.kind === "classify") return <div className="cl-classification">{activity.items.map((item, index) => <div className="cl-classify-row" key={item.id}><span className="cl-item-number" aria-hidden="true">{index + 1}</span><label htmlFor={`${activity.id}-${item.id}`}>{item.text}</label><select id={`${activity.id}-${item.id}`} data-classify-item-id={item.id} value={state.categories[item.id] ?? ""} disabled={state.feedbackShown} onChange={(event) => onChange({ categories: { ...state.categories, [item.id]: event.target.value } })}><option value="">Como você entende esta parte?</option>{activity.categories.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}</select></div>)}</div>;
  const move = (index: number, direction: number) => {
    const target = index + direction;
    if (target < 0 || target >= state.order.length) return;
    const order = [...state.order];
    [order[index], order[target]] = [order[target], order[index]];
    onChange({ order });
    const focusDirection = target === 0 ? "down" : target === order.length - 1 ? "up" : direction < 0 ? "up" : "down";
    requestAnimationFrame(() => document.querySelector<HTMLButtonElement>(`[data-move-id="${order[target]}"][data-direction="${focusDirection}"]`)?.focus());
  };
  return <><p className="cl-control-note">Vamos acompanhar a sequência deste ensino. Use as setas para mover cada parte, com toque ou teclado.</p><ol className="cl-order-list">{state.order.map((id, index) => {
    const item = activity.items.find((candidate) => candidate.id === id)!;
    return <li key={id} data-order-item-id={id}><span className="cl-item-number" aria-hidden="true">{index + 1}</span><p>{item.text}</p><div className="cl-order-actions"><button type="button" data-move-id={id} data-direction="up" aria-label={`Mover para cima: ${item.text}`} disabled={index === 0 || state.feedbackShown} onClick={() => move(index, -1)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 14 6-6 6 6" /></svg></button><button type="button" data-move-id={id} data-direction="down" aria-label={`Mover para baixo: ${item.text}`} disabled={index === state.order.length - 1 || state.feedbackShown} onClick={() => move(index, 1)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 10 6 6 6-6" /></svg></button></div></li>;
  })}</ol></>;
}

function ActivityFeedback({ activity, state }: { activity: CourseActivity; state: ActivityState }) {
  if (activity.kind === "choice") return <p>{activity.options.find((option) => option.id === state.choice)?.feedback}</p>;
  if (activity.kind === "order") return <p>{state.completed ? activity.correctFeedback : activity.incorrectFeedback}</p>;
  return <ul className="cl-item-feedback">{activity.items.map((item) => {
    const correct = state.categories[item.id] === item.categoryId;
    return <li key={item.id}><span className={correct ? "cl-feedback-label" : "cl-feedback-label cl-feedback-review"}>{correct ? "Encontramos no texto" : "Vamos reler esta parte"}</span><p><strong>{item.text}</strong></p><p>{correct ? item.feedback : item.correction}</p></li>;
  })}</ul>;
}

export function CourseLessonPlayer({ lesson, passages, edition, nextLesson }: { lesson: CourseLesson; passages: CoursePassage[]; edition: CourseEdition; nextLesson: { id: string; title: string } | null }) {
  const [started, setStarted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [exampleCount, setExampleCount] = useState(1);
  const [guidedHintCount, setGuidedHintCount] = useState(0);
  const [guidedAnswer, setGuidedAnswer] = useState(false);
  const [activePassageKey, setActivePassageKey] = useState(referenceKey(lesson.passages[0]));
  const [requestedReference, setRequestedReference] = useState(lesson.passages[0]);
  const [activityStates, setActivityStates] = useState<Record<string, ActivityState>>(() => Object.fromEntries(lesson.activities.map((activity, index) => [activity.id, initialActivityState(activity, index)])));
  const passageDialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const feedback = useRef<HTMLElement>(null);
  const steps: StudyStep[] = [{ kind: "reading" }, ...lesson.cards.map((_, index): StudyStep => ({ kind: "card", index })), { kind: "example" }, { kind: "guided" }, ...lesson.activities.map((_, index): StudyStep => ({ kind: "activity", index })), { kind: "reflection" }];
  const step = steps[stepIndex];
  const mainPassage = passages.find((passage) => referenceKey(passage) === referenceKey(lesson.passages[0])) ?? passages[0];
  const activePassage = passages.find((passage) => referenceKey(passage) === activePassageKey);
  const activity = step.kind === "activity" ? lesson.activities[step.index] : null;
  const currentState = activity ? activityStates[activity.id] : null;
  const phase = step.kind === "reading" ? 0 : ["card", "example", "guided"].includes(step.kind) ? 1 : step.kind === "activity" ? 2 : 3;
  const completedActivities = lesson.activities.filter((item) => activityStates[item.id].completed);
  const firstIndependent = completedActivities.filter((item) => activityStates[item.id].firstIndependentCorrect).length;
  const supported = completedActivities.length - firstIndependent;
  const updateActivity = (id: string, changes: Partial<ActivityState>) => setActivityStates((current) => ({ ...current, [id]: { ...current[id], ...changes } }));
  const focusHeading = () => requestAnimationFrame(() => { heading.current?.focus(); heading.current?.scrollIntoView({ block: "start", behavior: "instant" }); });
  const goTo = (index: number) => {
    if (activity && currentState && !currentState.completed && index < stepIndex) updateActivity(activity.id, { consulted: true });
    setStepIndex(index);
    focusHeading();
  };
  const next = () => {
    if (stepIndex === steps.length - 1) { setFinished(true); focusHeading(); }
    else goTo(stepIndex + 1);
  };
  const consult = (reference?: ScriptureReference) => {
    if (activity) updateActivity(activity.id, { consulted: true });
    const requested = reference ?? activity?.sourceRefs[0] ?? lesson.passages[0];
    setRequestedReference(requested);
    setActivePassageKey(referenceKey(requested));
    passageDialog.current?.showModal();
  };
  const submitActivity = (event: React.FormEvent) => {
    event.preventDefault();
    if (!activity || !currentState || currentState.feedbackShown || !isAnswerComplete(activity, currentState)) return;
    const correct = isCorrect(activity, currentState);
    updateActivity(activity.id, { attempts: currentState.attempts + 1, feedbackShown: true, completed: correct, firstIndependentCorrect: correct && currentState.attempts === 0 && !currentState.usedHint && !currentState.consulted });
    requestAnimationFrame(() => { feedback.current?.focus({ preventScroll: true }); feedback.current?.scrollIntoView({ block: "start", behavior: "instant" }); });
  };
  const stepTitle = step.kind === "reading" ? "Vamos ouvir a Palavra" : step.kind === "card" ? lesson.cards[step.index].title : step.kind === "example" ? lesson.workedExample.title : step.kind === "guided" ? "Agora, vamos olhar juntos" : step.kind === "reflection" ? "Um ensino para levar à vida" : step.index === 2 ? "Trazendo a Palavra à memória" : "Uma conversa sobre o que lemos";

  const nextCare = supported > 0
    ? "Houve trechos em que uma ajuda foi bem-vinda. Volte com carinho à passagem que mais pediu atenção e conte, com suas palavras, o que compreendeu. Reler também é uma forma de permanecer na Palavra."
    : "Escolha uma palavra ou atitude desta leitura para levar ao seu dia. Se puder, converse com alguém de confiança sobre o que aprendeu e volte ao texto em outro momento, sem pressa.";

  return <AppShell active="learn" title="Aprender" subtitle={lesson.theme}>
    <div className="course-study">
      <div className="cl-topline"><Link href="/aprender"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6" /></svg>Todos os estudos</Link><span>cerca de {lesson.estimatedMinutes} min · no seu ritmo</span></div>
      <header className="cl-lesson-header"><div className="cl-lesson-title"><div className="cl-theme"><span aria-hidden="true" />{lesson.theme}</div><h1>{lesson.title}</h1><p>{lesson.subtitle}</p></div><StudyChapterArt /></header>

      <StudyTransition marker={`${started}-${finished}-${stepIndex}`}>
      {!started ? <section className="cl-start" aria-labelledby="cl-start-title">
        <div className="cl-start-illustration" aria-hidden="true"><svg viewBox="0 0 72 72"><path d="M36 20c-9-6-19-6-28-2v39c9-4 19-4 28 2 9-6 19-6 28-2V18c-9-4-19-4-28 2Zm0 0v39M16 28l11 2m-11 8 11 2m18-10 11-2m-11 12 11-2" /></svg></div>
        <p className="cl-eyebrow">UM TEMPO NA PALAVRA</p>
        <h2 id="cl-start-title">Vamos abrir a Bíblia com calma.</h2>
        <p className="cl-pastoral-invitation">{lesson.pastoralInvitation ?? "Há lugar para suas perguntas neste encontro. Vamos nos aproximar da Palavra com humildade, ouvir o que ela nos ensina e pensar em como viver esse cuidado no nosso dia."}</p>
        <QuietMoment />
        <details className="cl-objectives-details"><summary>O que vamos percorrer juntos</summary><ul className="cl-objectives">{lesson.objectives.map((objective) => <li key={objective}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>{objective}</li>)}</ul></details>
        <div className="cl-preparation"><strong>A Bíblia por perto, o coração atento.</strong><p>Se puder, tenha sua Bíblia aberta e um caderno ao lado. Há espaço para reler, fazer perguntas e anotar o que deseja levar à oração. O texto também está aqui para acompanhar você.</p></div>
        <button type="button" className="cl-primary" onClick={() => { setStarted(true); focusHeading(); }}>Vamos abrir a Palavra <ForwardIcon /></button>
        <p className="cl-session-note">As atividades ficam somente enquanto esta página estiver aberta. Suas reflexões e orações permanecem com você.</p>
      </section> : finished ? <section className="cl-completion" aria-labelledby="cl-completion-title">
        <span className="cl-completion-mark" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="m8 16 5 5L25 9" /></svg></span>
        <p className="cl-eyebrow">PARA LEVAR NO CORAÇÃO</p>
        <h2 id="cl-completion-title" tabIndex={-1} ref={heading}>A leitura continua na vida.</h2>
        <p>Chegamos ao fim deste encontro. Antes de seguir, acolha uma descoberta que mereça acompanhar seus passos. Não precisa ser muita coisa: um ensino compreendido e vivido já merece nossa atenção.</p>
        <section className="cl-next-care" aria-labelledby="cl-next-care-title"><h3 id="cl-next-care-title">Um pequeno passo para hoje</h3><p>{nextCare}</p></section>
        <StudyCelebration />
        <div className="cl-recap"><h3>Guarde o que esta leitura lhe ensinou</h3><ul>{lesson.recap.map((item) => <li key={item}>{item}</li>)}</ul></div>
        {lesson.closingPrayer && <section className="cl-closing-prayer" aria-labelledby="cl-prayer-title"><h3 id="cl-prayer-title">Se desejar, encerre em oração</h3><blockquote>{lesson.closingPrayer}</blockquote><p>Você também pode orar com suas próprias palavras. Não é preciso escrever nem enviar nada ao aplicativo.</p></section>}
        <div className="cl-return"><span aria-hidden="true"><ReviewIcon /></span><div><h3>Há palavras que pedem um reencontro.</h3><p>{lesson.reviewPrompt}</p></div></div>
        <details className="cl-learning-path"><summary>Meu caminho neste estudo</summary><dl className="cl-results"><div><dt>Primeira tentativa sem ajuda</dt><dd>{firstIndependent} <span>/ {lesson.activities.length}</span></dd></div><div><dt>Corrigidas ou com apoio</dt><dd>{supported}</dd></div></dl><p className="cl-result-note">Este registro ajuda a organizar seu retorno ao texto. Ele mostra apenas as atividades desta página; não mede sua fé, sua comunhão com Deus ou o que permanecerá em sua memória depois. O ensino continua quando você volta à Palavra e procura vivê-la.</p></details>
        <div className="cl-completion-actions">{nextLesson ? <Link className="cl-primary" href={`/aprender/${nextLesson.id}`}>Continuar nossa caminhada <ForwardIcon /></Link> : <Link className="cl-primary" href="/aprender">Outros encontros na Palavra <ForwardIcon /></Link>}<Link className="cl-secondary" href={`/biblia?livro=${mainPassage.book}&capitulo=${mainPassage.chapter}&versiculo=${mainPassage.startVerse}`}>Permanecer nesta passagem</Link></div>
        <p className="cl-session-note">Seu caminho nesta aula aparece somente enquanto esta página estiver aberta.</p>
      </section> : <>
        <section className="cl-progress-section" aria-label="Seu caminho nesta aula"><div className="cl-progress-caption"><span>Etapa {stepIndex + 1} de {steps.length}</span><StudyProgressRing progress={stepIndex / steps.length} /></div><ol className="cl-phases">{["Ouvir", "Compreender", "Conversar", "Viver"].map((label, index) => <li key={label} aria-current={phase === index ? "step" : undefined}><span>{index + 1}</span>{label}</li>)}</ol></section>
        <article className="cl-step-card" data-course-step={step.kind}>
          <div className="cl-step-heading"><p className="cl-eyebrow">{step.kind === "activity" ? `NOSSA CONVERSA · ${step.index + 1} DE ${lesson.activities.length}` : step.kind === "example" ? "OLHE COMIGO PARA ESTE TRECHO" : step.kind === "guided" ? "VAMOS CAMINHAR JUNTOS" : step.kind === "reflection" ? "DA PALAVRA PARA A VIDA" : "COM A BÍBLIA ABERTA"}</p><h2 tabIndex={-1} ref={heading}>{stepTitle}</h2></div>
          {step.kind === "reading" && <><p className="cl-lead">Leia devagar. Ao terminar, pergunte a si: que palavra ou atitude merece permanecer comigo hoje? Vamos acompanhar este trecho juntos.</p><PassageText passage={mainPassage} /><div className="cl-small-task"><span>Deixe esta leitura assentar um pouco</span><p>O que chamou sua atenção nesta passagem? Você pode guardar essa pergunta no coração ou anotar no caderno. Não precisamos apressar a compreensão.</p></div><div className="cl-step-actions"><button type="button" className="cl-secondary" onClick={() => setStarted(false)}>Voltar</button><button className="cl-primary" data-course-next onClick={next}>Seguir com a leitura <ForwardIcon /></button></div></>}
          {step.kind === "card" && <><div className="cl-teaching-text">{lesson.cards[step.index].body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><div className="cl-small-task"><span>Vamos olhar juntos</span><p>{lesson.cards[step.index].task}</p></div><ReferenceLinks references={lesson.cards[step.index].sourceRefs} onConsult={consult} /><div className="cl-step-actions"><button className="cl-secondary" onClick={() => goTo(stepIndex - 1)}>Voltar</button><button className="cl-primary" data-course-next onClick={next}>Continuar <ForwardIcon /></button></div></>}
          {step.kind === "example" && <><p className="cl-lead">{lesson.workedExample.prompt}</p><ReferenceLinks references={lesson.workedExample.sourceRefs} onConsult={consult} /><ol className="cl-worked-steps">{lesson.workedExample.steps.slice(0, exampleCount).map((item, index) => <li key={item}><span>{index + 1}</span><p>{item}</p></li>)}</ol>{exampleCount < lesson.workedExample.steps.length ? <button className="cl-secondary" onClick={() => setExampleCount(exampleCount + 1)}>Acompanhar o próximo passo <span aria-hidden="true">+</span></button> : <div className="cl-example-answer"><span>O que podemos guardar deste trecho</span><p>{lesson.workedExample.answer}</p></div>}<div className="cl-step-actions"><button className="cl-secondary" onClick={() => goTo(stepIndex - 1)}>Voltar</button>{exampleCount >= lesson.workedExample.steps.length && <button className="cl-primary" data-course-next onClick={next}>Olhar mais de perto <ForwardIcon /></button>}</div></>}
          {step.kind === "guided" && <><p className="cl-lead">{lesson.guidedPractice.prompt}</p><p className="cl-muted">Pense um pouco sobre esta pergunta. Você pode falar em voz baixa ou escrever no caderno. Se precisar de ajuda, vamos olhar para a passagem outra vez.</p><ReferenceLinks references={lesson.guidedPractice.sourceRefs} onConsult={consult} /><div className="cl-support-actions">{guidedHintCount < lesson.guidedPractice.hints.length && <button className="cl-secondary" onClick={() => setGuidedHintCount(guidedHintCount + 1)}>Uma ajuda para esta leitura</button>}</div>{guidedHintCount > 0 && <ol className="cl-guided-hints" aria-label="Pistas da prática">{lesson.guidedPractice.hints.slice(0, guidedHintCount).map((hint) => <li key={hint}>{hint}</li>)}</ol>}{!guidedAnswer ? <button className="cl-source-button" onClick={() => setGuidedAnswer(true)}>Vamos conversar sobre a resposta <span aria-hidden="true">+</span></button> : <div className="cl-example-answer"><span>Olhe comigo para o que o trecho nos ensina</span><p>{lesson.guidedPractice.modelResponse}</p><p className="cl-muted">Compare com o que você percebeu. Se algo passou despercebido, volte à passagem com tranquilidade. Reler faz parte desse encontro com a Palavra.</p></div>}<div className="cl-step-actions"><button className="cl-secondary" onClick={() => goTo(stepIndex - 1)}>Voltar</button><button className="cl-primary" data-course-next onClick={next}>Conversar sobre a Palavra <ForwardIcon /></button></div></>}
          {step.kind === "activity" && activity && currentState && <section className="cl-activity" data-activity-id={activity.id}><div className="cl-activity-kind"><span>{activity.kind === "choice" ? "Uma pergunta para nossa conversa" : activity.kind === "classify" ? "Olhando cada detalhe" : "Relembrando esta caminhada"}</span><span className="cl-sr-only">{activity.skill}</span></div><h3>{activity.prompt}</h3>{step.index === 2 && !currentState.revealed && <div className="cl-recall-first"><p>Antes de ver as opções, tente contar com suas palavras o que ficou desta leitura. Se a memória falhar, podemos abrir o texto juntos. Não há constrangimento em precisar reler.</p><button className="cl-primary" onClick={() => updateActivity(activity.id, { revealed: true })}>Estou pronto para conversar <ForwardIcon /></button></div>}{currentState.revealed && <form onSubmit={submitActivity}><ActivityControls activity={activity} state={currentState} onChange={(changes) => updateActivity(activity.id, changes)} />{!currentState.feedbackShown && <button className="cl-primary cl-check-button" type="submit" disabled={!isAnswerComplete(activity, currentState)}>Vamos conferir juntos</button>}</form>}{!currentState.feedbackShown && <div className="cl-activity-support"><button className="cl-source-button" onClick={() => updateActivity(activity.id, { usedHint: true })} disabled={currentState.usedHint}>Uma ajuda para olhar o trecho</button><button className="cl-source-button" onClick={() => consult(activity.sourceRefs[0])}>Voltar à Palavra</button></div>}{currentState.usedHint && <p className="cl-hint" role="status"><strong>Olhe para esta parte com calma</strong>{activity.hint}</p>}{currentState.feedbackShown && <section ref={feedback} tabIndex={-1} className={`cl-feedback ${currentState.completed ? "cl-feedback-correct" : "cl-feedback-adjust"}`} aria-label="Comentário da atividade"><div className="cl-feedback-heading"><span aria-hidden="true">{currentState.completed ? <svg viewBox="0 0 24 24"><path d="m5 12 4 4L19 6" /></svg> : <ReviewIcon />}</span><h4>{currentState.completed ? "Vamos guardar esse cuidado." : "Vamos reler com calma."}</h4></div><ActivityFeedback activity={activity} state={currentState} /><p className="cl-feedback-source">Caminhamos com: {activity.sourceRefs.map((reference) => reference.label).join(" · ")}.</p>{currentState.completed ? <button className="cl-primary" data-course-next onClick={next}>Continuar <ForwardIcon /></button> : <button className="cl-primary" onClick={() => updateActivity(activity.id, { feedbackShown: false })}>Olhar outra vez</button>}</section>}<div className="cl-activity-footer"><button className="cl-back-button" onClick={() => { if (!currentState.completed) updateActivity(activity.id, { consulted: true }); goTo(stepIndex - 1); }}>Voltar ao estudo</button><p>{currentState.usedHint || currentState.consulted || currentState.attempts > 1 ? "Pedir ajuda também faz parte da caminhada. Podemos voltar à Palavra quantas vezes for preciso." : "A Palavra merece tempo e atenção. Vamos seguir sem pressa."}</p></div></section>}
          {step.kind === "reflection" && <><p className="cl-lead">Antes de encerrar, pense em como esta Palavra pode encontrar lugar no seu dia. Se desejar, converse com Deus sobre isso. Seu caderno é um espaço seu, e suas orações não precisam ser compartilhadas aqui.</p><ol className="cl-reflections">{[["A Palavra que li", lesson.reflection.scripture], ["O que merece permanecer comigo", lesson.reflection.observation], ["Um passo para viver", lesson.reflection.application], ["Minha oração, se desejar", lesson.reflection.prayer]].map(([label, prompt], index) => <li key={label}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{label}</h3><p>{prompt}</p></div></li>)}</ol><div className="cl-step-actions"><button className="cl-secondary" onClick={() => goTo(stepIndex - 1)}>Voltar</button><button className="cl-primary" data-course-next onClick={next}>Levar este ensino comigo <ForwardIcon /></button></div></>}
        </article>
      </>}
      </StudyTransition>
      <div className="cl-resources"><EditionDetails edition={edition} /><details className="cl-about-lesson"><summary>Sobre este encontro <span>Aula piloto</span></summary><p>{courseEditorialNote}</p><p>Comentários e atividades autorais. As referências bíblicas permitem conferir o estudo. Os resultados não classificam fé, salvação ou aptidão ministerial.</p></details></div>
      <dialog ref={passageDialog} className="cl-passage-dialog" aria-labelledby="cl-passage-dialog-title"><header><div><p className="cl-eyebrow">VOLTANDO À PALAVRA</p><h2 id="cl-passage-dialog-title">Bíblia ao lado</h2></div><button className="cl-close-dialog" aria-label="Fechar passagem" onClick={() => passageDialog.current?.close()}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></button></header>{passages.length > 1 && <label className="cl-passage-select">Escolher passagem<select value={activePassageKey} onChange={(event) => { setActivePassageKey(event.target.value); const selected = passages.find((passage) => referenceKey(passage) === event.target.value); if (selected) setRequestedReference(selected); }}>{passages.map((passage) => <option key={referenceKey(passage)} value={referenceKey(passage)}>{passage.label}</option>)}</select></label>}<>{activePassage ? <PassageText passage={activePassage} /> : <div className="cl-small-task"><p>O trecho {requestedReference.label} pode ser conferido no leitor completo.</p><Link className="cl-source-button" href={`/biblia?livro=${requestedReference.book}&capitulo=${requestedReference.chapter}&versiculo=${requestedReference.startVerse}`} target="_blank">Abrir a passagem no leitor</Link></div>}</><EditionDetails edition={edition} /><button className="cl-primary" onClick={() => passageDialog.current?.close()}>Voltar ao estudo</button></dialog>
    </div>
  </AppShell>;
}
