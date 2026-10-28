"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, BookOpenText, Compass } from "@phosphor-icons/react";
import { LessonCard } from "@/components/lesson-card";
import type { CatalogLesson } from "@/lib/course-catalog";

export function StudyJourney({ lessons }: { lessons: readonly CatalogLesson[] }) {
  const reducedMotion = useReducedMotion();
  const [viewport, api] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps", loop: false, watchFocus: true });
  const [position, setPosition] = useState(0);
  const [previous, setPrevious] = useState(false);
  const [next, setNext] = useState(true);
  const update = useCallback(() => {
    if (!api) return;
    setPosition(api.selectedScrollSnap());
    setPrevious(api.canScrollPrev());
    setNext(api.canScrollNext());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    api.on("select", update).on("reInit", update);
    const frame = requestAnimationFrame(update);
    return () => { cancelAnimationFrame(frame); api.off("select", update).off("reInit", update); };
  }, [api, update]);

  return <section className="study-journey" data-journey-position={position} aria-labelledby="study-journey-title" aria-roledescription="carrossel">
    <header className="home-section-heading">
      <div><p className="home-kicker"><Compass size={18} aria-hidden="true" /> UM CAMINHO PARA PERCORRER</p><h2 id="study-journey-title">Cada encontro, uma nova descoberta.</h2><p className="home-section-description">Seis estudos para conhecer a Palavra e cultivar a fé no cotidiano.</p></div>
      <div className="journey-arrows" aria-label="Percorrer os estudos"><button type="button" aria-label="Estudos anteriores" disabled={!api || !previous} onClick={() => api?.scrollPrev(Boolean(reducedMotion))}><ArrowLeft size={21} aria-hidden="true" /></button><button type="button" aria-label="Próximos estudos" disabled={!api || !next} onClick={() => api?.scrollNext(Boolean(reducedMotion))}><ArrowRight size={21} aria-hidden="true" /></button></div>
    </header>
    <div className={`journey-viewport${api ? " journey-enhanced" : ""}`} ref={viewport} onFocusCapture={(event) => {
      const slide = (event.target as HTMLElement).closest<HTMLElement>("[data-journey-slide]");
      if (slide && api) api.scrollTo(Number(slide.dataset.journeySlide), true);
    }} onKeyDown={(event) => {
      if (event.target !== event.currentTarget) return;
      if (event.key === "ArrowRight") { api?.scrollNext(Boolean(reducedMotion)); event.preventDefault(); }
      if (event.key === "ArrowLeft") { api?.scrollPrev(Boolean(reducedMotion)); event.preventDefault(); }
    }} tabIndex={0} aria-label="Estudos introdutórios; use as setas ou deslize para percorrer">
      <div className="journey-track">{lessons.map((lesson, index) => <motion.div className="journey-slide" key={lesson.id} data-journey-slide={index} whileHover={reducedMotion ? undefined : { y: -5 }} transition={{ duration: .2 }}><LessonCard lesson={lesson} /></motion.div>)}</div>
    </div>
    <footer className="journey-footer"><span><BookOpenText size={18} aria-hidden="true" /> No seu ritmo. Com a Bíblia por perto.</span><div className="journey-dots" aria-label="Escolher uma posição no percurso">{(api?.scrollSnapList() ?? [0]).map((_, index) => <button key={index} type="button" aria-label={`Ir para a posição ${index + 1} do percurso`} aria-pressed={position === index} onClick={() => api?.scrollTo(index, Boolean(reducedMotion))}><span /></button>)}</div></footer>
  </section>;
}
