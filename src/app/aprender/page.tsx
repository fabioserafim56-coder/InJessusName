import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpenText, Compass, Heart } from "@phosphor-icons/react/ssr";
import { AppShell } from "@/components/app-shell";
import { CourseCatalog } from "@/components/course-catalog";
import { getCourseCatalog } from "@/lib/course-catalog";
import { courseEditorialNote } from "@/content/courses/introductory-course";
import "@/components/learning-home.css";

export const metadata = { title: "Aprender — InJessusName", description: "Estudos bíblicos com exemplos, atividades e aplicação à vida." };

export default function LearningPage() {
  const lessons = getCourseCatalog();
  const activities = lessons.reduce((sum, lesson) => sum + lesson.activityCount, 0);
  return <AppShell active="learn" title="Estudos na Palavra" subtitle="Um caminho de escuta, fé e cuidado">
    <div className="catalog-page"><section className="catalog-intro"><div className="catalog-intro-copy"><p className="home-kicker"><Compass size={18} aria-hidden="true" /> NOSSOS PRIMEIROS PASSOS JUNTOS</p><h1>Conhecer a Palavra.<br /><span>Deixar que ela nos encontre.</span></h1><p>Uma passagem de cada vez, vamos conhecer o cuidado de Deus, acolher nossas perguntas e buscar como viver o amor que Jesus ensina.</p><div className="catalog-intro-meta"><span><BookOpenText size={19} aria-hidden="true" />{lessons.length} estudos acompanhados</span><span>{activities} convites para participar</span><span>No seu ritmo</span></div></div><div className="catalog-intro-art"><Image data-visual-art="study" src="/visuals/stories-hope.png" alt="" quality={90} fill sizes="(max-width: 760px) 100vw, 35vw" preload /><span>ABRA A BÍBLIA. TRAGA SUAS PERGUNTAS.</span></div></section>
    <section className="catalog-broad-library" aria-labelledby="catalog-broad-title"><p className="home-kicker">CONHECER O CONJUNTO. COMPREENDER CADA PARTE.</p><h2 id="catalog-broad-title">Um caminho inteiro para continuar descobrindo.</h2><div><Link href="/meu-percurso"><Compass size={27} aria-hidden="true" /><span><strong>O mapa da grande história</strong><small>24 etapas conectadas, da criação à nova criação, com leitura, explicações e prática.</small></span><ArrowRight size={20} aria-hidden="true" /></Link><Link href="/biblioteca"><BookOpenText size={27} aria-hidden="true" /><span><strong>Guias para os 66 livros</strong><small>Conheça o assunto, os temas, as conexões e por onde começar a ler cada livro desta edição.</small></span><ArrowRight size={20} aria-hidden="true" /></Link><Link href="/biblia#busca-biblica"><Heart size={27} aria-hidden="true" /><span><strong>Investigue um tema da fé</strong><small>52 caminhos temáticos com passagens e contexto: batismo, oração, perdão, esperança e muito mais.</small></span><ArrowRight size={20} aria-hidden="true" /></Link></div></section>
    <div className="catalog-practice-heading"><p className="home-kicker">UM TEMPO PARA APRENDER E PRATICAR</p><h2>Encontros guiados na Palavra.</h2><p>Comece por um destes estudos curtos e leve sua descoberta ao mapa de leitura.</p></div>
    <CourseCatalog lessons={lessons} />
    <section className="catalog-method"><div className="catalog-method-symbol"><Heart size={28} weight="duotone" aria-hidden="true" /></div><div><p className="home-kicker">APRENDER TAMBÉM É PERMANECER</p><h2>Você não precisa compreender tudo de uma vez.</h2><p>Se uma passagem parecer difícil, podemos reler e conversar sobre ela com calma. Há tempo para meditar, orar e levar uma descoberta ao cotidiano.</p></div><Link className="home-outline-button" href="/aprender/primeiros-passos">Vamos começar juntos <ArrowRight size={20} aria-hidden="true" /></Link></section>
    <details className="catalog-editorial-note"><summary>Sobre este primeiro percurso</summary><p>{courseEditorialNote} As aulas são introdutórias para jovens e adultos; o curso infantil, as adaptações por idade e as formações confessionais completas continuam em preparação.</p><p>O resultado de uma atividade orienta o próximo estudo. Aprendizagem duradoura será acompanhada com estudantes em tarefas novas, em outros dias.</p></details></div>
  </AppShell>;
}
