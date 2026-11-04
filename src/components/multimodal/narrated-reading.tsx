"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { ArrowLeft, ArrowRight, BookOpenText, Headphones, Pause, Play, Repeat } from "@phosphor-icons/react/ssr";
import { narratedPassages, narrationEdition, type NarratedPassage } from "@/content/narration";
import "./narrated-reading.css";

export function NarratedReading({ passageId }: { passageId?: string }) {
  const initialId = narratedPassages.find(passage => passage.id === passageId)?.id || narratedPassages[0]?.id;
  if (!initialId) return null;
  return <NarratedPassagePlayer key={initialId} initialId={initialId} />;
}

function NarratedPassagePlayer({ initialId }: { initialId: string }) {
  const [chosenId, setChosenId] = useState(initialId);
  const hydrated = useSyncExternalStore(() => () => {}, () => true, () => false);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [follow, setFollow] = useState(true);
  const [message, setMessage] = useState("");
  const audio = useRef<HTMLAudioElement>(null);
  const shouldPlay = useRef(false);
  const changingSource = useRef(false);
  const requestNumber = useRef(0);
  const id = useId();
  const passage = narratedPassages.find(item => item.id === chosenId) as NarratedPassage;
  const verse = passage.verses[index];
  const totalSeconds = passage.verses.reduce((total, item) => total + item.durationSeconds, 0);
  const minutes = Math.max(1, Math.ceil(totalSeconds / 60));
  const href = `/biblia?livro=${passage.bookId}&capitulo=${passage.chapter}&versiculo=${verse.number}#versiculo-${verse.number}`;

  useEffect(() => {
    const element = audio.current;
    const requests = requestNumber;
    return () => { requests.current++; element?.pause(); };
  }, []);

  const play = useCallback(async () => {
    const element = audio.current;
    if (!element) return;
    const request = ++requestNumber.current;
    shouldPlay.current = true;
    setMessage("");
    try { await element.play(); }
    catch {
      if (request !== requestNumber.current) return;
      shouldPlay.current = false;
      setPlaying(false);
      setMessage("Toque em Ouvir para iniciar este versículo. Se o áudio não carregar, você pode continuar lendo o texto abaixo.");
    }
  }, []);

  useEffect(() => {
    if (shouldPlay.current) void play();
    else changingSource.current = false;
  }, [verse.src, play]);

  function pause() {
    requestNumber.current++;
    shouldPlay.current = false;
    audio.current?.pause();
    setPlaying(false);
  }

  function selectVerse(next: number, listen = false) {
    if (next < 0 || next >= passage.verses.length) return;
    if (next === index) {
      if (audio.current) audio.current.currentTime = 0;
      if (listen) void play();
      else pause();
      return;
    }
    requestNumber.current++;
    changingSource.current = true;
    shouldPlay.current = listen;
    audio.current?.pause();
    setPlaying(false);
    setMessage("");
    setIndex(next);
  }

  function changePassage(next: string) {
    if (!narratedPassages.some(item => item.id === next)) return;
    pause();
    changingSource.current = true;
    setChosenId(next);
    setIndex(0);
    setMessage("");
  }

  function ended() {
    setPlaying(false);
    if (follow && shouldPlay.current && index + 1 < passage.verses.length) selectVerse(index + 1, true);
    else {
      shouldPlay.current = false;
      setMessage(index + 1 === passage.verses.length ? "Chegamos ao fim desta passagem. Você pode ouvi-la outra vez ou permanecer na leitura e na oração." : "Você pode ouvir o próximo versículo quando desejar.");
    }
  }

  return <section className="narrated-reading" aria-labelledby={`${id}-heading`} data-narrated-reading={passage.id} data-narration-ready={hydrated} data-narrated-verse={verse.number}>
    <header className="nr-heading"><span aria-hidden="true"><Headphones size={27} /></span><div><p>OUVIR E ACOMPANHAR A PALAVRA</p><h2 id={`${id}-heading`}>Uma leitura para escutar com calma.</h2></div></header>
    <p className="nr-invitation">{passage.introduction}</p>
    <div className="nr-choice"><label htmlFor={`${id}-passage`}>Escolha uma passagem narrada</label><select id={`${id}-passage`} disabled={!hydrated} value={chosenId} onChange={event => changePassage(event.target.value)}>{narratedPassages.map(item => <option key={item.id} value={item.id}>{item.reference} · {item.title}</option>)}</select><p>Seleção inicial de seis passagens · voz sintética brasileira · cerca de {minutes} min nesta leitura.</p></div>
    <div className="nr-current"><div><span>{passage.bookName} {passage.chapter}</span><strong>Versículo {verse.number}</strong></div><blockquote data-narrated-current-text>{verse.text}</blockquote><Link href={href} prefetch={false}><BookOpenText size={18} aria-hidden="true" />Abrir o capítulo e conferir o contexto</Link></div>
    <audio ref={audio} src={verse.src} preload="none" controls aria-label={`Ouvir ${passage.bookName} ${passage.chapter}:${verse.number}, voz sintética`} onPlay={() => { shouldPlay.current = true; setPlaying(true); setMessage(""); }} onPause={event => { setPlaying(false); if (!changingSource.current && !event.currentTarget.ended) shouldPlay.current = false; }} onLoadedData={() => { changingSource.current = false; }} onEnded={ended} onError={() => { shouldPlay.current = false; changingSource.current = false; setPlaying(false); setMessage("Não conseguimos carregar este áudio. A passagem continua disponível para leitura; tente ouvi-la novamente quando sua conexão estiver pronta."); }} />
    <div className="nr-controls"><button type="button" onClick={() => selectVerse(index - 1)} disabled={!hydrated || index === 0} aria-label="Versículo narrado anterior"><ArrowLeft size={20} aria-hidden="true" /></button><button className="nr-main-control" type="button" disabled={!hydrated} onClick={() => playing ? pause() : void play()}>{playing ? <Pause size={21} aria-hidden="true" /> : <Play size={21} aria-hidden="true" />}{playing ? "Pausar leitura" : "Ouvir versículo"}</button><button type="button" disabled={!hydrated} onClick={() => selectVerse(index, true)} aria-label="Ouvir este versículo novamente"><Repeat size={20} aria-hidden="true" /></button><button type="button" onClick={() => selectVerse(index + 1)} disabled={!hydrated || index + 1 === passage.verses.length} aria-label="Próximo versículo narrado"><ArrowRight size={20} aria-hidden="true" /></button></div>
    <label className="nr-follow"><input type="checkbox" disabled={!hydrated} checked={follow} onChange={event => setFollow(event.target.checked)} />Continuar pelos próximos versículos enquanto escuto</label>
    <p className="nr-status" role="status">{message || `Acompanhando ${passage.reference}. O destaque segue cada versículo ouvido.`}</p>
    <details className="nr-transcript"><summary>Acompanhar todo o texto desta passagem</summary><ol>{passage.verses.map((item, verseIndex) => <li key={item.number} value={item.number} className={verseIndex === index ? "nr-verse-current" : undefined} data-narrated-transcript-verse={item.number} aria-current={verseIndex === index ? "true" : undefined}><button type="button" disabled={!hydrated} onClick={() => selectVerse(verseIndex, true)} aria-label={`Ouvir ${passage.bookName} ${passage.chapter}:${item.number}`}><span aria-hidden="true">{item.number}</span><span>{item.text}</span><Play size={16} aria-hidden="true" /></button></li>)}</ol></details>
    <footer className="nr-credit"><p>Bíblia Livre · TR 2018 · Diego Santos, Mario Sérgio e Marco Teles · <a href={narrationEdition.licenseUrl} target="_blank" rel="noreferrer">CC BY 3.0 Brasil</a>. Leitura sintética com Kokoro; pronúncia e naturalidade aguardam revisão humana.</p><a href="/audio/scripture/proveniencia.json" target="_blank" rel="noreferrer">Texto, origem e arquivos desta narração</a></footer>
    <noscript><p>Ouça o versículo no player acima. Todos os arquivos e seus textos podem ser consultados na origem da narração; a seleção e o acompanhamento interativo usam JavaScript.</p></noscript>
  </section>;
}
