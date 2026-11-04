"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { ArrowLeft, ArrowRight, BookOpenText, Footprints, Play, X } from "@phosphor-icons/react/ssr";
import type { Application, Container, Graphics, Sprite, Text } from "pixi.js";
import { storyWorldQuestion, storyWorldReference, storyWorldStops } from "@/content/multimodal/story-world";
import "./story-world.css";

const artwork = "/visuals/story-multiplicacao-dos-paes.png";
const positionY = (index: number) => 337 + Math.sin(index * 1.35) * 24;

/** A small Pixi scene: the renderer and its single ticker exist only while requested. */
export function StoryWorld() {
  const [active, setActive] = useState(false);
  const hydrated = useSyncExternalStore(() => () => {}, () => true, () => false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const host = useRef<HTMLDivElement>(null);
  const enterButton = useRef<HTMLButtonElement>(null);
  const choose = useRef((index: number) => setSelected(index));
  const selectedRef = useRef(selected);
  const move = useRef<((index: number) => void) | null>(null);
  const titleId = useId();
  const sceneId = useId();
  const questionId = useId();
  const stop = storyWorldStops[selected];

  useEffect(() => {
    selectedRef.current = selected;
    move.current?.(selected);
  }, [selected]);

  useEffect(() => {
    if (!active || !host.current) return;
    const element = host.current;
    let disposed = false;
    let initialized = false;
    let destroyed = false;
    let application: Application | null = null;
    let observer: ResizeObserver | null = null;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let onMotionChange: (() => void) | undefined;
    const destroy = () => {
      if (!application || !initialized || destroyed) return;
      destroyed = true;
      application.stop();
      application.destroy({ removeView: true }, { children: true, texture: false, textureSource: false });
    };

    async function prepare() {
      const { Application: PixiApplication, Assets, Circle, Container: PixiContainer, Graphics: PixiGraphics, Sprite: PixiSprite, Text: PixiText } = await import("pixi.js");
      if (disposed) return;
      const app = new PixiApplication();
      application = app;
      await app.init({ width: Math.max(1, element.clientWidth), height: Math.max(1, element.clientHeight), autoStart: false, sharedTicker: false, antialias: true, autoDensity: true, resolution: Math.min(window.devicePixelRatio || 1, 2), background: "#244b38", preference: "webgl", powerPreference: "low-power" });
      initialized = true;
      if (disposed) { destroy(); return; }
      app.canvas.setAttribute("aria-hidden", "true");
      app.canvas.setAttribute("data-pixi-story-canvas", "true");
      element.appendChild(app.canvas);

      const backdrop = new PixiContainer();
      app.stage.addChild(backdrop);
      const shade = new PixiGraphics();
      backdrop.addChild(shade);
      const world: Container = new PixiContainer();
      world.sortableChildren = true;
      app.stage.addChild(world);
      const ground: Graphics = new PixiGraphics();
      world.addChild(ground);
      const markers: { shape: Graphics; label: Text; number: Text }[] = [];
      for (const [index, entry] of storyWorldStops.entries()) {
        const shape = new PixiGraphics();
        shape.position.set(entry.x, positionY(index));
        shape.eventMode = "static";
        shape.cursor = "pointer";
        shape.hitArea = new Circle(0, 0, 48);
        shape.on("pointertap", () => choose.current(index));
        world.addChild(shape);
        const number = new PixiText({ text: String(index + 1).padStart(2, "0"), style: { fontFamily: "Georgia, serif", fontSize: 20, fill: "#ede2af", fontWeight: "400" } });
        number.anchor.set(.5);
        number.position.set(entry.x, positionY(index) - 30);
        world.addChild(number);
        const label = new PixiText({ text: entry.short, style: { fontFamily: "Georgia, serif", fontSize: 18, fill: "#f0ead5", align: "center", wordWrap: true, wordWrapWidth: 180, lineHeight: 24 } });
        label.anchor.set(.5, 0);
        label.position.set(entry.x, positionY(index) + 35);
        world.addChild(label);
        markers.push({ shape, label, number });
      }

      const traveler = new PixiContainer();
      traveler.zIndex = 10;
      const shadow = new PixiGraphics().ellipse(0, 2, 20, 7).fill({ color: "#0d261b", alpha: .4 });
      const feet = new PixiGraphics().roundRect(-13, -18, 8, 20, 3).fill("#554b37").roundRect(5, -18, 8, 20, 3).fill("#67583e");
      const body = new PixiGraphics().poly([-13, -53, 11, -53, 19, -15, -18, -15]).fill("#dbcea3").poly([-8, -51, -3, -22, 2, -51]).fill("#a78b5b").roundRect(-23, -48, 9, 32, 4).fill("#b78e6a").roundRect(14, -49, 8, 32, 4).fill("#b78e6a").ellipse(-1, -65, 12, 16).fill("#4b4633").ellipse(0, -62, 8, 11).fill("#ba906d").poly([-11, -66, -7, -79, 3, -81, 11, -72, 8, -67, 0, -74, -4, -67]).fill("#4b4633");
      traveler.addChild(shadow, feet, body);
      world.addChild(traveler);
      let current = selectedRef.current;
      let targetX = storyWorldStops[current].x;
      let targetY = positionY(current) - 7;
      traveler.position.set(targetX, targetY);
      let camera = 0;
      let targetCamera = 0;
      let walkingTime = 0;
      let backgroundSprite: Sprite | null = null;
      const render = () => { if (!disposed && !destroyed) app.render(); };
      const cameraFor = (index: number) => Math.max(0, Math.min(Math.max(0, 1550 * world.scale.x - app.screen.width), storyWorldStops[index].x * world.scale.x - app.screen.width / 2));

      function paintStops(index: number) {
        markers.forEach((marker, n) => {
          marker.shape.clear().ellipse(0, 7, 31, 13).fill({ color: "#152d22", alpha: .35 }).ellipse(0, 2, 28, 13).fill(n === index ? "#d6bd76" : "#9e9d71").ellipse(0, -3, 28, 13).fill(n === index ? "#f5e4a9" : "#c7c39a").stroke({ color: n === index ? "#fff5d3" : "#9fa377", width: 2 });
          marker.label.alpha = n === index ? 1 : .76;
          marker.number.alpha = n === index ? 1 : .7;
        });
      }
      function resize() {
        if (disposed || destroyed) return;
        app.renderer.resize(Math.max(1, element.clientWidth), Math.max(1, element.clientHeight));
        const width = app.screen.width, height = app.screen.height;
        const scale = height / 480;
        world.scale.set(scale);
        ground.clear().ellipse(760, 525, 1240, 270).fill("#365b3e").ellipse(760, 485, 1150, 250).fill({ color: "#789064", alpha: .85 });
        ground.moveTo(storyWorldStops[0].x - 100, positionY(0));
        for (let index = 1; index < storyWorldStops.length; index++) {
          const a = storyWorldStops[index - 1], b = storyWorldStops[index];
          ground.bezierCurveTo(a.x + 150, positionY(index - 1) + 27, b.x - 150, positionY(index) - 27, b.x, positionY(index));
        }
        ground.stroke({ color: "#d2bf8b", width: 34, cap: "round" });
        shade.clear().rect(0, 0, width, height).fill({ color: "#1d402f", alpha: .42 }).rect(0, height * .62, width, height * .38).fill({ color: "#21442d", alpha: .34 });
        if (backgroundSprite) {
          const cover = Math.max(width / backgroundSprite.texture.width, height / backgroundSprite.texture.height);
          backgroundSprite.scale.set(cover);
          backgroundSprite.position.set((width - backgroundSprite.width) / 2, (height - backgroundSprite.height) / 2);
        }
        camera = targetCamera = cameraFor(current);
        world.x = -camera;
        render();
      }
      move.current = index => {
        if (disposed || destroyed) return;
        current = index;
        targetX = storyWorldStops[index].x;
        targetY = positionY(index) - 7;
        targetCamera = cameraFor(index);
        paintStops(index);
        if (reduced.matches) {
          traveler.position.set(targetX, targetY);
          camera = targetCamera;
          world.x = -camera;
          feet.rotation = 0;
          app.stop(); render();
        } else app.start();
      };
      app.ticker.maxFPS = 40;
      app.ticker.add(ticker => {
        if (disposed || destroyed) return;
        const factor = 1 - Math.pow(.82, Math.min(ticker.deltaTime, 3));
        traveler.x += (targetX - traveler.x) * factor;
        traveler.y += (targetY - traveler.y) * factor;
        camera += (targetCamera - camera) * factor;
        world.x = -camera;
        walkingTime += ticker.deltaMS / 1000;
        feet.rotation = Math.sin(walkingTime * 18) * .12;
        if (Math.abs(traveler.x - targetX) < .25 && Math.abs(camera - targetCamera) < .25) {
          traveler.position.set(targetX, targetY); camera = targetCamera; world.x = -camera; feet.rotation = 0; app.stop();
        }
      });
      paintStops(current);
      resize();
      observer = new ResizeObserver(resize);
      observer.observe(element);
      onMotionChange = () => move.current?.(current);
      reduced.addEventListener("change", onMotionChange);
      setReady(true);
      try {
        const texture = await Assets.load(artwork);
        if (disposed || destroyed) return;
        backgroundSprite = new PixiSprite(texture);
        backgroundSprite.alpha = .94;
        backdrop.addChildAt(backgroundSprite, 0);
        resize();
      } catch {
        // The scene remains usable with its original vector landscape if the illustration cannot load.
      }
    }
    prepare().catch(() => {
      if (!disposed) { setError("A cena animada não conseguiu abrir neste aparelho. Você pode acompanhar todos os encontros e as passagens logo abaixo."); setReady(false); destroy(); }
    });
    return () => {
      disposed = true;
      move.current = null;
      observer?.disconnect();
      if (onMotionChange) reduced.removeEventListener("change", onMotionChange);
      destroy();
    };
  }, [active]);

  function change(index: number) { setSelected(Math.max(0, Math.min(storyWorldStops.length - 1, index))); }
  function close() { setActive(false); setReady(false); setError(""); requestAnimationFrame(() => enterButton.current?.focus({ preventScroll: true })); }

  return <section className="story-world" aria-labelledby={titleId} data-story-world data-story-hydrated={hydrated} data-story-world-selected={stop.id} data-story-world-active={active}>
    <header className="sw-introduction"><div><p className="sw-kicker">UM ENCONTRO AO REDOR DA PALAVRA</p><h2 id={titleId}>Sente-se com a multidão.<br />Olhe para o cuidado de Jesus.</h2><p>Percorra cinco momentos da multiplicação dos pães. Cada passo leva de volta ao Evangelho, para ouvir o relato com fé, perceber seus detalhes e conhecer mais o Senhor.</p></div><Link href="/historias/multiplicacao-dos-paes">Abrir a história completa <BookOpenText size={19} aria-hidden="true" /></Link></header>
    <div className="sw-frame">
      {active ? <><div className="sw-canvas-host" id={`${sceneId}-canvas`} ref={host} data-ready={ready} role="img" aria-label={`Cena artística interativa, momento ${selected + 1}: ${stop.title}. Use os botões de cada encontro para caminhar.`} /><div className="sw-canvas-status"><span>JOÃO 6 · UM CAMINHO DE ESCUTA</span><button type="button" onClick={close}><X size={15} aria-hidden="true" /> Fechar cena</button></div></> : <div className="sw-poster"><div className="sw-poster-art"><Image src={artwork} alt="Ilustração artística de Jesus com os pães diante da multidão." fill sizes="(max-width:760px) 100vw, 50vw" quality={100} /></div><div className="sw-poster-copy"><p>Há lugar para você<br />neste encontro.</p><span>Entre na cena e acompanhe os passos da leitura. Você também pode seguir pelos textos, no seu ritmo.</span><button type="button" className="sw-primary" ref={enterButton} disabled={!hydrated} onClick={() => { setError(""); setReady(false); setActive(true); }} aria-controls={sceneId}><Play size={18} weight="fill" aria-hidden="true" /> Entrar na história</button></div></div>}
      {error && <p className="sw-error" role="status">{error}</p>}
      <div className="sw-tools"><button type="button" aria-label="Voltar ao momento anterior" onClick={() => change(selected - 1)} disabled={selected === 0}><ArrowLeft size={18} aria-hidden="true" /><span>Passo anterior</span></button><span>Encontro <strong>{selected + 1}</strong> de {storyWorldStops.length}</span><button type="button" aria-label="Ir para o próximo momento" onClick={() => change(selected + 1)} disabled={selected === storyWorldStops.length - 1}><span>Próximo passo</span><ArrowRight size={18} aria-hidden="true" /></button></div>
    </div>
    <article id={sceneId} className="sw-scene-copy" aria-live="polite" data-world-scene={stop.id}><div className="sw-scene-heading"><h3>{stop.title}</h3><Link href={storyWorldReference(stop.verse)}>{stop.label} ↗</Link></div><p>{stop.text}</p><aside className="sw-observe"><strong>OLHE COMIGO PARA A PASSAGEM</strong><p>{stop.observe}</p></aside></article>
    <ol className="sw-path" aria-label="Momentos da história">{storyWorldStops.map((entry, index) => <li key={entry.id}><button type="button" aria-pressed={selected === index} onClick={() => change(index)} aria-controls={sceneId}><span>{String(index + 1).padStart(2, "0")}</span>{entry.short}</button></li>)}</ol>
    <p className="sw-scene-note"><Footprints size={14} aria-hidden="true" /> O personagem acompanha sua leitura. Este cenário é uma composição artística para estudo, sem pretensão de reconstrução histórica. A cena usa PixiJS e respeita a preferência por movimento reduzido.</p>
    <section className="sw-feedback" aria-labelledby={questionId}><h3 id={questionId}>Uma descoberta para levar consigo.</h3><fieldset><legend>{storyWorldQuestion.prompt}</legend>{storyWorldQuestion.options.map((option, index) => <label key={option.text}><input type="radio" name={questionId} checked={answer === index} onChange={() => setAnswer(index)} />{option.text}</label>)}</fieldset><div className="sw-response" role="status">{answer !== null && <><p>{storyWorldQuestion.options[answer].feedback}</p><Link href={storyWorldReference(35)}>Permanecer em João 6:35 ↗</Link></>}</div></section>
    <details className="sw-every-step"><summary>Acompanhar os cinco momentos pelo texto</summary><ol>{storyWorldStops.map(entry => <li key={entry.id}><strong>{entry.title}</strong><p>{entry.text}</p><Link href={storyWorldReference(entry.verse)}>{entry.label} ↗</Link></li>)}</ol></details>
    <details className="sw-enhancement"><summary>Ver um detalhe da ilustração ampliado com Swin2SR</summary><p>Este é um pequeno experimento de ampliação de uma arte do projeto. O modelo estima novos pixels; a comparação não autentica detalhes históricos nem significa uma melhoria medida de aprendizagem.</p><div className="sw-enhancement-images"><figure><Image src="/visuals/enhanced/bread-detail-original.png" alt="Recorte original da ilustração artística: pães e peixes no cesto." width={240} height={192} unoptimized /><figcaption>Recorte original · 240 × 192 pixels</figcaption></figure><figure><Image src="/visuals/enhanced/bread-detail-swin2sr-x2.png" alt="O mesmo recorte artístico ampliado duas vezes com Swin2SR." width={480} height={384} unoptimized /><figcaption>Swin2SR · 480 × 384 pixels</figcaption></figure></div><Link href="/visuals/enhanced/swin2sr-proveniencia.json" target="_blank" rel="noreferrer">Conferir modelo, dimensões e origem dos arquivos ↗</Link></details>
  </section>;
}
