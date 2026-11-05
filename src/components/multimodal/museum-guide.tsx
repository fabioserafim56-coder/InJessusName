"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { ArrowRight, ArrowUpRight, BookOpenText, Camera, ChatCircleText, Compass, MagnifyingGlassPlus } from "@phosphor-icons/react/ssr";
import { museumExhibits } from "@/content/museum";
import { getMuseumObservations } from "@/content/multimodal/museum";
import { searchMuseumCatalogue, type CatalogueMatch } from "@/lib/museum-catalogue-search";
import "./museum-guide.css";

const subscribeToHydration = () => () => {};

type VisualAnswer = { answer: string; model: string; notice: string };

export function MuseumGuide({ initialExhibitId }: { initialExhibitId?: string }) {
  const id = useId();
  const interactive = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const [exhibitId, setExhibitId] = useState(initialExhibitId && museumExhibits.some(item => item.id === initialExhibitId) ? initialExhibitId : museumExhibits[0].id);
  const exhibit = museumExhibits.find(item => item.id === exhibitId)!;
  const observations = getMuseumObservations(exhibitId);
  const [observationId, setObservationId] = useState(observations[0].id);
  const observation = observations.find(item => item.id === observationId) ?? observations[0];
  const [revealed, setRevealed] = useState(false);
  const [visionAvailable, setVisionAvailable] = useState(false);
  const [availabilityChecked, setAvailabilityChecked] = useState(false);
  const [catalogueQuery, setCatalogueQuery] = useState("");
  const [catalogueMatches, setCatalogueMatches] = useState<CatalogueMatch[] | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<VisualAnswer | null>(null);
  const [asking, setAsking] = useState(false);
  const [error, setError] = useState("");
  const pending = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/multimodal/vision", { cache: "no-store", signal: controller.signal }).then(response => response.json()).then(data => { setVisionAvailable(data.available === true); setAvailabilityChecked(true); }).catch(() => { if (!controller.signal.aborted) setAvailabilityChecked(true); });
    return () => { controller.abort(); pending.current?.abort(); };
  }, []);

  function chooseExhibit(value: string) {
    pending.current?.abort();
    setExhibitId(value);
    setObservationId(getMuseumObservations(value)[0].id);
    setCatalogueQuery(""); setCatalogueMatches(null); setRevealed(false); setQuestion(""); setAnswer(null); setError(""); setAsking(false);
  }

  async function ask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!question.trim() || asking || !visionAvailable) return;
    const controller = new AbortController();
    pending.current?.abort(); pending.current = controller;
    setAsking(true); setError(""); setAnswer(null);
    try {
      const response = await fetch("/api/multimodal/vision", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ exhibitId, question: question.trim() }), signal: controller.signal });
      const result = await response.json();
      if (!response.ok || typeof result.answer !== "string") throw new Error(typeof result.error === "string" ? result.error : "Não conseguimos conferir a resposta agora.");
      if (!controller.signal.aborted) setAnswer({ answer: result.answer, model: result.model, notice: result.notice });
    } catch (failure) { if (!controller.signal.aborted) setError(failure instanceof Error ? failure.message : "Não conseguimos acessar a análise agora."); }
    finally { if (!controller.signal.aborted) setAsking(false); }
  }

  return <section className="multimodal-museum" data-multimodal-museum data-museum-guide-ready={interactive} aria-labelledby={`${id}-title`}>
    <header className="mm-heading"><p><Compass size={20} aria-hidden="true" /> UM ENCONTRO COM A HISTÓRIA</p><h2 id={`${id}-title`}>Olhe de perto.<br /><em>Vamos compreender juntos.</em></h2><p>Há histórias preservadas na pedra, na escrita e nos registros de quem veio antes de nós. Escolha uma peça, toque nos pontos e aproxime a observação da leitura bíblica.</p></header>
    <div className="mm-exhibit-picker" role="group" aria-label="Escolher uma peça para explorar">{museumExhibits.map(item => <button key={item.id} type="button" aria-pressed={exhibitId === item.id} onClick={() => chooseExhibit(item.id)}>{item.title}</button>)}</div>
    <div className="mm-exploration" data-museum-guide-exhibit={exhibit.id}>
      <figure className="mm-photo"><div className="mm-photo-frame"><div className="mm-photo-surface" style={{ aspectRatio: `${exhibit.image.width}/${exhibit.image.height}` }}><Image src={exhibit.image.src} alt={exhibit.image.alt} width={exhibit.image.width} height={exhibit.image.height} unoptimized />{observations.map((point, index) => <button key={point.id} type="button" className="mm-hotspot" style={{ left: `${point.x}%`, top: `${point.y}%` }} aria-label={`Observar ${index + 1}: ${point.label}`} aria-pressed={observation.id === point.id} aria-controls={`${id}-observation`} onClick={() => { setObservationId(point.id); setRevealed(false); }} data-museum-hotspot={point.id}>{index + 1}</button>)}</div></div><figcaption><span><Camera size={16} aria-hidden="true" /> Registro histórico preservado</span><a href={exhibit.image.src} target="_blank" rel="noreferrer"><MagnifyingGlassPlus size={16} aria-hidden="true" /> Abrir a fotografia original</a><small>{exhibit.image.license}. <a href={exhibit.image.sourceUrl} target="_blank" rel="noreferrer">Consultar a origem da imagem.</a></small></figcaption></figure>
      <div className="mm-observation" id={`${id}-observation`} aria-live="polite" data-museum-observation={observation.id}>
        <p className="mm-small-label">{exhibit.approxDate} · {exhibit.place}</p><h3>{exhibit.title}</h3><p className="mm-collection">{exhibit.collection}</p>
        <nav className="mm-points" aria-label="Pontos de observação">{observations.map((point, index) => <button key={point.id} type="button" aria-pressed={observation.id === point.id} onClick={() => { setObservationId(point.id); setRevealed(false); }}><span>{index + 1}</span>{point.label}</button>)}</nav>
        <article className="mm-observation-card"><p className="mm-small-label">VAMOS OLHAR JUNTOS</p><h4>{observation.label}</h4><p className="mm-invitation">{observation.invitation}</p><p>{observation.explanation}</p><button type="button" className="mm-curiosity" aria-expanded={revealed} aria-controls={`${id}-answer`} onClick={() => setRevealed(current => !current)} data-museum-question><ChatCircleText size={20} aria-hidden="true" /><span>{observation.question}</span><span aria-hidden="true">{revealed ? "−" : "+"}</span></button><div id={`${id}-answer`} hidden={!revealed} className="mm-editorial-answer"><strong>Uma explicação para acompanhar você</strong><p>{observation.answer}</p><small>Comentário editorial da visita, baseado na ficha e nas fontes abaixo.</small></div><details className="mm-point-sources"><summary>Conferir as fontes deste ponto</summary><ul>{observation.sourceIndexes.map(index => <li key={index}><a href={exhibit.sources[index].url} target="_blank" rel="noreferrer" data-museum-guide-source>{exhibit.sources[index].label}<ArrowUpRight size={14} aria-hidden="true" /></a></li>)}</ul></details></article>
        <div className="mm-bible-connection"><BookOpenText size={24} aria-hidden="true" /><div><strong>Com a Bíblia aberta ao nosso lado</strong>{exhibit.bibleConnections.map(connection => <Link key={connection.label} href={`/biblia?livro=${connection.book}&capitulo=${connection.chapter}&versiculo=${connection.startVerse}#versiculo-${connection.startVerse}`}>{connection.label}<ArrowRight size={17} aria-hidden="true" /></Link>)}</div></div><Link className="mm-full-fiche" href={`/museu/${exhibit.id}`}>Abrir a ficha completa da peça <ArrowUpRight size={16} aria-hidden="true" /></Link>
      </div>
    </div>
    <section className="mm-catalogue-search" aria-labelledby={`${id}-catalogue-title`}>
      <div><p className="mm-small-label">SUA CURIOSIDADE TEM LUGAR</p><h3 id={`${id}-catalogue-title`}>Vamos procurar na ficha desta peça.</h3><p>Escreva sua pergunta. A consulta encontra trechos já documentados, com fontes para você conferir.</p></div>
      <form onSubmit={event => { event.preventDefault(); setCatalogueMatches(searchMuseumCatalogue(exhibitId, catalogueQuery)); }}>
        <label htmlFor={`${id}-catalogue-query`}>O que você deseja conhecer sobre {exhibit.title}?</label>
        <div><input id={`${id}-catalogue-query`} type="search" disabled={!interactive} value={catalogueQuery} onChange={event => setCatalogueQuery(event.target.value)} maxLength={500} minLength={3} required placeholder="Ex.: inscrição, data, relação com a Bíblia…" /><button type="submit" disabled={!interactive || catalogueQuery.trim().length < 3}>Consultar a ficha <ArrowRight size={18} aria-hidden="true" /></button></div>
      </form>
      {catalogueMatches !== null && <div className="mm-catalogue-results" role="status" data-catalogue-results>{catalogueMatches.length ? <><p>Trechos relacionados à sua pergunta — consulta ao acervo, sem resposta gerada por IA.</p>{catalogueMatches.map(match => <article key={match.id}><h4>{match.title}</h4><p>{match.text}</p><div>{match.sourceIndexes.map(index => <a key={index} href={exhibit.sources[index].url} target="_blank" rel="noreferrer">{exhibit.sources[index].label}<ArrowUpRight size={14} aria-hidden="true" /></a>)}</div></article>)}</> : <p>Não encontramos um trecho para essa pergunta nesta ficha. Você pode tentar uma palavra mais específica ou abrir a documentação completa; preferimos deixar a pergunta em aberto a preencher o que não sabemos.</p>}</div>}
    </section>
    <details className="mm-visual-questions"><summary><ChatCircleText size={21} aria-hidden="true" /><span>Uma pergunta sua sobre esta imagem</span><span aria-hidden="true">+</span></summary>{visionAvailable ? <div className="mm-visual-question-body"><p>Escreva o que deseja observar em <strong>{exhibit.title}</strong>. Sua pergunta e a imagem pública desta peça serão enviadas ao serviço de análise visual, acompanhadas da ficha documental.</p><form onSubmit={ask}><label htmlFor={`${id}-question`}>O que você deseja compreender?</label><textarea id={`${id}-question`} value={question} onChange={event => setQuestion(event.target.value)} maxLength={500} rows={3} placeholder="Que detalhes desta imagem podemos observar com segurança?" required /><div><span>{question.length}/500</span><button type="submit" disabled={asking || !question.trim()}>{asking ? "Observando a imagem…" : "Analisar minha pergunta"}<ArrowRight size={17} aria-hidden="true" /></button>{asking && <button type="button" onClick={() => { pending.current?.abort(); setAsking(false); }}>Cancelar</button>}</div></form>{error && <p className="mm-analysis-error" role="alert">{error}</p>}{answer && <article className="mm-ai-answer" role="status"><strong>Resposta assistida por análise visual</strong><p>{answer.answer}</p><small>{answer.notice}</small><details><summary>Modelo usado nesta resposta</summary><p>{answer.model}</p></details><Link href={`/museu/${exhibit.id}#fontes`}>Conferir na ficha e nas fontes <ArrowUpRight size={15} aria-hidden="true" /></Link></article>}</div> : <div className="mm-visual-question-body"><p role="status">{availabilityChecked ? "A análise automática de imagem está desligada. A consulta à ficha, os pontos da visita e todas as fontes continuam disponíveis acima." : "Conferindo a disponibilidade das perguntas visuais…"}</p></div>}</details>
    <noscript><p className="mm-no-js">Para observar cada peça sem interação, abra sua ficha no museu. As quatro fichas oferecem as fotografias, conexões bíblicas e fontes completas.</p><ul>{museumExhibits.map(item => <li key={item.id}><Link href={`/museu/${item.id}`}>{item.title}</Link></li>)}</ul></noscript>
  </section>;
}
