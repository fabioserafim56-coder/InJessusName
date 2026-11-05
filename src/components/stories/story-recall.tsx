"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { ArrowCounterClockwise, ArrowRight, BookOpenText, Check, Path } from "@phosphor-icons/react";
import { storyBibleUrl, type BiblicalStory } from "@/content/stories";

const subscribe = () => () => {};
const sceneOrder = [2, 0, 3, 1];

/** Retrieval is about following the passage, never measuring the student's faith. */
export function StoryRecall({ story }: { story: BiblicalStory }) {
  const ready = useSyncExternalStore(subscribe, () => true, () => false);
  const [recalled, setRecalled] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<{ index: number; matched: boolean } | null>(null);
  const complete = recalled.length === story.scenes.length;
  const chosen = feedback === null ? null : story.scenes[feedback.index];

  function choose(index: number) {
    const matched = index === recalled.length;
    setFeedback({ index, matched });
    if (matched) setRecalled(current => [...current, index]);
  }

  return <section className="story-recall" aria-labelledby="story-recall-title" data-story-recalled={recalled.length}>
    <header><div><p className="stories-eyebrow"><Path size={18} aria-hidden="true" /> RECORDAR PARA GUARDAR</p><h2 id="story-recall-title">Retome o fio da história.</h2><p>Como chegamos até aqui? Escolha os quatro momentos na ordem em que acompanhamos a passagem. Você pode consultar a Bíblia quando desejar.</p></div><span className="story-recall-count" aria-label={`${recalled.length} de ${story.scenes.length} momentos retomados`}><strong>{recalled.length}</strong><span>/ {story.scenes.length}</span></span></header>
    <ol className="story-recall-progress" aria-label="Sua sequência">{story.scenes.map((scene, index) => <li key={scene.title} data-recalled={recalled.includes(index)}><span>{recalled.includes(index) ? <Check size={17} aria-hidden="true" /> : String(index + 1).padStart(2, "0")}</span><span>{recalled.includes(index) ? scene.title : index === recalled.length ? "Qual é o próximo momento?" : "Continue o caminho"}</span></li>)}</ol>
    {!complete && <div className="story-recall-choices" aria-label="Escolha o próximo acontecimento">{sceneOrder.map(index => <button key={story.scenes[index].title} type="button" disabled={!ready || recalled.includes(index)} data-recalled={recalled.includes(index)} onClick={() => choose(index)}>{recalled.includes(index) ? <Check size={19} aria-hidden="true" /> : <BookOpenText size={19} aria-hidden="true" />}<span>{story.scenes[index].title}</span><ArrowRight size={18} aria-hidden="true" /></button>)}</div>}
    <div className="story-recall-feedback" role="status" aria-live="polite">{chosen && <div data-matched={feedback?.matched}><strong>{complete ? "Você retomou o caminho desta leitura." : feedback?.matched ? "É isso. Vamos guardar este momento." : "Voltemos à passagem com calma."}</strong><p>{feedback?.matched ? `${chosen.title}. ${complete ? "Agora podemos pensar no que esta Palavra nos convida a viver." : "Siga lembrando o que acontece depois."}` : `“${chosen.title}” aparece em ${chosen.reference.label}. Volte às cenas e procure o momento que vem antes dele.`}</p><Link href={storyBibleUrl(chosen.reference)} prefetch={false}>Conferir {chosen.reference.label}<ArrowRight size={17} aria-hidden="true" /></Link></div>}</div>
    <footer><small>Aqui não há cronômetro nem nota para a sua fé. Recordar e conferir o texto ajuda a aprender.</small><button type="button" disabled={!ready || recalled.length === 0 && !feedback} onClick={() => { setRecalled([]); setFeedback(null); }}><ArrowCounterClockwise size={17} aria-hidden="true" /> Recomeçar</button></footer>
    <details className="story-recall-reading"><summary>Conferir o caminho completo nas Escrituras</summary><ol>{story.scenes.map(scene => <li key={scene.title}><strong>{scene.title}</strong><Link href={storyBibleUrl(scene.reference)} prefetch={false}>{scene.reference.label}</Link></li>)}</ol></details>
  </section>;
}
