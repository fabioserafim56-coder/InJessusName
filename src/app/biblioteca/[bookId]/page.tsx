import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpenText, Compass } from "@phosphor-icons/react/ssr";
import { AppShell } from "@/components/app-shell";
import { getBookGuide, getBookGuideSummaries } from "@/content/book-guides";
import { curriculumStages } from "@/content/curriculum";
import { getBibleChapter } from "@/lib/bible";
import "@/components/book-guides/book-guides.css";

export function generateStaticParams() { return getBookGuideSummaries().map(book => ({ bookId: book.id })); }
export async function generateMetadata({ params }: { params: Promise<{ bookId: string }> }): Promise<Metadata> {
  const book = getBookGuide((await params).bookId);
  return { title: book ? `Conhecendo ${book.name} — InJessusName` : "Livro não encontrado", description: book?.overview[0] };
}
export default async function BookGuidePage({ params }: { params: Promise<{ bookId: string }> }) {
  const book = getBookGuide((await params).bookId);
  if (!book) notFound();
  const all = getBookGuideSummaries();
  const previous = all[book.number - 2];
  const next = all[book.number];
  const stage = curriculumStages.find(item => item.books.includes(book.id));
  return <AppShell active="learn" title={`Conhecendo ${book.name}`} subtitle={`${book.testament} · ${book.category}`}><article key={book.id} className="book-guide-reading" data-book-guide-detail={book.id}>
    <Link className="bgr-back" href="/biblioteca"><ArrowLeft size={18} aria-hidden="true" /> Voltar à biblioteca</Link>
    <header className="bgr-header"><div className="bgr-number" aria-hidden="true"><span>LIVRO</span><strong>{String(book.number).padStart(2, "0")}</strong><BookOpenText size={26} /></div><div><p className="bgl-eyebrow">{book.testament} · {book.chapters} {book.chapters === 1 ? "capítulo" : "capítulos"}</p><h1>{book.name}</h1><p>{book.genre}</p><div className="bgl-themes">{book.themes.map(theme => <span key={theme}>{theme}</span>)}</div></div></header>
    <section className="bgr-overview" aria-labelledby="bgr-overview-title"><p className="bgl-eyebrow">ANTES DE COMEÇAR A LEITURA</p><h2 id="bgr-overview-title">Vamos situar este livro.</h2>{book.overview.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</section>
    <aside className="bgr-connection"><Compass size={25} aria-hidden="true" /><div><h2>Como ele se liga à grande história?</h2><p>{book.connection}</p>{stage && <Link href={`/percurso/${stage.id}`} prefetch={false}>Encontrar esta leitura na etapa {stage.number}: {stage.title}<ArrowRight size={17} aria-hidden="true" /></Link>}</div></aside>
    <section className="bgr-readings" aria-labelledby="bgr-readings-title"><p className="bgl-eyebrow">A BÍBLIA ABERTA AO NOSSO LADO</p><h2 id="bgr-readings-title">Duas portas de entrada para ler.</h2><p>Comece por estas passagens. Depois, abra o capítulo inteiro e acompanhe o que vem antes e depois.</p>{book.readings.map(reading => {
      const chapter = getBibleChapter(book.id, reading.chapter);
      if (!chapter) return null;
      const verses = chapter.verses.filter(verse => verse.number >= reading.verse && verse.number <= reading.endVerse);
      const reference = `${book.name} ${reading.chapter}:${reading.verse}${reading.endVerse !== reading.verse ? `–${reading.endVerse}` : ""}`;
      const href = `/biblia?livro=${book.id}&capitulo=${reading.chapter}&versiculo=${reading.verse}#versiculo-${reading.verse}`;
      return <article key={reference} className="bgr-reading"><h3>{reference}</h3><p>{reading.note}</p><blockquote><sup>{verses[0].number}</sup> {verses[0].text}</blockquote><details><summary>Ler o trecho completo aqui</summary><ol>{verses.map(verse => <li key={verse.number} value={verse.number} data-guide-verse={`${book.id}.${reading.chapter}.${verse.number}`}>{verse.text}</li>)}</ol></details><Link href={href} prefetch={false}>Abrir o capítulo e conferir o contexto<ArrowRight size={18} aria-hidden="true" /></Link></article>;
    })}<p className="bgr-source">Bíblia Livre · TR 2018 · Diego Santos, Mario Sérgio e Marco Teles · <a href="https://creativecommons.org/licenses/by/3.0/br/" target="_blank" rel="noreferrer">CC BY 3.0 BR</a>. As explicações ao redor das passagens são comentários autorais.</p></section>
    <section className="bgr-example"><p className="bgl-eyebrow">PARA NÃO FICAR DISTANTE DA VIDA</p><h2>Um exemplo para pensar junto.</h2><p>{book.example}</p></section>
    <section className="bgr-question" aria-labelledby="bgr-question-title"><p className="bgl-eyebrow">PARE UM INSTANTE E RECORDE</p><h2 id="bgr-question-title">{book.question.prompt}</h2><p>Antes de abrir a explicação, tente responder com suas palavras. Você pode voltar à leitura quantas vezes precisar.</p><details><summary>Conferir uma explicação</summary><p>{book.question.answer}</p></details></section>
    <nav className="bgr-navigation" aria-label="Continuar na ordem dos livros">{previous && <Link href={`/biblioteca/${previous.id}`} prefetch={false}><ArrowLeft size={19} aria-hidden="true" /><span><small>Livro anterior na biblioteca</small>{previous.name}</span></Link>}<Link href={`/biblia?livro=${book.id}&capitulo=1`} prefetch={false}><BookOpenText size={20} aria-hidden="true" /><span><small>Começar pelo texto</small>Abrir {book.name} 1</span></Link>{next && <Link href={`/biblioteca/${next.id}`} prefetch={false}><span><small>Próximo livro na biblioteca</small>{next.name}</span><ArrowRight size={19} aria-hidden="true" /></Link>}</nav>
    <footer className="bgr-editorial">Guia introdutório autoral dos livros desta edição. As explicações e os exemplos ajudam a começar; o estudo capítulo a capítulo e a revisão teológica especializada continuam a ser aprofundados.</footer>
  </article></AppShell>;
}
