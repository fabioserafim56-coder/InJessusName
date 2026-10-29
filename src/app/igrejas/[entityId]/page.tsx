import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { HistorySourceNotes } from "@/components/church-history/source-notes";
import { churches, people, getChurch, getPerson, getConnections, sourcesFor } from "@/content/church-history";
import "@/components/church-history/history.css";

export function generateStaticParams() { return [...churches, ...people].map(entity => ({ entityId: entity.id })); }
export async function generateMetadata({ params }: { params: Promise<{ entityId: string }> }): Promise<Metadata> {
  const { entityId } = await params;
  const entity = getChurch(entityId) ?? getPerson(entityId);
  return { title: `${entity?.name ?? "História cristã"} — InJessusName`, description: entity?.summary };
}
export default async function HistoryEntityPage({ params }: { params: Promise<{ entityId: string }> }) {
  const { entityId } = await params;
  const church = getChurch(entityId);
  const person = getPerson(entityId);
  if (!church && !person) notFound();
  const entity = church ?? person!;
  const connections = getConnections(entityId);
  const allSources = [...new Set([...entity.sourceIds, ...(church?.events.flatMap(event => event.sourceIds) ?? []), ...connections.flatMap(edge => edge.sourceIds)])];
  return <AppShell active="churches" title="Igrejas e personalidades" subtitle="Uma ficha para ler, relacionar e conferir"><article className="history-page history-detail-page">
    <Link className="history-back-link" href="/igrejas">← Voltar à rede de conexões</Link>
    <header className="history-detail-hero"><p className="history-eyebrow">{church ? `${church.family} · MARCO NO BRASIL: ${church.year}` : person!.role}</p><h1>{entity.name}</h1><p>{entity.summary}</p>{person && <span className="history-detail-period">{person.period}</span>}</header>
    {church ? <>
      <div className="history-fact-grid"><section><p className="history-eyebrow">01 · ORIGEM</p><h2>De onde veio?</h2><p>{church.origin}</p></section><section><p className="history-eyebrow">02 · BRASIL</p><h2>Quando e onde chegou?</h2><p>{church.brazil}</p></section><section><p className="history-eyebrow">03 · PESSOAS</p><h2>Quem participou do começo?</h2><p>{church.founders}</p></section><section><p className="history-eyebrow">04 · MISSÃO</p><h2>Por que se organizou?</h2><p>{church.purpose}</p></section></div>
      <section className="history-belief-note"><p className="history-eyebrow">ENSINO NA PERSPECTIVA DESTA TRADIÇÃO</p><h2>Como essa comunidade expressa sua fé?</h2><p>{church.teaching}</p><p className="history-detail-small">Uma síntese não substitui a leitura dos documentos confessionais. Os Dez Mandamentos de Êxodo 20 e Deuteronômio 5 são textos bíblicos; normas de uma instituição são outra categoria, e a numeração dos mandamentos varia entre tradições.</p><Link href="/biblia?livro=EXO&capitulo=20">Ler Êxodo 20 no contexto ↗</Link></section>
      <section className="history-detail-timeline" aria-labelledby="history-timeline-title"><p className="history-eyebrow">DATAS QUE NÃO DEVEM SER CONFUNDIDAS</p><h2 id="history-timeline-title">Como a história se desenvolveu.</h2><ol className="history-timeline">{church.events.map((event, index) => <li key={`${event.year}-${index}`}><span>{event.year}</span><div><h3>{event.title}</h3><p>{event.text}</p><small>{sourcesFor(event.sourceIds).map(source => source.publisher).join("; ")}</small></div></li>)}</ol></section>
      <aside className="history-curiosity"><p className="history-eyebrow">UM DETALHE PARA OLHAR DE NOVO</p><h2>A história fica mais clara de perto.</h2><p>{church.curiosity}</p></aside>
      <section className="history-context"><h2>Contexto para uma leitura cuidadosa.</h2><p>{church.context}</p></section>
    </> : <><div className="history-person-detail-facts"><strong>Origem e caminhos</strong><p>{person!.origin}</p></div><section className="history-person-contribution"><p className="history-eyebrow">PRESENÇA NESTA HISTÓRIA</p><h2>O que essa trajetória ajuda a compreender?</h2><p>{person!.contribution}</p><p>As relações abaixo descrevem uma atuação documentada. Não constituem endosso pessoal, uma biografia completa ou uma lista de cargos atuais.</p></section></>}
    <section className="history-related" aria-labelledby="history-related-title"><p className="history-eyebrow">CONTINUE SEGUINDO OS FIOS</p><h2 id="history-related-title">Conexões desta ficha.</h2><ul>{connections.map(edge => {const otherId = edge.from === entityId ? edge.to : edge.from;const other = getChurch(otherId) ?? getPerson(otherId)!;return <li key={`${edge.from}:${edge.to}`}><span>{edge.label}</span><h3><Link href={`/igrejas/${other.id}`}>{other.name} ↗</Link></h3><p>{edge.explanation}</p></li>;})}</ul></section>
    <HistorySourceNotes sourceIds={allSources} />
    <div className="history-detail-next"><Link href="/igrejas">Explorar outra trajetória ↗</Link><Link href="/biblia?livro=ACT&capitulo=2&versiculo=42">Conhecer as primeiras comunidades em Atos 2 ↗</Link></div>
  </article></AppShell>;
}
