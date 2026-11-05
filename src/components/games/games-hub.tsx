"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useSyncExternalStore } from "react";
import { breadClues, breadConclusion, compassionSteps, compassionTray, contextCategories, gameBibleLink, games, passageConnections, type GameId, type GameReading, type GameReadings } from "@/content/games";
import "./games.css";

const subscribe = () => () => {};
type StepId = typeof compassionSteps[number]["id"];
type CategoryId = typeof contextCategories[number]["id"];
type Feedback = { good: boolean; text: string };

function Symbol({ name, className = "" }: { name: string; className?: string }) {
  return <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`g-symbol ${className}`}>
    {name === "heart" ? <path d="M16 27S4 19.5 4 11.5C4 5 12 3 16 9c4-6 12-4 12 2.5C28 19.5 16 27 16 27Z" />
      : name === "hands" ? <><path d="m5 22 6-8c2-2 4 0 3 2l-2 4 8-2c5-2 9 2 5 4l-8 5H7M3 20l5 9M18 12V6m-4 5 2-2 2 2 2-2 2 2M11 6l7-3 8 5-7 8" /></>
      : name === "house" ? <><path d="m3 15 13-11 13 11M7 12v16h18V12M13 28V17h6v11M11 11h10" /></>
      : name === "sun" ? <><circle cx="16" cy="16" r="7" /><path d="M16 2v4m0 20v4M2 16h4m20 0h4M6 6l3 3m14 14 3 3M6 26l3-3M23 9l3-3" /></>
      : name === "water" ? <><path d="M5 21c4-5 7 5 11 0s7 5 11 0M5 27c4-5 7 5 11 0s7 5 11 0M16 3s-6 7-6 11a6 6 0 0 0 12 0c0-4-6-11-6-11Z" /></>
      : name === "bread" ? <><path d="M5 25c-4-8 0-15 8-18s15-1 15 6-8 15-15 15c-3 0-6-1-8-3ZM10 12l4 5m3-8 4 5M6 18l3 5" /></>
      : name === "check" ? <path d="m7 17 6 6L26 9" />
      : name === "arrow" ? <path d="M5 16h22m-8-8 8 8-8 8" />
      : <><path d="M16 7C11 3 5 4 3 5v21c5-2 9-1 13 3 4-4 8-5 13-3V5c-2-1-8-2-13 2Zm0 0v22M8 10l4 1M8 15l4 1m8-5 4-1m-4 6 4-1" /></>}
  </svg>;
}

function Scripture({ reading, verses, open = false, label }: { reading: GameReading; verses?: readonly number[]; open?: boolean; label?: string }) {
  const text = verses ? reading.verses.filter(verse => verses.includes(verse.number)) : reading.verses;
  const contiguous = text.every((verse, index) => index === 0 || verse.number === text[index - 1].number + 1);
  const reference = verses ? `${reading.label.split(":")[0]}:${contiguous && text.length > 1 ? `${text[0].number}–${text[text.length - 1].number}` : text.map(verse => verse.number).join(", ")}` : reading.label;
  return <details className="g-scripture" open={open || undefined}>
    <summary><span><Symbol name="book" /><span>{label ?? "Abra a Palavra"}<small>{reference} · Bíblia Livre</small></span></span><span className="g-scripture-plus" aria-hidden="true">+</span></summary>
    <div className="g-scripture-body"><p className="g-text-label">Texto bíblico · redação preservada da edição</p>
      {text.map(verse => <p className="g-verse" key={verse.number}><sup>{verse.number}</sup>{verse.text}</p>)}
      <Link className="g-text-link" href={gameBibleLink(reading, text[0]?.number)} target="_blank" rel="noopener noreferrer">Ler o capítulo na Bíblia <span aria-hidden="true">↗</span></Link>
    </div>
  </details>;
}

function FeedbackBox({ feedback }: { feedback: Feedback | null }) {
  return <div className="g-feedback-region" aria-live="polite" aria-atomic="true">{feedback && <div className={`g-feedback ${feedback.good ? "g-feedback-good" : ""}`}><span className="g-feedback-mark" aria-hidden="true">{feedback.good ? "✓" : "↺"}</span><p>{feedback.text}</p></div>}</div>;
}

