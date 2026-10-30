"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpenText, Check, Compass, MapTrifold, UserCircle, UsersThree, WaveSine } from "@phosphor-icons/react/ssr";
import { faithJourneySources, faithLands, faithStopPosition } from "@/content/faith-journey";
import { useJourneySession } from "@/components/journey-session";
import { FaithWorldArt, type FaithStop } from "./world-art";
import "./faith-world.css";

export function FaithWorld({ stages, currentStageId }: { stages: readonly FaithStop[]; currentStageId?: string }) {
  const session = useJourneySession();
  const id = useId();
  const [selectedId, setSelectedId] = useState(currentStageId || session.currentStageId || stages[0].id);
  const [overview, setOverview] = useState(false);
  const [aspect, setAspect] = useState(1.6);
  const viewport = useRef<HTMLDivElement>(null);
  const selected = Math.max(0, stages.findIndex(stage => stage.id === selectedId));
  const stage = stages[selected];
  const land = faithLands[Math.floor(selected / 4)];
  const point = faithStopPosition(selected);
  const width = Math.max(310, 510 * aspect);
  const viewBox = overview ? "-70 90 1630 865" : `${point.x - width / 2} ${point.y - 284} ${width} 510`;
  const isPracticed = session.practiced.includes(stage.id);
  const dedication = session.practiced.length + session.completedLessons.length;
  const visualMarks = [dedication >= 1 ? "Uma luz para o caminho" : null, dedication >= 3 ? "Sua bolsa de leituras" : null, dedication >= 6 ? "Um novo detalhe no manto" : null].filter(Boolean);

  useEffect(() => {
    const target = viewport.current;
    if (!target || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(entries => { const rectangle = entries[0]?.contentRect; if (rectangle?.height && rectangle.width) setAspect(rectangle.width / rectangle.height); });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  function walk(index: number) {
    const next = Math.max(0, Math.min(stages.length - 1, index));
    setSelectedId(stages[next].id);
    session.visitStage(stages[next].id);
  }

  return <section className="faith-world" data-faith-world data-faith-world-selected={stage.id} data-faith-world-mode={overview ? "overview" : "follow"} data-faith-world-company={session.visualProfile.company} data-faith-world-appearance={session.visualProfile.appearance} aria-labelledby={`${id}-title`}>
    <header className="fw-heading"><div><p className="fw-eyebrow"><Compass size={19} aria-hidden="true" /> SUA CAMINHADA NA PALAVRA</p><h2 id={`${id}-title`}>A Palavra ilumina<br /><em>o próximo passo.</em></h2><p>Entre no caminho, conheça cada lugar e abra uma leitura. As descobertas se ligam, uma após a outra, para compreender o cuidado de Deus do começo à esperança final.</p></div><div className="fw-real-progress"><BookOpenText size={22} aria-hidden="true" /><strong>{session.practiced.length}<span>/{stages.length}</span></strong><p>leituras praticadas<br />nesta visita</p></div></header>
    <div className="fw-world-frame">
      <div className="fw-world-topline"><span><span className="fw-live-dot" />{land.short}</span><button type="button" aria-pressed={overview} onClick={() => setOverview(current => !current)}><MapTrifold size={18} aria-hidden="true" />{overview ? "Acompanhar os passos" : "Ver todo o caminho"}</button></div>
      <div className="fw-world-viewport" ref={viewport} tabIndex={0} aria-label="Caminho ilustrado: use as setas para escolher uma etapa" onKeyDown={event => { if (event.target !== event.currentTarget) return; if (event.key === "ArrowRight") { event.preventDefault(); walk(selected + 1); } if (event.key === "ArrowLeft") { event.preventDefault(); walk(selected - 1); } if (event.key === "Home") { event.preventDefault(); walk(0); } if (event.key === "End") { event.preventDefault(); walk(stages.length - 1); } }}>
        <FaithWorldArt stages={stages} selected={selected} practiced={session.practiced} completedLessons={session.completedLessons.length} profile={session.visualProfile} viewBox={viewBox} onSelect={walk} />
      </div>
      <div className="fw-land-caption" aria-hidden="true"><span>{land.title}</span><p>{land.subtitle}</p></div>
      <div className="fw-world-controls"><button type="button" aria-label="Caminhar para a etapa anterior" disabled={selected === 0} onClick={() => walk(selected - 1)}><ArrowLeft size={20} aria-hidden="true" /><span>Passo anterior</span></button><p aria-live="polite">Parada <strong>{stage.number}</strong> de {stages.length}</p><button type="button" aria-label="Caminhar para a próxima etapa" disabled={selected === stages.length - 1} onClick={() => walk(selected + 1)}><span>Próximo passo</span><ArrowRight size={20} aria-hidden="true" /></button></div>
    </div>
    <div className="fw-stop-details" aria-live="polite"><div className={`fw-step-seal${isPracticed ? " fw-step-practiced" : ""}`} aria-hidden="true">{isPracticed ? <Check size={27} /> : String(stage.number).padStart(2, "0")}</div><div><p className="fw-eyebrow">{stage.era}</p><h3>{stage.title}</h3><p>{stage.objective}</p>{isPracticed && <span className="fw-practiced-message"><Check size={15} aria-hidden="true" /> Você conferiu a prática desta leitura nesta visita.</span>}</div><Link href={`/percurso/${stage.id}`} prefetch={false}>Abrir esta leitura<ArrowRight size={20} aria-hidden="true" /></Link></div>
    <p className="fw-word-companion">{land.companion} <Link href={land.href} prefetch={false}>{land.scripture}<span aria-hidden="true"> ↗</span></Link></p>
    <div className="fw-personalization">
      <details className="fw-customize"><summary><UserCircle size={22} aria-hidden="true" /><span>Um personagem para acompanhar você</span><span aria-hidden="true">+</span></summary><div className="fw-customize-body"><p>A representação é uma escolha sua. Ela não muda o conteúdo nem mede sua fé. Essas preferências ficam somente nesta visita.</p><div className="fw-customize-fields"><label>Como prefere aparecer?<select aria-label="Como prefere aparecer?" value={session.visualProfile.appearance} onChange={event => session.updateVisualProfile({ appearance: event.target.value as typeof session.visualProfile.appearance })}><option value="neutral">Representação neutra</option><option value="feminine">Representação feminina</option><option value="masculine">Representação masculina</option></select></label><label>Etapa da vida na representação<select aria-label="Etapa da vida na representação" value={session.visualProfile.ageBand} onChange={event => session.updateVisualProfile({ ageBand: event.target.value as typeof session.visualProfile.ageBand })}><option value="child">Infância</option><option value="youth">Juventude</option><option value="adult">Vida adulta</option><option value="mature">Maturidade</option></select></label></div><fieldset><legend><UsersThree size={19} aria-hidden="true" /> Quem acompanha esta cena?</legend><div className="fw-company-options">{([{ id: "alone", label: "Caminhada pessoal" }, { id: "family", label: "Com minha família" }, { id: "community", label: "Com a comunidade" }] as const).map(item => <label key={item.id}><input type="radio" name={`${id}-company`} checked={session.visualProfile.company === item.id} onChange={() => session.updateVisualProfile({ company: item.id })} /><span>{item.label}</span></label>)}</div></fieldset><p className="fw-vocation-note">Casamento, filhos e vida solteira têm histórias diferentes. O amor a Deus não é uma sequência obrigatória de estados de vida. <Link href="/biblia?livro=1CO&capitulo=7&versiculo=7">Ler 1 Coríntios 7</Link>.</p></div></details>
      <details className="fw-customize fw-marks"><summary><BookOpenText size={22} aria-hidden="true" /><span>O que muda quando você pratica?</span><span aria-hidden="true">+</span></summary><div className="fw-customize-body"><p>Uma leitura com a prática conferida ou um estudo guiado concluído deixa uma lembrança no personagem: uma lanterna no primeiro encontro, uma bolsa depois de três e um novo detalhe do manto depois de seis. Estudos guiados e paradas do mapa mantêm seus próprios registros, sem marcar uma etapa pela outra.</p>{visualMarks.length > 0 ? <ul>{visualMarks.map(mark => <li key={mark}><Check size={16} aria-hidden="true" />{mark}</li>)}</ul> : <p className="fw-first-invitation">Sua primeira descoberta começa com uma Bíblia aberta. Caminhe até uma parada e experimente sua leitura.</p>}<p>Esses sinais não representam santidade, salvação ou um batismo realizado. Aprender é um convite para conhecer a Palavra e viver seu amor.</p></div></details>
    </div>
    <Link className="fw-baptism" href="/biblia?busca=batismo#busca-biblica"><span><WaveSine size={27} aria-hidden="true" /></span><div><small>UM ENCONTRO IMPORTANTE NO CAMINHO</small><strong>Vamos compreender o batismo?</strong><p>Acompanhe o batismo de Jesus e o ensino às primeiras comunidades. Leia as passagens e conheça as diferentes perspectivas cristãs.</p></div><ArrowRight size={21} aria-hidden="true" /></Link>
    <details className="fw-biblical-roots"><summary>As raízes bíblicas deste caminho visual</summary><div>{faithJourneySources.map(source => <article key={source.reference}><strong>{source.title}</strong><p>{source.text}</p><Link href={source.href} prefetch={false}>{source.reference}<span aria-hidden="true"> ↗</span></Link></article>)}</div><p>O cenário é uma ilustração pedagógica, não um mapa geográfico ou uma reconstrução histórica. O conteúdo e seus vínculos permanecem no mapa de leitura abaixo, também disponível sem animação.</p></details>
    <noscript><p className="fw-no-js">Você pode acompanhar o cenário e abrir a leitura inicial. O mapa abaixo oferece todas as etapas e continua funcionando sem animação.</p></noscript>
  </section>;
}
