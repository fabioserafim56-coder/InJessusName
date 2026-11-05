"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { ArrowRight, ArrowUpRight, ClockCounterClockwise, Graph, Images, MagnifyingGlass } from "@phosphor-icons/react/ssr";
import { HistoryPhotoGallery } from "./history-photos";
import { churches, people, relationships, sourcesFor, type ChurchHistory, type HistoricalRelationship } from "@/content/church-history";
import { getHistoryCover, getHistoryPhotoViewer, getHistoryPhotos } from "@/content/church-history/photos";

const normalized = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
const familyNames = [...new Set(churches.map(church => church.family))];
const kindNames: Record<HistoricalRelationship["kind"], string> = { missao: "Missão", fundacao: "Fundação", musica: "Música", educacao: "Educação", reforma: "Tradição e Reforma", trajetoria: "Mudança de trajetória" };
const initials = (name: string) => name.split(" ").filter(part => !["de", "da", "do"].includes(part)).slice(0, 2).map(part => part[0]).join("");

function NodePortrait({ entityId, name }: { entityId: string; name: string }) {
  const photo = getHistoryCover(entityId);
  const resource = photo ? getHistoryPhotoViewer(photo, 720) : null;
  return <span className={`history-node-portrait${photo ? " has-photo" : ""}`} aria-hidden="true">{resource ? <Image src={resource.src} width={resource.width} height={resource.height} unoptimized alt="" /> : initials(name)}</span>;
}

function ChurchPreview({ church }: { church: ChurchHistory }) {
  return <div className="history-church-preview"><p className="history-eyebrow">MARCO NO BRASIL · {church.year}</p><h3>{church.name}</h3><p>{church.summary}</p><dl><div><dt>De onde veio</dt><dd>{church.origin}</dd></div><div><dt>Como chegou</dt><dd>{church.brazil}</dd></div></dl><Link className="history-detail-link" href={`/igrejas/${church.id}`}>Abrir história, doutrina e linha do tempo <ArrowRight size={19} aria-hidden="true" /></Link></div>;
}

