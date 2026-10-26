"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { firstLesson as lesson, type LessonQuestion } from "@/content/lessons/primeiros-passos";
import { calculateStudySummary, type StudyAnswer } from "@/lib/study-progress";
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
    <p className="study-kicker">CONFIRA NA BÍBLIA</p><h3>{passage.label}</h3>
    {passage.verses.map((verse) => <p className="study-verse" key={verse.number}><sup>{verse.number}</sup> {verse.text}</p>)}
    <p className="study-attribution">{edition.name} · {edition.license}<br />{edition.attribution} <a href={edition.sourceUrl} target="_blank" rel="noreferrer">Fonte da edição ↗</a></p>
    <Link className="study-text-link" href={`/biblia?livro=${passage.book}&capitulo=${passage.chapter}`}>Ler o capítulo completo →</Link>
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
    {!withoutLooking && !diagnostic && <Passage passage={passage} edition={edition} />}
    {question.kind === "transfer" && <p className="study-note">Antes de escolher uma alternativa, explique em voz baixa ou no caderno como o diálogo inicial ajuda a compreender esta nova passagem. Depois compare sua justificativa com o comentário da resposta.</p>}
    <form onSubmit={submit}>
      <fieldset disabled={feedback !== null}>
        <legend>{question.prompt}</legend>
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
  const titles = ["Prepare sua mesa", "Leia com contexto", "Pratique e confira", "Leve para a vida e retome"];
  return <div className="study-page">
    <a className="skip-link" href="#aula">Pular para a aula</a>
    <header className="study-header"><Link className="study-brand" href="/">InJessusName<span>CONHECER · COMPREENDER · VIVER</span></Link><nav aria-label="Navegação do estudo"><Link href="/aprender">Estudos</Link><Link href="/biblia">Bíblia</Link><Link href="/meu-percurso">Meu percurso</Link></nav></header>
    <main className="study-container" id="aula">
      <div className="study-introduction"><Link className="study-text-link" href="/aprender">← Voltar aos estudos</Link><p className="study-kicker">PRIMEIROS PASSOS · AULA 01</p><h1>{lesson.title}</h1><p>{lesson.subtitle}</p><div className="study-tags"><span>15–20 min sugeridos</span><span>{lesson.editorialLabel}</span></div><p className="study-fine">{lesson.pacingNote} {lesson.perspective}</p></div>
      {!started ? <section className="study-welcome" aria-labelledby="study-objectives"><div><p className="study-kicker">AO FINAL, VOCÊ VAI PRATICAR</p><h2 id="study-objectives">Ler, conferir e explicar o seu caminho.</h2><ul>{lesson.objectives.map((objective) => <li key={objective.id}>{objective.statement}</li>)}</ul><button className="study-primary" onClick={() => preparationDialog.current?.showModal()}>Preparar minha mesa</button><p className="study-fine">Quer guardar a conclusão? <Link className="study-text-link" href="/entrar?next=/aprender/primeiros-passos">Entre antes de começar.</Link> Sem conta, você pode estudar com respostas apenas nesta sessão.</p></div><aside><span className="study-symbol" aria-hidden="true">✧</span><h3>Uma descoberta de cada vez.</h3><p>Um exemplo resolvido, seis missões, três perguntas de lembrança e uma nova passagem para aplicar o procedimento.</p><p>Não há corrida nem classificação da sua fé. Você pode pedir ajuda e tentar de novo.</p></aside></section> : <>
        <nav className="study-phases" aria-label="Etapas da aula">{["Preparar", "Entender", "Praticar", "Retomar"].map((title, index) => <button key={title} disabled={index === 3 && !finished} aria-current={phase === index ? "step" : undefined} onClick={() => changePhase(index)}><span>{index + 1}</span>{title}</button>)}</nav>
        <div className="study-layout"><section className="study-main"><p className="study-kicker">ETAPA {phase + 1} DE 4</p><h2 tabIndex={-1} ref={sectionHeading}>{titles[phase]}</h2>
          {phase === 0 && <><p>{lesson.preparation.message}</p><ul className="study-checklist">{lesson.preparation.checklist.map((item) => <li key={item}>{item}</li>)}</ul>{!diagnosticDone ? <QuestionCard question={lesson.preparation.diagnostic} previousAnswers={answers} passage={mainPassage} edition={edition} onAnswer={addAnswer} onContinue={() => setDiagnosticDone(true)} /> : <div className="study-callout"><h3>Seu ponto de partida foi registrado nesta sessão.</h3><p>A pergunta inicial orienta o estudo e fica fora do resultado. Vamos aprender o procedimento com um exemplo.</p></div>}<button className="study-primary" disabled={!diagnosticDone} onClick={() => changePhase(1)}>Ir para o contexto</button></>}
          {phase === 1 && <><div className="study-prose">{lesson.context.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><figure className="study-diagram"><figcaption>{lesson.context.diagram.title}</figcaption><ol>{lesson.context.diagram.items.map((item, index) => <li key={item}><span>{index + 1}</span>{item}</li>)}</ol><p>{lesson.context.diagram.caption}</p></figure><article className="study-worked"><p className="study-kicker">EU MOSTRO COMO FAZER</p><h3>{lesson.workedExample.title}</h3><div className="study-reference-key">{lesson.workedExample.referenceKey.map((item) => <div key={item.label}><strong>{item.label}</strong><span>{item.meaning}</span></div>)}</div><h4>{lesson.workedExample.question}</h4><ol>{lesson.workedExample.thinkAloud.map((item) => <li key={item}>{item}</li>)}</ol><p><strong>Observação:</strong> {lesson.workedExample.observation}</p><p>{lesson.workedExample.evidence}</p><p className="study-note">{lesson.workedExample.interpretationBoundary}</p></article><section className="study-lenses" aria-labelledby="study-lenses-title"><p className="study-kicker">ABRA UMA PERGUNTA POR VEZ</p><h3 id="study-lenses-title">Seis lentes de contexto</h3><div className="study-lens-buttons" role="group" aria-label="Lentes de contexto">{lesson.lenses.map((item, index) => <button key={item.id} aria-pressed={lens === index} onClick={() => setLens(index)}>{item.title}</button>)}</div><div className="study-lens"><h4>{lesson.lenses[lens].question}</h4><p>{lesson.lenses[lens].explanation}</p><p><strong>Experimente:</strong> {lesson.lenses[lens].task}</p><p className="study-fine">{lesson.lenses[lens].limit}</p></div></section><section className="study-guided"><p className="study-kicker">AGORA, COM APOIO</p><h3>{lesson.guidedPractice.title}</h3><p>{lesson.guidedPractice.prompt}</p><details><summary>Ver pistas graduais</summary><ol>{lesson.guidedPractice.hints.map((hint) => <li key={hint}>{hint}</li>)}</ol></details><details><summary>Conferir uma resposta comentada</summary><p>{lesson.guidedPractice.modelResponse}</p><p>{lesson.guidedPractice.selfCheck}</p></details></section><button className="study-primary" onClick={() => changePhase(2)}>Ir para a prática</button></>}
          {phase === 2 && (!finished ? <><div className="study-activity-heading"><h3>{activity < 6 ? lesson.game.title : activity < 9 ? "O que você consegue lembrar?" : "Um novo texto, o mesmo cuidado"}</h3><p>{activity < 6 ? `Missão ${activity + 1} de 6 · consulta permitida` : activity < 9 ? `Lembrança ${activity - 5} de 3 · tente antes de consultar` : "Aplicação em Lucas 10:25–37 · consulta permitida"}</p></div><QuestionCard key={currentQuestion.id} question={currentQuestion} passage={activity === 9 ? transferPassage : mainPassage} edition={edition} support={supportByQuestion[currentQuestion.id]} onSupport={(flags) => recordSupport(currentQuestion.id, flags)} previousAnswers={answers} onAnswer={addAnswer} onContinue={continueActivity} last={activity === questions.length - 1} /><p className="study-fine">{lesson.game.evidenceNote}</p></> : <><p>Você já percorreu as atividades desta sessão. Seu resultado e as próximas ações estão na etapa Retomar.</p><button className="study-primary" onClick={() => changePhase(3)}>Ver minha retomada</button></>)}
          {phase === 3 && finished && <><section className="study-results" aria-labelledby="study-results-title"><p className="study-kicker">EVIDÊNCIAS DESTA SESSÃO</p><h3 id="study-results-title">Veja como chegou às respostas.</h3><dl><div><dt>Prática: acertos na primeira tentativa</dt><dd>{summary.guidedFirstAttemptCorrect} / 6</dd></div><div><dt>Lembrança: primeira tentativa sem ajuda</dt><dd>{summary.retrievalFirstAttemptCorrect} / 3</dd></div><div><dt>Respostas que precisaram de nova tentativa</dt><dd>{summary.retryCorrect}</dd></div><div><dt>Aplicação em outra passagem</dt><dd>{summary.transferFirstAttemptCorrect ? "Primeira tentativa" : summary.transferCorrect ? "Com apoio ou correção" : "Retomar"}</dd></div></dl><p className="study-note">São perguntas de reconhecimento nesta sessão. Corrigir uma resposta não comprova retenção em outro dia, e selecionar uma alternativa não substitui explicar seu raciocínio. Estes resultados não medem fé ou valor espiritual.</p></section><section className="study-soap"><h3>{lesson.soap.title}</h3><p>{lesson.soap.introduction}</p><ol>{lesson.soap.prompts.map((prompt) => <li key={prompt.id}><strong>{prompt.dimensions.join(" e ")}</strong><p>{prompt.prompt}</p></li>)}</ol><a className="study-primary" href="/resumos/primeiros-passos-v1.pdf" download>Baixar resumo em PDF (1 página)</a><Link className="study-text-link" href="/aprender/primeiros-passos/resumo" target="_blank">Abrir versão para impressão →</Link></section><section className="study-review-plan"><p className="study-kicker">APRENDER TAMBÉM É VOLTAR</p><h3>Retome em outro dia.</h3>{lesson.review.schedule.map((review) => <article key={review.afterDays}><span>+{review.afterDays} dia{review.afterDays > 1 ? "s" : ""}</span><div><h4>{review.title}</h4><p>{review.task}</p></div></article>)}<p className="study-fine">{lesson.review.scheduleNote} Não enviamos notificações.</p></section><details className="study-rubric"><summary>Como avaliar seu próximo passo</summary>{lesson.review.selfAssessment.map((item) => <div key={item.skill}><h4>{item.skill}</h4><p><strong>Com apoio:</strong> {item.withHelp}</p><p><strong>Com autonomia:</strong> {item.independently}</p></div>)}<p>{lesson.review.assessmentNote}</p></details><section className="study-save"><h3>Quer retomar pela sua conta?</h3><p>Salvar é opcional e exige uma conta adulta com autorização de personalização ativa. Serão guardados somente as alternativas, as tentativas, o uso de ajuda e as datas desta atividade. Orações e notas pessoais ficam no seu caderno.</p><label><input type="checkbox" checked={saveConsent} onChange={(event) => setSaveConsent(event.target.checked)} /> Quero guardar o progresso desta aula e as datas de retomada na minha conta.</label><button className="study-primary" disabled={!saveConsent || saveState === "saving" || saveState === "saved"} onClick={saveProgress}>{saveState === "saving" ? "Salvando…" : saveState === "saved" ? "Progresso salvo" : "Salvar meu progresso"}</button><Link className="study-text-link" href="/entrar?next=/aprender/primeiros-passos">Entrar na minha conta →</Link></section></>}
        </section><aside className="study-sidebar">{phase === 2 && currentQuestion?.evidenceMode === "without-looking" && !finished ? <div className="study-recall-note"><span aria-hidden="true">✧</span><h3>Um momento para lembrar.</h3><p>O texto está recolhido. Use o botão de consulta se precisar; pedir ajuda faz parte do aprendizado.</p></div> : phase === 2 && !finished ? <div className="study-recall-note"><span aria-hidden="true">✧</span><h3>Leia e justifique.</h3><p>A passagem desta atividade aparece junto da pergunta. Antes de escolher, procure o trecho que sustenta sua resposta. Dicas e novas tentativas ajudam a praticar.</p><Link className="study-text-link" href={`/biblia?livro=${currentQuestion?.kind === "transfer" ? transferPassage.book : mainPassage.book}&capitulo=${currentQuestion?.kind === "transfer" ? transferPassage.chapter : mainPassage.chapter}`}>Conferir o capítulo completo →</Link></div> : <Passage passage={mainPassage} edition={edition} />}<div className="study-sidebar-note"><h3>Seu ritmo importa.</h3><p>Pare e releia quando precisar. Ao sair ou recarregar, esta sessão será descartada até que você escolha salvar a conclusão.</p></div></aside></div>
      </>}
      <section className="study-account-summary" aria-label="Progresso guardado"><button className="study-secondary" onClick={readProgress}>Consultar meu progresso salvo</button>{saved?.completed && <div><p>Conclusão: {saved.completedAt ? dateLabel(saved.completedAt) : "registrada"}.</p>{saved.reviewDates?.map((date) => <p key={date}>Retomada sugerida: {dateLabel(date)}.</p>)}<button className="study-secondary" onClick={clearProgress}>Apagar progresso desta aula</button></div>}{saveMessage && <p role="status">{saveMessage}</p>}<p className="study-fine">{lesson.evaluationNote}</p></section>
    </main>
    <footer className="study-footer"><p>Plataforma educacional independente, sem vínculo institucional oficial com as igrejas mencionadas.</p><Link href="/privacidade">Privacidade e escolhas</Link></footer>
    <dialog className="study-preparation-dialog" ref={preparationDialog} aria-labelledby="preparation-dialog-title"><p className="study-kicker">MODO MESA DE ESTUDO</p><h2 id="preparation-dialog-title">Vamos preparar este momento?</h2><p>Recomendamos fortemente que você estude com a sua Bíblia física aberta ao lado para conferir cada passagem e um caderno de papel para fazer suas anotações pessoais.</p><p>Se não os tiver agora, use o leitor do app. Você pode retomar com calma depois.</p><button className="study-primary" onClick={() => { preparationDialog.current?.close(); setStarted(true); requestAnimationFrame(() => sectionHeading.current?.focus()); }}>Começar a aula</button><button className="study-secondary" onClick={() => preparationDialog.current?.close()}>Voltar</button></dialog>
  </div>;
}
