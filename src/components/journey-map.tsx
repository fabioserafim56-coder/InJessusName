import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight, BookOpenText, Church, Compass, FilmStrip, MapTrifold } from "@phosphor-icons/react/ssr";
import { curriculumStages } from "@/content/curriculum";
import { JourneySessionSummary, JourneyStageLink } from "./journey-session";
import { FaithWorld } from "./faith-world/faith-world";
import "./journey-map.css";

const positions = curriculumStages.map((_, index) => ({ x: [150, 450, 750][Math.floor(index / 3) % 2 ? 2 - index % 3 : index % 3], y: Math.floor(index / 3) * 216 + 52 }));
const trail = positions.reduce((path, position, index) => {
  if (!index) return `M ${position.x} ${position.y}`;
  const previous = positions[index - 1];
  if (position.y === previous.y) return `${path} L ${position.x} ${position.y}`;
  const bend = previous.x > 450 ? 885 : 15;
  return `${path} C ${bend} ${previous.y}, ${bend} ${position.y}, ${position.x} ${position.y}`;
}, "");

export function JourneyMap({ currentStageId }: { currentStageId?: string }) {
  return <section className="journey-map" data-journey-map aria-labelledby="journey-map-title">
    <FaithWorld stages={curriculumStages.map(stage => ({ id: stage.id, number: stage.number, title: stage.title, era: stage.era, objective: stage.objective }))} currentStageId={currentStageId} />
    <header className="jm-heading"><div><p className="jm-eyebrow"><MapTrifold size={19} aria-hidden="true" /> UM CAMINHO COM SENTIDO</p><h2 id="journey-map-title">Da criação à esperança que permanece.</h2><p>Cada parada prepara a próxima. Abra uma etapa, leia a passagem em seu contexto e experimente explicar o que compreendeu.</p></div><div className="jm-key"><span><strong>24</strong> etapas de leitura</span><span><strong>66</strong> livros no índice</span></div></header>
    <p className="jm-exploration-note"><Compass size={19} aria-hidden="true" /> Este é o mapa do conteúdo disponível. A ordem conecta as leituras; você pode explorar qualquer parada. As práticas não são uma avaliação da sua fé.</p>
    <JourneySessionSummary total={curriculumStages.length} />
    <div className="jm-ground"><svg className="jm-trail" viewBox="0 0 900 1728" preserveAspectRatio="none" aria-hidden="true"><path className="jm-trail-shadow" d={trail} /><path className="jm-trail-stone" d={trail} /><path className="jm-trail-center" d={trail} /></svg><ol className="jm-stages">{curriculumStages.map((stage, index) => <li key={stage.id} style={{ "--jm-column": Math.floor(index / 3) % 2 ? 3 - index % 3 : index % 3 + 1, "--jm-row": Math.floor(index / 3) + 1 } as CSSProperties}><JourneyStageLink stageId={stage.id} currentStageId={currentStageId}><span className="jm-stone"><span>{String(stage.number).padStart(2, "0")}</span><BookOpenText size={23} aria-hidden="true" /></span><span className="jm-stage-copy"><small>{stage.era}</small><strong>{stage.title}</strong><span>{stage.books.length === 1 ? "Leitura e descoberta" : `${stage.books.length} livros em conexão`} <ArrowRight size={15} aria-hidden="true" /></span></span></JourneyStageLink></li>)}</ol></div>
    <div className="jm-continuations"><Link href="/historias"><FilmStrip size={25} aria-hidden="true" /><span><strong>Veja as histórias ganharem forma</strong><small>Uma companhia visual para a leitura, com as passagens ao lado.</small></span><ArrowRight size={21} aria-hidden="true" /></Link><Link href="/igrejas"><Church size={25} aria-hidden="true" /><span><strong>Das primeiras comunidades aos nossos dias</strong><small>Investigue igrejas, pessoas e conexões históricas, inclusive no Brasil.</small></span><ArrowRight size={21} aria-hidden="true" /></Link></div>
    <details className="jm-library"><summary><BookOpenText size={23} aria-hidden="true" /><span>Encontre os 66 livros neste caminho</span><span className="jm-summary-symbol" aria-hidden="true">+</span></summary><p>O índice corresponde à edição protestante Bíblia Livre disponível no leitor. Tradições católica e ortodoxas têm cânones distintos; seus livros adicionais ainda não integram esta edição. Os agrupamentos abaixo são pedagógicos e não pretendem datar todos os livros. Toque no nome de um livro para abrir seu guia e chegar ao texto bíblico.</p><div data-book-index className="jm-book-index">{curriculumStages.filter(stage => ![2, 15, 16, 18].includes(stage.number)).map(stage => <section key={stage.id}><h3><Link href={`/percurso/${stage.id}`} prefetch={false}>{stage.title}</Link></h3><div>{stage.books.map(book => <Link key={book} href={`/biblioteca/${book}`} data-book-id={book} prefetch={false}>{bookNames[book] || book}</Link>)}</div></section>)}</div></details>
  </section>;
}

const bookNames: Record<string, string> = { GEN:"Gênesis",EXO:"Êxodo",LEV:"Levítico",NUM:"Números",DEU:"Deuteronômio",JOS:"Josué",JDG:"Juízes",RUT:"Rute","1SA":"1 Samuel","2SA":"2 Samuel","1KI":"1 Reis","2KI":"2 Reis","1CH":"1 Crônicas","2CH":"2 Crônicas",EZR:"Esdras",NEH:"Neemias",EST:"Ester",JOB:"Jó",PSA:"Salmos",PRO:"Provérbios",ECC:"Eclesiastes",SNG:"Cântico dos Cânticos",ISA:"Isaías",JER:"Jeremias",LAM:"Lamentações",EZK:"Ezequiel",DAN:"Daniel",HOS:"Oseias",JOL:"Joel",AMO:"Amós",OBA:"Obadias",JON:"Jonas",MIC:"Miqueias",NAM:"Naum",HAB:"Habacuque",ZEP:"Sofonias",HAG:"Ageu",ZEC:"Zacarias",MAL:"Malaquias",MAT:"Mateus",MRK:"Marcos",LUK:"Lucas",JHN:"João",ACT:"Atos",ROM:"Romanos","1CO":"1 Coríntios","2CO":"2 Coríntios",GAL:"Gálatas",EPH:"Efésios",PHP:"Filipenses",COL:"Colossenses","1TH":"1 Tessalonicenses","2TH":"2 Tessalonicenses","1TI":"1 Timóteo","2TI":"2 Timóteo",TIT:"Tito",PHM:"Filemom",HEB:"Hebreus",JAS:"Tiago","1PE":"1 Pedro","2PE":"2 Pedro","1JN":"1 João","2JN":"2 João","3JN":"3 João",JUD:"Judas",REV:"Apocalipse" };
