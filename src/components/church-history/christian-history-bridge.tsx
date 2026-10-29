import Link from "next/link";
import { ArrowDown, ClockCounterClockwise } from "@phosphor-icons/react/ssr";
import { christianHistoryMilestones, christianHistorySources, getChristianHistorySources } from "@/content/christian-history";
import "./christian-history-bridge.css";

export function ChristianHistoryBridge() {
  return <section className="christian-bridge" aria-labelledby="christian-bridge-title" data-christian-history-bridge>
    <header className="cb-heading"><div><p className="cb-eyebrow"><ClockCounterClockwise size={20} aria-hidden="true" /> ANTES DE SEGUIR OS RAMOS</p><h2 id="christian-bridge-title">Das primeiras comunidades aos nossos dias.</h2><p>Entre os relatos de Atos e as igrejas brasileiras há muitos séculos de encontros, debates e transformação. Vamos situar algumas dessas passagens para que as conexões façam sentido.</p></div><a className="cb-skip" href="#history-network-explorer">Ir às conexões brasileiras <ArrowDown size={18} aria-hidden="true" /></a></header>
    <p className="cb-orientation">Estes marcos se sobrepõem em alguns períodos. São portas de entrada para a pesquisa, sem reduzir a história cristã à Europa ou a uma única tradição.</p>
    <ol className="cb-timeline">{christianHistoryMilestones.map((milestone, index) => <li key={milestone.id} data-christian-milestone={milestone.id}>
      <span className="cb-marker" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
      <article><p className="cb-period">{milestone.period}</p><h3>{milestone.title}</h3><p className="cb-summary">{milestone.summary}</p><details className="cb-context"><summary>Entender o contexto e a conexão <span aria-hidden="true">+</span></summary><div><p>{milestone.context}</p><aside><strong>Por que este marco está no caminho?</strong><p>{milestone.connection}</p></aside>{milestone.links.length > 0 && <nav aria-label={`Continuar a partir de ${milestone.title}`}>{milestone.links.map(link => <Link key={link.href} href={link.href} prefetch={false}>{link.label}<span aria-hidden="true"> ↗</span></Link>)}</nav>}<p className="cb-source-label">Fontes para conferir</p><ul className="cb-inline-sources">{getChristianHistorySources(milestone.sourceIds).map(source => <li key={source.id}>{source.url.startsWith("/") ? <Link href={source.url} prefetch={false}>{source.title}</Link> : <a href={source.url} target="_blank" rel="noreferrer">{source.title}</a>}<span>{source.publisher} · {source.kind}</span></li>)}</ul></div></details></article>
    </li>)}</ol>
    <details className="cb-bibliography"><summary>Conhecer as fontes deste panorama</summary><p>As sínteses são autorais. Textos bíblicos, pesquisa histórica, memória institucional e enciclopédia colaborativa são identificados separadamente. As referências foram consultadas em 29/10/2026; o panorama continua sujeito a revisão especializada.</p><ul>{christianHistorySources.map(source => <li key={source.id}>{source.url.startsWith("/") ? <Link href={source.url} prefetch={false}>{source.title}</Link> : <a href={source.url} target="_blank" rel="noreferrer">{source.title}</a>}<span>{source.publisher} · {source.kind}</span></li>)}</ul></details>
  </section>;
}
