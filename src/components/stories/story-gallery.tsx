import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpenText, Compass, Play } from "@phosphor-icons/react/ssr";
import { biblicalStories } from "@/content/stories";
import "./stories.css";

export function StoryGallery() {
  return <div className="stories-page stories-gallery-page">
    <header className="stories-intro">
      <div className="stories-intro-art"><Image src="/visuals/story-multiplicacao-dos-paes.png" alt="Ilustração artística: Jesus entre a multidão reunida, com pães e cestos em primeiro plano." fill quality={100} sizes="(max-width:760px) 1536px, 100vw" loading="eager" /><div /></div>
      <div className="stories-intro-copy"><p className="stories-eyebrow">CONTEMPLE A HISTÓRIA. CONHEÇA O SENHOR.</p><h1>Há uma Palavra<br />viva em cada<br /><em>encontro.</em></h1><p>Das primeiras páginas de Gênesis aos passos de Jesus. Entre na passagem, acompanhe cada momento e encontre a própria Bíblia sempre aberta ao seu lado.</p><Link className="stories-feature-link" href="/historias/multiplicacao-dos-paes" prefetch={false}><span><Play size={18} weight="fill" aria-hidden="true" /></span>Começar pelos pães e peixes<ArrowRight size={20} aria-hidden="true" /></Link></div>
      <div className="stories-hero-caption"><span>UM ENCONTRO À BEIRA DO MAR DA GALILEIA</span><strong>João 6:1–15</strong><small>Ilustração artística</small></div>
    </header>
    <div className="stories-gallery-path"><span>15 histórias <i aria-hidden="true" /> 60 cenas para acompanhar</span><div><Link href="/meu-percurso"><Compass size={19} aria-hidden="true" /> Meu percurso</Link><Link href="/biblia"><BookOpenText size={19} aria-hidden="true" /> Abrir a Bíblia</Link></div></div>
    <section aria-labelledby="stories-collection-title"><header className="stories-section-heading"><div><p className="stories-eyebrow">UM FIO DE FÉ, ESPERANÇA E REDENÇÃO</p><h2 id="stories-collection-title">Cada história, um novo encontro.</h2><p>Escolha uma passagem. Há tempo para observar, perguntar e permanecer na Palavra.</p></div><span>DAS ORIGENS À IGREJA PRIMITIVA</span></header>
      <ol className="stories-grid">{biblicalStories.map((story, index) => <li key={story.id}><Link className={`story-card story-art-${story.art}`} href={`/historias/${story.id}`} prefetch={false}><div className="story-card-cover"><Image src={story.image || `/visuals/stories-${story.art}.png`} alt="" fill quality={100} sizes="(max-width:600px) 95vw, (max-width:1100px) 45vw, 30vw" /><div className="story-card-shade" /><span className="story-card-number">{String(index + 1).padStart(2, "0")}</span><span className="story-card-theme">{story.theme}</span><span className="story-card-enter"><ArrowRight size={24} aria-hidden="true" /></span></div><div className="story-card-copy"><p>{story.era}</p><h3>{story.title}</h3><span>{story.subtitle}</span><footer><small>4 momentos · contexto · reflexão</small><span>Entrar na história <ArrowRight size={17} aria-hidden="true" /></span></footer></div></Link></li>)}</ol>
    </section>
    <div className="stories-reading-note"><BookOpenText size={25} aria-hidden="true" /><p><strong>A beleza nos aproxima; a Palavra nos conduz.</strong> Cada cena é uma síntese autoral com sua referência bíblica. As imagens são criações artísticas, sem pretensão de retrato histórico. Leia o texto completo para conhecer detalhes que nenhuma imagem consegue guardar.</p></div>
    <aside className="stories-continuity"><div><p className="stories-eyebrow">DEPOIS DA ÚLTIMA CENA</p><h2>A história continua em comunidade.</h2><p>Conheça os caminhos das igrejas, as pessoas que anunciaram o Evangelho e a chegada das comunidades ao Brasil.</p></div><Link href="/igrejas">Explorar as conexões <ArrowRight size={21} aria-hidden="true" /></Link></aside>
  </div>;
}
