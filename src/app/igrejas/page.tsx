import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { HistoryExplorer } from "@/components/church-history/history-explorer";
import { ChristianHistoryBridge } from "@/components/church-history/christian-history-bridge";
import { churches, people, relationships } from "@/content/church-history";
import "@/components/church-history/history.css";

export const metadata: Metadata = { title: "Igrejas e personalidades — InJessusName", description: "Explore origens, chegada ao Brasil, mulheres, missionários e música cristã em uma rede de conexões com fontes identificadas." };
export default function ChurchesPage() {
  return <AppShell active="churches" title="Igrejas e personalidades" subtitle="Raízes, encontros e caminhos da fé"><div className="history-page">
    <header className="history-hero"><div className="history-hero-copy"><p className="history-eyebrow">ATLAS DO CRISTIANISMO NO BRASIL</p><h1>Uma história feita<br /> de encontros.</h1><p>Quem trouxe a Palavra? Por quais caminhos ela viajou? Abra cada conexão para conhecer pessoas, comunidades, canções e decisões que marcaram essa história.</p><div className="history-hero-stats"><span><strong>{churches.length}</strong> trajetórias</span><span><strong>{people.length}</strong> personalidades</span><span><strong>{relationships.length}</strong> conexões explicadas</span></div></div><div className="history-hero-art" aria-hidden="true"><span className="history-art-route" /><span className="history-art-label history-art-label-one">ORIGENS</span><span className="history-art-label history-art-label-two">MISSÕES</span><span className="history-art-label history-art-label-three">BRASIL</span><span className="history-art-dot history-art-dot-one" /><span className="history-art-dot history-art-dot-two" /><span className="history-art-dot history-art-dot-three" /><span className="history-art-compass">N<span>✧</span>S</span><span className="history-art-caption">Conhecer as raízes.<br />Compreender os caminhos.</span></div></header>
    <div className="history-method-note"><strong>Um começo para investigar, com respeito a cada tradição.</strong><p>Este recorte inicial reúne trajetórias representativas, sem ranking de importância. Datas de chegada, primeira comunidade e organização nacional são identificadas separadamente. As fontes acompanham cada ficha.</p></div>
    <details className="history-bridge-disclosure"><summary><span><strong>Como chegamos até aqui?</strong><small>Conheça 12 marcos da história cristã, das primeiras comunidades aos nossos dias.</small></span><span aria-hidden="true">+</span></summary><ChristianHistoryBridge /></details>
    <div id="history-network-explorer" className="history-network-anchor"><HistoryExplorer /></div>
    <section className="history-reading-index" aria-labelledby="history-index-title"><p className="history-eyebrow">ACERVO PARA CONSULTA</p><h2 id="history-index-title">Todas as fichas, no seu ritmo.</h2><details><summary>Igrejas e tradições · {churches.length} fichas</summary><ul>{churches.map(church => <li key={church.id}><Link href={`/igrejas/${church.id}`}>{church.name}<span>Brasil · {church.year} ↗</span></Link></li>)}</ul></details><details><summary>Personalidades · {people.length} fichas</summary><ul>{people.map(person => <li key={person.id}><Link href={`/igrejas/${person.id}`}>{person.name}<span>{person.role} ↗</span></Link></li>)}</ul></details></section>
    <footer className="history-page-footer"><p>História cristã, diversidade de tradições e fontes abertas para conferir. As fichas não representam vínculo institucional ou recomendação de líderes.</p><Link href="/meu-percurso">Voltar ao mapa de estudo ↗</Link></footer>
  </div></AppShell>;
}
