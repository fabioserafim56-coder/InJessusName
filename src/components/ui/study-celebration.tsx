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
  return <div className="study-chapter-art" aria-hidden="true"><span className="study-art-halo" /><span className="study-art-pages" /><span className="study-art-cover"><span className="study-art-ornament study-art-cross" /><span className="study-art-book-title">PALAVRA<br />E VIDA</span><span className="study-art-line" /></span><span className="study-art-ribbon" /></div>;
}

function StudyLamp() {
  return <svg className="study-earned-lamp" aria-hidden="true" viewBox="0 0 160 120" fill="none"><defs><radialGradient id="study-lamp-glow"><stop stopColor="#e7ca84" stopOpacity=".6" /><stop offset="1" stopColor="#e7ca84" stopOpacity="0" /></radialGradient><linearGradient id="study-lamp-brass" x1="38" x2="121" y1="82" y2="110" gradientUnits="userSpaceOnUse"><stop stopColor="#ab8545" /><stop offset=".4" stopColor="#dfc58a" /><stop offset="1" stopColor="#937038" /></linearGradient></defs><ellipse className="study-lamp-glow" cx="84" cy="46" rx="56" ry="47" fill="url(#study-lamp-glow)" /><path d="M90 20c3 12 13 17 13 26a13 13 0 0 1-26 0c0-9 9-15 13-26Z" fill="#cfaa64" /><path d="M89 35c1 7 7 10 7 15a7 7 0 0 1-14 0c0-6 4-10 7-15Z" fill="#faeac0" /><path d="M44 74c6-5 19-8 35-8 17 0 30 4 33 11l-8 21c-2 6-16 10-31 10-16 0-30-5-32-12l-3-14-16-7c-4-2-4-8 1-8l21 7Z" fill="url(#study-lamp-brass)" stroke="#a88b53" strokeWidth="1.5" /><path d="M107 76c20-15 35-2 23 11-5 6-14 8-24 8" stroke="#ab8b4f" strokeWidth="5" /><ellipse cx="78" cy="77" rx="34" ry="11" stroke="#f1ddb0" strokeWidth="1.5" /><path d="M88 57v11" stroke="#53442a" strokeWidth="3" /><path d="M37 112h85" stroke="#ab986b" strokeOpacity=".3" strokeWidth="2" strokeLinecap="round" /></svg>;
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
      void instance.current({ particleCount: 28, spread: 52, startVelocity: 18, gravity: .65, ticks: 125, scalar: .7, origin: { x: .5, y: .68 }, colors: ["#d8b67b", "#9da77e", "#eedcc0", "#a6874d"], disableForReducedMotion: true });
    } catch {
      // The acknowledgement remains available when the optional animation cannot load.
    }
  }

  return <div className={`study-celebration${celebrated ? " study-celebrated" : ""}`} data-study-keepsake><canvas ref={canvas} className="study-celebration-canvas" aria-hidden="true" /><div><StudyLamp /><span className="study-keepsake-label">UMA LEMBRANÇA DESTE ENCONTRO</span><p>Uma luz para o próximo passo.</p><span className="study-keepsake-copy">Você leu, praticou e voltou à Palavra. Guarde este pequeno sinal do tempo que dedicou a aprender.</span><a className="study-lamp-reference" href="/biblia?livro=PSA&capitulo=119&versiculo=105">A imagem da lâmpada em Salmo 119:105 ↗</a></div><button type="button" onClick={celebrate} disabled={celebrated}><span aria-hidden="true">✧</span>{celebrated ? "Encontro celebrado com carinho" : "Celebrar este encontro"}</button><p className="study-celebration-message" aria-live="polite">{celebrated ? "Que o cuidado desta leitura acompanhe seus passos." : "Uma celebração opcional, sem som."}</p></div>;
}
