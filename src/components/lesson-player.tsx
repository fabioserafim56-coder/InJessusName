"use client";

import Link from "next/link";
import { StudyCelebration, StudyChapterArt, StudyTransition } from "@/components/ui/study-celebration";
import { useId, useRef, useState } from "react";
import { firstLesson as lesson, type LessonQuestion } from "@/content/lessons/primeiros-passos";
import { calculateStudySummary, type StudyAnswer } from "@/lib/study-progress";
import { AppShell } from "@/components/app-shell";
import "./lesson-player.css";

export type LessonPassage = {
  label: string;
  book: string;
  chapter: number;
  verses: { number: number; text: string }[];
};
export type LessonEdition = { name: string; attribution: string; license: string; sourceUrl: string };

function QuietMoment() {
  const [open, setOpen] = useState(false);
  const contentId = useId();
  return <section className="study-quiet-moment" aria-label="Um momento de recolhimento">
    <button type="button" className="study-quiet-toggle" aria-expanded={open} aria-controls={contentId} onClick={() => setOpen((current) => !current)}><span aria-hidden="true">✧</span>Um momento com Deus, se desejar<span aria-hidden="true">{open ? "−" : "+"}</span></button>
    <div id={contentId} className="study-quiet-content" hidden={!open}><h3>Podemos chegar com calma.</h3><p>Antes de abrir a Bíblia, você pode ficar em silêncio ou apresentar este tempo a Deus. Não precisa encontrar palavras perfeitas.</p><blockquote>Senhor, recebe este momento e ajuda-nos a ouvir tua Palavra com humildade. Ensina-nos a acolher o que ela diz e a caminhar com amor. Amém.</blockquote><p>Esta oração é apenas uma sugestão. Ore com suas próprias palavras, se quiser, e siga quando estiver pronto.</p></div>
  </section>;
}

function Passage({ passage, edition }: { passage: LessonPassage; edition: LessonEdition }) {
  return <section className="study-passage" aria-label={`Texto de ${passage.label}`}>
    <div className="study-passage-heading"><h3>{passage.label}</h3><Link href={`/biblia?livro=${passage.book}&capitulo=${passage.chapter}`} target="_blank" rel="noreferrer" aria-label={`Ler o capítulo completo de ${passage.label} em outra aba`}>Abrir capítulo <span aria-hidden="true">↗</span></Link></div>
    <div className="study-verses" tabIndex={0} aria-label={`Leitura de ${passage.label}`}>{passage.verses.map((verse) => <p className="study-verse" key={verse.number}><sup>{verse.number}</sup> {verse.text}</p>)}</div>
    <details className="study-edition"><summary><span>BLIVRE · TR 2018 · CC BY 3.0 BR</span><span>Edição e fontes</span></summary><div><p><strong>{edition.name}</strong></p><p>{edition.attribution}</p><p>{edition.license}</p><a href={edition.sourceUrl} target="_blank" rel="noreferrer">Consultar a fonte original</a><p>A edição contém 66 livros e não inclui deuterocanônicos. Comentários da aula são autorais.</p></div></details>
  </section>;
}

// Different positions avoid an answer-position pattern and remain identical during hydration.
function orderedOptions(question: LessonQuestion) {
  const offset = [...question.id].reduce((hash, letter) => (hash * 31 + letter.charCodeAt(0)) >>> 0, 7) % question.options.length;
  return [...question.options.slice(offset), ...question.options.slice(0, offset)];
}

type StudySupport = { usedHint: boolean; consultedText: boolean };

