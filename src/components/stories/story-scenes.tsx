"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, BookOpenText, Check, Eye, HandSwipeLeft, Plus } from "@phosphor-icons/react";
import { storyBibleUrl, type BiblicalStory } from "@/content/stories";
import { getStorySceneArtwork } from "@/content/stories/scene-artwork";
import { StoryArtworkZoom } from "./story-artwork-viewer";

export function StoryScenes({ story }: { story: BiblicalStory }) {
  const reduceMotion = useReducedMotion();
  const [viewport, api] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps", loop: false, watchFocus: true });
  const [position, setPosition] = useState(0);
  const update = useCallback(() => { if (api) setPosition(api.selectedScrollSnap()); }, [api]);

  useEffect(() => {
    if (!api) return;
    api.on("select", update).on("reInit", update);
    const frame = requestAnimationFrame(update);
    return () => { cancelAnimationFrame(frame); api.off("select", update).off("reInit", update); };
  }, [api, update]);

  function moveTo(index: number) {
    api?.scrollTo(index, Boolean(reduceMotion));
    // A deliberate change of scene returns phone readers to its illustration.
    if (window.matchMedia("(max-width:760px)").matches) {
      document.getElementById("story-scene-canvas")?.scrollIntoView({ block: "start", behavior: reduceMotion ? "instant" : "smooth" });
    }
  }

  return <section className="story-scenes" data-story-position={position} aria-label="Quatro cenas para acompanhar a passagem" aria-roledescription="carrossel">
    <div id="story-scene-canvas" className={`story-scenes-viewport${api ? " story-scenes-enhanced" : ""}`} ref={viewport} tabIndex={0}
      aria-label="Cenas da história; deslize ou use as setas"
      onKeyDown={event => {
        if (event.target !== event.currentTarget) return;
        if (event.key === "ArrowRight") { api?.scrollNext(Boolean(reduceMotion)); event.preventDefault(); }
        if (event.key === "ArrowLeft") { api?.scrollPrev(Boolean(reduceMotion)); event.preventDefault(); }
        if (event.key === "Home") { api?.scrollTo(0, Boolean(reduceMotion)); event.preventDefault(); }
        if (event.key === "End") { api?.scrollTo(story.scenes.length - 1, Boolean(reduceMotion)); event.preventDefault(); }
      }}
      onFocusCapture={event => {
        const slide = (event.target as HTMLElement).closest<HTMLElement>("[data-story-scene]");
        if (slide && api) api.scrollTo(Number(slide.dataset.storyScene), true);
      }}>
      <div className="story-scenes-track">{story.scenes.map((scene, index) => {
        const artwork = getStorySceneArtwork(story, index);
        return <article key={scene.title} className="story-scene" data-story-scene={index} data-active={position === index} aria-label={`Cena ${index + 1}: ${scene.title}`}>
          <div className="story-scene-art">
            <Image src={artwork.src} alt={artwork.alt} fill quality={100} sizes="(max-width:760px) 1000px, 100vw" loading={index === 0 ? "eager" : "lazy"} style={{ objectPosition: artwork.position || "center" }} />
            <div className="story-scene-art-shade" />
            <span className="story-scene-art-label">ILUSTRAÇÃO ARTÍSTICA · {story.theme}</span>
            {artwork.width && artwork.height && <StoryArtworkZoom src={artwork.src} width={artwork.width} height={artwork.height} title={scene.title} />}
            <details className="story-scene-discover">
              <summary><span className="story-discover-marker"><Plus size={20} aria-hidden="true" /></span><span>Um detalhe para perceber</span></summary>
              <div><span className="stories-eyebrow"><Eye size={17} aria-hidden="true" /> OLHE COM ATENÇÃO</span><p>{scene.observe}</p><small>Confira em {scene.reference.label}.</small></div>
            </details>
          </div>
          <div className="story-scene-copy">
            <p className="stories-eyebrow"><span className="story-scene-beat">{String(index + 1).padStart(2, "0")}</span> {index === 0 ? "ENTRE NA PASSAGEM" : index === 3 ? "GUARDE NO CORAÇÃO" : "ACOMPANHE O QUE ACONTECE"}</p>
            <h2>{scene.title}</h2>
            <p className="story-scene-narration">{scene.text}</p>
            <Link href={storyBibleUrl(scene.reference)} prefetch={false}><BookOpenText size={22} aria-hidden="true" /><span><small>ABRA A PALAVRA</small>{scene.reference.label}</span><ArrowRight size={20} aria-hidden="true" /></Link>
          </div>
        </article>;
      })}</div>
    </div>
    <div className="story-scene-navigation">
      <header className="story-scenes-toolbar"><p><span>CAMINHE NO SEU TEMPO</span><strong aria-live="polite">Cena {position + 1} de {story.scenes.length}</strong></p><div><button type="button" aria-label="Cena anterior" disabled={!api || position === 0} onClick={() => moveTo(position - 1)}><ArrowLeft size={22} aria-hidden="true" /></button><button type="button" aria-label="Próxima cena" disabled={!api || position === story.scenes.length - 1} onClick={() => moveTo(position + 1)}><ArrowRight size={22} aria-hidden="true" /></button></div></header>
      <ol className="story-scene-dots" aria-label="Escolher uma cena">{story.scenes.map((scene, index) => <li key={scene.title}><button type="button" aria-label={`Ir para a cena ${index + 1}: ${scene.title}`} aria-pressed={position === index} disabled={!api} onClick={() => moveTo(index)}><span className="story-scene-step-number">{String(index + 1).padStart(2, "0")}</span><span className="story-scene-step-title">{scene.title}</span><span className="story-scene-step-line" /></button></li>)}</ol>
      <p className="story-scenes-hint"><HandSwipeLeft size={17} aria-hidden="true" /> Deslize ou use as setas. Abra o sinal + para observar um detalhe na Palavra.</p>
      <noscript><p className="story-scenes-hint">Deslize a faixa de cenas para os lados; todos os textos e links bíblicos continuam disponíveis.</p></noscript>
    </div>
  </section>;
}

export function StoryReflection({ story }: { story: BiblicalStory }) {
  const [choice, setChoice] = useState<number | null>(null);
  return <section className="story-reflection" aria-labelledby="story-reflection-title"><div className="story-reflection-heading"><span className="story-reflection-symbol" aria-hidden="true"><BookOpenText size={29} /></span><div><p className="stories-eyebrow">A HISTÓRIA ENCONTRA A SUA VIDA</p><h2 id="story-reflection-title">O que fica no seu coração?</h2></div></div><p className="story-reflection-prompt">{story.question.prompt}</p><div className="story-reflection-options">{story.question.options.map((option, index) => <button type="button" key={option.text} aria-pressed={choice === index} onClick={() => setChoice(index)}><span>{choice === index ? <Check size={19} aria-hidden="true" /> : String(index + 1).padStart(2, "0")}</span>{option.text}</button>)}</div><div className="story-reflection-feedback" role="status" aria-live="polite">{choice !== null && <p>{story.question.options[choice].feedback}</p>}</div><details className="story-reflection-context"><summary>Ler as duas possibilidades com uma explicação</summary>{story.question.options.map(option => <div key={option.text}><strong>{option.text}</strong><p>{option.feedback}</p></div>)}</details><small>Você pode voltar à passagem e pensar com calma. Esta reflexão não atribui nota à sua fé. Nenhuma resposta é salva.</small></section>;
}
