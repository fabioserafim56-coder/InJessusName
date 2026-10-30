"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { AppShell } from "@/components/app-shell";
import { ScriptureBook } from "@/components/bible/scripture-book";
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

type BibleTheme = "claro" | "sepia" | "noturno";
function fold(value: string) { return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR"); }


function ReaderIcon({ kind }: { kind: "book" | "info" | "copy" | "arrow-left" | "arrow-right" | "close" }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    {kind === "book" && <><path d="M12 5C8 2 4 3 2 4v15c3-1 7-1 10 1 3-2 7-2 10-1V4c-3-1-7-2-10 1Z" /><path d="M12 5v15" /></>}
    {kind === "info" && <><circle cx="12" cy="12" r="9" /><path d="M12 11v6m0-10h.01" /></>}
    {kind === "copy" && <><rect x="8" y="8" width="12" height="13" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></>}
    {kind === "arrow-left" && <path d="m14 6-6 6 6 6M8 12h12" />}
    {kind === "arrow-right" && <path d="m10 6 6 6-6 6M16 12H4" />}
    {kind === "close" && <path d="m6 6 12 12M18 6 6 18" />}
  </svg>;
}

export function BibleReader({ books, chapter, highlightedVerse, searchPanel, churchMode = false, initialBookOpen = false, initialTheme = "claro", initialFontSize = 24, verseCounts = {} }: {
  books: readonly Book[];
  chapter: ReaderChapter;
  highlightedVerse?: number;
  searchPanel?: ReactNode;
  churchMode?: boolean;
  initialBookOpen?: boolean;
  initialTheme?: BibleTheme;
  initialFontSize?: number;
  verseCounts?: Record<string, number[]>;
}) {
  const [selectedBook, setSelectedBook] = useState(chapter.book.id);
  const [selectedChapter, setSelectedChapter] = useState(chapter.chapter);
  const [fontSize, setFontSize] = useState(initialFontSize);
  const [theme, setTheme] = useState<BibleTheme>(initialTheme);
  const [fullScreen, setFullScreen] = useState(false);
  const [navStep, setNavStep] = useState<"books" | "chapters" | "verses">("books");
  const [bookQuery, setBookQuery] = useState("");
  const [testament, setTestament] = useState<"all" | "old" | "new">("all");
  const passageDialog = useRef<HTMLDialogElement>(null);
  const lastPassageTrigger = useRef<HTMLElement | null>(null);
  const pageRoot = useRef<HTMLDivElement>(null);
  const [readingMode, setReadingMode] = useState<"verses" | "continuous">("verses");
  const [copyMessage, setCopyMessage] = useState("");
  const sourceDialog = useRef<HTMLDialogElement>(null);
  const bookDialog = useRef<HTMLDialogElement>(null);
  const bookTrigger = useRef<HTMLButtonElement>(null);
  const simpleRequested = useRef(false);
  const [bookOpen, setBookOpen] = useState(initialBookOpen);
  const selectedBookData = books.find((book) => book.id === selectedBook) ?? chapter.book;
  const reference = `${chapter.book.name} ${chapter.chapter}${highlightedVerse ? `:${highlightedVerse}` : ""}`;

  const selectedVerseCount = verseCounts[selectedBook]?.[selectedChapter - 1] || (selectedBook === chapter.book.id && selectedChapter === chapter.chapter ? chapter.verses.length : 1);
  const shownBooks = books.filter((book, index) => (testament === "all" || (testament === "old" ? index < 39 : index >= 39)) && fold(book.name).includes(fold(bookQuery.trim())));
  function chapterUrl(location: Location, verse?: number, keepBook = false, mode = churchMode) {
    const parameters = new URLSearchParams({ livro: location.bookId, capitulo: String(location.chapter) });
    if (verse) parameters.set("versiculo", String(verse));
    if (mode) parameters.set("modo", "igreja");
    if (keepBook) parameters.set("livroaberto", "1");
    if (fontSize !== 24) parameters.set("fonte", String(fontSize));
    if (theme !== "claro") parameters.set("tema", theme);
    return `/biblia?${parameters}${verse && !keepBook ? `#versiculo-${verse}` : ""}`;
  }
  useEffect(() => {
    if (initialBookOpen && bookDialog.current && !bookDialog.current.open) bookDialog.current.showModal();
    const onFullscreen = () => setFullScreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFullscreen);
    return () => document.removeEventListener("fullscreenchange", onFullscreen);
  }, [initialBookOpen]);
  function openPassage(trigger: HTMLElement, psalms = false) {
    lastPassageTrigger.current = trigger;
    setSelectedBook(psalms ? "PSA" : chapter.book.id);
    setSelectedChapter(psalms ? 1 : chapter.chapter);
    setBookQuery("");
    setTestament("all");
    setNavStep(psalms ? "chapters" : "books");
    passageDialog.current?.showModal();
  }
  async function toggleFullScreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (document.fullscreenEnabled && pageRoot.current?.requestFullscreen) await pageRoot.current.requestFullscreen();
      else setCopyMessage("A tela inteira não está disponível neste navegador. A leitura permanece pronta aqui.");
    } catch { setCopyMessage("A tela inteira não pôde ser aberta agora. Você pode continuar a leitura normalmente."); }
  }
  const themeControls = <div className="br-theme-switch" role="group" aria-label="Aparência da Bíblia">{(["claro", "sepia", "noturno"] as const).map(item => <button key={item} type="button" data-bible-theme-choice={item} aria-label={`Tema ${item === "sepia" ? "sépia" : item}`} aria-pressed={theme === item} onClick={() => setTheme(item)}><span aria-hidden="true" />{item === "sepia" ? "Sépia" : item === "claro" ? "Claro" : "Noite"}</button>)}</div>;

  function openBook() {
    simpleRequested.current = false;
    setBookOpen(true);
    bookDialog.current?.showModal();
  }

  function closeBook(simple = false) {
    simpleRequested.current = simple;
    bookDialog.current?.close();
  }

  function returnFromBook() {
    setBookOpen(false);
    requestAnimationFrame(() => {
      if (simpleRequested.current) {
        const passage = document.getElementById("bible-chapter");
        passage?.focus({ preventScroll: true });
        passage?.scrollIntoView({ block: "start", behavior: "instant" });
        simpleRequested.current = false;
      } else bookTrigger.current?.focus({ preventScroll: true });
    });
  }

  async function copyReference() {
    const citation = `${reference} — ${chapter.edition.name}`;
    try {
      await navigator.clipboard.writeText(citation);
      setCopyMessage("Referência copiada.");
    } catch {
      setCopyMessage(`Copie esta referência: ${citation}`);
    }
  }

  const content = <div className={`bible-reader-page${churchMode ? " br-church-mode" : ""}`} data-bible-theme={theme} ref={pageRoot}>
      {churchMode && <header className="br-church-topbar"><Link href="/" className="br-church-back" aria-label="Voltar ao aplicativo"><ReaderIcon kind="arrow-left" /></Link><div className="br-church-brand"><span className="br-church-cross" aria-hidden="true" /><div><p>SAGRADAS ESCRITURAS</p><strong>A Palavra, sempre com você.</strong></div></div><button type="button" className="br-church-reference" aria-label={`Escolher passagem: ${reference}`} onClick={event => openPassage(event.currentTarget)}><span><strong>{chapter.book.name} {chapter.chapter}{highlightedVerse ? `:${highlightedVerse}` : ""}</strong><small>Escolher passagem</small></span><span aria-hidden="true">⌄</span></button><Link className="br-exit-church" href={chapterUrl({ bookId: chapter.book.id, chapter: chapter.chapter }, highlightedVerse, false, false)}>Estudo completo</Link></header>}
      {churchMode && <section className="br-church-opening"><p>BÍBLIA LIVRE · EDIÇÃO TR 2018</p><h2>Um lugar de escuta.</h2><div><button type="button" className="br-church-locate" onClick={event => openPassage(event.currentTarget)}><ReaderIcon kind="book" /><span>{chapter.book.name} <strong>{chapter.chapter}{highlightedVerse ? `:${highlightedVerse}` : ""}</strong></span><span aria-hidden="true">⌄</span></button><button type="button" className="br-church-psalms" onClick={event => openPassage(event.currentTarget, true)}>Salmos</button><button type="button" className="br-church-book" ref={bookTrigger} onClick={openBook}>Abrir minha Bíblia <ReaderIcon kind="book" /></button></div><p className="br-church-instruction">Escolha a passagem. Leia com reverência, no seu ritmo.</p></section>}
      <a className="skip-link" href="#bible-chapter">Pular para o texto bíblico</a>
      {churchMode && <noscript><form action="/biblia" method="get" className="br-nojs-form"><input type="hidden" name="modo" value="igreja" />{theme !== "claro" && <input type="hidden" name="tema" value={theme} />}{fontSize !== 24 && <input type="hidden" name="fonte" value={fontSize} />}<label>Livro<select name="livro" defaultValue={chapter.book.id}>{books.map(book => <option key={book.id} value={book.id}>{book.name}</option>)}</select></label><label>Capítulo<input type="number" name="capitulo" min={1} max={150} defaultValue={chapter.chapter} /></label><label>Versículo<input type="number" name="versiculo" min={1} max={176} defaultValue={highlightedVerse || 1} /></label><button type="submit">Abrir passagem</button></form></noscript>}

      {!churchMode && <section className="br-book-invitation" aria-labelledby="br-book-invitation-title">
        <div className="br-book-invitation-copy"><p className="br-book-kicker">UM ENCONTRO COM A PALAVRA</p><h2 id="br-book-invitation-title">Há uma Palavra<br /><span>esperando por você.</span></h2><p>Abra sua Bíblia, vire as páginas e permaneça um pouco. Há tempo para escutar, fazer perguntas e levar um ensino ao coração.</p><div className="br-book-invitation-actions"><button type="button" className="br-open-book" ref={bookTrigger} onClick={openBook}>Abrir minha Bíblia <ReaderIcon kind="arrow-right" /></button><a href="#bible-chapter">Ir direto ao texto</a><Link href={chapterUrl({ bookId: chapter.book.id, chapter: chapter.chapter }, highlightedVerse, false, true)}>Usar só a Bíblia</Link></div><span className="br-book-invitation-edition">Bíblia Livre · 66 livros · Texto ajustável</span></div>
        <div className="br-tactile-scene" aria-hidden="true"><div className="br-tactile-book"><span className="br-tactile-pages" /><span className="br-tactile-spine" /><div className="br-tactile-cover"><div className="br-tactile-frame"><span className="br-tactile-symbol">✦</span><strong>BÍBLIA</strong><span>SAGRADA</span><small>PALAVRA · VIDA · ESPERANÇA</small></div></div><span className="br-tactile-ribbon" /></div><span className="br-tactile-caption">Abra. Escute. Permaneça.</span></div>
      </section>}

      {!churchMode && <div className="br-church-entry"><div><p>PARA O CULTO, A ORAÇÃO E A LEITURA</p><strong>Quando você precisa apenas da Bíblia.</strong></div><Link href={chapterUrl({ bookId: chapter.book.id, chapter: chapter.chapter }, highlightedVerse, false, true)}>Entrar no modo igreja <ReaderIcon kind="arrow-right" /></Link></div>}
      {!churchMode && searchPanel}

      <section className="br-toolbar" aria-label="Encontre uma passagem">
        <form action="/biblia" method="get" className="br-location-form">
          {churchMode && <input type="hidden" name="modo" value="igreja" />}
          {theme !== "claro" && <input type="hidden" name="tema" value={theme} />}
          {fontSize !== 24 && <input type="hidden" name="fonte" value={fontSize} />}
          <div className="br-field br-book-field">
            <label htmlFor="br-book">Livro</label>
            <select id="br-book" name="livro" value={selectedBook} onChange={(event) => { setSelectedBook(event.target.value); setSelectedChapter(1); }}>
              {books.map((book) => <option key={book.id} value={book.id}>{book.name}</option>)}
            </select>
          </div>
          <div className="br-field br-chapter-field">
            <label htmlFor="br-chapter-select">Capítulo</label>
            <select id="br-chapter-select" name="capitulo" value={selectedChapter} onChange={(event) => setSelectedChapter(Number(event.target.value))}>
              {Array.from({ length: selectedBookData.chapters }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1}</option>)}
            </select>
          </div>
          <div className="br-field br-verse-field"><label htmlFor="br-verse-select">Versículo</label><input id="br-verse-select" type="number" name="versiculo" min={1} max={selectedVerseCount} defaultValue={1} inputMode="numeric" /></div>
          <button className="br-primary-button" type="submit">Abrir capítulo <ReaderIcon kind="arrow-right" /></button>
        </form>
        <button className="br-edition-button" type="button" onClick={() => sourceDialog.current?.showModal()}>
          <ReaderIcon kind="info" /><span>Edição e fontes</span>
        </button>
      </section>

      <div className="br-display-bar">{themeControls}<button type="button" className="br-fullscreen" aria-pressed={fullScreen} onClick={toggleFullScreen}>{fullScreen ? "Sair da tela inteira" : "Tela inteira"}</button></div>

      <div className="br-workspace">
        <article id="bible-chapter" className="br-reading" aria-labelledby="br-chapter-title" tabIndex={-1}>
          <header className="br-chapter-header">
            <div className="br-chapter-icon"><ReaderIcon kind="book" /></div>
            <div className="br-chapter-heading">
              <p className="br-edition-label">BLIVRE · TR 2018</p>
              <h1 id="br-chapter-title">{chapter.book.name} <span>{chapter.chapter}</span></h1>
              <p className="br-chapter-counter">Capítulo {chapter.chapter} de {chapter.book.chapters} · {chapter.verses.length} versículos</p>
            </div>
            <button className="br-copy-reference" type="button" aria-label="Copiar referência" onClick={copyReference}><ReaderIcon kind="copy" /><span>Copiar referência</span></button>
          </header>

          <div className="br-reading-tools">
            <div className="br-mode-tools" role="group" aria-label="Modo de leitura">
              <button type="button" aria-pressed={readingMode === "verses"} onClick={() => setReadingMode("verses")}>Versículos</button>
              <button type="button" aria-pressed={readingMode === "continuous"} onClick={() => setReadingMode("continuous")}>Leitura corrida</button>
            </div>
            <div className="br-size-tools" role="group" aria-label="Tamanho do texto bíblico">
              <button type="button" aria-label="Diminuir tamanho do texto" disabled={fontSize <= 20} onClick={() => setFontSize((size) => Math.max(20, size - 2))}>A−</button>
              <span aria-live="polite">{fontSize} px</span>
              <button type="button" aria-label="Aumentar tamanho do texto" disabled={fontSize >= 38} onClick={() => setFontSize((size) => Math.min(38, size + 2))}>A+</button>
            </div>
          </div>
          {copyMessage && <p className="br-copy-message" role="status">{copyMessage}</p>}
          {highlightedVerse ? <p className="br-highlight-note"><span aria-hidden="true" />Versículo {highlightedVerse} destacado. Leia também o que vem antes e depois.</p> : null}

          <ol className={`br-verses${readingMode === "continuous" ? " br-flow" : ""}`} style={{ "--br-text-size": `${fontSize}px` } as CSSProperties}>
            {chapter.verses.map((verse) => <li key={verse.number} value={verse.number} id={`versiculo-${verse.number}`} className={verse.number === highlightedVerse ? "br-verse-highlighted" : undefined}>
              <a className="br-verse-number" href={chapterUrl({ bookId: chapter.book.id, chapter: chapter.chapter }, verse.number)} aria-label={`${chapter.book.name} ${chapter.chapter}:${verse.number}, destacar versículo`}>{verse.number}</a>
              <span>{verse.text}</span>{" "}
            </li>)}
          </ol>

          <nav className="br-chapter-navigation" aria-label="Navegar entre capítulos">
            {chapter.prev ? <Link href={chapterUrl(chapter.prev)} prefetch={false}><ReaderIcon kind="arrow-left" /><span>Capítulo anterior</span></Link> : <span>Início desta edição</span>}
            {chapter.next ? <Link href={chapterUrl(chapter.next)} prefetch={false}><span>Próximo capítulo</span><ReaderIcon kind="arrow-right" /></Link> : <span>Fim desta edição</span>}
          </nav>

          <footer className="br-compact-source">
            <p>Bíblia Livre · Diego Santos, Mario Sérgio e Marco Teles · <a href={chapter.edition.licenseUrl} target="_blank" rel="noreferrer">CC BY 3.0 BR</a></p>
            <a href={chapter.edition.sourceUrl} target="_blank" rel="noreferrer">Consultar a fonte da edição<span className="br-sr-only"> (abre em outra aba)</span></a>
          </footer>
        </article>

        {!churchMode && <aside className="br-study-card" aria-labelledby="br-study-title">
          <span className="br-study-symbol" aria-hidden="true"><ReaderIcon kind="book" /></span>
          <p className="br-small-label">UM TEMPO COM A PALAVRA</p>
          <h3 id="br-study-title">Vamos escutar esta passagem?</h3>
          <p>Leia devagar. Há uma palavra que pede sua atenção? Permaneça um pouco nela e procure compreender o que essa passagem nos revela sobre Deus e a vida.</p>
          <Link href="/aprender">Ler com uma explicação ao lado <ReaderIcon kind="arrow-right" /></Link>
          <div className="br-study-tip"><strong>Suas perguntas têm lugar aqui.</strong><p>Se algo parecer difícil, você pode reler, anotar e voltar depois. Não é preciso transformar esse encontro em uma corrida.</p></div>
        </aside>}
      </div>

      <dialog className="br-book-dialog" data-bible-theme={theme} ref={bookDialog} aria-labelledby="br-book-dialog-title" onClose={returnFromBook}>
        <header className="br-book-dialog-header"><div><p className="br-small-label">{chapter.book.name} {chapter.chapter} · BÍBLIA LIVRE</p><h2 id="br-book-dialog-title">Sua Bíblia aberta</h2></div><div className="br-book-header-actions"><button type="button" className="br-book-passage" aria-label="Escolher livro, capítulo e versículo" onClick={event => openPassage(event.currentTarget)}><ReaderIcon kind="book" /><span>{chapter.book.name} {chapter.chapter}</span><span aria-hidden="true">⌄</span></button><button type="button" className="br-book-close" aria-label="Fechar modo livro" onClick={() => closeBook()}><ReaderIcon kind="close" /></button></div></header><div className="br-book-appearance">{themeControls}<button type="button" onClick={event => openPassage(event.currentTarget, true)}>Abrir Salmos</button></div>
        {bookOpen && <ScriptureBook bookName={chapter.book.name} chapterNumber={chapter.chapter} verses={chapter.verses} fontSize={fontSize} onFontSizeChange={setFontSize} highlightedVerse={highlightedVerse} onSimpleReading={() => closeBook(true)} />}
      </dialog>

      <dialog className="br-passage-dialog" data-bible-theme={theme} ref={passageDialog} aria-labelledby="br-passage-title" onClose={() => lastPassageTrigger.current?.focus({ preventScroll: true })}>
        <header className="br-passage-header"><div><p>SUA BÍBLIA ABERTA NO LUGAR CERTO</p><h2 id="br-passage-title">Encontre sua passagem.</h2></div><button type="button" aria-label="Fechar seleção de passagem" onClick={() => passageDialog.current?.close()}><ReaderIcon kind="close" /></button></header>
        <div className="br-passage-tabs" role="group" aria-label="Escolher parte da referência"><button type="button" aria-pressed={navStep === "books"} onClick={() => setNavStep("books")}>Livro</button><button type="button" aria-pressed={navStep === "chapters"} onClick={() => setNavStep("chapters")}>Capítulo</button><button type="button" aria-pressed={navStep === "verses"} onClick={() => setNavStep("verses")}>Versículo</button></div>
        <p className="br-passage-selected"><strong>{selectedBookData.name}</strong><span>{selectedChapter} · {selectedVerseCount} versículos</span></p>
        {navStep === "books" && <><label className="br-passage-search">Procurar um livro<input type="search" placeholder="Ex.: Salmos, Mateus, João…" value={bookQuery} onChange={event => setBookQuery(event.target.value)} autoComplete="off" /></label><div className="br-testament-tabs" role="group" aria-label="Filtrar livros por testamento">{(["all", "old", "new"] as const).map(item => <button key={item} type="button" aria-pressed={testament === item} onClick={() => setTestament(item)}>{item === "all" ? "Todos" : item === "old" ? "Antigo Testamento" : "Novo Testamento"}</button>)}</div><div className="br-passage-books">{shownBooks.map(book => <button key={book.id} type="button" aria-pressed={selectedBook === book.id} onClick={() => { setSelectedBook(book.id); setSelectedChapter(1); setNavStep("chapters"); }}><span>{book.name}</span><small>{book.chapters} {book.chapters === 1 ? "capítulo" : "capítulos"}</small></button>)}</div>{shownBooks.length === 0 && <p className="br-passage-empty">Experimente outro nome de livro.</p>}</>}
        {navStep === "chapters" && <div className="br-passage-number-grid" aria-label={`Capítulos de ${selectedBookData.name}`}>{Array.from({ length: selectedBookData.chapters }, (_, index) => <button key={index} type="button" aria-label={`${selectedBookData.name}, capítulo ${index + 1}`} aria-pressed={selectedChapter === index + 1} onClick={() => {setSelectedChapter(index + 1);setNavStep("verses");}}>{index + 1}</button>)}</div>}
        {navStep === "verses" && <div className="br-passage-number-grid" aria-label={`Versículos de ${selectedBookData.name} ${selectedChapter}`}>{Array.from({ length: selectedVerseCount }, (_, index) => <Link key={index} href={chapterUrl({ bookId: selectedBook, chapter: selectedChapter }, index + 1, bookOpen)} prefetch={false} aria-label={`Abrir ${selectedBookData.name} ${selectedChapter}:${index + 1}`} onClick={() => passageDialog.current?.close()}>{index + 1}</Link>)}</div>}
        <footer className="br-passage-footer"><p>O texto completo do capítulo acompanha sua escolha.</p><Link href={chapterUrl({ bookId: selectedBook, chapter: selectedChapter }, undefined, bookOpen)} prefetch={false} onClick={() => passageDialog.current?.close()}>Abrir {selectedBookData.name} {selectedChapter}<ReaderIcon kind="arrow-right" /></Link></footer>
      </dialog>

      <dialog className="br-source-dialog" data-bible-theme={theme} id="br-source" ref={sourceDialog} aria-labelledby="br-source-title">
        <div className="br-dialog-heading"><p className="br-small-label">EDIÇÃO E FONTES</p><button type="button" onClick={() => sourceDialog.current?.close()} aria-label="Fechar edição e fontes"><ReaderIcon kind="close" /></button></div>
        <h2 id="br-source-title">{chapter.edition.name}</h2>
        <p className="br-dialog-intro">{books.length} livros disponíveis nesta edição. A versão e a origem ajudam você a conferir cada leitura.</p>
        <section><h3>Créditos e licença</h3><p>{chapter.edition.attribution}</p><p>Licença: {chapter.edition.license}.</p><a href={chapter.edition.licenseUrl} target="_blank" rel="noreferrer">Ler a licença completa</a></section>
        <section><h3>Cobertura e versão</h3><p>{chapter.edition.canonNote}</p><p>{chapter.edition.editorialNote}</p></section>
        <section><h3>Conferir a origem</h3><p><a href={chapter.edition.sourceUrl} target="_blank" rel="noreferrer">Release original da edição</a></p><p><a href={chapter.edition.rightsEvidenceUrl} target="_blank" rel="noreferrer">Declaração de licença do projeto original</a></p></section>
        <button className="br-primary-button" type="button" onClick={() => sourceDialog.current?.close()}>Voltar à leitura</button>
      </dialog>
    </div>;
  return churchMode ? <main className="church-bible-shell" aria-label="Bíblia para acompanhar o culto">{content}</main> : <AppShell active="bible" title="Bíblia" subtitle="Abra a Palavra com o coração atento">{content}</AppShell>;
}