function QuestionCard({ question, passage, edition, onAnswer, onContinue, previousAnswers = [], support, onSupport, last = false }: {
  question: LessonQuestion; passage: LessonPassage; edition: LessonEdition;
  onAnswer: (answer: StudyAnswer) => void; onContinue: () => void; previousAnswers?: readonly StudyAnswer[]; support?: StudySupport; onSupport?: (flags: Partial<StudySupport>) => void; last?: boolean;
}) {
  const history = previousAnswers.filter((answer) => answer.questionId === question.id);
  const latest = history.at(-1);
  const withoutLooking = question.evidenceMode === "without-looking";
  const [showChoices, setShowChoices] = useState(!withoutLooking || Boolean(latest));
  const [selected, setSelected] = useState(latest?.selectedOptionId ?? "");
  const [feedback, setFeedback] = useState<string | null>(latest ? question.options.find((option) => option.id === latest.selectedOptionId)?.explanation ?? null : null);
  const [wrongChoices, setWrongChoices] = useState<string[]>(history.filter((answer) => answer !== latest && answer.selectedOptionId !== question.correctOptionId).map((answer) => answer.selectedOptionId));
  const [usedHint, setUsedHint] = useState(Boolean(latest?.usedHint || support?.usedHint));
  const [consultedText, setConsultedText] = useState(Boolean(latest?.consultedText || support?.consultedText));
  const [showPassage, setShowPassage] = useState(false);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const correct = selected === question.correctOptionId;
  const diagnostic = question.kind === "diagnostic";
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selected || feedback) return;
    const option = question.options.find((item) => item.id === selected)!;
    onAnswer({ questionId: question.id, selectedOptionId: selected, attempt: wrongChoices.length + 1, usedHint: usedHint || Boolean(support?.usedHint), consultedText: consultedText || Boolean(support?.consultedText) });
    setFeedback(option.explanation);
    requestAnimationFrame(() => feedbackRef.current?.focus());
  };
  return <div className="study-question" data-question-id={question.id}>
    <p className="study-kicker">{diagnostic ? "PARA COMEÇARMOS NOSSA CONVERSA" : withoutLooking ? "GUARDANDO A PALAVRA NA MEMÓRIA" : question.kind === "transfer" ? "SEGUIMOS EM OUTRA PASSAGEM" : "COM A BÍBLIA ABERTA"}</p>
    {withoutLooking && <p className="study-note">Antes de ver as opções, tente contar o que ficou desta leitura. Se precisar voltar ao texto, podemos reler juntos. Pedir ajuda também faz parte do aprendizado.</p>}
    {question.kind === "transfer" && <p className="study-note">Vamos ouvir esta outra passagem com o mesmo cuidado. Leia a conversa que vem antes da parábola e conte, com suas palavras, o que ela ajuda você a compreender.</p>}
    <form onSubmit={submit}>
      <fieldset disabled={feedback !== null}>
        <legend>{question.prompt}</legend>
        {!withoutLooking && !diagnostic && <Passage passage={passage} edition={edition} />}
        {showChoices && orderedOptions(question).map((option) => <label className="study-option" key={option.id}>
          <input type="radio" name={question.id} value={option.id} checked={selected === option.id} disabled={wrongChoices.includes(option.id)} onChange={() => setSelected(option.id)} />
          <span>{option.text}</span>
        </label>)}
      </fieldset>
      {!showChoices && <button className="study-secondary" type="button" onClick={() => setShowChoices(true)}>Já pensei; vamos conversar</button>}
      {!feedback && <div className="study-question-actions">
        {showChoices && <button className="study-primary" disabled={!selected} type="submit">Vamos conferir juntos</button>}
        {!diagnostic && <button className="study-secondary" type="button" onClick={() => { setUsedHint(true); onSupport?.({ usedHint: true }); }} disabled={usedHint}>Preciso de uma dica</button>}
        {withoutLooking && <button className="study-secondary" type="button" onClick={() => { setConsultedText(true); setShowPassage(true); onSupport?.({ consultedText: true }); }}>Reler a passagem</button>}
      </div>}
    </form>
    {usedHint && <p className="study-hint" role="status"><strong>Olhe comigo para esta parte:</strong> {question.hint}</p>}
    {showPassage && withoutLooking && <Passage passage={passage} edition={edition} />}
    {feedback && <div className={`study-feedback ${correct || diagnostic ? "is-correct" : "needs-review"}`} tabIndex={-1} ref={feedbackRef}>
      <h3>{diagnostic ? "Podemos começar por aqui." : correct ? "Vamos guardar essa descoberta." : "Vamos olhar juntos outra vez."}</h3>
      <p>{feedback}</p>
      <p className="study-feedback-reference">Vamos reler: {question.sourceRefs.map((reference) => reference.label).join("; ")}.</p>
      {correct || diagnostic ? <button className="study-primary" onClick={onContinue}>{diagnostic ? "Seguimos juntos" : last ? "Levar esta Palavra comigo" : "Seguir com nossa conversa"}</button> : <>
        <details><summary>Voltar ao que a Palavra nos mostrou</summary><p>Abra o trecho outra vez. Repare no que as pessoas fazem e nas palavras que o relato usa. Não precisamos responder depressa: podemos olhar juntos para cada parte.</p></details>
        <button className="study-primary" onClick={() => { setWrongChoices([...wrongChoices, selected]); setSelected(""); setFeedback(null); }}>Olhar outra vez</button>
      </>}
    </div>}
  </div>;
}

