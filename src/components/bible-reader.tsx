"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import "./bible-reader.css";

type Book = { id: string; name: string; chapters: number };
type Location = { bookId: string; chapter: number };

type ReaderChapter = {
  book: Book;
  chapter: number;
  verses: readonly { number: number; text: string }[];
  edition: {
    id: string;
    name: string;
    language: string;
    license: string;
    attribution: string;
    sourceUrl: string;
    licenseUrl: string;
    canonNote: string;
    editorialNote: string;
    rightsEvidenceUrl: string;
  };
  prev: Location | null;
  next: Location | null;
};

function chapterUrl(location: Location) {
  const query = new URLSearchParams({ livro: location.bookId, capitulo: String(location.chapter) });
  return `/biblia?${query}`;
}

function ReaderBookIcon() {
  return <svg aria-hidden="true" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 9c-4-3-8-3-12-1v18c4-2 8-2 12 1 4-3 8-3 12-1V8c-4-2-8-2-12 1Zm0 0v18M16 2v4M9 3l2 3m12-3-2 3" /></svg>;
}

export function BibleReader({ books, chapter, highlightedVerse }: {
  books: readonly Book[];
  chapter: ReaderChapter;
  highlightedVerse?: number;
}) {
  const [selectedBook, setSelectedBook] = useState(chapter.book.id);
  const [selectedChapter, setSelectedChapter] = useState(chapter.chapter);
  const [fontSize, setFontSize] = useState(21);
  const [copyMessage, setCopyMessage] = useState("");
  const selectedBookData = books.find((book) => book.id === selectedBook) ?? chapter.book;
  const reference = `${chapter.book.name} ${chapter.chapter}${highlightedVerse ? `:${highlightedVerse}` : ""}`;

  async function copyReference() {
    const citation = `${reference} — ${chapter.edition.name}`;
    try {
      await navigator.clipboard.writeText(citation);
      setCopyMessage("Referência copiada.");
    } catch {
      setCopyMessage(`Copie esta referência: ${citation}`);
    }
  }

  return (
    <div className="bible-reader-page">
      <a className="skip-link" href="#bible-chapter">Pular para o texto bíblico</a>
      <header className="br-site-header">
        <div className="br-shell br-header-inner">
          <Link className="br-brand" href="/" aria-label="InJessusName, página inicial">
            <span className="br-brand-icon"><ReaderBookIcon /></span>
            <span>InJessusName<small>CONHECER · COMPREENDER · VIVER</small></span>
          </Link>
          <nav aria-label="Navegação principal">
            <Link href="/aprender">Aprender</Link>
            <Link href="/meu-percurso">Meu percurso</Link>
          </nav>
        </div>
      </header>

      <main className="br-shell">
        <section className="br-introduction" aria-labelledby="br-title">
          <div>
            <p className="br-eyebrow">BÍBLIA · LEITURA COM CONTEXTO</p>
            <h1 id="br-title">Abra o texto.<br /><em>Leia com atenção.</em></h1>
            <p>Encontre uma passagem, acompanhe o capítulo e confira a edição que está lendo. Os números ajudam a localizar; o contexto ajuda a compreender.</p>
            <p className="br-edition-note">Edição disponível: Bíblia Livre TR, fevereiro de 2018 · 66 livros. A cobertura católica de 73 livros ainda está em preparação.</p>
          </div>
          <aside className="br-study-note">
            <ReaderBookIcon />
            <p>Uma Bíblia aberta.<br /><strong>Boas perguntas ao lado.</strong></p>
            <Link href="/aprender/primeiros-passos">Praticar na primeira aula <span aria-hidden="true">↗</span></Link>
          </aside>
        </section>

        <div className="br-workspace">
          <aside className="br-selection" aria-labelledby="br-selection-title">
            <p className="br-eyebrow">ENCONTRE A PASSAGEM</p>
            <h2 id="br-selection-title">Por onde vamos ler?</h2>
            <form action="/biblia" method="get">
              <label htmlFor="br-book">Livro</label>
              <select id="br-book" name="livro" value={selectedBook} onChange={(event) => { setSelectedBook(event.target.value); setSelectedChapter(1); }}>
                {books.map((book) => <option key={book.id} value={book.id}>{book.name}</option>)}
              </select>
              <label htmlFor="br-chapter-select">Capítulo</label>
              <select id="br-chapter-select" name="capitulo" value={selectedChapter} onChange={(event) => setSelectedChapter(Number(event.target.value))}>
                {Array.from({ length: selectedBookData.chapters }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1}</option>)}
              </select>
              <button className="br-primary-button" type="submit">Abrir capítulo <span aria-hidden="true">→</span></button>
            </form>
            <div className="br-edition-note">
              <p className="br-eyebrow">EDIÇÃO DESTE LEITOR</p>
              <h3>{chapter.edition.name}</h3>
              <p>{books.length} livros disponíveis. Outras edições e diferenças entre cânones ainda serão incorporadas e identificadas.</p>
              <a href="#br-source">Consultar fonte e direitos <span aria-hidden="true">↓</span></a>
            </div>
          </aside>

          <article id="bible-chapter" className="br-reading" aria-labelledby="br-chapter-title" tabIndex={-1}>
            <header className="br-chapter-header">
              <div><p className="br-eyebrow">{chapter.edition.name}</p><h2 id="br-chapter-title">{chapter.book.name} <span>{chapter.chapter}</span></h2></div>
              <span className="br-chapter-counter">Capítulo {chapter.chapter} de {chapter.book.chapters}</span>
            </header>
            <div className="br-reading-tools">
              <div className="br-size-tools" role="group" aria-label="Tamanho do texto bíblico">
                <button type="button" aria-label="Diminuir tamanho do texto" disabled={fontSize <= 18} onClick={() => setFontSize((size) => Math.max(18, size - 2))}>A−</button>
                <span aria-live="polite">{fontSize} px</span>
                <button type="button" aria-label="Aumentar tamanho do texto" disabled={fontSize >= 29} onClick={() => setFontSize((size) => Math.min(29, size + 2))}>A+</button>
              </div>
              <button className="br-copy-reference" type="button" onClick={copyReference}>Copiar referência</button>
            </div>
            <p className="br-copy-message" role="status">{copyMessage}</p>
            {highlightedVerse ? <p className="br-highlight-note">Versículo {highlightedVerse} destacado. Leia também o que vem antes e depois.</p> : null}
            <ol className="br-verses" style={{ "--br-text-size": `${fontSize}px` } as CSSProperties}>
              {chapter.verses.map((verse) => {
                const verseLocation = `${chapterUrl({ bookId: chapter.book.id, chapter: chapter.chapter })}&versiculo=${verse.number}#versiculo-${verse.number}`;
                return (
                  <li key={verse.number} value={verse.number} id={`versiculo-${verse.number}`} className={verse.number === highlightedVerse ? "br-verse-highlighted" : undefined}>
                    <a className="br-verse-number" href={verseLocation} aria-label={`${chapter.book.name} ${chapter.chapter}:${verse.number}, destacar versículo`}>{verse.number}</a>
                    <span>{verse.text}</span>
                  </li>
                );
              })}
            </ol>
            <nav className="br-chapter-navigation" aria-label="Navegar entre capítulos">
              {chapter.prev ? <Link href={chapterUrl(chapter.prev)} prefetch={false}><span aria-hidden="true">←</span> Capítulo anterior</Link> : <span>Início desta edição</span>}
              {chapter.next ? <Link href={chapterUrl(chapter.next)} prefetch={false}>Próximo capítulo <span aria-hidden="true">→</span></Link> : <span>Fim desta edição</span>}
            </nav>
            <footer className="br-source" id="br-source">
              <p className="br-eyebrow">FONTE E DIREITOS</p>
              <h3>{chapter.edition.name}</h3>
              <p>{chapter.edition.attribution}</p>
              <p>Licença: {chapter.edition.license}.</p>
              <p>{chapter.edition.canonNote} {chapter.edition.editorialNote}</p>
              <p><a href={chapter.edition.licenseUrl} target="_blank" rel="noreferrer">Ler a licença ↗</a> · <a href={chapter.edition.rightsEvidenceUrl} target="_blank" rel="noreferrer">Declaração do projeto original ↗</a></p>
              <a href={chapter.edition.sourceUrl} target="_blank" rel="noreferrer">Consultar a fonte da edição <span className="br-sr-only">(abre em outra aba)</span><span aria-hidden="true"> ↗</span></a>
            </footer>
          </article>
        </div>
        <section className="br-bottom-invitation" aria-labelledby="br-learn-title"><div><p className="br-eyebrow">DA LEITURA À PRÁTICA</p><h2 id="br-learn-title">Aprenda a conferir uma descoberta.</h2><p>A primeira aula apresenta um exemplo, prática com ajuda e perguntas para tentar sem consultar.</p></div><Link className="br-primary-button" href="/aprender/primeiros-passos">Abrir a primeira aula <span aria-hidden="true">→</span></Link></section>
      </main>
      <footer className="br-site-footer"><div className="br-shell"><p>InJessusName · Conhecimento bíblico com contexto, fontes e cuidado.</p><Link href="/privacidade">Privacidade</Link></div></footer>
    </div>
  );
}
