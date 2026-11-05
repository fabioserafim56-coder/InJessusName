import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpenText, Compass } from "@phosphor-icons/react/ssr";
import { biblicalStories, storyBibleUrl, storyStageIds, type BiblicalStory } from "@/content/stories";
import { StoryReflection, StoryScenes } from "./story-scenes";
import { StoryArtworkViewer } from "./story-artwork-viewer";
import { StoryRecall } from "./story-recall";
import { getStoryArtwork } from "@/content/stories/artwork";
import { storySceneArtwork } from "@/content/stories/scene-artwork";
import { getNarratedPassageForStory } from "@/content/narration";
import { NarratedReading } from "@/components/multimodal/narrated-reading";
import "./stories.css";

export function StoryDetail({ story }: { story: BiblicalStory }) {
  const index = biblicalStories.findIndex(item => item.id === story.id);
  const previous = biblicalStories[index - 1];
  const next = biblicalStories[index + 1];
  const art = getStoryArtwork(story.image || `/visuals/stories-${story.art}.png`);
  const narration = getNarratedPassageForStory(story.id);
  const sceneProvenance = [...new Set(Object.values(storySceneArtwork[story.id] || {}).map(item => item.provenance).filter(Boolean))];

  return <div className="stories-page story-detail-page">
    <header className="story-detail-header"><div><p className="stories-eyebrow">HISTÓRIA {String(index + 1).padStart(2, "0")} <span aria-hidden="true">·</span> {story.era}</p><h1>{story.title}</h1></div><span className="story-detail-theme">{story.theme}<span>4 momentos na Palavra</span></span></header>
    <StoryScenes key={story.id} story={story} />
    <div className="story-deeper-reading">
      <section className="story-welcome" aria-labelledby="story-welcome-title"><p className="stories-eyebrow">PERMANEÇA UM POUCO MAIS</p><h2 id="story-welcome-title">{story.subtitle}</h2><p>{story.introduction}</p></section>
      {narration && <div className="story-narration-space"><NarratedReading passageId={narration.id} /></div>}
      <section className="story-understanding" aria-label="Contexto e conexões da história"><article><p className="stories-eyebrow">ANTES DE SEGUIR</p><h2>Onde estamos na Bíblia?</h2><p>{story.context}</p></article><article><p className="stories-eyebrow">UM FIO LIGA AO OUTRO</p><h2>O que esta história prepara?</h2><p>{story.connection}</p></article><article><p className="stories-eyebrow">DA PALAVRA PARA A VIDA</p><h2>Um cuidado para hoje.</h2><p>{story.example}</p></article></section>
      <StoryRecall key={`recall-${story.id}`} story={story} />
      <StoryReflection key={`reflection-${story.id}`} story={story} />
      {art && <StoryArtworkViewer {...art} title={story.title} />}
      <aside className="story-reading-invitation"><BookOpenText size={34} aria-hidden="true" /><div><p className="stories-eyebrow">A PRÓXIMA PÁGINA</p><h2>Deixe a própria Palavra conduzir.</h2><p>As cenas ajudam a acompanhar. A leitura completa revela detalhes e conexões que uma síntese não consegue guardar.</p><Link href={storyBibleUrl(story.nextReading)} prefetch={false}>Continuar em {story.nextReading.label} <ArrowRight size={21} aria-hidden="true" /></Link></div></aside>
      <nav className="story-neighbor-nav" aria-label="Outras histórias">{previous ? <Link href={`/historias/${previous.id}`}><ArrowLeft size={23} aria-hidden="true" /><span><small>HISTÓRIA ANTERIOR</small>{previous.title}</span></Link> : <Link href="/meu-percurso"><Compass size={23} aria-hidden="true" /><span><small>O CAMINHO DE ESTUDO</small>Ver a jornada na Palavra</span></Link>}{next ? <Link href={`/historias/${next.id}`}><span><small>PRÓXIMA HISTÓRIA</small>{next.title}</span><ArrowRight size={23} aria-hidden="true" /></Link> : <Link href="/igrejas"><span><small>A HISTÓRIA CONTINUA</small>Conhecer as igrejas e suas conexões</span><ArrowRight size={23} aria-hidden="true" /></Link>}</nav>
      {story.id === "bom-samaritano" && <p className="story-related-lesson">Quer permanecer nesta passagem? <Link href="/aprender/jesus-e-o-proximo">Abrir o estudo com atividades sobre Lucas 10.</Link></p>}
      <details className="story-editorial-note"><summary>Sobre a leitura e a origem das imagens</summary><p>Síntese narrativa autoral baseada nas passagens indicadas. Ilustrações artísticas ajudam a acompanhar o tema; não são registros históricos nem reproduções exatas das pessoas ou dos acontecimentos. <a href={art?.provenance || "/visuals/historias-narrativas-proveniencia.json"} target="_blank" rel="noreferrer">Origem da ilustração principal</a>. {sceneProvenance.map(src => <a key={src} href={src} target="_blank" rel="noreferrer">Origem das cenas adicionais</a>)}</p><Link href={`/percurso/${storyStageIds[story.id]}`}>Situar esta leitura no percurso completo <ArrowRight size={18} aria-hidden="true" /></Link></details>
    </div>
  </div>;
}
