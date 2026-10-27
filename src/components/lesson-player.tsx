"use client";

import Link from "next/link";
import { useRef, useState } from "react";
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
    <p className="study-kicker">{diagnostic ? "SEU PONTO DE PARTIDA · SEM NOTA" : withoutLooking ? "TENTE LEMBRAR PRIMEIRO" : question.kind === "transfer" ? "APLIQUE EM OUTRO TEXTO" : "PRÁTICA COM CONSULTA"}</p>
    {withoutLooking && <p className="study-note">A passagem fica recolhida nesta etapa. Responda em voz baixa ou no seu caderno antes de abrir as alternativas. A consulta e as dicas serão identificadas no resultado.</p>}
    {question.kind === "transfer" && <p className="study-note">Antes de escolher uma alternativa, explique em voz baixa ou no caderno como o diálogo inicial ajuda a compreender esta nova passagem. Depois compare sua justificativa com o comentário da resposta.</p>}
    <form onSubmit={submit}>
      <fieldset disabled={feedback !== null}>
        <legend>{question.prompt}</legend>
        {!withoutLooking && !diagnostic && <Passage passage={passage} edition={edition} />}
        {showChoices && orderedOptions(question).map((option) => <label className="study-option" key={option.id}>
          <input type="radio" name={question.id} value={option.id} checked={selected === option.id} disabled={wrongChoices.includes(option.id)} onChange={() => setSelected(option.id)} />
          <span>{option.text}</span>
        </label>)}
      </fieldset>
      {!showChoices && <button className="study-secondary" type="button" onClick={() => setShowChoices(true)}>Tentei lembrar; mostrar alternativas</button>}
      {!feedback && <div className="study-question-actions">
        {showChoices && <button className="study-primary" disabled={!selected} type="submit">Conferir resposta</button>}
        {!diagnostic && <button className="study-secondary" type="button" onClick={() => { setUsedHint(true); onSupport?.({ usedHint: true }); }} disabled={usedHint}>Preciso de uma dica</button>}
        {withoutLooking && <button className="study-secondary" type="button" onClick={() => { setConsultedText(true); setShowPassage(true); onSupport?.({ consultedText: true }); }}>Consultar texto (registra ajuda)</button>}
      </div>}
    </form>
    {usedHint && <p className="study-hint" role="status"><strong>Uma pista:</strong> {question.hint}</p>}
    {showPassage && withoutLooking && <Passage passage={passage} edition={edition} />}
    {feedback && <div className={`study-feedback ${correct || diagnostic ? "is-correct" : "needs-review"}`} tabIndex={-1} ref={feedbackRef}>
      <h3>{diagnostic ? "Vamos partir daqui." : correct ? "Resposta conferida." : "Vamos conferir a evidência."}</h3>
      <p>{feedback}</p>
      <p className="study-feedback-reference">Onde conferir: {question.sourceRefs.map((reference) => reference.label).join("; ")}.</p>
      {correct || diagnostic ? <button className="study-primary" onClick={onContinue}>{diagnostic ? "Seguir com o estudo" : last ? "Ver minha retomada" : "Próxima atividade"}</button> : <>
        <details><summary>Rever o procedimento</summary><p>Localize a passagem, leia o entorno e procure a ação ou o limite indicado na explicação. Compare a evidência com cada alternativa antes de escolher novamente.</p></details>
        <button className="study-primary" onClick={() => { setWrongChoices([...wrongChoices, selected]); setSelected(""); setFeedback(null); }}>Tentar novamente</button>
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
  const titles = ["Seu ponto de partida", "Aprenda o procedimento", "Pratique e confira", "Seu próximo passo"];
  const coach = currentQuestion?.skill === "locate"
    ? "Procure o livro, depois o capítulo e o intervalo de versículos."
    : currentQuestion?.skill === "observe"
      ? "Observe quem participa e o que acontece, sem completar lacunas."
      : "Encontre na passagem o que sustenta a sua resposta.";
  const focusCard = () => requestAnimationFrame(() => sectionHeading.current?.focus());

  return <AppShell active="learn" title="Primeiros passos" subtitle="Fundamentos da leitura bíblica">
    <div className="study-page" id="aula">
      <header className="study-lesson-heading">
        <Link className="study-back" href="/aprender"><span aria-hidden="true">←</span> Todos os estudos</Link>
        <div className="study-heading-meta"><span>Aula 01</span><span>15–20 min · no seu ritmo</span><details className="study-about"><summary>Piloto educacional</summary><div><p>{lesson.evaluationNote}</p><p>{lesson.perspective}</p><p>{lesson.pacingNote}</p></div></details></div>
        <h1>{lesson.title}</h1>
        {!started && <p className="study-subtitle">Encontre uma passagem, confira uma afirmação e use o procedimento em outro texto.</p>}
      </header>

      {!started ? <section className="study-welcome" aria-labelledby="study-objectives">
        <div className="study-welcome-heading"><span className="study-welcome-icon" aria-hidden="true">01</span><div><p className="study-kicker">SUA PRIMEIRA PRÁTICA</p><h2 id="study-objectives">Aprenda fazendo, uma descoberta por vez.</h2></div></div>
        <div className="study-start-actions"><button className="study-primary" onClick={() => preparationDialog.current?.showModal()}>Preparar minha mesa <span aria-hidden="true">→</span></button><p>Sem cronômetro. Você pode pausar, pedir ajuda e retomar.</p></div>
        <div className="study-learning-route">
          <div><span aria-hidden="true">1</span><h3>Veja como fazer</h3><p>Acompanhe um exemplo curto com a Bíblia aberta.</p></div>
          <div><span aria-hidden="true">2</span><h3>Investigue o texto</h3><p>Faça seis missões, com dicas e explicação de cada resposta.</p></div>
          <div><span aria-hidden="true">3</span><h3>Use o que aprendeu</h3><p>Tente lembrar e aplique o procedimento a outra passagem.</p></div>
        </div>

        <details className="study-objectives"><summary>O que vou conseguir praticar?</summary><ul>{lesson.objectives.map((objective) => <li key={objective.id}>{objective.statement}</li>)}</ul></details>
      </section> : <>
        <nav className="study-phases" aria-label="Etapas da aula">{["Preparar", "Entender", "Praticar", "Retomar"].map((title, index) => <button key={title} disabled={index === 3 && !finished} aria-current={phase === index ? "step" : undefined} onClick={() => changePhase(index)}><span>{index + 1}</span>{title}</button>)}</nav>
        <div className="study-session-progress"><progress max={10} value={finished ? 10 : phase === 2 ? activity : 0} aria-label="Atividades concluídas nesta sessão" /><span>{finished ? "Prática concluída" : phase === 2 ? `Atividade ${activity + 1} de 10` : "Prepare-se para praticar"}</span></div>

        <div className={`study-layout ${phase === 3 ? "study-layout-complete" : ""}`}>
          <section className="study-main" aria-labelledby="study-phase-title">
            <div className="study-step-heading"><p className="study-kicker">ETAPA {phase + 1} DE 4</p><h2 id="study-phase-title" tabIndex={-1} ref={sectionHeading}>{titles[phase]}</h2></div>
            {phase === 0 && <>
              <p className="study-lead">Antes do exemplo, escolha como você começaria. Esta pergunta orienta o estudo e não recebe nota.</p>
              {!diagnosticDone ? <QuestionCard question={lesson.preparation.diagnostic} previousAnswers={answers} passage={mainPassage} edition={edition} onAnswer={addAnswer} onContinue={() => setDiagnosticDone(true)} /> : <div className="study-callout"><h3>Agora vamos experimentar o procedimento.</h3><p>Você vai localizar a passagem e observar como conferir uma afirmação.</p></div>}
              <button className="study-primary" disabled={!diagnosticDone} onClick={() => changePhase(1)}>Ir para o contexto <span aria-hidden="true">→</span></button>
            </>}

            {phase === 1 && <>
              <div className="study-card-progress" aria-label="Cartões de explicação"><span className={contextCard === 0 ? "is-current" : ""}>1. Localize</span><span className={contextCard === 1 ? "is-current" : ""}>2. Acompanhe</span><span className={contextCard === 2 ? "is-current" : ""}>3. Experimente</span></div>
              {contextCard === 0 && <article className="study-teaching-card">
                <p className="study-kicker">COMECE POR UMA UNIDADE CURTA</p><h3>Uma referência é um endereço para encontrar o texto.</h3>
                <div className="study-reference-key">{lesson.workedExample.referenceKey.map((item) => <div key={item.label}><strong>{item.label}</strong><span>{item.meaning}</span></div>)}</div>
                <p>{lesson.context.paragraphs[0]}</p>
                <div className="study-action-prompt"><strong>Experimente agora</strong><p>Encontre Atos 17:10–12 na Bíblia. Leia os três versículos e procure os nomes dos participantes.</p></div>
                <div className="study-card-actions"><button className="study-primary" onClick={() => { setContextCard(1); focusCard(); }}>Ver exemplo resolvido <span aria-hidden="true">→</span></button></div>
              </article>}
              {contextCard === 1 && <article className="study-teaching-card study-worked">
                <p className="study-kicker">ACOMPANHE O RACIOCÍNIO</p><h3>{lesson.workedExample.title}</h3><p className="study-example-question">{lesson.workedExample.question}</p>
                <ol className="study-thinking-steps">{lesson.workedExample.thinkAloud.map((item, index) => <li key={item}><span aria-hidden="true">{index + 1}</span><p>{item}</p></li>)}</ol>
                <div className="study-example-answer"><strong>O que encontramos</strong><p>{lesson.workedExample.observation}</p><span>Conferir: Atos 17:11</span></div>
                <details className="study-note-details"><summary>Reconheça o limite da conclusão</summary><p>{lesson.workedExample.interpretationBoundary}</p></details>
                <div className="study-card-actions"><button className="study-secondary" onClick={() => { setContextCard(0); focusCard(); }}>Voltar ao cartão anterior</button><button className="study-primary" onClick={() => { setContextCard(2); focusCard(); }}>Fazer uma observação <span aria-hidden="true">→</span></button></div>
              </article>}
              {contextCard === 2 && <article className="study-teaching-card study-guided">
                <p className="study-kicker">AGORA É SUA VEZ</p><h3>{lesson.guidedPractice.title}</h3><p>{lesson.guidedPractice.prompt}</p>
                <div className="study-action-prompt"><strong>Responda antes de conferir</strong><p>Diga sua observação em voz baixa ou escreva no caderno. Aponte o versículo que a sustenta.</p></div>
                <details><summary>Ver pistas graduais</summary><ol>{lesson.guidedPractice.hints.map((hint) => <li key={hint}>{hint}</li>)}</ol></details>
                <details><summary>Conferir uma resposta comentada</summary><p>{lesson.guidedPractice.modelResponse}</p><p>{lesson.guidedPractice.selfCheck}</p></details>
                <div className="study-card-actions"><button className="study-secondary" onClick={() => { setContextCard(1); focusCard(); }}>Voltar ao cartão anterior</button><button className="study-primary" onClick={() => changePhase(2)}>Ir para a prática <span aria-hidden="true">→</span></button></div>
              </article>}
              <details className="study-tools"><summary>Explorar as seis lentes</summary><div className="study-lens-buttons" role="group" aria-label="Lentes de contexto">{lesson.lenses.map((item, index) => <button key={item.id} aria-pressed={lens === index} onClick={() => setLens(index)}>{item.title}</button>)}</div><section className="study-lens"><h3>{lesson.lenses[lens].question}</h3><p>{lesson.lenses[lens].explanation}</p><p><strong>Experimente:</strong> {lesson.lenses[lens].task}</p><p className="study-fine">{lesson.lenses[lens].limit}</p></section></details>
            </>}

            {phase === 2 && (!finished ? <>
              <div className="study-activity-heading"><h3>{activity < 6 ? lesson.game.title : activity < 9 ? "O que você consegue lembrar?" : "Um novo texto, o mesmo cuidado"}</h3><p>{activity < 6 ? `Missão ${activity + 1} de 6 · consulta permitida` : activity < 9 ? `Lembrança ${activity - 5} de 3 · tente antes de consultar` : "Aplicação em Lucas 10:25–37 · consulta permitida"}</p></div>
              <QuestionCard key={currentQuestion.id} question={currentQuestion} passage={activity === 9 ? transferPassage : mainPassage} edition={edition} support={supportByQuestion[currentQuestion.id]} onSupport={(flags) => recordSupport(currentQuestion.id, flags)} previousAnswers={answers} onAnswer={addAnswer} onContinue={continueActivity} last={activity === questions.length - 1} />
            </> : <><p>Você percorreu as atividades desta sessão. Veja seu resultado e escolha um próximo passo.</p><button className="study-primary" onClick={() => changePhase(3)}>Ver minha retomada</button></>)}

            {phase === 3 && finished && <>
              <section className="study-results" aria-labelledby="study-results-title"><h3 id="study-results-title">Veja como chegou às respostas.</h3><dl>
                <div><dt>Prática: acertos na primeira tentativa</dt><dd>{summary.guidedFirstAttemptCorrect}<small> / 6</small></dd></div>
                <div><dt>Lembrança: primeira tentativa sem ajuda</dt><dd>{summary.retrievalFirstAttemptCorrect}<small> / 3</small></dd></div>
                <div><dt>Respostas que precisaram de nova tentativa</dt><dd>{summary.retryCorrect}</dd></div>
                <div><dt>Aplicação em outra passagem</dt><dd className="study-result-text">{summary.transferFirstAttemptCorrect ? "Primeira tentativa" : summary.transferCorrect ? "Com apoio ou correção" : "Retomar"}</dd></div>
              </dl><p className="study-fine">Corrigir uma resposta não comprova retenção em outro dia. A retomada ajuda a descobrir o que você consegue lembrar e explicar.</p></section>
              <section className="study-soap"><h3>{lesson.soap.title}</h3><p>Reserve uma pequena anotação no caderno. Suas reflexões e orações não são enviadas ao aplicativo.</p><ol>{lesson.soap.prompts.map((prompt) => <li key={prompt.id}><strong>{prompt.dimensions.join(" e ")}</strong><p>{prompt.prompt}</p></li>)}</ol><div className="study-card-actions"><a className="study-secondary" href="/resumos/primeiros-passos-v1.pdf" download>Baixar resumo em PDF</a><Link className="study-text-link" href="/aprender/primeiros-passos/resumo" target="_blank">Versão para impressão</Link></div></section>
              <section className="study-review-plan"><h3>Retome em outro dia.</h3>{lesson.review.schedule.map((review) => <article key={review.afterDays}><span>+{review.afterDays} dia{review.afterDays > 1 ? "s" : ""}</span><div><h4>{review.title}</h4><p>{review.task}</p></div></article>)}<details><summary>Sobre as datas e a autoavaliação</summary><p>{lesson.review.scheduleNote}</p>{lesson.review.selfAssessment.map((item) => <div key={item.skill}><h4>{item.skill}</h4><p><strong>Com apoio:</strong> {item.withHelp}</p><p><strong>Com autonomia:</strong> {item.independently}</p></div>)}<p>{lesson.review.assessmentNote}</p></details></section>
              <section className="study-save"><h3>Guardar meu progresso</h3><p>Opcional, para uma conta adulta com autorização ativa. Guardamos respostas, tentativas, ajuda e datas; suas reflexões ficam no caderno.</p><label><input type="checkbox" checked={saveConsent} onChange={(event) => setSaveConsent(event.target.checked)} /> Quero guardar o progresso desta aula e as datas de retomada na minha conta.</label><button className="study-primary" disabled={!saveConsent || saveState === "saving" || saveState === "saved"} onClick={saveProgress}>{saveState === "saving" ? "Salvando…" : saveState === "saved" ? "Progresso salvo" : "Salvar meu progresso"}</button><Link className="study-text-link" href="/entrar?next=/aprender/primeiros-passos">Entrar na minha conta</Link></section>
            </>}
          </section>

          {phase !== 3 && <aside className="study-sidebar">
            {phase === 1 ? <Passage passage={mainPassage} edition={edition} /> : phase === 2 && currentQuestion?.evidenceMode === "without-looking" && !finished ? <div className="study-coach"><span className="study-coach-symbol" aria-hidden="true">◎</span><h3>Um momento para lembrar.</h3><p>Tente responder antes de consultar. Se precisar de ajuda, use os botões da atividade.</p></div> : <div className="study-coach"><span className="study-coach-symbol" aria-hidden="true">↗</span><h3>{phase === 0 ? "Um passo de cada vez." : "Procure a evidência."}</h3><p>{phase === 0 ? "Você vai ver um exemplo, praticar com apoio e usar o procedimento em outra passagem." : coach}</p><div className="study-coach-route"><span>Ler</span><span>Observar</span><span>Conferir</span></div></div>}
          </aside>}
        </div>
      </>}

      {saveMessage && <p className={`study-save-message ${saveState === "error" ? "is-error" : ""}`} role="status">{saveMessage}</p>}
      <details className="study-account-summary"><summary>Progresso na conta</summary><div><p>Enquanto você estuda, as respostas ficam apenas nesta sessão. Ao sair ou recarregar, elas são descartadas até você escolher salvar a conclusão.</p><button className="study-secondary" onClick={readProgress}>Consultar meu progresso salvo</button>{saved?.completed && <div className="study-saved-dates"><p>Conclusão: {saved.completedAt ? dateLabel(saved.completedAt) : "registrada"}.</p>{saved.reviewDates?.map((date) => <p key={date}>Retomada sugerida: {dateLabel(date)}.</p>)}<button className="study-secondary" onClick={clearProgress}>Apagar progresso desta aula</button></div>}<Link className="study-text-link" href="/privacidade">Privacidade e escolhas</Link></div></details>

      <dialog className="study-preparation-dialog" ref={preparationDialog} aria-labelledby="preparation-dialog-title"><span className="study-dialog-icon" aria-hidden="true">✦</span><h2 id="preparation-dialog-title">Vamos preparar este momento?</h2><p>Recomendamos estudar com a sua <strong>Bíblia física aberta ao lado</strong> e um caderno para conferir e anotar.</p><p>Se não os tiver agora, acompanhe pelo leitor do app. Siga no seu ritmo.</p><div className="study-card-actions"><button className="study-primary" onClick={() => { preparationDialog.current?.close(); setStarted(true); requestAnimationFrame(() => sectionHeading.current?.focus()); }}>Começar a aula <span aria-hidden="true">→</span></button><button className="study-secondary" onClick={() => preparationDialog.current?.close()}>Voltar</button></div></dialog>
    </div>
  </AppShell>;
}