function Completion({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="g-completion" role="status"><span className="g-completion-icon"><Symbol name="check" /></span><div><span className="g-kicker">Prática concluída</span><h3>{title}</h3><p>{children}</p></div><svg viewBox="0 0 120 120" aria-hidden="true"><path d="M60 10v100M10 60h100M25 25l70 70m0-70-70 70" /><circle cx="60" cy="60" r="40" /></svg></div>;
}

function CompassionGame({ reading, onComplete }: { reading: GameReading; onComplete: () => void }) {
  const [slots, setSlots] = useState<(StepId | null)[]>([null, null, null, null]);
  const [selected, setSelected] = useState<StepId | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [checked, setChecked] = useState(false);
  const [finished, setFinished] = useState(false);
  const allPlaced = slots.every(Boolean);
  function place(index: number, step = selected) {
    if (!step || finished) { if (slots[index]) setSelected(slots[index]); return; }
    setSlots(current => {
      const next = [...current];
      const previous = next.indexOf(step);
      if (previous !== -1) next[previous] = next[index];
      next[index] = step;
      return next;
    });
    setSelected(null); setChecked(false); setFeedback(null);
  }
  function check() {
    const good = compassionSteps.every((step, index) => slots[index] === step.id);
    setChecked(true); setFinished(good);
    if (good) { onComplete(); setFeedback({ good, text: "Você acompanhou os gestos de misericórdia na ordem do relato. Jesus termina convidando: “Vai, e faze da mesma maneira.”" }); }
    else setFeedback({ good, text: "Vamos caminhar pelo texto mais uma vez. No versículo 33 vem a compaixão; no 34, o cuidado com as feridas e a hospedaria; no 35, a continuidade desse cuidado. Você pode mover os cartões e tentar novamente." });
  }
  return <section className="g-experience" aria-labelledby="compassion-title">
    <div className="g-experience-heading"><div><span className="g-kicker">01 · Reconstruir o relato</span><h2 id="compassion-title">O amor se torna caminho.</h2><p>Na parábola de Jesus, a misericórdia ganha mãos, tempo e cuidado. Reconstrua os quatro gestos do samaritano na ordem em que Lucas os apresenta.</p></div><span className="g-reference-pill">Lucas 10:33–35</span></div>
    <div className="g-compassion-layout">
      <div className="g-route-board">
        <Image src="/visuals/story-bom-samaritano.png" alt="Ilustração artística de um viajante cuidando de um homem ferido em um caminho de pedra." fill quality={100} sizes="(max-width: 900px) 100vw, 65vw" className="g-cover-image" />
        <div className="g-route-shade" /><div className="g-board-caption"><span className="g-kicker">De Jerusalém a Jericó</span><p>Um próximo se revela pelo cuidado.</p></div>
        <svg className="g-route-line" viewBox="0 0 900 450" preserveAspectRatio="none" aria-hidden="true"><path d="M90 332C140 245 250 270 315 332S440 390 500 310 650 215 750 290 800 330 840 300" /><path d="M90 332C140 245 250 270 315 332S440 390 500 310 650 215 750 290 800 330 840 300" className="g-route-line-dots" /></svg>
        <div className="g-route-slots" aria-label="Caminho com quatro posições">
          {slots.map((id, index) => { const step = compassionSteps.find(item => item.id === id); const wrong = checked && id !== compassionSteps[index].id; return <div className={`g-route-stop g-route-stop-${index + 1} ${id ? "g-route-filled" : ""} ${wrong ? "g-route-wrong" : ""} ${selected === id && id ? "g-route-selected" : ""}`} key={index}>
            <button type="button" data-route-slot={index + 1} onClick={() => place(index)} disabled={finished} onDragOver={event => { if (!finished) event.preventDefault(); }} onDrop={event => { event.preventDefault(); const stepId = event.dataTransfer.getData("text/plain"); if (compassionSteps.some(item => item.id === stepId)) place(index, stepId as StepId); }} aria-label={`Posição ${index + 1}${step ? `: ${step.title}` : ": colocar gesto selecionado"}`} aria-pressed={id && selected === id ? true : undefined}>
              <span className="g-stop-number">{index + 1}</span><Symbol name={step?.symbol ?? "book"} /><strong>{step?.title ?? "Coloque um gesto"}</strong>{step && <small>Lucas 10:{step.verse}</small>}
            </button>
            {id && !finished && <button type="button" className="g-remove-step" aria-label={`Retirar ${step?.title} da posição ${index + 1}`} onClick={() => { setSlots(current => current.map((value, position) => position === index ? null : value)); setChecked(false); setFeedback(null); if (selected === id) setSelected(null); }}>×</button>}
          </div>; })}
        </div><span className="g-art-caption">Ilustração artística · Lucas 10</span>
      </div>
      <aside className="g-action-tray"><span className="g-kicker">Os gestos de misericórdia</span><h3>Escolha. Depois, coloque.</h3><p id="g-placement-help">Toque em um cartão e depois em uma posição do caminho. Use Tab e Enter se preferir. Para mover um gesto, selecione-o no caminho e escolha outra posição.</p>
        <div className="g-tray-grid">{compassionTray.map(id => { const step = compassionSteps.find(item => item.id === id)!; const placed = slots.includes(id); return <button key={id} type="button" className={`g-action-card ${selected === id ? "g-card-selected" : ""} ${placed ? "g-card-placed" : ""}`} data-game-step={id} aria-pressed={selected === id} disabled={placed || finished} aria-describedby="g-placement-help" draggable={!placed && !finished} onDragStart={event => { event.dataTransfer.setData("text/plain", id); setSelected(id); }} onClick={() => setSelected(selected === id ? null : id)}><Symbol name={step.symbol} /><span><strong>{step.title}</strong><small>{placed ? "Já está no caminho" : step.description}</small></span>{placed && <span aria-hidden="true">✓</span>}</button>; })}</div>
        <p className="g-selection-hint" aria-live="polite">{selected ? `Agora escolha uma posição para “${compassionSteps.find(step => step.id === selected)?.title}”.` : `${slots.filter(Boolean).length} de 4 gestos no caminho`}</p>
        <button className="g-primary" type="button" onClick={check} disabled={!allPlaced || finished}>{finished ? "Caminho reconstruído" : "Conferir o caminho"}<Symbol name={finished ? "check" : "arrow"} /></button>
        <button className="g-reset" type="button" onClick={() => { setSlots([null, null, null, null]); setSelected(null); setFeedback(null); setChecked(false); setFinished(false); }}>Recomeçar esta prática</button>
      </aside>
    </div>
    <FeedbackBox feedback={feedback} />
    {finished && <Completion title="Você reconheceu a sequência do cuidado.">Agora leve a pergunta de Jesus consigo: quem agiu como próximo? A resposta está na misericórdia praticada, e não em uma pontuação. Reflita em Lucas 10:36–37.</Completion>}
    <div className="g-reading-columns"><Scripture reading={reading} verses={[33, 34, 35, 36, 37]} label="Confira os gestos na Palavra" /><div className="g-teaching-note"><span className="g-kicker">Por que praticar assim?</span><h3>Um gesto prepara o seguinte.</h3><p>Reconstruir a sequência ajuda a perceber o ensino inteiro: o samaritano vê, se aproxima, cuida e providencia a continuidade. Os cartões são resumos editoriais; a Palavra permanece disponível para você conferir cada detalhe.</p><Link href={gameBibleLink(reading)}>Conheça a pergunta que deu início à parábola <span aria-hidden="true">↗</span></Link></div></div>
  </section>;
}

function ConnectionsGame({ readings, onComplete }: { readings: GameReadings; onComplete: () => void }) {
  const [selected, setSelected] = useState<string>(passageConnections[0].id);
  const [links, setLinks] = useState<Record<string, CategoryId>>({});
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [checked, setChecked] = useState(false);
  const [finished, setFinished] = useState(false);
  const connected = Object.keys(links).length;
  const active = passageConnections.find(passage => passage.id === selected)!;
  function connect(category: CategoryId) { setLinks(current => ({ ...current, [selected]: category })); setChecked(false); setFeedback(null); const next = passageConnections.find(passage => passage.id !== selected && !links[passage.id]); if (next) setSelected(next.id); }
  function check() {
    const good = passageConnections.every(passage => links[passage.id] === passage.category);
    setChecked(true); setFinished(good);
    setFeedback({ good, text: good ? "Você distinguiu uma parábola, um salmo e um sinal narrado no Evangelho. Reconhecer como o texto fala nos ajuda a ouvir com atenção o que ele ensina." : "Uma conexão precisa de mais atenção. A parábola ensina por uma história contada por Jesus; o salmo expressa confiança em poesia; João narra o sinal dos pães como um acontecimento. Leia as explicações e refaça os fios destacados." });
    if (good) onComplete();
  }
  return <section className="g-experience" aria-labelledby="connections-title">
    <div className="g-experience-heading"><div><span className="g-kicker">02 · Ler com atenção ao contexto</span><h2 id="connections-title">Cada passagem tem uma voz.</h2><p>A Palavra nos alcança também por parábolas, poesia e relatos. Escolha uma passagem à esquerda e conecte-a à forma como ela nos ensina, à direita.</p></div><span className="g-reference-pill">3 passagens · 3 conexões</span></div>
    <div className="g-context-intro"><Symbol name="book" /><p><strong>Antes de começar:</strong> uma parábola é uma história usada para ensinar; um salmo pode expressar oração por imagens poéticas; um sinal no Evangelho revela a ação e o poder de Jesus. Aqui você vai reconhecer essas três formas em passagens concretas.</p></div>
    <div className="g-connections-board">
      <div className="g-passage-list" aria-label="Escolha uma passagem">{passageConnections.map((passage, index) => { const assigned = contextCategories.find(category => category.id === links[passage.id]); const wrong = checked && links[passage.id] !== passage.category; return <button className={`g-passage-card ${selected === passage.id ? "g-passage-selected" : ""} ${wrong ? "g-connection-wrong" : ""}`} type="button" key={passage.id} onClick={() => setSelected(passage.id)} disabled={finished} aria-pressed={selected === passage.id} data-passage={passage.id}><span className="g-passage-art"><Image src={passage.art} alt="" fill quality={100} sizes="100px" /></span><span className="g-passage-copy"><small>{readings[passage.reading].label}</small><strong>{passage.title}</strong><span>{passage.preview}</span><em>{assigned ? `Conectado: ${assigned.title}` : "Selecione para conectar"}</em></span><span className="g-connection-port" aria-hidden="true">{index + 1}</span></button>; })}</div>
      <div className="g-thread-space" aria-hidden="true"><svg viewBox="0 0 100 100" preserveAspectRatio="none">{passageConnections.map((passage, index) => { const target = contextCategories.findIndex(category => category.id === links[passage.id]); return target >= 0 ? <path key={passage.id} d={`M0 ${17 + index * 33} C50 ${17 + index * 33} 50 ${17 + target * 33} 100 ${17 + target * 33}`} className={`g-thread g-thread-${index} ${checked && links[passage.id] !== passage.category ? "g-thread-wrong" : ""}`} /> : <path className="g-thread-empty" key={passage.id} d={`M0 ${17 + index * 33}h15`} />; })}</svg><span className="g-thread-seal"><Symbol name="book" /></span></div>
      <div className="g-category-list" aria-label="Escolha o contexto para a passagem selecionada">{contextCategories.map(category => <button type="button" className={`g-category-card ${links[selected] === category.id ? "g-category-linked" : ""}`} key={category.id} onClick={() => connect(category.id)} disabled={finished} data-category={category.id} aria-label={`Conectar ${active.title} a ${category.title}`}><span className="g-category-icon"><Symbol name={category.symbol} /></span><span><strong>{category.title}</strong><small>{category.subtitle}</small></span><span className="g-category-arrow" aria-hidden="true">↗</span></button>)}</div>
    </div>
    <div className="g-connection-toolbar"><p aria-live="polite">{finished ? "As três passagens encontraram seu contexto." : <><strong>{active.title}</strong><span> → escolha uma forma de ensino. {connected}/3 conectadas.</span></>}</p><button type="button" className="g-primary" disabled={connected !== passageConnections.length || finished} onClick={check}>{finished ? "Conexões conferidas" : "Conferir as conexões"}<Symbol name={finished ? "check" : "arrow"} /></button></div>
    <FeedbackBox feedback={feedback} />
    {checked && <div className="g-connection-explanations">{passageConnections.map(passage => { const good = links[passage.id] === passage.category; return <article key={passage.id} className={good ? "g-explanation-good" : "g-explanation-retry"}><span aria-hidden="true">{good ? "✓" : "↺"}</span><div><h3>{passage.title}</h3><p>{passage.feedback}</p><Link href={gameBibleLink(readings[passage.reading], passage.verses[0])} target="_blank" rel="noopener noreferrer">Conferir {readings[passage.reading].label} ↗</Link></div></article>; })}</div>}
    {finished && <Completion title="Os fios agora fazem sentido.">Ler com fé e atenção ao contexto ajuda a receber a mensagem sem trocar uma poesia por uma promessa que o texto não fez, nem reduzir um milagre a uma ilustração.</Completion>}
    <div className="g-context-readings">{passageConnections.map(passage => <Scripture key={passage.id} reading={readings[passage.reading]} verses={passage.verses} label={passage.title} />)}</div>
    <button className="g-reset" type="button" onClick={() => { setLinks({}); setSelected(passageConnections[0].id); setFeedback(null); setChecked(false); setFinished(false); }}>Refazer as conexões</button>
  </section>;
}

function BreadGame({ reading, onComplete }: { reading: GameReading; onComplete: () => void }) {
  const [active, setActive] = useState<string>(breadClues[0].id);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [responses, setResponses] = useState<Record<string, Feedback>>({});
  const [conclusion, setConclusion] = useState<string | null>(null);
  const clue = breadClues.find(item => item.id === active)!;
  const solved = breadClues.filter(item => item.options.some(option => option.id === answers[item.id] && option.correct)).map(item => item.id as string);
  const ready = solved.length === breadClues.length;
  const finalOption = breadConclusion.options.find(option => option.id === conclusion);
  const finished = !!finalOption?.correct;
  const cluePanel = useRef<HTMLDivElement>(null);
  function chooseClue(id: string, focus = false) { setActive(id); if (focus) requestAnimationFrame(() => cluePanel.current?.focus({ preventScroll: true })); }
  return <section className="g-experience" aria-labelledby="bread-title">
    <div className="g-experience-heading"><div><span className="g-kicker">03 · Observar, conferir, compreender</span><h2 id="bread-title">Pouco nas mãos. Um sinal diante dos olhos.</h2><p>Aproxime-se do relato dos pães. Abra as três pistas, consulte a Palavra e reúna o que João nos conta sobre o cuidado e o poder de Jesus.</p></div><span className="g-reference-pill">João 6:9–14</span></div>
    <div className="g-bread-layout"><div className="g-investigation-scene"><Image src="/visuals/story-multiplicacao-dos-paes.png" alt="Ilustração artística de Jesus e seus discípulos repartindo alimento diante da multidão, junto ao mar da Galileia." fill quality={100} sizes="(max-width: 900px) 100vw, 65vw" className="g-cover-image" /><div className="g-scene-vignette" /><div className="g-scene-title"><span className="g-kicker">No monte, junto ao mar da Galileia</span><h3>Venha ver o que a Palavra conta.</h3></div>
      {breadClues.map((item, index) => <button type="button" className={`g-hotspot ${active === item.id ? "g-hotspot-active" : ""} ${solved.includes(item.id) ? "g-hotspot-solved" : ""}`} key={item.id} style={{ left: item.position.left, top: item.position.top }} onClick={() => chooseClue(item.id, true)} aria-label={`Abrir pista ${index + 1}: ${item.title}${solved.includes(item.id) ? ", conferida" : ""}`} aria-pressed={active === item.id} data-clue={item.id}><span className="g-hotspot-ring" /><span>{solved.includes(item.id) ? "✓" : index + 1}</span><small>{item.shortTitle}</small></button>)}<span className="g-art-caption">Ilustração artística · as respostas estão no texto bíblico.</span></div>
      <div className="g-clue-panel" ref={cluePanel} tabIndex={-1}><div className="g-clue-progress"><span className="g-kicker">Caderno de investigação</span><span>{solved.length}/3</span></div><div className="g-clue-tabs" aria-label="Pistas do relato">{breadClues.map((item, index) => <button type="button" key={item.id} onClick={() => chooseClue(item.id)} className={active === item.id ? "g-clue-tab-active" : ""} aria-pressed={active === item.id} aria-label={`Pista ${index + 1}: ${item.title}`}>{solved.includes(item.id) ? "✓" : `0${index + 1}`}</button>)}</div>
        <span className="g-clue-reference">João 6:{clue.verse}</span><h3>{clue.title}</h3><p className="g-clue-question">{clue.question}</p>
        <div className="g-choices">{clue.options.map(option => <button type="button" key={option.id} data-clue-answer={option.id} className={`g-choice ${answers[clue.id] === option.id ? option.correct ? "g-choice-correct" : "g-choice-retry" : ""}`} disabled={solved.includes(clue.id)} onClick={() => { setAnswers(current => ({ ...current, [clue.id]: option.id })); setResponses(current => ({ ...current, [clue.id]: { good: option.correct, text: option.feedback } })); }}><span className="g-choice-dot" aria-hidden="true">{answers[clue.id] === option.id ? option.correct ? "✓" : "↺" : ""}</span><span>{option.label}</span></button>)}</div>
        <FeedbackBox feedback={responses[clue.id] ?? null} /><Scripture reading={reading} verses={clue.id === "cestos" ? [12, 13] : [clue.verse]} open label="A pista na Palavra" />
        {solved.includes(clue.id) && !ready && <button className="g-text-link g-next-clue" type="button" onClick={() => chooseClue(breadClues.find(item => !solved.includes(item.id))!.id)}>Abrir a próxima pista <Symbol name="arrow" /></button>}
      </div></div>
    <div className={`g-conclusion ${ready ? "g-conclusion-ready" : ""}`}><div><span className="g-kicker">Reúna as pistas</span><h3>{ready ? "Agora, contemple o relato inteiro." : "Três detalhes. Uma história que aponta para Jesus."}</h3><p>{ready ? breadConclusion.question : "Confira as três pistas para abrir a conclusão. A imagem nos aproxima da cena; é a Escritura que orienta cada resposta."}</p></div>{ready ? <div className="g-conclusion-answers"><div className="g-choices">{breadConclusion.options.map(option => <button type="button" className={`g-choice ${conclusion === option.id ? option.correct ? "g-choice-correct" : "g-choice-retry" : ""}`} data-conclusion={option.id} key={option.id} disabled={finished} onClick={() => { setConclusion(option.id); if (option.correct) onComplete(); }}><span className="g-choice-dot" aria-hidden="true">{conclusion === option.id ? option.correct ? "✓" : "↺" : ""}</span><span>{option.label}</span></button>)}</div><FeedbackBox feedback={finalOption ? { good: finalOption.correct, text: finalOption.feedback } : null} /></div> : <div className="g-evidence-count" aria-label={`${solved.length} de 3 pistas conferidas`}>{breadClues.map(item => <span className={solved.includes(item.id) ? "g-evidence-found" : ""} key={item.id}><Symbol name={solved.includes(item.id) ? "check" : "bread"} /></span>)}</div>}</div>
    {finished && <Completion title="Você reuniu as pistas com a Bíblia aberta.">Cinco pães, dois peixinhos, Jesus dando graças e doze cestos de sobras. Você distinguiu os detalhes do relato e uma conclusão que permanece ligada à passagem.</Completion>}
    <Scripture reading={reading} label="Leia o relato completo, do começo ao fim" />
    <button className="g-reset" type="button" onClick={() => { setAnswers({}); setResponses({}); setConclusion(null); setActive(breadClues[0].id); }}>Investigar novamente</button>
  </section>;
}

export function GamesHub({ readings, initialGame = "caminho", attribution }: { readings: GameReadings; initialGame?: GameId; attribution: string }) {
  const [current, setCurrent] = useState<GameId>(initialGame);
  const [completed, setCompleted] = useState<GameId[]>([]);
  const ready = useSyncExternalStore(subscribe, () => true, () => false);
  const experience = useRef<HTMLDivElement>(null);
  function select(id: GameId) { setCurrent(id); const url = new URL(window.location.href); url.searchParams.set("jogo", id); window.history.replaceState(null, "", url); }
  function complete(id: GameId) { setCompleted(previous => previous.includes(id) ? previous : [...previous, id]); }
  const selectedGame = games.find(game => game.id === current)!;
  return <div className="games-hub" data-games-ready={ready}>
    <section className="g-hero"><div className="g-hero-copy"><span className="g-kicker"><span className="g-gold-dot" />Aprender também é participar</span><h1>A Palavra ganha <em>caminho nas suas mãos.</em></h1><p>Entre no relato, perceba os detalhes e descubra as conexões. Três maneiras de estudar com fé, atenção e a Bíblia sempre aberta ao seu lado.</p><div className="g-hero-foot"><span className="g-visit-progress"><span>{completed.length}<small>/3</small></span><span>práticas concluídas<br /><small>nesta visita</small></span></span><span className="g-hero-principle"><Symbol name="book" />Sem pressa.<br />Com a Palavra.</span></div></div><div className="g-hero-art"><Image src="/visuals/story-bom-samaritano.png" alt="Ilustração artística do bom samaritano acolhendo o viajante ferido, um dos relatos explorados nestas práticas." fill quality={100} sizes="(max-width: 700px) 100vw, 55vw" preload /><div className="g-hero-art-shade" /><span className="g-hero-verse">“Vai, e faze da mesma maneira.”<small>Lucas 10:37 · trecho da Bíblia Livre</small></span><span className="g-art-caption">Ilustração artística</span></div></section>
    <fieldset disabled={!ready} className="g-interactive-fieldset"><legend className="g-sr-only">Práticas bíblicas interativas</legend>
      <nav className="g-game-selector" aria-label="Escolha uma prática bíblica">{games.map(game => <button type="button" key={game.id} className={`g-game-option ${current === game.id ? "g-game-option-active" : ""}`} onClick={() => select(game.id)} aria-pressed={current === game.id} aria-controls="game-experience" data-game-tab={game.id}><span className="g-game-number">{completed.includes(game.id) ? <Symbol name="check" /> : game.number}</span><span><strong>{game.title}</strong><small>{game.subtitle}</small></span><Symbol name="arrow" /></button>)}</nav>
      <div className="g-experience-wrap" id="game-experience" ref={experience} tabIndex={-1} key={current} data-active-game={current}>{current === "caminho" ? <CompassionGame reading={readings.samaritano} onComplete={() => complete("caminho")} /> : current === "conexoes" ? <ConnectionsGame readings={readings} onComplete={() => complete("conexoes")} /> : <BreadGame reading={readings.paes} onComplete={() => complete("sinais")} />}</div>
    </fieldset>
    <noscript><div className="g-noscript"><h2>Estude as passagens na Bíblia</h2><p>Os tabuleiros precisam de JavaScript. A leitura bíblica continua disponível nestes links:</p>{Object.values(readings).map(reading => <Link key={reading.id} href={gameBibleLink(reading)}>{reading.label} ↗</Link>)}</div></noscript>
    <footer className="g-footer"><div><Symbol name="heart" /><p><strong>O que você pratica aqui</strong><span>{selectedGame.skill}. Os desafios verificam compreensão do texto; o cuidado com a sua fé vai além de qualquer atividade.</span></p></div><details><summary>Sobre os textos, as imagens e esta visita</summary><p>As instruções e explicações são comentários editoriais. Os versículos identificados como texto bíblico preservam a redação da Bíblia Livre, edição TR de fevereiro de 2018. As cenas são ilustrações artísticas; não são fotografias dos acontecimentos nem fontes para contar objetos.</p><p>O registro de práticas fica apenas na memória desta página e desaparece ao recarregar. As atividades não avaliam fé, santidade ou inteligência.</p><p>{attribution}</p><Link href="/fontes">Consultar fontes e direitos ↗</Link></details></footer>
  </div>;
}
