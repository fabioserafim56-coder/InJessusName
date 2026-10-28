import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpenText, Compass, Heart, Leaf, Sparkle, SunHorizon } from "@phosphor-icons/react/ssr";
import { AppShell } from "@/components/app-shell";
import { StudyJourney } from "@/components/visual/study-journey";
import { WelcomeNarration } from "@/components/scripture-audio/welcome-narration";
import { getCourseCatalog } from "@/lib/course-catalog";
import "@/components/learning-home.css";

export default function Home() {
  const lessons = getCourseCatalog();
  return <AppShell active="home" title="Seu tempo com a Palavra" subtitle="Uma leitura acompanhada, no seu ritmo">
    <div className="visual-home">
      <section className="home-hero" aria-labelledby="home-welcome-title">
        <Image data-visual-art="galilee" className="home-hero-image" src="/visuals/galilee-dawn.png" alt="" fill sizes="(max-width: 760px) 100vw, 85vw" preload />
        <div className="home-hero-shade" aria-hidden="true" />
        <div className="home-hero-copy"><p className="home-kicker"><SunHorizon size={20} aria-hidden="true" /> HÁ LUGAR PARA VOCÊ AQUI</p><h1 id="home-welcome-title">Vamos abrir a<br /> <span>Palavra juntos.</span></h1><p>Traga sua fé, suas perguntas e o que ainda não compreende. Caminhemos com calma, com o coração atento a Deus.</p><div className="home-hero-actions"><Link href="/aprender/primeiros-passos" className="home-gold-button">Começar nosso primeiro estudo <ArrowRight size={21} aria-hidden="true" /></Link><Link href="/biblia" className="home-hero-bible"><span><BookOpenText size={22} aria-hidden="true" /></span>Abrir minha Bíblia</Link></div></div>
        <div className="home-hero-bottom"><span><Leaf size={17} aria-hidden="true" /> CONHECER. PERMANECER. VIVER.</span><span>Paisagem artística inspirada na Galileia</span></div>
      </section>

      <div className="home-quick-paths" aria-label="Encontre seu próximo passo"><Link href="/biblia"><span className="home-quick-icon"><BookOpenText size={23} aria-hidden="true" /></span><span><strong>Abra a Palavra</strong><small>Um tempo para escutar</small></span><ArrowUpRight size={19} aria-hidden="true" /></Link><Link href="/aprender"><span className="home-quick-icon"><Compass size={23} aria-hidden="true" /></span><span><strong>Caminhe pelos estudos</strong><small>{lessons.length} encontros para aprender</small></span><ArrowUpRight size={19} aria-hidden="true" /></Link><Link href="/museu"><span className="home-quick-icon"><Sparkle size={23} aria-hidden="true" /></span><span><strong>Conheça o mundo bíblico</strong><small>Memória, história e fé</small></span><ArrowUpRight size={19} aria-hidden="true" /></Link></div>

      <WelcomeNarration />

      <section className="home-study-feature" aria-labelledby="home-study-title"><div className="home-study-photo"><Image data-visual-art="study" src="/visuals/scripture-study.png" alt="Ilustração artística de um livro aberto sobre uma mesa, iluminado pela luz da manhã." fill sizes="(max-width: 760px) 100vw, 35vw" /><span>UM LUGAR PARA PERMANECER</span></div><div className="home-study-copy"><p className="home-kicker">NOSSO PRIMEIRO ENCONTRO</p><h2 id="home-study-title">Sua Bíblia aberta.<br />Seu coração atento.</h2><p>Comecemos com uma pequena passagem. Vamos acolher as perguntas que ela desperta e aprender a ouvi-la com amor e atenção.</p><div className="home-study-reference"><BookOpenText size={21} aria-hidden="true" /><span>Atos 17:10–12<small>Primeiros passos na Palavra</small></span></div><Link href="/aprender/primeiros-passos" className="home-text-link">Vamos dar esse primeiro passo <ArrowRight size={21} aria-hidden="true" /></Link></div></section>

      <StudyJourney lessons={lessons} />

      <section className="home-discovery" aria-label="Encontros com a Palavra e a história"><Link href="/biblia" className="home-bible-feature"><div><p className="home-kicker"><BookOpenText size={18} aria-hidden="true" /> SUA BIBLIOTECA</p><h2>Uma Bíblia para abrir.<br />Um lugar para voltar.</h2><p>66 livros. Leitura acompanhada pelo seu próprio ritmo, com tempo para permanecer em cada passagem.</p><span className="home-feature-action">Entrar na Bíblia <ArrowUpRight size={23} aria-hidden="true" /></span></div><div className="home-tactile-bible" aria-hidden="true"><span className="home-tactile-spine" /><span className="home-tactile-cover"><span className="home-cover-cross" /><strong>BÍBLIA<br />SAGRADA</strong><span>PALAVRA · VIDA · ESPERANÇA</span></span><span className="home-tactile-ribbon" /></div></Link><Link href="/museu" className="home-museum-feature"><div><p className="home-kicker"><Sparkle size={18} aria-hidden="true" /> MUSEU DO MUNDO BÍBLICO</p><h2>O tempo guarda<br />histórias para contar.</h2><p>Olhe de perto. Conheça peças antigas, seus contextos e os encontros com o mundo das Escrituras.</p><span className="home-feature-action">Conhecer o museu <ArrowUpRight size={23} aria-hidden="true" /></span></div><div className="home-museum-objects" aria-hidden="true"><Image className="home-museum-stela" src="/museum/estela-merneptah-1917.jpg" alt="" width={270} height={500} /><Image className="home-museum-rosetta" src="/museum/pedra-roseta-1917.jpg" alt="" width={347} height={500} /><span>Fotografias históricas · 1917</span></div></Link></section>

      <section className="home-mercy-invitation" aria-labelledby="home-mercy-title"><span className="home-mercy-icon"><Heart size={30} weight="duotone" aria-hidden="true" /></span><div><p className="home-kicker">UM CONVITE DE JESUS</p><h2 id="home-mercy-title">Quem precisa do seu cuidado hoje?</h2><p>Em Lucas 10, a compaixão se aproxima, cuida e permanece. Vamos ouvir essa história e perguntar como o amor pode ganhar forma em nossa vida.</p></div><Link href="/aprender/jesus-e-o-proximo" className="home-outline-button">Caminhar por essa história <ArrowRight size={20} aria-hidden="true" /></Link></section>
      <footer className="home-footer"><p>Conhecer a Palavra. Crescer no amor. Caminhar com cuidado.</p><Link href="/comecar">Encontrar meu caminho <ArrowRight size={17} aria-hidden="true" /></Link></footer>
    </div>
  </AppShell>;
}