type SavedProgress = { completed: boolean; nextReviewAt: string | null; reviewDates: string[]; completedAt: string | null };
function dateLabel(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeZone: "America/Sao_Paulo" }).format(new Date(value));
}

export function LessonPlayer({ mainPassage, transferPassage, edition }: { mainPassage: LessonPassage; transferPassage: LessonPassage; edition: LessonEdition }) {
  const preparationDialog = useRef<HTMLDialogElement>(null);
  const sectionHeading = useRef<HTMLHeadingElement>(null);
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState(0);
  const [diagnosticDone, setDiagnosticDone] = useState(false);
  const [lens, setLens] = useState(0);
  const [contextCard, setContextCard] = useState(0);
  const [answers, setAnswers] = useState<StudyAnswer[]>([]);
  const [activity, setActivity] = useState(0);
  const [finished, setFinished] = useState(false);
  const [supportByQuestion, setSupportByQuestion] = useState<Record<string, StudySupport>>({});
  const [saveConsent, setSaveConsent] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const [saved, setSaved] = useState<SavedProgress | null>(null);
  const questions = [...lesson.game.missions, ...lesson.retrievalQuestions, lesson.transferQuestion];
  const currentQuestion = questions[activity];
  const summary = calculateStudySummary(answers);
  const recordSupport = (questionId: string, flags: Partial<StudySupport>) => setSupportByQuestion((current) => ({ ...current, [questionId]: { usedHint: Boolean(current[questionId]?.usedHint || flags.usedHint), consultedText: Boolean(current[questionId]?.consultedText || flags.consultedText) } }));
  const changePhase = (next: number) => {
    if (phase === 2 && currentQuestion?.evidenceMode === "without-looking" && !finished && next !== 2) recordSupport(currentQuestion.id, { consultedText: true });
    setPhase(next);
    requestAnimationFrame(() => { sectionHeading.current?.focus(); sectionHeading.current?.scrollIntoView({ block: "start", behavior: "instant" }); });
  };
  const addAnswer = (answer: StudyAnswer) => setAnswers((current) => [...current, answer]);
  const continueActivity = () => {
    if (activity === questions.length - 1) { setFinished(true); changePhase(3); }
    else { setActivity(activity + 1); requestAnimationFrame(() => { sectionHeading.current?.focus(); sectionHeading.current?.scrollIntoView({ block: "start", behavior: "instant" }); }); }
  };
  const saveProgress = async () => {
    if (!saveConsent || !finished || saveState === "saving") return;
    setSaveState("saving");
    try {
      const response = await fetch("/api/study-progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lessonId: "primeiros-passos-v1", answers: answers.filter((answer) => answer.questionId !== lesson.preparation.diagnostic.id), completed: true }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Não conseguimos salvar agora. Você pode continuar sem salvar.");
      setSaved(result.progress); setSaveState("saved"); setSaveMessage("Progresso salvo na sua conta. As datas de retomada foram calculadas a partir desta conclusão.");
    } catch (error) { setSaveState("error"); setSaveMessage(error instanceof Error ? error.message : "Não foi possível confirmar o salvamento."); }
  };
  const readProgress = async () => {
    try {
      const response = await fetch("/api/study-progress", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Não conseguimos consultar seu progresso.");
      setSaved(result.progress); setSaveMessage(result.progress ? "Sua conclusão anterior está salva. Você pode estudar novamente; esta sessão começa do início." : "Nenhuma conclusão salva nesta conta.");
    } catch (error) { setSaveMessage(error instanceof Error ? error.message : "Não foi possível consultar agora."); }
  };
  const clearProgress = async () => {
    try {
      const response = await fetch("/api/study-progress", { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Não conseguimos apagar agora.");
      setSaved(null); setSaveState("idle"); setSaveMessage("Progresso desta aula apagado da conta. Para recomeçar as atividades, recarregue a página.");
    } catch (error) { setSaveMessage(error instanceof Error ? error.message : "Não foi possível confirmar a exclusão."); }
  };
  const titles = ["Vamos chegar com calma", "Ouvindo a Palavra juntos", "Conversando sobre a leitura", "Uma palavra para caminhar"];
  const coach = currentQuestion?.skill === "locate"
    ? "Vamos encontrar a passagem juntos: primeiro o livro, depois o capítulo e os versículos. Você pode voltar quantas vezes precisar."
    : currentQuestion?.skill === "observe"
      ? "Repare com calma nas pessoas e nas atitudes desta história. A Palavra merece esse olhar paciente."
      : "Se uma dúvida aparecer, vamos abrir o trecho outra vez. Há espaço para perguntar e compreender com cuidado.";
  const nextCare = summary.assistedCorrect > 0
    ? "Algumas partes pediram uma ajuda ou uma nova leitura. Isso não diminui este encontro. Escolha uma delas, volte à passagem com calma e procure dizer, com suas palavras, o que recebeu deste ensino."
    : "Escolha um cuidado desta leitura para levar ao seu dia. Você pode conversar com alguém de confiança, anotar uma pergunta ou voltar à passagem em oração. O importante é dar lugar à Palavra na vida.";
  const focusCard = () => requestAnimationFrame(() => sectionHeading.current?.focus());

  return <AppShell active="learn" title="Primeiros passos" subtitle="Fundamentos da leitura bíblica">
    <div className="study-page" id="aula">
      <header className="study-lesson-heading">
        <div className="study-heading-copy">
        <Link className="study-back" href="/aprender"><span aria-hidden="true">←</span> Todos os estudos</Link>
        <div className="study-heading-meta"><span>Aula 01</span><span>15–20 min · no seu ritmo</span><details className="study-about"><summary>Piloto educacional</summary><div><p>{lesson.evaluationNote}</p><p>{lesson.perspective}</p><p>{lesson.pacingNote}</p></div></details></div>
        <h1>{lesson.title}</h1>
        {!started && <p className="study-subtitle">{lesson.subtitle}</p>}
        </div><StudyChapterArt />
      </header>

      <StudyTransition marker={`${started}-${finished}-${phase}-${contextCard}-${activity}`}>
      {!started ? <section className="study-welcome" aria-labelledby="study-objectives">
        <div className="study-welcome-heading"><span className="study-welcome-icon" aria-hidden="true">01</span><div><p className="study-kicker">NOSSO PRIMEIRO ENCONTRO NA PALAVRA</p><h2 id="study-objectives">Há tempo para ouvir e compreender.</h2></div></div>
        <p className="study-pastoral-invitation">{lesson.pastoralInvitation}</p>
        <QuietMoment />
        <div className="study-start-actions"><button className="study-primary" onClick={() => preparationDialog.current?.showModal()}>Preparar minha mesa <span aria-hidden="true">→</span></button><p>Venha no seu ritmo. Podemos reler e conversar sobre cada passo.</p></div>
        <div className="study-learning-route">
          <div><span aria-hidden="true">1</span><h3>Abra a Palavra</h3><p>Vamos nos aproximar do trecho e ouvir o que ele nos ensina.</p></div>
          <div><span aria-hidden="true">2</span><h3>Caminhe com cuidado</h3><p>Há perguntas e ajudas para olharmos juntos para a passagem.</p></div>
          <div><span aria-hidden="true">3</span><h3>Leve para a vida</h3><p>Guarde um ensino, converse com Deus e pense em como vivê-lo.</p></div>
        </div>

        <details className="study-objectives"><summary>O que vamos percorrer juntos?</summary><ul>{lesson.objectives.map((objective) => <li key={objective.id}>{objective.statement}</li>)}</ul></details>
      </section> : <>
        <nav className="study-phases" aria-label="Etapas da aula">{["Acolher", "Ouvir", "Conversar", "Viver"].map((title, index) => <button key={title} disabled={index === 3 && !finished} aria-current={phase === index ? "step" : undefined} onClick={() => changePhase(index)}><span>{index + 1}</span>{title}</button>)}</nav>
        <div className="study-session-progress"><progress max={10} value={finished ? 10 : phase === 2 ? activity : 0} aria-label="Atividades concluídas nesta sessão" /><span>{finished ? "Chegamos ao fim da leitura" : phase === 2 ? `Passo ${activity + 1} de 10` : "Um tempo para ouvir a Palavra"}</span></div>

        <div className={`study-layout ${phase === 3 ? "study-layout-complete" : ""}`}>
          <section className="study-main" aria-labelledby="study-phase-title">
            <div className="study-step-heading"><p className="study-kicker">ETAPA {phase + 1} DE 4</p><h2 id="study-phase-title" tabIndex={-1} ref={sectionHeading}>{titles[phase]}</h2></div>
            {phase === 0 && <>
              <p className="study-lead">Antes de seguirmos, pense nesta pergunta. Ela nos ajuda a começar a conversa, sem nota ou cobrança. Há lugar para o seu começo aqui.</p>
              {!diagnosticDone ? <QuestionCard question={lesson.preparation.diagnostic} previousAnswers={answers} passage={mainPassage} edition={edition} onAnswer={addAnswer} onContinue={() => setDiagnosticDone(true)} /> : <div className="study-callout"><h3>Podemos caminhar a partir daqui.</h3><p>Vamos abrir a passagem e olhar com atenção para o que ela nos conta. Sua pergunta também tem lugar neste caminho.</p></div>}
              <button className="study-primary" disabled={!diagnosticDone} onClick={() => changePhase(1)}>Vamos abrir este trecho <span aria-hidden="true">→</span></button>
            </>}

            {phase === 1 && <>
              <div className="study-card-progress" aria-label="Nosso caminho na leitura"><span className={contextCard === 0 ? "is-current" : ""}>1. Encontre a passagem</span><span className={contextCard === 1 ? "is-current" : ""}>2. Leia comigo</span><span className={contextCard === 2 ? "is-current" : ""}>3. Pense com calma</span></div>
              {contextCard === 0 && <article className="study-teaching-card">
                <p className="study-kicker">COM A BÍBLIA ABERTA</p><h3>Vamos encontrar estas palavras na sua Bíblia.</h3>
                <div className="study-reference-key">{lesson.workedExample.referenceKey.map((item) => <div key={item.label}><strong>{item.label}</strong><span>{item.meaning}</span></div>)}</div>
                <p>{lesson.context.paragraphs[0]}</p>
                <div className="study-action-prompt"><strong>Leia este pequeno trecho comigo</strong><p>Abra Atos 17:10–12. Leia devagar e repare nas pessoas desta história. Quem recebe a mensagem? Que cuidado elas têm com a Palavra?</p></div>
                <div className="study-card-actions"><button className="study-primary" onClick={() => { setContextCard(1); focusCard(); }}>Acompanhar esta leitura <span aria-hidden="true">→</span></button></div>
              </article>}
              {contextCard === 1 && <article className="study-teaching-card study-worked">
                <p className="study-kicker">VAMOS OUVIR COM ATENÇÃO</p><h3>{lesson.workedExample.title}</h3><p className="study-example-question">{lesson.workedExample.question}</p>
                <ol className="study-thinking-steps">{lesson.workedExample.thinkAloud.map((item, index) => <li key={item}><span aria-hidden="true">{index + 1}</span><p>{item}</p></li>)}</ol>
                <div className="study-example-answer"><strong>Um cuidado que podemos guardar</strong><p>{lesson.workedExample.observation}</p><span>Conferir: Atos 17:11</span></div>
                <details className="study-note-details"><summary>Um cuidado para não acrescentar ao texto o que ele não diz</summary><p>{lesson.workedExample.interpretationBoundary}</p></details>
                <div className="study-card-actions"><button className="study-secondary" onClick={() => { setContextCard(0); focusCard(); }}>Voltar ao cartão anterior</button><button className="study-primary" onClick={() => { setContextCard(2); focusCard(); }}>Pensar juntos sobre a passagem <span aria-hidden="true">→</span></button></div>
              </article>}
              {contextCard === 2 && <article className="study-teaching-card study-guided">
                <p className="study-kicker">SUA PERGUNTA TEM LUGAR AQUI</p><h3>{lesson.guidedPractice.title}</h3><p>{lesson.guidedPractice.prompt}</p>
                <div className="study-action-prompt"><strong>Deixe um pensamento nascer desta leitura</strong><p>Conte em voz baixa o que percebeu ou faça uma anotação no caderno. Se quiser, volte ao versículo e leia uma vez mais.</p></div>
                <details><summary>Receber uma ajuda para a leitura</summary><ol>{lesson.guidedPractice.hints.map((hint) => <li key={hint}>{hint}</li>)}</ol></details>
                <details><summary>Vamos conversar sobre o que lemos</summary><p>{lesson.guidedPractice.modelResponse}</p><p>{lesson.guidedPractice.selfCheck}</p></details>
                <div className="study-card-actions"><button className="study-secondary" onClick={() => { setContextCard(1); focusCard(); }}>Voltar ao cartão anterior</button><button className="study-primary" onClick={() => changePhase(2)}>Conversar sobre esta Palavra <span aria-hidden="true">→</span></button></div>
              </article>}
              <details className="study-tools"><summary>Seis maneiras de olhar para esta passagem</summary><div className="study-lens-buttons" role="group" aria-label="Lentes de contexto">{lesson.lenses.map((item, index) => <button key={item.id} aria-pressed={lens === index} onClick={() => setLens(index)}>{item.title}</button>)}</div><section className="study-lens"><h3>{lesson.lenses[lens].question}</h3><p>{lesson.lenses[lens].explanation}</p><p><strong>Vamos pensar juntos:</strong> {lesson.lenses[lens].task}</p><p className="study-fine">{lesson.lenses[lens].limit}</p></section></details>
            </>}

            {phase === 2 && (!finished ? <>
              <div className="study-activity-heading"><h3>{activity < 6 ? lesson.game.title : activity < 9 ? "O que ficou desta leitura?" : "Seguimos com Jesus em outra passagem"}</h3><p>{activity < 6 ? `Passo ${activity + 1} de 6 · com a Bíblia aberta` : activity < 9 ? `Relembrando ${activity - 5} de 3 · com calma` : "Vamos ler Lucas 10:25–37 juntos"}</p></div>
              <QuestionCard key={currentQuestion.id} question={currentQuestion} passage={activity === 9 ? transferPassage : mainPassage} edition={edition} support={supportByQuestion[currentQuestion.id]} onSupport={(flags) => recordSupport(currentQuestion.id, flags)} previousAnswers={answers} onAnswer={addAnswer} onContinue={continueActivity} last={activity === questions.length - 1} />
            </> : <><p>Nossa conversa sobre o texto chegou ao fim. Agora vamos guardar um ensino e pensar em um pequeno passo para vivê-lo.</p><button className="study-primary" onClick={() => changePhase(3)}>Levar esta Palavra comigo</button></>)}

            {phase === 3 && finished && <>
              <section className="study-pastoral-completion" aria-labelledby="study-completion-title"><p className="study-kicker">PARA LEVAR NO CORAÇÃO</p><h3 id="study-completion-title">Antes de seguir, guarde um cuidado.</h3><p>Chegamos ao fim deste encontro, mas a Palavra continua a nos acompanhar. Que lugar este ensino pode encontrar na sua vida hoje?</p><div className="study-next-care"><h4>Um pequeno passo para hoje</h4><p>{nextCare}</p></div></section>
              <StudyCelebration />
              <details className="study-results-details"><summary>Meu caminho neste estudo</summary><section className="study-results" aria-labelledby="study-results-title"><h3 id="study-results-title">Como foi nosso caminho na leitura</h3><dl>
                <div><dt>Prática: acertos na primeira tentativa</dt><dd>{summary.guidedFirstAttemptCorrect}<small> / 6</small></dd></div>
                <div><dt>Lembrança: primeira tentativa sem ajuda</dt><dd>{summary.retrievalFirstAttemptCorrect}<small> / 3</small></dd></div>
                <div><dt>Respostas que precisaram de nova tentativa</dt><dd>{summary.retryCorrect}</dd></div>
                <div><dt>Aplicação em outra passagem</dt><dd className="study-result-text">{summary.transferFirstAttemptCorrect ? "Primeira tentativa" : summary.transferCorrect ? "Com apoio ou correção" : "Retomar"}</dd></div>
              </dl><p className="study-fine">Este registro ajuda a escolher uma passagem para reler. Ele mostra apenas as respostas desta página: não mede sua fé, sua comunhão com Deus ou o que ficará na memória depois. Reler e pedir ajuda fazem parte do caminho.</p></section></details>
              <section className="study-soap"><h3>{lesson.soap.title}</h3><p>Se puder, reserve um cantinho no caderno para este encontro. Escreva o que deseja guardar e levar à oração. Essas palavras são suas e não precisam ser enviadas a ninguém.</p><ol>{lesson.soap.prompts.map((prompt) => <li key={prompt.id}><strong>{prompt.dimensions.join(" e ")}</strong><p>{prompt.prompt}</p></li>)}</ol><div className="study-card-actions"><a className="study-secondary" href="/resumos/primeiros-passos-v1.pdf" download>Baixar resumo em PDF</a><Link className="study-text-link" href="/aprender/primeiros-passos/resumo" target="_blank">Versão para impressão</Link></div></section>
              {lesson.closingPrayer && <section className="study-closing-prayer" aria-labelledby="study-prayer-title"><h3 id="study-prayer-title">Se desejar, encerre em oração</h3><blockquote>{lesson.closingPrayer}</blockquote><p>Esta é uma oração sugerida. Você pode falar com Deus com suas próprias palavras, sem escrever ou compartilhar nada aqui.</p></section>}
              <section className="study-review-plan"><h3>Há palavras que pedem um reencontro.</h3>{lesson.review.schedule.map((review) => <article key={review.afterDays}><span>+{review.afterDays} dia{review.afterDays > 1 ? "s" : ""}</span><div><h4>{review.title}</h4><p>{review.task}</p></div></article>)}<details><summary>Sobre as datas e a autoavaliação</summary><p>{lesson.review.scheduleNote}</p>{lesson.review.selfAssessment.map((item) => <div key={item.skill}><h4>{item.skill}</h4><p><strong>Com apoio:</strong> {item.withHelp}</p><p><strong>Com autonomia:</strong> {item.independently}</p></div>)}<p>{lesson.review.assessmentNote}</p></details></section>
              <section className="study-save"><h3>Guardar meu progresso</h3><p>Opcional, para uma conta adulta com autorização ativa. Guardamos respostas, tentativas, ajuda e datas; suas reflexões ficam no caderno.</p><label><input type="checkbox" checked={saveConsent} onChange={(event) => setSaveConsent(event.target.checked)} /> Quero guardar o progresso desta aula e as datas de retomada na minha conta.</label><button className="study-primary" disabled={!saveConsent || saveState === "saving" || saveState === "saved"} onClick={saveProgress}>{saveState === "saving" ? "Salvando…" : saveState === "saved" ? "Progresso salvo" : "Salvar meu progresso"}</button><Link className="study-text-link" href="/entrar?next=/aprender/primeiros-passos">Entrar na minha conta</Link></section>
            </>}
          </section>

          {phase !== 3 && <aside className="study-sidebar">
            {phase === 1 ? <Passage passage={mainPassage} edition={edition} /> : phase === 2 && currentQuestion?.evidenceMode === "without-looking" && !finished ? <div className="study-coach"><span className="study-coach-symbol" aria-hidden="true">◎</span><h3>O que esta leitura deixou em você?</h3><p>Tente contar com suas palavras. Se precisar reler, abrimos a passagem outra vez. Não há pressa nem constrangimento.</p></div> : <div className="study-coach"><span className="study-coach-symbol" aria-hidden="true">↗</span><h3>{phase === 0 ? "Podemos começar daqui." : "Vamos olhar juntos para a Palavra."}</h3><p>{phase === 0 ? "Não é preciso conhecer tudo para se aproximar da Bíblia. Vamos ouvir, perguntar e compreender um pouco de cada vez." : coach}</p><div className="study-coach-route"><span>Ouvir</span><span>Compreender</span><span>Viver</span></div></div>}
          </aside>}
        </div>
      </>}
      </StudyTransition>

      {saveMessage && <p className={`study-save-message ${saveState === "error" ? "is-error" : ""}`} role="status">{saveMessage}</p>}
      <details className="study-account-summary"><summary>Progresso na conta</summary><div><p>Enquanto você estuda, as respostas ficam apenas nesta sessão. Ao sair ou recarregar, elas são descartadas até você escolher salvar a conclusão.</p><button className="study-secondary" onClick={readProgress}>Consultar meu progresso salvo</button>{saved?.completed && <div className="study-saved-dates"><p>Conclusão: {saved.completedAt ? dateLabel(saved.completedAt) : "registrada"}.</p>{saved.reviewDates?.map((date) => <p key={date}>Retomada sugerida: {dateLabel(date)}.</p>)}<button className="study-secondary" onClick={clearProgress}>Apagar progresso desta aula</button></div>}<Link className="study-text-link" href="/privacidade">Privacidade e escolhas</Link></div></details>

      <dialog className="study-preparation-dialog" ref={preparationDialog} aria-labelledby="preparation-dialog-title"><span className="study-dialog-icon" aria-hidden="true">✦</span><h2 id="preparation-dialog-title">Vamos preparar este momento?</h2><p>Se puder, deixe sua <strong>Bíblia física aberta ao lado</strong> e um caderno por perto. Vamos ler juntos e guardar o que esta Palavra nos ensina.</p><p>Se não os tiver agora, o texto está aqui para acompanhar você. Podemos seguir com calma, com atenção e reverência.</p><div className="study-card-actions"><button className="study-primary" onClick={() => { preparationDialog.current?.close(); setStarted(true); requestAnimationFrame(() => sectionHeading.current?.focus()); }}>Começar a aula <span aria-hidden="true">→</span></button><button className="study-secondary" onClick={() => preparationDialog.current?.close()}>Voltar</button></div></dialog>
    </div>
  </AppShell>;
}
