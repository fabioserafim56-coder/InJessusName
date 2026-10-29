import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenText } from "@phosphor-icons/react/ssr";
import { AppShell } from "@/components/app-shell";
import { BookGuideLibrary } from "@/components/book-guides/book-guide-library";
import { getBookGuideSummaries } from "@/content/book-guides";
import "@/components/book-guides/book-guides.css";

export const metadata: Metadata = { title: "Biblioteca bíblica — InJessusName", description: "Guias introdutórios dos 66 livros desta edição, com explicações, exemplos, temas, leituras e conexões para estudar com contexto." };

export default function BibleLibraryPage() {
  return <AppShell active="learn" title="Biblioteca bíblica" subtitle="Conhecer cada livro. Compreender o conjunto."><div className="book-guides-page">
    <header className="bgl-hero"><div><p className="bgl-eyebrow">66 LIVROS. MUITAS VOZES. UMA LEITURA COM CONTEXTO.</p><h1>Há um mundo para descobrir<br /><span>em cada livro.</span></h1><p>Vamos conhecer o que cada livro conta, como ele se liga às outras leituras e por onde você pode começar. As explicações e os exemplos acompanham a Bíblia aberta ao seu lado.</p><Link href="/meu-percurso">Ver os livros no mapa do estudo <ArrowRight size={19} aria-hidden="true" /></Link></div><div className="bgl-library-seal" aria-hidden="true"><BookOpenText size={47} /><strong>66</strong><span>PORTAS PARA A LEITURA</span></div></header>
    <BookGuideLibrary books={getBookGuideSummaries()} />
    <details className="bgl-editorial"><summary>Sobre os guias, a edição e as fontes</summary><p>Esta biblioteca oferece guias introdutórios autorais dos 66 livros do cânon protestante presentes na Bíblia Livre TR 2018. Tradições católica e ortodoxas têm cânones distintos; os livros adicionais ainda não estão nesta edição.</p><p>As passagens bíblicas são recuperadas do corpus local sem mudar sua redação. Explicações, perguntas e exemplos são comentários do aplicativo, separados das Escrituras e sujeitos a revisão humana especializada. Não constituem uma formação teológica completa nem um comentário de cada capítulo.</p><p>A organização dos livros não pretende estabelecer a data exata de sua composição. Não atribuímos autores e datas onde este panorama não dispõe de estudo especializado suficiente.</p><Link href="/biblia">Abrir o texto bíblico e seus créditos <ArrowRight size={17} aria-hidden="true" /></Link></details>
  </div></AppShell>;
}
