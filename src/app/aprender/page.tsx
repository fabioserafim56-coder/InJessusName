import Link from "next/link";
import { AppShell, AppIcon } from "@/components/app-shell";
import { CourseCatalog } from "@/components/course-catalog";
import { getCourseCatalog } from "@/lib/course-catalog";
import { courseEditorialNote } from "@/content/courses/introductory-course";
import "@/components/learning-home.css";

export const metadata = { title: "Aprender — InJessusName", description: "Estudos bíblicos com exemplos, atividades e aplicação à vida." };

export default function LearningPage() {
  const lessons = getCourseCatalog();
  const activities = lessons.reduce((sum, lesson) => sum + lesson.activityCount, 0);
  return <AppShell active="learn" title="Aprender" subtitle="Leia, descubra e pratique">
    <section className="catalog-intro"><p className="app-eyebrow">PRIMEIRO PERCURSO · FUNDAMENTOS CRISTÃOS</p><h1>Conhecer é só o começo.<br />Praticar faz parte do caminho.</h1><p>Da leitura do texto ao cuidado com as pessoas: aulas curtas, exemplos explicados e atividades para você participar.</p><div className="catalog-intro-meta"><span><AppIcon name="learn" />{lessons.length} aulas completas</span><span><AppIcon name="layers" />{activities} atividades</span><span><AppIcon name="clock" />Ritmo livre</span></div></section>
    <CourseCatalog lessons={lessons} />
    <section className="catalog-method"><div className="catalog-method-symbol"><AppIcon name="spark" /></div><div><h2>Não entendeu? Vamos por outro caminho.</h2><p>Cada atividade oferece explicação e novas tentativas. Comece com apoio, tente lembrar antes de consultar e aplique o procedimento em outro texto.</p></div><Link className="app-secondary-button" href="/aprender/primeiros-passos">Experimentar o estudo <AppIcon name="arrow" /></Link></section>
    <details className="catalog-editorial-note"><summary>Sobre este primeiro percurso</summary><p>{courseEditorialNote} As aulas são introdutórias para jovens e adultos; o curso infantil, as adaptações por idade e as formações confessionais completas continuam em preparação.</p><p>O resultado de uma atividade orienta o próximo estudo. Aprendizagem duradoura será acompanhada com estudantes em tarefas novas, em outros dias.</p></details>
  </AppShell>;
}
