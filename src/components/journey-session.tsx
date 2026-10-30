"use client";

import Link from "next/link";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type JourneyVisualProfile = { appearance: "neutral" | "masculine" | "feminine"; ageBand: "child" | "youth" | "adult" | "mature"; knowledge: "starting" | "some" | "experienced"; company: "alone" | "family" | "community" };
const defaultVisualProfile: JourneyVisualProfile = { appearance: "neutral", ageBand: "adult", knowledge: "starting", company: "alone" };
type JourneySession = { practiced: readonly string[]; completedLessons: readonly string[]; markLessonCompleted: (lessonId: string) => void; currentStageId: string | null; visualProfile: JourneyVisualProfile; updateVisualProfile: (patch: Partial<JourneyVisualProfile>) => void; markPracticed: (stageId: string) => void; visitStage: (stageId: string) => void; reset: () => void };
const JourneySessionContext = createContext<JourneySession | null>(null);
const fallback: JourneySession = { practiced: [], completedLessons: [], markLessonCompleted: () => {}, currentStageId: null, visualProfile: defaultVisualProfile, updateVisualProfile: () => {}, markPracticed: () => {}, visitStage: () => {}, reset: () => {} };

export function JourneySessionProvider({ children }: { children: ReactNode }) {
  const [practiced, setPracticed] = useState<string[]>([]);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const markLessonCompleted = useCallback((lessonId: string) => setCompletedLessons(current => current.includes(lessonId) ? current : [...current, lessonId]), []);
  const [currentStageId, setCurrentStageId] = useState<string | null>(null);
  const [visualProfile, setVisualProfile] = useState<JourneyVisualProfile>(defaultVisualProfile);
  const updateVisualProfile = useCallback((patch: Partial<JourneyVisualProfile>) => setVisualProfile(current => ({ ...current, ...patch })), []);
  const visitStage = useCallback((stageId: string) => setCurrentStageId(stageId), []);
  const markPracticed = useCallback((stageId: string) => { setPracticed(current => current.includes(stageId) ? current : [...current, stageId]); setCurrentStageId(stageId); }, []);
  const reset = useCallback(() => { setPracticed([]); setCurrentStageId(null); }, []);
  const value = useMemo(() => ({ practiced, completedLessons, markLessonCompleted, currentStageId, visualProfile, updateVisualProfile, markPracticed, visitStage, reset }), [practiced, completedLessons, markLessonCompleted, currentStageId, visualProfile, updateVisualProfile, markPracticed, visitStage, reset]);
  return <JourneySessionContext.Provider value={value}>{children}</JourneySessionContext.Provider>;
}
export function useJourneySession() { return useContext(JourneySessionContext) || fallback; }

export function JourneySessionSummary({ total }: { total: number }) {
  const session = useJourneySession();
  return <div className="jm-session-summary" data-journey-session-summary><p role="status"><strong>{session.practiced.length}</strong> de {total} leituras praticadas nesta visita.<span> Um marco aparece depois que você confere uma resposta correta. Eles desaparecem ao recarregar ou fechar o app.</span></p>{session.practiced.length > 0 && <button type="button" onClick={session.reset}>Limpar marcos desta visita</button>}</div>;
}

export function JourneyStageLink({ stageId, currentStageId, children }: { stageId: string; currentStageId?: string; children: ReactNode }) {
  const session = useJourneySession();
  const practiced = session.practiced.includes(stageId);
  const current = currentStageId ? currentStageId === stageId : session.currentStageId === stageId;
  return <Link className={`jm-stage-link${practiced ? " jm-stage-practiced" : ""}`} data-practiced={practiced ? "true" : "false"} href={`/percurso/${stageId}`} aria-current={current ? "step" : undefined} prefetch={false}>{children}{practiced && <span className="jm-practiced-label"><span aria-hidden="true">✓</span> Praticada nesta visita</span>}{current && <span className="jm-current-label">Etapa em foco</span>}</Link>;
}
