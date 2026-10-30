"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, BookOpenText, CaretRight, Eye } from "@phosphor-icons/react";
import { storyBibleUrl, type BiblicalStory } from "@/content/stories";
import { StorySymbol } from "./story-art";

export function StoryScenes({ story }: { story: BiblicalStory }) {
  const reduceMotion = useReducedMotion();
  const [viewport,api]=useEmblaCarousel({align:"start",containScroll:"trimSnaps",loop:false,watchFocus:true});
  const [position,setPosition]=useState(0);
  const update=useCallback(()=>{ if(api) setPosition(api.selectedScrollSnap()); },[api]);
  useEffect(()=>{if(!api)return;api.on("select",update).on("reInit",update);const frame=requestAnimationFrame(update);return()=>{cancelAnimationFrame(frame);api.off("select",update).off("reInit",update);};},[api,update]);
  return <section className="story-scenes" data-story-position={position} aria-label="Quatro cenas para acompanhar a passagem" aria-roledescription="carrossel">
    <header className="story-scenes-toolbar"><p><span>ACOMPANHE A HISTÓRIA</span><strong aria-live="polite">Cena {position+1} de {story.scenes.length}</strong></p><div><button type="button" aria-label="Cena anterior" disabled={!api||position===0} onClick={()=>api?.scrollPrev(Boolean(reduceMotion))}><ArrowLeft size={22} aria-hidden="true" /></button><button type="button" aria-label="Próxima cena" disabled={!api||position===story.scenes.length-1} onClick={()=>api?.scrollNext(Boolean(reduceMotion))}><ArrowRight size={22} aria-hidden="true" /></button></div></header>
    <div className={`story-scenes-viewport${api?" story-scenes-enhanced":""}`} ref={viewport} tabIndex={0} aria-label="Cenas da história; deslize ou use as setas" onKeyDown={event=>{if(event.target!==event.currentTarget)return;if(event.key==="ArrowRight"){api?.scrollNext(Boolean(reduceMotion));event.preventDefault();}if(event.key==="ArrowLeft"){api?.scrollPrev(Boolean(reduceMotion));event.preventDefault();}if(event.key==="Home"){api?.scrollTo(0,Boolean(reduceMotion));event.preventDefault();}if(event.key==="End"){api?.scrollTo(story.scenes.length-1,Boolean(reduceMotion));event.preventDefault();}}} onFocusCapture={event=>{const slide=(event.target as HTMLElement).closest<HTMLElement>("[data-story-scene]");if(slide&&api)api.scrollTo(Number(slide.dataset.storyScene),true);}}>
      <div className="story-scenes-track">{story.scenes.map((scene,index)=><article key={scene.title} className="story-scene" data-story-scene={index} aria-label={`Cena ${index+1}: ${scene.title}`}><div className="story-scene-copy"><p className="stories-eyebrow">{String(index+1).padStart(2,"0")} / A HISTÓRIA</p><h2>{scene.title}</h2><p className="story-scene-narration">{scene.text}</p><div className="story-scene-observation"><Eye size={23} aria-hidden="true" /><div><strong>Olhe com atenção</strong><p>{scene.observe}</p></div></div><Link href={storyBibleUrl(scene.reference)} prefetch={false}><BookOpenText size={21} aria-hidden="true" /><span>Abrir {scene.reference.label}</span><CaretRight size={17} aria-hidden="true" /></Link></div><div className={`story-scene-art story-art-${story.art}`} aria-hidden="true"><Image src={story.image || `/visuals/stories-${story.art}.png`} alt="" fill quality={100} sizes="(max-width:760px) 90vw, 40vw" style={{objectPosition:`${25+index*16}% center`}} /><div className="story-scene-art-shade" /><span className="story-scene-art-label">ILUSTRAÇÃO ARTÍSTICA</span><div className="story-scene-emblem"><StorySymbol kind={story.symbol}/><span>{story.theme}</span><small>CENA {String(index+1).padStart(2,"0")}</small></div></div></article>)}</div>
    </div>
    <div className="story-scene-dots" aria-label="Escolher uma cena">{story.scenes.map((scene,index)=><button type="button" key={scene.title} aria-label={`Ir para a cena ${index+1}: ${scene.title}`} aria-pressed={position===index} disabled={!api} onClick={()=>api?.scrollTo(index,Boolean(reduceMotion))}><span />{String(index+1).padStart(2,"0")}</button>)}</div>
    <p className="story-scenes-hint">Sem pressa: deslize para acompanhar. Cada cena permanece disponível para voltar e reler.</p>
  </section>;
}

export function StoryReflection({ story }: { story: BiblicalStory }) {
  const [choice,setChoice]=useState<number|null>(null);
  return <section className="story-reflection" aria-labelledby="story-reflection-title"><p className="stories-eyebrow">UMA PERGUNTA PARA LEVAR À VIDA</p><h2 id="story-reflection-title">Vamos pensar juntos?</h2><p className="story-reflection-prompt">{story.question.prompt}</p><div className="story-reflection-options">{story.question.options.map((option,index)=><button type="button" key={option.text} aria-pressed={choice===index} onClick={()=>setChoice(index)}><span>{String(index+1).padStart(2,"0")}</span>{option.text}</button>)}</div><div className="story-reflection-feedback" role="status" aria-live="polite">{choice!==null&&<p>{story.question.options[choice].feedback}</p>}</div><details className="story-reflection-context"><summary>Ler as duas possibilidades com uma explicação</summary>{story.question.options.map(option=><div key={option.text}><strong>{option.text}</strong><p>{option.feedback}</p></div>)}</details><small>Esta reflexão não atribui nota à sua fé. Nenhuma resposta é salva.</small></section>;
}
