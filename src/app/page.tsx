import Link from "next/link";
import { AppShell, AppIcon } from "@/components/app-shell";
import { LessonCard } from "@/components/lesson-card";
import { getCourseCatalog } from "@/lib/course-catalog";
import "@/components/learning-home.css";

export default function Home() {
  const lessons = getCourseCatalog();
  return <AppShell active="home" title="Seu espaço de aprendizado" subtitle="Um passo de cada vez, com propósito">
    <section className="home-greeting"><div><p className="app-eyebrow">BEM-VINDO AO SEU ESTUDO</p><h1>Um novo passo no<br className="home-title-break" /> seu aprendizado.</h1><p>Encontre sentido no texto. Pratique o que descobriu.<br className="home-desktop-break" /> Leve o conhecimento para a vida.</p></div><Link className="home-library-link" href="/aprender"><AppIcon name="layers" /><span><strong>{lessons.length} aulas</strong>para explorar</span><AppIcon name="arrow" /></Link></section>

    <div className="home-main-grid"><div className="home-left-column">
      <section className="home-start-card" aria-labelledby="home-start-title"><div className="home-start-top"><span className="home-start-label"><span />COMECE POR AQUI</span><span className="home-foundation-pill">Fundamentos da leitura</span></div><div className="home-start-main"><div><h2 id="home-start-title">Uma Bíblia aberta.<br />Uma boa pergunta.</h2><p>Aprenda a localizar uma passagem e conferir o que ela diz, com um exemplo e atividades comentadas.</p><Link href="/aprender/primeiros-passos" className="app-primary-button">Começar a primeira aula <AppIcon name="arrow" /></Link></div><div className="home-book-art" aria-hidden="true"><span className="home-book-orbit orbit-one" /><span className="home-book-orbit orbit-two" /><div className="home-book"><AppIcon name="bible" /></div><span className="home-book-star star-one">✦</span><span className="home-book-star star-two">✧</span><span className="home-book-label">LER. OBSERVAR. DESCOBRIR.</span></div></div><div className="home-start-footer"><span><AppIcon name="clock" />No seu ritmo</span><span><AppIcon name="check" />Dicas e novas tentativas</span><span><AppIcon name="bible" />Atos 17:10–12</span></div></section>

      <section className="home-course-section" aria-labelledby="home-course-title"><div className="home-section-heading"><div><p className="app-eyebrow">CONSTRUA SEUS FUNDAMENTOS</p><h2 id="home-course-title">Descobertas que se conectam.</h2></div><Link href="/aprender" className="app-secondary-link">Ver todas <AppIcon name="arrow" /></Link></div><div className="lesson-card-grid home-lesson-grid">{lessons.slice(1, 5).map((lesson) => <LessonCard key={lesson.id} lesson={lesson} />)}</div></section>
    </div><aside className="home-right-column">
      <section className="home-practice-card" aria-labelledby="home-practice-title"><div className="home-side-card-icon"><AppIcon name="compass" /></div><p className="app-eyebrow">UMA PERGUNTA PARA EXPLORAR</p><h2 id="home-practice-title">Como o cuidado se transforma em ação?</h2><p>Leia o encontro narrado em Lucas 10. Observe as atitudes, procure evidências e pense em uma ação possível hoje.</p><Link href="/aprender/jesus-e-o-proximo" className="app-secondary-button">Explorar esta aula <AppIcon name="arrow" /></Link><span className="home-side-reference">Lucas 10:25–37</span></section>
      <section className="home-reading-card" aria-labelledby="home-reading-title"><span className="home-reading-icon"><AppIcon name="bible" /></span><div><p className="app-eyebrow">SUA BIBLIOTECA</p><h2 id="home-reading-title">A Bíblia, perto de você.</h2><p>66 livros, com navegação por capítulo e texto ajustável.</p></div><Link className="app-secondary-link" href="/biblia">Abrir o leitor <AppIcon name="arrow" /></Link></section>
      <section className="home-study-rhythm" aria-labelledby="home-rhythm-title"><h2 id="home-rhythm-title">Estudar é participar.</h2><ol><li><span>1</span><div><strong>Veja um exemplo</strong><p>Acompanhe o raciocínio.</p></div></li><li><span>2</span><div><strong>Faça uma descoberta</strong><p>Leia, classifique e organize.</p></div></li><li><span>3</span><div><strong>Aplique e retome</strong><p>Explique com suas palavras.</p></div></li></ol></section>
    </aside></div>

    <footer className="home-footer"><p>Conhecimento bíblico com contexto e cuidado.</p><Link href="/comecar">Personalizar meu percurso <AppIcon name="arrow" /></Link></footer>
  </AppShell>;
}
