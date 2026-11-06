"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type PointerEvent, type KeyboardEvent } from "react";
import { ArrowCounterClockwise, ArrowRight, BookOpenText, Check, Compass, Pause, Play, SignOut, X } from "@phosphor-icons/react/ssr";
import { createMissionState, getAvailableInteraction, getCurrentObjective, missionBibleLink, missionIntroduction, missionReducer, missionStages, worldBounds, worldPoints, type MissionEvent, type WorldPosition } from "@/content/games3d";
import type { GameWorld, WorldStats } from "./engine";
import "./journey-game.css";

type Props = { verses: readonly { number: number; text: string }[]; edition: { attribution: string; licenseUrl: string; sourceUrl: string } };
type Phase = "intro" | "loading" | "playing" | "error";
type Overlay = "pause" | "bible" | "restart" | "complete" | null;
type Quality = "auto" | "low" | "high";
const subscribeToHydration = () => () => {};
const zero = { x: 0, z: 0 };

function pointOnMap(point: WorldPosition) {
  return { x: 10 + (point.x - worldBounds.minX) / (worldBounds.maxX - worldBounds.minX) * 80, y: 8 + (point.z - worldBounds.minZ) / (worldBounds.maxZ - worldBounds.minZ) * 134 };
}

function JourneyMap({ position, target }: { position: WorldPosition; target: WorldPosition | null }) {
  const player = pointOnMap(position);
  const goal = target ? pointOnMap(target) : null;
  const start = pointOnMap(worldPoints.spawn), traveler = pointOnMap(worldPoints.traveler), inn = pointOnMap(worldPoints.inn);
  return <figure className="j3-map" aria-label="Mapa esquemático da jornada, com sua posição e seu próximo destino"><span>SEU CAMINHO</span><svg viewBox="0 0 100 150" aria-hidden="true"><path className="j3-map-terrain" d="M4 35 20 9 36 32 44 15 70 30 86 7 96 45 80 65 98 94 76 116 88 145 14 142 21 109 4 84 17 57Z" /><path className="j3-map-road" d={`M${start.x} ${start.y} Q32 105 ${traveler.x} ${traveler.y} Q70 60 ${inn.x} ${inn.y}`} /><path className="j3-map-house" d={`m${inn.x - 6} ${inn.y} 6-6 6 6v8h-12Z`} />{goal && <><circle className="j3-map-goal-ring" cx={goal.x} cy={goal.y} r="8" /><circle className="j3-map-goal" cx={goal.x} cy={goal.y} r="3" /></>}<circle className="j3-map-player-ring" cx={player.x} cy={player.y} r="6" /><circle className="j3-map-player" cx={player.x} cy={player.y} r="3" /></svg><figcaption><span /> Você <i /> Destino</figcaption></figure>;
}

