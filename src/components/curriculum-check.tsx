"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { useJourneySession } from "./journey-session";
import type { CurriculumStage } from "@/content/curriculum";

export function CurriculumCheck({ question, stageNumber, stageId, nextStage }: { question: CurriculumStage["question"]; stageNumber: number; stageId: string; nextStage?: { id: string; title: string } }) {
  const id = useId();
  const { markPracticed, visitStage } = useJourneySession();
  useEffect(() => { visitStage(stageId); }, [stageId, visitStage]);
  const [selection, setSelection] = useState<number | null>(null);
  const [answer, setAnswer] = useState<number | null>(null);
  const options = question.options.map((_, index) => question.options[(index + stageNumber % question.options.length) % question.options.length]);
  return <section className="cr-check" aria-labelledby={`${id}-title`}><p className="cr-eyebrow">PARE UM INSTANTE E RECORDE</p><h2 id={`${id}-title`}>O que ficou desta leitura?</h2><p>Escolha uma resposta e confira a explicação. Você pode reler e tentar novamente, sem nota ou pressa.</p><form onSubmit={event => { event.preventDefault(); if (selection !== null) { setAnswer(selection); if (options[selection].correct) markPracticed(stageId); } }}><fieldset><legend>{question.prompt}</legend>{options.map((option, index) => <label key={option.text}><input type="radio" name={`${id}-answer`} value={index} checked={selection === index} onChange={() => { setSelection(index); setAnswer(null); }} /><span>{option.text}</span></label>)}</fieldset><button type="submit" disabled={selection === null}>Conferir minha compreensão <span aria-hidden="true">→</span></button></form>{answer !== null && <div data-curriculum-feedback className="cr-feedback" role="status"><strong>{options[answer].correct ? "Você percebeu a conexão." : "Vamos olhar mais uma vez, com calma."}</strong><p>{options[answer].feedback}</p>{!options[answer].correct ? <a href="#cr-passages">Voltar às passagens e conferir</a> : <div className="cr-practice-next"><p>Esta leitura ganhou um marco no mapa, apenas nesta visita.</p><Link href={`/meu-percurso?etapa=${stageId}#journey-map-title`}>Ver meu marco no mapa</Link>{nextStage ? <Link href={`/percurso/${nextStage.id}`} prefetch={false}>Próxima parada: {nextStage.title} →</Link> : <Link href="/igrejas" prefetch={false}>Continuar pela história das igrejas →</Link>}</div>}</div>}<p className="cr-memory-note">Sua resposta não é salva nem enviada à conta. Só o marco da prática permanece em memória durante esta visita; recarregar o app limpa os marcos.</p></section>;
}