export function HistoryExplorer() {
  const [selectedChurch, setSelectedChurch] = useState("assembleias");
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState("");
  const [kind, setKind] = useState("");
  const [view, setView] = useState<"network" | "timeline" | "photos">("network");
  const church = churches.find(item => item.id === selectedChurch)!;
  const filteredChurches = churches.filter(item => {
    const connectedNames = relationships.filter(edge => edge.from === item.id).map(edge => people.find(person => person.id === edge.to)?.name ?? "").join(" ");
    return (!family || item.family === family) && normalized(`${item.name} ${item.family} ${item.origin} ${connectedNames}`).includes(normalized(query.trim()));
  });
  const edges = relationships.filter(edge => edge.from === church.id && (!kind || edge.kind === kind));
  const person = people.find(item => item.id === selectedPerson);
  const selectedEdge = edges.find(edge => edge.to === selectedPerson);
  const photos = getHistoryPhotos(church.id);
  const height = Math.max(570, edges.length * 142);
  const boardPhotos = [church.id, ...edges.map(edge => edge.to)].flatMap(entityId => { const photo = getHistoryCover(entityId); return photo ? [photo] : []; });
  function selectChurch(id: string) { setSelectedChurch(id); setSelectedPerson(null); setKind(""); }

  return <section className="history-explorer" aria-label="Rede de conexões históricas">
    <div className="history-explorer-toolbar"><div><label htmlFor="history-search"><MagnifyingGlass size={18} aria-hidden="true" />Pesquisar igrejas e personalidades</label><input id="history-search" type="search" placeholder="Ex.: Frida, batista, Inglaterra…" value={query} onChange={event => setQuery(event.target.value)} /></div><div><label htmlFor="history-family">Filtrar por tradição</label><select id="history-family" value={family} onChange={event => setFamily(event.target.value)}><option value="">Todas as tradições</option>{familyNames.map(name => <option key={name}>{name}</option>)}</select></div></div>
    <div className="history-collection-heading"><p role="status">{filteredChurches.length} {filteredChurches.length === 1 ? "trajetória encontrada" : "trajetórias encontradas"}</p><p>Escolha uma comunidade. Depois, siga os fios.</p></div>
    <div className="history-church-picker" aria-label="Escolher uma história">{filteredChurches.map(item => <button key={item.id} type="button" data-church-id={item.id} aria-pressed={item.id === church.id} onClick={() => selectChurch(item.id)}><span>{item.year}</span><strong>{item.shortName}</strong><small>{item.family}</small><span className="history-picker-arrow" aria-hidden="true"><ArrowUpRight size={18} /></span></button>)}</div>
    {filteredChurches.length === 0 && <div className="history-empty"><h3>Vamos procurar por outro caminho?</h3><p>Este acervo inicial ainda não reúne todas as igrejas e personalidades. Tente um sobrenome, uma tradição ou um país.</p><button type="button" onClick={() => {setQuery("");setFamily("");}}>Limpar a pesquisa</button></div>}
    <div className="history-board-header"><div><p className="history-eyebrow">SEU QUADRO DE INVESTIGAÇÃO</p><h2>{church.shortName}</h2></div><div className="history-view-switch" role="group" aria-label="Como explorar a história"><button type="button" aria-pressed={view === "network"} onClick={() => setView("network")}><Graph size={19} aria-hidden="true" />Rede de conexões</button><button type="button" aria-pressed={view === "timeline"} onClick={() => setView("timeline")}><ClockCounterClockwise size={19} aria-hidden="true" />Linha do tempo</button><button type="button" aria-pressed={view === "photos"} onClick={() => setView("photos")}><Images size={19} aria-hidden="true" />Fotografias</button></div></div>
    <p className="history-board-note">Cada ramo descreve uma relação específica. Uma ligação de música ou influência teológica não significa fundação, parentesco ou autoridade sobre a igreja.</p>
    {view === "network" && <>
      <div className="history-network-tools"><label htmlFor="history-kind">Tipo de conexão</label><select id="history-kind" value={kind} onChange={event => {setKind(event.target.value);setSelectedPerson(null);}}><option value="">Todas as conexões</option>{Object.entries(kindNames).filter(([id]) => relationships.some(edge => edge.from === church.id && edge.kind === id)).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select><span>{edges.length} {edges.length === 1 ? "ramo documentado" : "ramos documentados"}</span></div>
      <div className="history-network-board" style={{ "--history-board-height": `${height}px` } as CSSProperties}>
        <span className="history-board-coordinate" aria-hidden="true">ACERVO · {String(churches.indexOf(church) + 1).padStart(2, "0")} / {churches.length}</span>
        <svg className="history-network-lines" viewBox={`0 0 1000 ${height}`} preserveAspectRatio="none" aria-hidden="true">{edges.map((edge, index) => {const y = height * (index + .5) / edges.length;return <g key={edge.to} data-history-edge={`${edge.from}:${edge.to}`} data-kind={edge.kind} data-selected={selectedPerson === edge.to}><path d={`M 320 ${height / 2} C 505 ${height / 2}, 505 ${y}, 680 ${y}`} /><rect x="408" y={(height / 2 + y) / 2 - 16} width="184" height="32" rx="16" /><text x="500" y={(height / 2 + y) / 2 + 5} textAnchor="middle">{edge.label}</text></g>;})}</svg>
        <div className="history-network-root"><NodePortrait entityId={church.id} name={church.shortName} /><p>{church.family}</p><h3>{church.name}</h3><span className="history-node-date">Brasil · {church.year}</span><Link href={`/igrejas/${church.id}`}>Ler a história completa ↗</Link></div>
        <div className="history-network-people">{edges.map(edge => {const item = people.find(person => person.id === edge.to)!;return <button type="button" data-person-id={item.id} data-relationship-kind={edge.kind} key={item.id} aria-pressed={selectedPerson === item.id} aria-controls="history-connection-detail" onClick={() => setSelectedPerson(item.id)}><NodePortrait entityId={item.id} name={item.name} /><span><small>{edge.label}</small><strong>{item.name}</strong><span>{item.role}</span></span><span className="history-open-mark" aria-hidden="true"><ArrowUpRight size={18} /></span></button>;})}</div>
      </div>
      {boardPhotos.length > 0 && <details className="history-board-credits"><summary>Fotografias do quadro: autoria e direitos</summary><p>Os cartões mostram recortes de exibição. Os arquivos preservados e as imagens ampliadas mantêm suas proporções.</p><ul>{boardPhotos.map(photo => <li key={photo.id}><strong>{photo.title}</strong><span>{photo.creator} · {photo.dateLabel}</span><a href={photo.licenseUrl} target="_blank" rel="noreferrer">{photo.license === "Public domain" ? "Domínio público" : photo.license} ↗</a><a href={photo.sourceUrl} target="_blank" rel="noreferrer">Consultar o registro no acervo ↗</a></li>)}</ul></details>}
      <div className={`history-investigation-detail${getHistoryPhotos(selectedPerson || church.id).length ? " has-photo" : ""}`}>
        <div id="history-connection-detail" className="history-connection-detail" aria-live="polite">{person && selectedEdge ? <><div><p className="history-eyebrow">{kindNames[selectedEdge.kind]} · {person.period}</p><h3>{person.name}</h3><p>{person.summary}</p><p>{person.contribution}</p><div className="history-connection-proof"><strong>Por que estes dois pontos estão ligados?</strong><p>{selectedEdge.explanation}</p><details><summary>Conferir as fontes desta conexão</summary><ul>{sourcesFor(selectedEdge.sourceIds).map(source => <li key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{source.publisher} ↗</a></li>)}</ul></details></div><Link className="history-detail-link" href={`/igrejas/${person.id}`}>Abrir biografia e fontes ↗</Link></div><button className="history-reset-selection" type="button" onClick={() => setSelectedPerson(null)}>Voltar à comunidade</button></> : <ChurchPreview church={church} />}</div>
        <HistoryPhotoGallery entityId={selectedPerson || church.id} compact />
      </div>
      <details className="history-text-connections"><summary>Ver as mesmas conexões em lista</summary><ul>{edges.map(edge => {const item = people.find(person => person.id === edge.to)!;return <li key={edge.to}><Link href={`/igrejas/${item.id}`}>{item.name}</Link><strong>{edge.label}</strong><p>{edge.explanation}</p></li>;})}</ul></details>
    </>}
    {view === "timeline" && <section className="history-timeline-room" aria-label={`Linha do tempo: ${church.name}`}><div className="history-timeline-intro"><p className="history-eyebrow">ORIGEM · CHEGADA · DESENVOLVIMENTO</p><h3>Uma data abre uma história.</h3><p>Missão, primeira comunidade e organização institucional podem acontecer em momentos diferentes. Acompanhe o contexto de cada marco.</p><Link href={`/igrejas/${church.id}`}>Abrir a ficha completa <ArrowRight size={18} aria-hidden="true" /></Link></div><ol className="history-timeline">{church.events.map((event, index) => <li key={`${event.year}-${index}`}><span>{event.year}</span><div><h3>{event.title}</h3><p>{event.text}</p><details><summary>Fontes deste marco</summary><ul>{sourcesFor(event.sourceIds).map(source => <li key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{source.publisher} ↗</a></li>)}</ul></details></div></li>)}</ol></section>}
    {view === "photos" && <section className="history-archive-room" aria-label={`Acervo visual: ${church.name}`}><p className="history-eyebrow">UM ENCONTRO COM REGISTROS REAIS</p>{church.id === "quadrangular" ? <><h3>O mesmo templo. Dois momentos.</h3><p>Por volta de 1923, Aimee prega no interior do Angelus Temple. Em 2014, outra fotografia registra sua fachada. São momentos e enquadramentos diferentes do mesmo lugar, com as datas e os acervos para conferir.</p></> : <><h3>Olhe com tempo. Cada imagem tem uma história.</h3><p>Fotografias, documentos e retratos são registros com autoria e data próprias. Toque em uma imagem para ampliá-la e leia a legenda antes de relacioná-la a um acontecimento.</p></>}{photos.length ? <HistoryPhotoGallery entityId={church.id} /> : <div className="history-archive-empty"><Images size={37} aria-hidden="true" /><h4>Esta trajetória aguarda um registro com origem conferida.</h4><p>A história e suas fontes já podem ser consultadas. O acervo visual cresce quando encontramos imagens com contexto e direitos identificados.</p><Link href={`/igrejas/${church.id}`}>Conhecer os documentos da história ↗</Link></div>}</section>}
    <div className="history-exploration-next"><div><p className="history-eyebrow">PARA ESTUDAR COM CONTEXTO</p><h3>A história continua com a Bíblia aberta.</h3><p>Compare a vida das primeiras comunidades com os diferentes caminhos da história cristã. As fichas históricas usam fontes documentais; o texto bíblico tem seu próprio contexto.</p></div><Link href="/biblia?livro=ACT&capitulo=2&versiculo=42">Ler Atos 2:42–47 ↗</Link></div>
  </section>;
}