/** A small original world, prepared only after the visitor chooses to enter. */
export function JourneyGame({ verses, edition }: Props) {
  const hydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const [phase, setPhase] = useState<Phase>("intro");
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [mission, setMission] = useState(createMissionState);
  const [quality, setQuality] = useState<Quality>("auto");
  const [stats, setStats] = useState<WorldStats | null>(null);
  const [error, setError] = useState("");
  const [stick, setStick] = useState(zero);
  const world = useRef<GameWorld | null>(null);
  const host = useRef<HTMLDivElement>(null);
  const entry = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const missionRef = useRef(mission);
  const mounted = useRef(false);
  const launch = useRef(0);
  const focusFrame = useRef<number | null>(null);
  const dragging = useRef<number | null>(null);
  const objective = getCurrentObjective(mission);
  const interaction = getAvailableInteraction(mission);
  const complete = mission.stage === "concluido";
  const gameState = phase === "playing" ? complete ? "complete" : overlay ? "paused" : "playing" : phase;

  const commit = useCallback((event: MissionEvent) => {
    const next = missionReducer(missionRef.current, event);
    missionRef.current = next;
    setMission(next);
    world.current?.setMissionState(next);
    return next;
  }, []);

  const focusWorld = useCallback(() => {
    if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current);
    focusFrame.current = requestAnimationFrame(() => { if (mounted.current) host.current?.querySelector("canvas")?.focus({ preventScroll: true }); focusFrame.current = null; });
  }, []);

  const resetInput = useCallback(() => { dragging.current = null; setStick(zero); world.current?.setInput(zero); }, []);

  const act = useCallback(() => {
    const current = world.current;
    if (!current) return;
    commit({ type: "position", position: current.getPosition() });
    const next = commit({ type: "interact" });
    if (next.stage === "concluido") { current.setPaused(true); setOverlay("complete"); }
    else focusWorld();
  }, [commit, focusWorld]);

  const leave = useCallback(() => {
    launch.current += 1;
    world.current?.dispose(); world.current = null;
    if (focusFrame.current !== null) { cancelAnimationFrame(focusFrame.current); focusFrame.current = null; }
    setOverlay(null); setStats(null); setStick(zero); setError(""); setPhase("intro");
    focusFrame.current = requestAnimationFrame(() => { entry.current?.focus({ preventScroll: true }); focusFrame.current = null; });
  }, []);

  function begin() {
    launch.current += 1;
    world.current?.dispose(); world.current = null;
    const fresh = createMissionState(); missionRef.current = fresh; setMission(fresh);
    setOverlay(null); setStick(zero); setStats(null); setError(""); setPhase("loading");
  }

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; launch.current += 1; world.current?.dispose(); world.current = null; if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current); };
  }, []);

  useEffect(() => {
    if (phase !== "loading") return;
    const token = launch.current;
    let cancelled = false;
    const live = () => mounted.current && launch.current === token;
    void import("./engine").then(({ createGameWorld }) => {
      if (cancelled || !live() || !host.current) return;
      try {
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const instance = createGameWorld(host.current, {
          quality, reducedMotion,
          onReady: () => { if (live()) { setPhase("playing"); focusWorld(); } },
          onPosition: position => { if (live()) commit({ type: "position", position }); },
          onInteract: () => { if (live()) act(); },
          onStats: report => { if (live()) setStats(report); },
          onError: message => { if (live()) { world.current?.dispose(); world.current = null; setError(message); setOverlay(null); setPhase("error"); } },
        });
        if (!live()) { instance.dispose(); return; }
        world.current = instance;
        instance.setMissionState(missionRef.current);
      } catch {
        if (live()) { world.current?.dispose(); world.current = null; setError("Este aparelho não conseguiu preparar o cenário 3D. A leitura e a prática em duas dimensões continuam disponíveis."); setPhase("error"); }
      }
    }).catch(() => { if (live()) { setError("Não conseguimos preparar os arquivos desta jornada agora. Você pode tentar novamente ou continuar pela passagem bíblica."); setPhase("error"); } });
    return () => { cancelled = true; };
  }, [phase, quality, commit, act, focusWorld]);

  useEffect(() => { world.current?.setQuality(quality); }, [quality]);

  useEffect(() => {
    world.current?.setPaused(Boolean(overlay) || document.hidden);
    if (overlay && dialog.current && !dialog.current.open) dialog.current.showModal();
    if (!overlay && dialog.current?.open) dialog.current.close();
  }, [overlay]);

  useEffect(() => {
    if (phase !== "playing") return;
    const visibility = () => { if (document.hidden) { resetInput(); world.current?.setPaused(true); setOverlay(current => current ?? "pause"); } };
    document.addEventListener("visibilitychange", visibility);
    return () => document.removeEventListener("visibilitychange", visibility);
  }, [phase, resetInput]);

  function openOverlay(next: Overlay) { resetInput(); world.current?.setPaused(true); setOverlay(next); }
  function closeOverlay() { setOverlay(null); if (world.current) focusWorld(); }
  function joystick(event: PointerEvent<HTMLButtonElement>) {
    if (dragging.current !== event.pointerId) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const radius = Math.min(bounds.width, bounds.height) * .34;
    const x = (event.clientX - bounds.left - bounds.width / 2) / radius;
    const z = (event.clientY - bounds.top - bounds.height / 2) / radius;
    const magnitude = Math.max(1, Math.hypot(x, z));
    const direction = { x: x / magnitude, z: z / magnitude };
    setStick(direction); world.current?.setInput(direction);
  }
  function stickKey(event: KeyboardEvent<HTMLButtonElement>, down: boolean) {
    const keys: Record<string, WorldPosition> = { ArrowUp: { x: 0, z: -1 }, w: { x: 0, z: -1 }, ArrowDown: { x: 0, z: 1 }, s: { x: 0, z: 1 }, ArrowLeft: { x: -1, z: 0 }, a: { x: -1, z: 0 }, ArrowRight: { x: 1, z: 0 }, d: { x: 1, z: 0 } };
    const direction = keys[event.key];
    if (!direction) return;
    event.preventDefault(); const input = down ? direction : zero; setStick(input); world.current?.setInput(input);
  }
  const dialogTitle = overlay === "bible" ? "A Palavra que acompanha este caminho" : overlay === "restart" ? "Recomeçar a jornada?" : overlay === "complete" ? "Um cuidado que continua" : "Jornada pausada";

  return <div className="journey3d" data-game3d data-game-state={gameState} data-mission-stage={mission.stage} data-player-x={mission.position.x.toFixed(3)} data-player-z={mission.position.z.toFixed(3)} data-traveler-aboard={mission.travelerAboard} data-escort-distance={mission.escortDistance.toFixed(2)} data-render-fps={stats?.fps.toFixed(2)} data-draw-calls={stats?.drawCalls} data-triangles={stats?.triangles} data-pixel-ratio={stats?.pixelRatio} data-render-quality={stats?.quality}>
    {(phase === "intro" || phase === "error") && <>
      <section className="j3-intro" aria-labelledby="j3-title"><Image className="j3-intro-art" src="/visuals/scenes/lucas-10-cuidado.png" alt="Ilustração artística do samaritano cuidando do viajante na estrada, inspirada na parábola de Lucas 10." fill quality={100} sizes="100vw" preload /><div className="j3-intro-shade" /><div className="j3-intro-copy"><p className="j3-eyebrow"><Compass size={18} aria-hidden="true" /> UMA PARÁBOLA PARA CAMINHAR</p><span className="j3-intro-location">Jerusalém · caminho para Jericó</span><h1 id="j3-title">O caminho<br />da <em>compaixão.</em></h1><p>Há um caminho diante de você. E uma vida que convida você a parar.</p><p className="j3-intro-invitation">Controle seu personagem, explore a estrada e represente os gestos de cuidado que Jesus apresenta na parábola do bom samaritano.</p><div className="j3-intro-actions"><button ref={entry} className="j3-primary" type="button" disabled={!hydrated} onClick={begin}><Play size={21} weight="fill" aria-hidden="true" />{phase === "error" ? "Tentar a jornada 3D novamente" : "Entrar na jornada 3D"}<ArrowRight size={21} aria-hidden="true" /></button><button className="j3-text-button" type="button" disabled={!hydrated} onClick={() => openOverlay("bible")}><BookOpenText size={20} aria-hidden="true" /> Abrir a Palavra primeiro</button></div>{error && <div className="j3-start-error" role="alert"><strong>Podemos continuar por outro caminho.</strong><p>{error}</p><Link href="/jogos?jogo=caminho">Abrir a prática em duas dimensões <ArrowRight size={17} aria-hidden="true" /></Link></div>}<div className="j3-intro-meta"><span>Um cenário 3D para explorar</span><span>Lucas 10:25–37</span><span>No seu tempo</span></div></div><div className="j3-intro-footer"><span>ILUSTRAÇÃO ARTÍSTICA · ADAPTAÇÃO DA PARÁBOLA</span><span>Conhecer a Palavra. Aproximar o cuidado.</span></div></section>
      <section className="j3-before" aria-labelledby="j3-before-title"><div><p className="j3-eyebrow">UM GESTO PREPARA O SEGUINTE</p><h2 id="j3-before-title">A compaixão se torna caminho.</h2><p>Aqui, aprender envolve prestar atenção, aproximar-se e participar. Você não precisa correr nem acertar uma prova para continuar.</p><ol className="j3-intro-steps"><li><span>01</span><strong>Observe e aproxime-se</strong><p>Explore o cenário e encontre quem precisa de cuidado.</p></li><li><span>02</span><strong>Prepare suas mãos</strong><p>Reúna os recursos, cuide e prepare o transporte.</p></li><li><span>03</span><strong>Continue acompanhado</strong><p>Leve o viajante até a hospedaria e providencie a continuidade.</p></li></ol></div><aside className="j3-controls-card"><Compass size={30} aria-hidden="true" /><h3>Encontre seu jeito de caminhar.</h3><p><strong>No computador</strong>Use W, A, S, D ou as setas. Aproxime-se e pressione E para interagir. Arraste o cenário para olhar ao redor.</p><p><strong>No celular</strong>Arraste o controle direcional e toque no botão de ação. Toque no cenário para explorá-lo com os dedos.</p><label htmlFor="j3-intro-quality">Qualidade do cenário</label><select id="j3-intro-quality" value={quality} onChange={event => setQuality(event.target.value as Quality)} disabled={!hydrated}><option value="auto">Automática · adaptar a este aparelho</option><option value="low">Leve · priorizar o movimento</option><option value="high">Detalhada · mais sombras e definição</option></select><small>Você pode pausar, consultar a Bíblia ou sair a qualquer momento. A jornada fica apenas nesta visita.</small><Link className="j3-alternative" href="/jogos?jogo=caminho">Abrir a prática sem cenário 3D <ArrowRight size={16} aria-hidden="true" /></Link></aside></section>
      <section className="j3-context"><p><strong>Com a Bíblia ao nosso lado.</strong> {missionIntroduction.literaryContext} {missionIntroduction.adaptation}</p><details><summary>Ler Lucas 10:25–37 e conhecer a edição</summary><div className="j3-scripture-inline">{verses.map(verse => <p key={verse.number} data-game-scripture-verse={verse.number}><sup>{verse.number}</sup><span>{verse.text}</span></p>)}</div><p>{edition.attribution}</p><a href={edition.sourceUrl} target="_blank" rel="noreferrer">Fonte da edição ↗</a><a href={edition.licenseUrl} target="_blank" rel="noreferrer">Licença de uso ↗</a></details><noscript><p>O cenário interativo precisa de JavaScript. A passagem completa permanece disponível acima. <Link href="/biblia?livro=LUK&capitulo=10&versiculo=25#versiculo-25">Abrir Lucas 10 na Bíblia</Link>.</p></noscript></section>
    </>}

    {(phase === "loading" || phase === "playing") && <section className="j3-world-stage" aria-label="A jornada controlável do bom samaritano">
      <h1 className="j3-sr-only">O caminho da compaixão · jornada 3D</h1><div className="j3-world" ref={host} data-game-world aria-describedby="j3-keyboard-help" />
      {phase === "loading" ? <div className="j3-loading"><div className="j3-loading-mark"><Compass size={42} aria-hidden="true" /></div><p className="j3-eyebrow">PREPARANDO O CAMINHO</p><h2>Há uma história para viver<br />com atenção.</h2><p role="status">Preparando o cenário neste aparelho…</p><button className="j3-secondary" type="button" onClick={leave}>Cancelar e voltar</button></div> : <>
        <header className="j3-hud-top"><div className="j3-chapter-pill"><Compass size={20} aria-hidden="true" /><span>O caminho da compaixão<small>Uma jornada em Lucas 10</small></span></div><div className="j3-hud-buttons"><button className="j3-icon-button" type="button" aria-label="Consultar a Bíblia da jornada" onClick={() => openOverlay("bible")}><BookOpenText size={22} aria-hidden="true" /></button><button className="j3-icon-button" type="button" aria-label="Pausar jornada" onClick={() => openOverlay("pause")}><Pause size={21} aria-hidden="true" /></button></div></header>
        <div className="j3-objective" aria-labelledby="j3-objective-title"><p className="j3-eyebrow">{complete ? "UM CAMINHO PERCORRIDO" : `GESTO ${objective?.number} DE ${missionStages.length}`}</p><h2 id="j3-objective-title">{objective?.title ?? "O cuidado continua além desta estrada."}</h2><p className="j3-objective-instruction">{objective?.instruction ?? "Continue explorando ou abra a Palavra para permanecer nesta leitura."}</p><div className="j3-objective-bottom"><button type="button" onClick={() => openOverlay("bible")}><BookOpenText size={15} aria-hidden="true" />{objective?.reference.label ?? "Lucas 10:25–37"}</button>{interaction && <span data-objective-distance>{interaction.available ? "Você está perto" : `${Math.ceil(interaction.distance)} m no cenário`}</span>}</div><div className="j3-step-line" aria-label={`${mission.completed.length} de ${missionStages.length} gestos percorridos`}>{missionStages.map(stage => <span key={stage.id} data-done={mission.completed.includes(stage.id)} data-current={stage.id === mission.stage} />)}</div></div>
        <JourneyMap position={mission.position} target={interaction?.point ?? null} />
        {mission.feedback && <div className="j3-feedback" role="status"><p>{mission.feedback.text}</p><button type="button" aria-label="Fechar orientação" onClick={() => commit({ type: "clear-feedback" })}><X size={17} aria-hidden="true" /></button></div>}
        <div className="j3-walking-controls"><div className="j3-stick-group"><button className="j3-joystick" type="button" data-game-joystick aria-label="Controle direcional: arraste para caminhar ou use as setas com este controle selecionado" onPointerDown={event => { if (event.button !== 0) return; event.preventDefault(); dragging.current = event.pointerId; event.currentTarget.setPointerCapture(event.pointerId); joystick(event); }} onPointerMove={joystick} onPointerUp={event => { if (dragging.current === event.pointerId) { resetInput(); if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); focusWorld(); } }} onPointerCancel={resetInput} onLostPointerCapture={resetInput} onKeyDown={event => stickKey(event, true)} onKeyUp={event => stickKey(event, false)} onBlur={resetInput}><span className="j3-stick-cross" aria-hidden="true" /><span className="j3-stick-knob" style={{ transform: `translate(${stick.x * 29}px, ${stick.z * 29}px)` }} aria-hidden="true"><span /></span></button><span className="j3-control-label">CAMINHAR</span></div><p className="j3-keyboard-hint" id="j3-keyboard-help"><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd><span>ou setas · arraste para olhar</span></p><div className="j3-action-group"><button className={`j3-action ${interaction?.available ? "j3-action-near" : ""}`} type="button" data-mission-action={interaction?.id ?? "complete"} data-available={Boolean(interaction?.available)} disabled={!interaction?.available} onClick={act}><span>{complete ? <Check size={25} aria-hidden="true" /> : <ArrowRight size={25} aria-hidden="true" />}</span><strong>{interaction?.label ?? "Caminho percorrido"}</strong><small>{interaction?.available ? "TOCAR OU PRESSIONAR E" : complete ? "A PALAVRA CONTINUA COM VOCÊ" : "APROXIME-SE DO DESTINO"}</small></button></div></div>
        <p className="j3-world-caption">ADAPTAÇÃO ARTÍSTICA DA PARÁBOLA · CENÁRIO ESQUEMÁTICO</p>
      </>}
    </section>}

    <dialog className="j3-dialog" ref={dialog} aria-labelledby="j3-dialog-title" onCancel={event => { event.preventDefault(); closeOverlay(); }} onClick={event => { if (event.target === event.currentTarget) closeOverlay(); }}>
      <div className={`j3-dialog-card ${overlay === "bible" ? "j3-dialog-scripture" : ""}`}><button className="j3-dialog-close" type="button" aria-label="Fechar painel da jornada" onClick={closeOverlay}><X size={22} aria-hidden="true" /></button><p className="j3-eyebrow">{overlay === "bible" ? "COM A BÍBLIA ABERTA" : overlay === "complete" ? "UM CONVITE DE JESUS" : "NO SEU TEMPO"}</p><h2 id="j3-dialog-title">{dialogTitle}</h2>
        {overlay === "bible" ? <><p className="j3-dialog-intro">O jogo aproxima nossos gestos da leitura. É a passagem que orienta o que aprendemos.</p>{objective && <div className="j3-dialog-lesson"><strong>{objective.reference.label}</strong><p>{objective.lesson}</p><small>Comentário editorial da jornada.</small></div>}<div className="j3-dialog-verses" aria-label="Texto de Lucas 10:25–37">{verses.map(verse => <p key={verse.number} data-game-scripture-verse={verse.number} data-highlight={Boolean(objective && verse.number >= objective.reference.start && verse.number <= objective.reference.end)}><sup>{verse.number}</sup><span>{verse.text}</span></p>)}</div><p className="j3-scripture-credit">{edition.attribution}</p><div className="j3-scripture-links"><Link href={objective ? missionBibleLink(objective.reference) : "/biblia?livro=LUK&capitulo=10&versiculo=25#versiculo-25"} target="_blank" rel="noreferrer">Abrir o capítulo na Bíblia ↗</Link><a href={edition.licenseUrl} target="_blank" rel="noreferrer">Licença da edição ↗</a></div><button className="j3-primary" type="button" onClick={closeOverlay}>{phase === "playing" ? "Voltar à jornada" : "Voltar ao começo"}<ArrowRight size={19} aria-hidden="true" /></button></>
        : overlay === "restart" ? <><p className="j3-dialog-intro">Você voltará ao começo desta visita. O que já aprendeu pode acompanhar seu novo olhar para a passagem.</p><div className="j3-dialog-actions"><button className="j3-primary" type="button" onClick={begin}><ArrowCounterClockwise size={20} aria-hidden="true" />Recomeçar do início</button><button className="j3-secondary" type="button" onClick={() => setOverlay("pause")}>Continuar de onde estou</button></div></>
        : overlay === "complete" ? <><div className="j3-complete-emblem"><Check size={37} aria-hidden="true" /></div><p className="j3-dialog-intro">Você parou, reuniu recursos, representou o cuidado e acompanhou o viajante até a hospedaria. O último gesto prepara a continuidade do cuidado.</p>{verses.find(verse => verse.number === 37) && <blockquote>{verses.find(verse => verse.number === 37)!.text}<cite>Lucas 10:37 · Bíblia Livre</cite></blockquote>}<p className="j3-complete-reflection">A jornada termina nesta tela. O convite de Jesus pode continuar no encontro com alguém que precisa de você.</p><div className="j3-dialog-actions"><button className="j3-primary" type="button" onClick={() => setOverlay("bible")}><BookOpenText size={20} aria-hidden="true" />Permanecer na Palavra</button><button className="j3-secondary" type="button" onClick={closeOverlay}>Continuar a explorar</button><button className="j3-text-button j3-dark-text" type="button" onClick={leave}>Sair do cenário</button></div><small className="j3-complete-note">Você concluiu os gestos desta adaptação. A jornada não atribui nota à sua fé nem substitui o cuidado na vida real.</small></>
        : <><p className="j3-dialog-intro">Há tempo para respirar, reler e retomar o caminho.</p>{objective && <div className="j3-dialog-lesson"><strong>Seu próximo gesto: {objective.title}</strong><p>{objective.instruction}</p></div>}<div className="j3-dialog-actions"><button className="j3-primary" type="button" onClick={closeOverlay}><Play size={20} aria-hidden="true" />Continuar jornada</button><button className="j3-secondary" type="button" onClick={() => setOverlay("bible")}><BookOpenText size={20} aria-hidden="true" />Consultar a Palavra</button><button className="j3-secondary" type="button" onClick={() => setOverlay("restart")}><ArrowCounterClockwise size={20} aria-hidden="true" />Recomeçar a jornada</button><button className="j3-text-button j3-dark-text" type="button" onClick={leave}><SignOut size={19} aria-hidden="true" />Sair do cenário</button></div><div className="j3-settings"><label htmlFor="j3-running-quality">Qualidade do cenário</label><select id="j3-running-quality" value={quality} onChange={event => setQuality(event.target.value as Quality)}><option value="auto">Automática</option><option value="low">Leve</option><option value="high">Detalhada</option></select><p>W, A, S, D ou setas para caminhar; E para agir. No celular, use o controle direcional e o botão de ação.</p>{stats && <details><summary>Detalhes da execução neste aparelho</summary><dl>{Object.entries(stats).filter(([, value]) => typeof value === "string" || typeof value === "number").map(([key, value]) => <div key={key}><dt>{({ fps: "Quadros por segundo", drawCalls: "Chamadas de desenho", triangles: "Triângulos", pixelRatio: "Escala de resolução", quality: "Qualidade ativa" } as Record<string, string>)[key] ?? key}</dt><dd>{typeof value === "number" ? Math.round(value * 10) / 10 : value}</dd></div>)}</dl><small>Medição desta execução, sem garantia de desempenho para outros aparelhos.</small></details>}</div></>}
      </div>
    </dialog>
  </div>;
}
