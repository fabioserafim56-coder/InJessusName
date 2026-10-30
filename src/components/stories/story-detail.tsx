import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpenText, Compass } from "@phosphor-icons/react/ssr";
import { biblicalStories, storyBibleUrl, storyStageIds, type BiblicalStory } from "@/content/stories";
import { StorySymbol } from "./story-art";
import { StoryReflection, StoryScenes } from "./story-scenes";
import { StoryArtworkViewer } from "./story-artwork-viewer";
import { getStoryArtwork } from "@/content/stories/artwork";
import "./stories.css";

export function StoryDetail({story}:{story:BiblicalStory}) {
  const index=biblicalStories.findIndex(item=>item.id===story.id);
  const previous=biblicalStories[index-1];const next=biblicalStories[index+1];
  const art = getStoryArtwork(story.image || `/visuals/stories-${story.art}.png`);
  return <div className="stories-page story-detail-page"><Link className="story-back-link" href="/historias"><ArrowLeft size={20} aria-hidden="true" /> Todas as histórias</Link><header className="story-detail-header"><div><p className="stories-eyebrow">HISTÓRIA {String(index+1).padStart(2,"0")} · {story.era}</p><h1>{story.title}</h1><p className="story-detail-subtitle">{story.subtitle}</p><p>{story.introduction}</p></div><div className="story-detail-mark" aria-hidden="true"><StorySymbol kind={story.symbol} /></div></header>
    <StoryScenes story={story}/>
    <section className="story-understanding" aria-label="Contexto e conexões da história"><article><p className="stories-eyebrow">PARA NÃO PERDER O CONTEXTO</p><h2>Onde estamos na Bíblia?</h2><p>{story.context}</p></article><article><p className="stories-eyebrow">UM FIO LIGA AO OUTRO</p><h2>O que esta história prepara?</h2><p>{story.connection}</p></article><article><p className="stories-eyebrow">UM EXEMPLO POSSÍVEL</p><h2>Da leitura para a vida.</h2><p>{story.example}</p></article></section>
    <StoryReflection story={story}/>
    {art && <StoryArtworkViewer {...art} title={story.title} />}
    <aside className="story-reading-invitation"><BookOpenText size={34} aria-hidden="true"/><div><h2>Agora, deixe a própria Palavra conduzir.</h2><p>As cenas ajudam a acompanhar. A leitura completa mostra detalhes e conexões que uma síntese não consegue guardar.</p><Link href={storyBibleUrl(story.nextReading)} prefetch={false}>Continuar em {story.nextReading.label} <ArrowRight size={21} aria-hidden="true"/></Link></div></aside>
    <nav className="story-neighbor-nav" aria-label="Outras histórias">{previous?<Link href={`/historias/${previous.id}`}><ArrowLeft size={23} aria-hidden="true"/><span><small>HISTÓRIA ANTERIOR</small>{previous.title}</span></Link>:<Link href="/meu-percurso"><Compass size={23} aria-hidden="true"/><span><small>O CAMINHO DE ESTUDO</small>Ver a jornada na Palavra</span></Link>}{next?<Link href={`/historias/${next.id}`}><span><small>PRÓXIMA HISTÓRIA</small>{next.title}</span><ArrowRight size={23} aria-hidden="true"/></Link>:<Link href="/igrejas"><span><small>A HISTÓRIA CONTINUA</small>Conhecer as igrejas e suas conexões</span><ArrowRight size={23} aria-hidden="true"/></Link>}</nav>
    {story.id==="bom-samaritano"&&<p className="story-related-lesson">Quer permanecer nesta passagem? <Link href="/aprender/jesus-e-o-proximo">Abrir o estudo com atividades sobre Lucas 10.</Link></p>}
    <footer className="story-editorial-note"><p>Síntese narrativa autoral baseada nas passagens indicadas. Ilustrações artísticas e símbolos visuais ajudam a acompanhar o tema; não são registros históricos nem reproduções exatas das pessoas ou dos acontecimentos. <a href={art?.provenance || "/visuals/historias-narrativas-proveniencia.json"} target="_blank" rel="noreferrer">Origem das ilustrações</a>.</p><Link href={`/percurso/${storyStageIds[story.id]}`}>Situar esta leitura no percurso completo <ArrowRight size={18} aria-hidden="true" /></Link></footer>
  </div>;
}
