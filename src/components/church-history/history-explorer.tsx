"use client";

import Link from "next/link";
import { useState } from "react";
import { HistoryPhotoGallery } from "./history-photos";
import { churches, people, relationships, sourcesFor, type ChurchHistory, type HistoricalRelationship } from "@/content/church-history";

const normalized = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
const familyNames = [...new Set(churches.map(church => church.family))];
const kindNames: Record<HistoricalRelationship["kind"], string> = { missao: "Missão", fundacao: "Fundação", musica: "Música", educacao: "Educação", reforma: "Tradição e Reforma", trajetoria: "Mudança de trajetória" };
const initials = (name: string) => name.split(" ").filter(part => !["de", "da", "do"].includes(part)).slice(0, 2).map(part => part[0]).join("");

function ChurchPreview({ church }: { church: ChurchHistory }) {
  return <div className="history-church-preview"><p className="history-eyebrow">MARCO NO BRASIL · {church.year}</p><h3>{church.name}</h3><p>{church.summary}</p><dl><div><dt>De onde veio</dt><dd>{church.origin}</dd></div><div><dt>Como chegou</dt><dd>{church.brazil}</dd></div></dl><Link className="history-detail-link" href={`/igrejas/${church.id}`}>Abrir história, doutrina e linha do tempo <span aria-hidden="true">↗</span></Link></div>;
}

