"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useId, useRef, useState, useSyncExternalStore } from "react";
import { ArrowRight, BookOpenText, Camera, Compass, Headphones, Microphone, Scroll, Sparkle } from "@phosphor-icons/react/ssr";
import "./multimodal-hub.css";

const loading = () => <p className="mh-loading" role="status">Preparando este encontro com a Palavra…</p>;
const NarratedReading = dynamic(() => import("./narrated-reading").then(module => module.NarratedReading), { loading });
const SemanticSearch = dynamic(() => import("./semantic-search").then(module => module.SemanticSearch), { loading });
const VoiceInput = dynamic(() => import("./voice-input").then(module => module.VoiceInput), { loading });
const PassageCamera = dynamic(() => import("./passage-camera").then(module => module.PassageCamera), { loading });
const OralPractice = dynamic(() => import("./oral-practice").then(module => module.OralPractice), { loading });
const StoryWorld = dynamic(() => import("./story-world").then(module => module.StoryWorld), { loading });
const MuseumGuide = dynamic(() => import("./museum-guide").then(module => module.MuseumGuide), { loading });

export type ExplorationMode = "ouvir" | "perguntar" | "camera" | "contar" | "historias" | "museu";
const experiences = [
  { id: "ouvir", title: "Ler e ouvir", text: "Acompanhe cada versículo.", Icon: Headphones },
  { id: "perguntar", title: "Trazer minha pergunta", text: "Escreva ou use sua voz.", Icon: Microphone },
  { id: "camera", title: "Abrir pela câmera", text: "Encontre uma passagem impressa.", Icon: Camera },
  { id: "contar", title: "Contar o que aprendi", text: "Recorde com suas palavras.", Icon: BookOpenText },
  { id: "historias", title: "Caminhar na história", text: "Explore, observe e compreenda.", Icon: Scroll },
  { id: "museu", title: "Olhar a história de perto", text: "Fotografias e fontes ao seu lado.", Icon: Compass }
] as const;

export function MultimodalHub({ initialMode = "ouvir" }: { initialMode?: ExplorationMode }) {
  const id = useId();
  const hydrated = useSyncExternalStore(() => () => {}, () => true, () => false);
  const [mode, setMode] = useState<ExplorationMode>(initialMode);
  const [query, setQuery] = useState("");
  const [voiceOpen, setVoiceOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const current = experiences.find(experience => experience.id === mode)!;
  function choose(next: ExplorationMode) {
    setMode(next); setVoiceOpen(false);
    const url = new URL(window.location.href);
    url.searchParams.set("modo", next);
    window.history.replaceState(null, "", url);
    requestAnimationFrame(() => panel.current?.focus({ preventScroll: true }));
  }
  return <div className="multimodal-hub" data-multimodal-hub data-multimodal-ready={hydrated} data-exploration-mode={mode}>
    <header className="mh-hero"><div><p className="mh-eyebrow"><Sparkle size={19} aria-hidden="true" /> UM ENCONTRO COM A PALAVRA</p><h1>Há muitas formas<br />de se aproximar.<br /><em>A Palavra nos une.</em></h1><p>Leia com calma. Escute um versículo. Traga uma pergunta. Há lugar para sua voz, seu olhar e o desejo de conhecer a Deus mais de perto.</p><a href="#escolher-experiencia">Encontre seu próximo passo <ArrowRight size={18} aria-hidden="true" /></a></div><div className="mh-hero-art" aria-hidden="true"><span className="mh-light" /><div className="mh-arch"><span className="mh-window" /><div className="mh-waves">{Array.from({ length: 13 }, (_, index) => <span key={index} style={{ height: `${Math.round(18 + Math.sin(index * .8) ** 2 * 54)}px` }} />)}</div><div className="mh-open-word"><BookOpenText size={136} weight="thin" /></div><span className="mh-art-caption">Tua Palavra é luz<br />para o nosso caminho.</span></div></div></header>
    <section id="escolher-experiencia" className="mh-choices" aria-labelledby={`${id}-choices`}><div className="mh-introduction"><p className="mh-eyebrow">COMECE PELO QUE FAZ SENTIDO HOJE</p><h2 id={`${id}-choices`}>Uma porta de entrada.<br /><em>Uma descoberta para levar.</em></h2><p>Os recursos se encontram na mesma direção: abrir as Escrituras, compreender seu contexto e aproximar o ensino da vida.</p></div><div className="mh-experience-buttons" role="group" aria-label="Escolher uma experiência de estudo">{experiences.map(({ id: key, title, text, Icon }) => <button key={key} id={`${id}-${key}`} type="button" disabled={!hydrated} aria-pressed={mode === key} aria-controls={`${id}-panel`} onClick={() => choose(key)}><Icon size={25} aria-hidden="true" /><span><strong>{title}</strong><small>{text}</small></span><ArrowRight size={18} aria-hidden="true" /></button>)}</div></section>
    <div id={`${id}-panel`} className="mh-panel" ref={panel} tabIndex={-1} role="region" aria-label={current.title} aria-labelledby={`${id}-${mode}`}>
      {mode === "ouvir" && <NarratedReading />}
      {mode === "perguntar" && <><div className="mh-voice-invitation"><div><Microphone size={24} aria-hidden="true" /><p>Você também pode trazer sua pergunta falando. Confira o que foi ouvido e depois procure as leituras relacionadas.</p></div><button type="button" aria-expanded={voiceOpen} onClick={() => setVoiceOpen(value => !value)}>{voiceOpen ? "Fechar entrada por voz" : "Falar minha pergunta"}</button></div>{voiceOpen && <VoiceInput onTranscript={text => { setQuery(text); setVoiceOpen(false); }} />}<SemanticSearch query={query} onQueryChange={setQuery} /></>}
      {mode === "camera" && <PassageCamera />}
      {mode === "contar" && <OralPractice />}
      {mode === "historias" && <StoryWorld />}
      {mode === "museu" && <MuseumGuide />}
    </div>
    <aside className="mh-keep-reading"><BookOpenText size={26} aria-hidden="true" /><div><strong>A Bíblia permanece aberta ao seu lado.</strong><p>Você pode ir direto ao texto, acompanhar nossos encontros ou retornar à mesma passagem quantas vezes desejar.</p></div><Link href="/biblia?modo=igreja">Abrir minha Bíblia <ArrowRight size={18} aria-hidden="true" /></Link></aside>
    <noscript><p>As experiências de áudio podem ser acompanhadas nos links das histórias. Para voz, câmera e exploração interativa, ative JavaScript. A <Link href="/biblia">Bíblia completa desta edição</Link>, os <Link href="/aprender">encontros de estudo</Link> e as <Link href="/museu">fichas do museu</Link> continuam disponíveis.</p></noscript>
  </div>;
}
