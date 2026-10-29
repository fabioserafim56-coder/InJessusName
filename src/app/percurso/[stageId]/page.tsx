import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpenText, Compass, FilmStrip } from "@phosphor-icons/react/ssr";
import { AppShell } from "@/components/app-shell";
import { CurriculumCheck } from "@/components/curriculum-check";
import { curriculumStages, getCurriculumStage, scriptureLink } from "@/content/curriculum";
import { getBibleChapter } from "@/lib/bible";
import "@/components/journey-map.css";

export function generateStaticParams() { return curriculumStages.map(stage => ({ stageId: stage.id })); }
export async function generateMetadata({ params }: { params: Promise<{ stageId: string }> }): Promise<Metadata> {
  const stage = getCurriculumStage((await params).stageId);
  return { title: stage ? `${stage.title} — InJessusName` : "Etapa não encontrada", description: stage?.objective };
}
const stories: Record<string, { id: string; title: string }> = {
  "criacao-e-comecos": { id: "criacao", title: "A criação" }, "promessa-e-alianca": { id: "abraao", title: "O chamado de Abraão" }, "exodo-e-libertacao": { id: "exodo", title: "O caminho da libertação" }, "rute-e-acolhimento": { id: "rute", title: "Rute e Noemi" }, "samuel-e-davi": { id: "davi", title: "Davi" }, "profetas-e-esperanca": { id: "daniel", title: "Daniel" }, "chegada-de-jesus": { id: "nascimento-de-jesus", title: "O nascimento de Jesus" }, "jesus-e-seu-reino": { id: "bom-samaritano", title: "O bom samaritano" }, "cruz-e-entrega": { id: "cruz-e-ressurreicao", title: "A cruz e a ressurreição" }, "ressurreicao-e-missao": { id: "cruz-e-ressurreicao", title: "A cruz e a ressurreição" }, "pentecostes-e-comunidade": { id: "pentecostes", title: "Pentecostes" }
};
export default async function CurriculumStagePage({ params }: { params: Promise<{ stageId: string }> }) {
  const stage = getCurriculumStage((await params).stageId);
  if (!stage) notFound();
  const previous = curriculumStages[stage.number - 2];
  const next = curriculumStages[stage.number];
  const story = stories[stage.id];
  return <AppShell active="profile" title="Meu percurso" subtitle={`Etapa ${stage.number} de ${curriculumStages.length} · ${stage.era}`}><article className="curriculum-reading" data-curriculum-stage data-stage-id={stage.id}>
    <Link className="cr-back" href={`/meu-percurso?etapa=${stage.id}#journey-map-title`}><ArrowLeft size={19} aria-hidden="true" /> Voltar ao mapa</Link>
    <header className="cr-header"><div className="cr-stage-seal" aria-hidden="true"><span>ETAPA</span><strong>{String(stage.number).padStart(2,"0")}</strong><BookOpenText size={28} /></div><div><p className="cr-eyebrow">{stage.era}</p><h1>{stage.title}</h1><p className="cr-subtitle">{stage.subtitle}</p></div></header>
    <div className="cr-objective"><Compass size={25} aria-hidden="true" /><p><strong>Neste encontro, vamos aprender a:</strong> {stage.objective}</p></div>
    <section className="cr-context"><p className="cr-eyebrow">ANTES DE ABRIR A PASSAGEM</p><h2>Onde estamos na história?</h2><p>{stage.context}</p>{previous && <p className="cr-previous"><strong>De onde viemos:</strong> na etapa anterior, estudamos <Link href={`/percurso/${previous.id}`} prefetch={false}>{previous.title.toLocaleLowerCase("pt-BR")}</Link>.</p>}</section>
    <section className="cr-passages" id="cr-passages" aria-labelledby="cr-passages-title"><div className="cr-section-heading"><div><p className="cr-eyebrow">A BÍBLIA ABERTA AO NOSSO LADO</p><h2 id="cr-passages-title">Leia, observe e confira.</h2></div><BookOpenText size={31} aria-hidden="true" /></div><p>Comece pelos trechos abaixo. Os versículos são da Bíblia Livre; os links abrem o capítulo completo para você acompanhar o contexto.</p><div className="cr-scripture-grid">{stage.passages.map(passage => { const chapter = getBibleChapter(passage.book, passage.chapter); const verse = chapter?.verses.find(item => item.number === passage.verse); return <article key={passage.label}><h3>{passage.label}</h3>{verse && <blockquote><sup>{verse.number}</sup> {verse.text}</blockquote>}<Link href={scriptureLink(passage)} prefetch={false}>Ler a passagem no capítulo <ArrowRight size={17} aria-hidden="true" /></Link></article>; })}</div><p className="cr-source">Bíblia Livre · TR 2018 · Diego Santos, Mario Sérgio e Marco Teles · <a href="https://creativecommons.org/licenses/by/3.0/br/" target="_blank" rel="noreferrer">CC BY 3.0 BR</a>. Explicações e exemplos: sínteses autorais do aplicativo.</p></section>
    <section className="cr-book-guides" aria-label="Aprofundar nos livros desta etapa"><BookOpenText size={22} aria-hidden="true" /><div><strong>Conheça os livros desta parada</strong><p>Abra um guia para situar o livro inteiro e continuar a leitura.</p><div>{stage.books.map(book => <Link key={book} href={`/biblioteca/${book}`} prefetch={false}>{getBibleChapter(book, 1)?.book.name || book}<ArrowRight size={15} aria-hidden="true" /></Link>)}</div></div></section>
    <section className="cr-teaching" aria-labelledby="cr-teaching-title"><p className="cr-eyebrow">CAMINHEMOS UM POUCO MAIS</p><h2 id="cr-teaching-title">Três descobertas para levar consigo.</h2>{stage.teaching.map((item, index) => <article key={item.title}><span className="cr-teaching-number" aria-hidden="true">0{index + 1}</span><div><h3>{item.title}</h3><p>{item.text}</p><aside><strong>Na vida de cada dia</strong><p>{item.example}</p></aside></div></article>)}</section>
    <CurriculumCheck key={stage.id} question={stage.question} stageNumber={stage.number} stageId={stage.id} nextStage={next ? { id: next.id, title: next.title } : undefined} />
    {story && <Link className="cr-story-link" href={`/historias/${story.id}`} prefetch={false}><FilmStrip size={29} aria-hidden="true" /><span><small>UMA COMPANHIA VISUAL PARA ESTA LEITURA</small><strong>Explore a história: {story.title}</strong></span><ArrowRight size={23} aria-hidden="true" /></Link>}
    <section className="cr-connection"><p className="cr-eyebrow">POR QUE A PRÓXIMA ETAPA VEM AGORA?</p><h2>Uma história se liga à outra.</h2><p>{stage.connection}</p><nav aria-label="Continuar o percurso bíblico">{previous && <Link className="cr-previous-link" href={`/percurso/${previous.id}`} prefetch={false}><ArrowLeft size={20} aria-hidden="true" /><span><small>Etapa anterior</small>{previous.title}</span></Link>}{next ? <Link className="cr-next-link" href={`/percurso/${next.id}`} prefetch={false}><span><small>Próxima etapa · {next.number} de {curriculumStages.length}</small>{next.title}</span><ArrowRight size={23} aria-hidden="true" /></Link> : <Link className="cr-next-link" href="/igrejas" prefetch={false}><span><small>Continue investigando</small>Conhecer a história das igrejas</span><ArrowRight size={23} aria-hidden="true" /></Link>}</nav></section>
    <footer className="cr-editorial-note">Este percurso oferece um panorama introdutório conectado dos 66 livros desta edição. Não substitui comentário de todos os capítulos, formação teológica completa ou acompanhamento pastoral. Sínteses e exemplos aguardam revisão humana especializada; perspectivas cristãs podem divergir em pontos de interpretação.</footer>
  </article></AppShell>;
}
