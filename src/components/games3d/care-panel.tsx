"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Drop, Hand, X } from "@phosphor-icons/react/ssr";
import { careSteps, type CareStep } from "@/content/games3d";

type Props = {
  step: CareStep;
  completed: readonly string[];
  onProgress: (progress: number | null) => void;
  onComplete: () => void;
  onClose: () => void;
};

/** Holding represents a deliberate gesture, with no deadline or failure score. */
export function CarePanel({ step, completed, onProgress, onComplete, onClose }: Props) {
  const [progress, setProgress] = useState(0);
  const active = useRef(false);
  const frame = useRef(0);
  const callbacks = useRef({ onProgress, onComplete });
  useEffect(() => { callbacks.current = { onProgress, onComplete }; }, [onProgress, onComplete]);
  useEffect(() => () => { active.current = false; cancelAnimationFrame(frame.current); callbacks.current.onProgress(null); }, []);

  function release() {
    if (!active.current) return;
    active.current = false;
    cancelAnimationFrame(frame.current);
    callbacks.current.onProgress(null);
    setProgress(0);
  }
  function begin() {
    if (active.current) return;
    active.current = true;
    const started = performance.now();
    callbacks.current.onProgress(0);
    const tick = (time: number) => {
      if (!active.current) return;
      const value = Math.min(1, (time - started) / 1250);
      setProgress(value);
      callbacks.current.onProgress(value);
      if (value === 1) {
        active.current = false;
        callbacks.current.onProgress(null);
        callbacks.current.onComplete();
      } else frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  }
  return <section className="j3-care-panel" data-care-panel onKeyDown={event => { if (event.key === "Escape") { event.preventDefault(); release(); onClose(); } }} aria-labelledby="j3-care-title">
    <header><div><p className="j3-eyebrow">O AMOR GANHA UM GESTO · LUCAS 10:34</p><h2 id="j3-care-title">Perto de quem precisa.</h2></div><button type="button" aria-label="Fechar os gestos de cuidado" onClick={() => { release(); onClose(); }}><X size={20} aria-hidden="true" /></button></header>
    <ol className="j3-care-inventory" aria-label="Recursos do cuidado">{careSteps.map(item => <li key={item.id} data-care-resource={item.id} data-used={completed.includes(item.id)} data-current={item.id === step.id}><span>{completed.includes(item.id) ? <Check size={18} aria-hidden="true" /> : item.kind === "oil-wine" ? <Drop size={18} aria-hidden="true" /> : <Hand size={18} aria-hidden="true" />}</span><strong>{item.title}</strong>{completed.includes(item.id) && <small>Gesto realizado</small>}</li>)}</ol>
    <div className="j3-care-current"><p>{step.instruction}</p><button autoFocus type="button" data-care-action={step.id} className="j3-care-hold" onPointerDown={event => { if (event.button !== 0) return; event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId); begin(); }} onPointerUp={release} onPointerCancel={release} onLostPointerCapture={release} onBlur={release} onKeyDown={event => { if (![" ", "Enter"].includes(event.key)) return; event.preventDefault(); if (!event.repeat) begin(); }} onKeyUp={event => { if ([" ", "Enter"].includes(event.key)) { event.preventDefault(); release(); } }}><span className="j3-care-fill" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" /><Hand size={23} aria-hidden="true" /><span><strong>{step.action}</strong><small>MANTENHA PRESSIONADO · OU SEGURE ESPAÇO / ENTER</small></span></button><progress aria-label={`Acompanhando o gesto: ${step.title}`} value={progress} max={1} /><small>Você pode soltar, respirar e retomar. Estes gestos representam o cuidado narrado na parábola.</small></div>
  </section>;
}
