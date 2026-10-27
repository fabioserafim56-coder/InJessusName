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
  return <AppShell active="learn" title="Estudos na Palavra" subtitle="Um caminho de escuta, fé e cuidado">
    <section className="catalog-intro"><p className="app-eyebrow">NOSSOS PRIMEIROS PASSOS JUNTOS</p><h1>Conhecer a Palavra.<br />Deixar que ela nos encontre.</h1><p>Uma passagem de cada vez, vamos conhecer o cuidado de Deus, acolher nossas perguntas e buscar como viver o amor que Jesus ensina.</p><div className="catalog-intro-meta"><span><AppIcon name="learn" />{lessons.length} estudos acompanhados</span><span><AppIcon name="layers" />{activities} convites para participar</span><span><AppIcon name="clock" />Sem pressa</span></div></section>
    <CourseCatalog lessons={lessons} />
    <section className="catalog-method"><div className="catalog-method-symbol"><AppIcon name="heart" /></div><div><h2>Você não precisa compreender tudo de uma vez.</h2><p>Se uma passagem parecer difícil, podemos reler e conversar sobre ela com calma. As perguntas ajudam a aprofundar a leitura; há também tempo para meditar, orar e levar uma descoberta ao cotidiano.</p></div><Link className="app-secondary-button" href="/aprender/primeiros-passos">Vamos começar juntos <AppIcon name="arrow" /></Link></section>
    <details className="catalog-editorial-note"><summary>Sobre este primeiro percurso</summary><p>{courseEditorialNote} As aulas são introdutórias para jovens e adultos; o curso infantil, as adaptações por idade e as formações confessionais completas continuam em preparação.</p><p>O resultado de uma atividade orienta o próximo estudo. Aprendizagem duradoura será acompanhada com estudantes em tarefas novas, em outros dias.</p></details>
  </AppShell>;
}
