"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useAnimate, useReducedMotion } from "motion/react";
import type { CreateTypes } from "canvas-confetti";
import "./study-celebration.css";

/** The existing study stays mounted and visible before hydration. */
export function StudyTransition({ marker, children }: { marker: string; children: ReactNode }) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const reducedMotion = useReducedMotion();
  const previous = useRef(marker);

  useEffect(() => {
    if (previous.current === marker) return;
    previous.current = marker;
    if (!scope.current || reducedMotion) return;
    const element = scope.current;
    const clear = () => { element.style.removeProperty("transform"); element.style.removeProperty("opacity"); };
    const animation = animate(element, { opacity: [.88, 1], y: [12, 0] }, { duration: .24, ease: [.2, .7, .3, 1], onComplete: clear });
    return () => { animation.stop(); clear(); };
  }, [animate, marker, reducedMotion, scope]);

  return <div ref={scope} className="study-transition">{children}</div>;
}

/** Decorative contemporary book; scripture always comes from the authored study. */
export function StudyChapterArt() {
  return <div className="study-chapter-art" aria-hidden="true"><span className="study-art-halo" /><span className="study-art-pages" /><span className="study-art-cover"><span className="study-art-ornament">✦</span><span className="study-art-book-title">PALAVRA<br />E VIDA</span><span className="study-art-line" /></span><span className="study-art-ribbon" /></div>;
}

/** A single optional burst celebrates time spent studying, never a score or faith. */
export function StudyCelebration() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const instance = useRef<CreateTypes | null>(null);
  const used = useRef(false);
  const mounted = useRef(false);
  const [celebrated, setCelebrated] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; instance.current?.reset(); };
  }, []);

  async function celebrate() {
    if (used.current) return;
    used.current = true;
    setCelebrated(true);
    if (reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    try {
      const { default: confetti } = await import("canvas-confetti");
      if (!mounted.current || !canvas.current) return;
      instance.current = confetti.create(canvas.current, { resize: true, useWorker: false });
      void instance.current({ particleCount: 55, spread: 66, startVelocity: 24, gravity: .8, ticks: 135, scalar: .85, origin: { x: .5, y: .68 }, colors: ["#d8b67b", "#7e9d7e", "#eedcc0", "#315d49"], disableForReducedMotion: true });
    } catch {
      // The acknowledgement remains available when the optional animation cannot load.
    }
  }

  return <div className="study-celebration"><canvas ref={canvas} className="study-celebration-canvas" aria-hidden="true" /><div><span className="study-celebration-symbol" aria-hidden="true">✦</span><p>Um encontro para guardar.</p><span>Você dedicou um tempo à Palavra. Leve esse cuidado com você.</span></div><button type="button" onClick={celebrate} disabled={celebrated}><span aria-hidden="true">✧</span>{celebrated ? "Encontro celebrado com carinho" : "Celebrar este encontro"}</button><p className="study-celebration-message" aria-live="polite">{celebrated ? "Que o cuidado desta leitura acompanhe seus passos." : "Uma celebração opcional, sem som."}</p></div>;
}
