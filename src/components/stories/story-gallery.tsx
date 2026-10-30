import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpenText, Compass, PlayCircle } from "@phosphor-icons/react/ssr";
import { biblicalStories } from "@/content/stories";
import { StorySymbol } from "./story-art";
import "./stories.css";

export function StoryGallery() {
  return <div className="stories-page">
    <header className="stories-intro">
      <div><p className="stories-eyebrow"><PlayCircle size={19} aria-hidden="true" /> A PALAVRA GANHA CENAS</p><h1>Histórias para ver.<br /><em>Uma Palavra para viver.</em></h1><p>Acompanhe os acontecimentos, perceba suas conexões e volte ao texto com novos olhos. Cada história tem quatro cenas, contexto e um convite para pensar.</p><div className="stories-intro-links"><Link href="/meu-percurso"><Compass size={19} aria-hidden="true" /> Ver o caminho completo</Link><Link href="/biblia"><BookOpenText size={19} aria-hidden="true" /> Ler na Bíblia</Link></div></div>
      <div className="stories-intro-art" aria-hidden="true"><Image src="/visuals/story-rute.png" alt="" fill quality={100} sizes="(max-width:760px) 100vw, 40vw" priority /><div /><span><StorySymbol kind="road" /><small>MEMÓRIA · ENCONTRO · ESPERANÇA</small></span></div>
    </header>
    <div className="stories-reading-note"><BookOpenText size={22} aria-hidden="true" /><p><strong>O texto bíblico é o nosso ponto de encontro.</strong> As cenas são sínteses autorais, não transcrições. As imagens são ilustrações artísticas; cada passagem pode ser aberta e conferida na Bíblia.</p></div>
    <section aria-labelledby="stories-collection-title"><header className="stories-section-heading"><div><p className="stories-eyebrow">DAS ORIGENS ÀS PRIMEIRAS COMUNIDADES</p><h2 id="stories-collection-title">Um fio que une as histórias.</h2></div><span>15 histórias · 60 cenas</span></header>
      <ol className="stories-grid">{biblicalStories.map((story,index)=><li key={story.id}><Link className={`story-card story-art-${story.art}`} href={`/historias/${story.id}`} prefetch={false}><div className="story-card-cover"><Image src={story.image || `/visuals/stories-${story.art}.png`} alt="" fill quality={100} sizes="(max-width:600px) 90vw, (max-width:1100px) 45vw, 28vw" /><div className="story-card-shade" /><span className="story-card-number">{String(index+1).padStart(2,"0")}</span><StorySymbol kind={story.symbol} /><span className="story-card-theme">{story.theme}</span></div><div className="story-card-copy"><p>{story.era}</p><h3>{story.title}</h3><span>{story.subtitle}</span><footer><small>4 cenas · leitura acompanhada</small><ArrowRight size={22} aria-hidden="true" /></footer></div></Link></li>)}</ol>
    </section>
    <aside className="stories-continuity"><div><p className="stories-eyebrow">DEPOIS DA ÚLTIMA CENA</p><h2>A história continua em comunidade.</h2><p>Conheça como as igrejas se desenvolveram, cruzaram fronteiras e chegaram ao Brasil. Datas, pessoas e relações são apresentadas com fontes históricas.</p></div><Link href="/igrejas">Explorar as conexões <ArrowRight size={21} aria-hidden="true" /></Link></aside>
  </div>;
}