export function HistoryExplorer() {
  const [selectedChurch, setSelectedChurch] = useState("assembleias");
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState("");
  const [kind, setKind] = useState("");
  const [view, setView] = useState<"network" | "timeline">("network");
  const church = churches.find(item => item.id === selectedChurch)!;
  const filteredChurches = churches.filter(item => {
    const connectedNames = relationships.filter(edge => edge.from === item.id).map(edge => people.find(person => person.id === edge.to)?.name ?? "").join(" ");
    return (!family || item.family === family) && normalized(`${item.name} ${item.family} ${item.origin} ${connectedNames}`).includes(normalized(query.trim()));
  });
  const edges = relationships.filter(edge => edge.from === church.id && (!kind || edge.kind === kind));
  const person = people.find(item => item.id === selectedPerson);
  const selectedEdge = edges.find(edge => edge.to === selectedPerson);
  const height = Math.max(500, edges.length * 132);
  function selectChurch(id: string) { setSelectedChurch(id); setSelectedPerson(null); setKind(""); }
  return <section className="history-explorer" aria-label="Rede de conexões históricas">
    <div className="history-explorer-toolbar"><div><label htmlFor="history-search">Pesquisar igrejas e personalidades</label><input id="history-search" type="search" placeholder="Ex.: Frida, batista, Inglaterra…" value={query} onChange={event => setQuery(event.target.value)} /></div><div><label htmlFor="history-family">Filtrar por tradição</label><select id="history-family" value={family} onChange={event => setFamily(event.target.value)}><option value="">Todas as tradições</option>{familyNames.map(name => <option key={name}>{name}</option>)}</select></div></div>
    <div className="history-collection-heading"><p role="status">{filteredChurches.length} {filteredChurches.length === 1 ? "trajetória encontrada" : "trajetórias encontradas"}</p><p>Escolha uma comunidade para seguir suas conexões.</p></div>
    <div className="history-church-picker" aria-label="Escolher uma história">{filteredChurches.map(item => <button key={item.id} type="button" data-church-id={item.id} aria-pressed={item.id === church.id} onClick={() => selectChurch(item.id)}><span>{item.year}</span><strong>{item.shortName}</strong><small>{item.family}</small></button>)}</div>
    {filteredChurches.length === 0 && <div className="history-empty"><h3>Vamos procurar por outro caminho?</h3><p>Este acervo inicial ainda não reúne todas as igrejas e personalidades. Tente um sobrenome, uma tradição ou um país.</p><button type="button" onClick={() => {setQuery("");setFamily("");}}>Limpar a pesquisa</button></div>}
    <div className="history-board-header"><div><p className="history-eyebrow">CONEXÕES COM ORIGEM IDENTIFICADA</p><h2>{church.shortName}</h2></div><div className="history-view-switch" role="group" aria-label="Como explorar a história"><button type="button" aria-pressed={view === "network"} onClick={() => setView("network")}>Rede de conexões</button><button type="button" aria-pressed={view === "timeline"} onClick={() => setView("timeline")}>Linha do tempo</button></div></div>
    <p className="history-board-note">Cada ramo descreve uma relação específica. Uma ligação de música ou influência teológica não significa fundação, parentesco ou autoridade sobre a igreja.</p>
    {view === "network" ? <>
      <div className="history-network-tools"><label htmlFor="history-kind">Tipo de conexão</label><select id="history-kind" value={kind} onChange={event => {setKind(event.target.value);setSelectedPerson(null);}}><option value="">Todas as conexões</option>{Object.entries(kindNames).filter(([id]) => relationships.some(edge => edge.from === church.id && edge.kind === id)).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select><span>{edges.length} {edges.length === 1 ? "ramo documentado" : "ramos documentados"}</span></div>
      <div className="history-network-board" style={{ "--history-board-height": `${height}px` } as React.CSSProperties}>
        <svg className="history-network-lines" viewBox={`0 0 1000 ${height}`} preserveAspectRatio="none" aria-hidden="true">{edges.map((edge, index) => {const y = height * (index + .5) / edges.length;return <g key={edge.to} data-history-edge={`${edge.from}:${edge.to}`} data-kind={edge.kind}><path d={`M 320 ${height / 2} C 505 ${height / 2}, 505 ${y}, 680 ${y}`} /><rect x="405" y={(height / 2 + y) / 2 - 16} width="190" height="32" rx="16" /><text x="500" y={(height / 2 + y) / 2 + 5} textAnchor="middle">{edge.label}</text></g>;})}</svg>
        <div className="history-network-root"><span className="history-node-seal" aria-hidden="true">{initials(church.shortName)}</span><p>{church.family}</p><h3>{church.name}</h3><span className="history-node-date">Brasil · {church.year}</span><Link href={`/igrejas/${church.id}`}>Ler a história completa ↗</Link></div>
        <div className="history-network-people">{edges.map(edge => {const item = people.find(person => person.id === edge.to)!;return <button type="button" data-person-id={item.id} data-relationship-kind={edge.kind} key={item.id} aria-pressed={selectedPerson === item.id} aria-controls="history-connection-detail" onClick={() => setSelectedPerson(item.id)}><span className="history-person-initials" aria-hidden="true">{initials(item.name)}</span><span><small>{edge.label}</small><strong>{item.name}</strong><span>{item.role}</span></span><span className="history-open-mark" aria-hidden="true">↗</span></button>;})}</div>
      </div>
      <div id="history-connection-detail" className="history-connection-detail" aria-live="polite">{person && selectedEdge ? <><div><p className="history-eyebrow">{kindNames[selectedEdge.kind]} · {person.period}</p><h3>{person.name}</h3><p>{person.summary}</p><p>{person.contribution}</p><div className="history-connection-proof"><strong>Por que estes dois pontos estão ligados?</strong><p>{selectedEdge.explanation}</p><small>Origem: {sourcesFor(selectedEdge.sourceIds).map(source => source.publisher).join("; ")}</small></div><Link className="history-detail-link" href={`/igrejas/${person.id}`}>Abrir biografia e fontes ↗</Link></div><button className="history-reset-selection" type="button" onClick={() => setSelectedPerson(null)}>Voltar à comunidade</button></> : <ChurchPreview church={church} />}</div>
      <HistoryPhotoGallery entityId={selectedPerson || church.id} compact />
      <details className="history-text-connections"><summary>Ver as mesmas conexões em lista</summary><ul>{edges.map(edge => {const item = people.find(person => person.id === edge.to)!;return <li key={edge.to}><Link href={`/igrejas/${item.id}`}>{item.name}</Link><strong>{edge.label}</strong><p>{edge.explanation}</p></li>;})}</ul></details>
    </> : <ol className="history-timeline">{church.events.map((event, index) => <li key={`${event.year}-${index}`}><span>{event.year}</span><div><h3>{event.title}</h3><p>{event.text}</p><small>{sourcesFor(event.sourceIds).map(source => source.publisher).join("; ")}</small></div></li>)}</ol>}
    <div className="history-exploration-next"><div><p className="history-eyebrow">PARA ESTUDAR COM CONTEXTO</p><h3>A história continua com a Bíblia aberta.</h3><p>Compare a vida das primeiras comunidades com os diferentes caminhos da história cristã.</p></div><Link href="/biblia?livro=ACT&capitulo=2&versiculo=42">Ler Atos 2:42–47 ↗</Link></div>
  </section>;
}
