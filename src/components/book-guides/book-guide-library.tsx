"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, BookOpenText, MagnifyingGlass } from "@phosphor-icons/react/ssr";
import type { BookGuideSummary } from "@/content/book-guides";

function normalize(value: string) { return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR"); }

export function BookGuideLibrary({ books }: { books: BookGuideSummary[] }) {
  const [query, setQuery] = useState("");
  const [testament, setTestament] = useState("");
  const shown = useMemo(() => books.filter(book => (!testament || book.testament === testament) && normalize(`${book.name} ${book.genre} ${book.themes.join(" ")}`).includes(normalize(query.trim()))), [books, query, testament]);
  const groups = [...new Set(shown.map(book => book.category))];
  return <section className="book-guide-library" aria-label="Guias dos livros bíblicos">
    <div className="bgl-controls"><label className="bgl-search"><MagnifyingGlass size={22} aria-hidden="true" /><span className="sr-only">Procurar um livro ou tema nesta biblioteca</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Ex.: Gênesis, esperança, justiça…" maxLength={100} /></label><label><span className="sr-only">Filtrar testamento</span><select value={testament} onChange={event => setTestament(event.target.value)}><option value="">Toda a biblioteca</option><option>Antigo Testamento</option><option>Novo Testamento</option></select></label></div>
    <p className="bgl-count" role="status">{shown.length} de {books.length} livros disponíveis para conhecer.</p>
    <noscript><p>Todos os guias estão listados abaixo. Você também pode usar a busca do navegador para localizar um livro.</p></noscript>
    {groups.map(group => <section key={group} className="bgl-group" aria-label={group}><header><p>{shown.find(book => book.category === group)?.testament}</p><h2>{group}</h2></header><ol className="bgl-grid">{shown.filter(book => book.category === group).map(book => <li key={book.id} data-book-guide={book.id}><Link href={`/biblioteca/${book.id}`} prefetch={false}><span className="bgl-book-number" aria-hidden="true">{String(book.number).padStart(2, "0")}</span><div><span className="bgl-book-meta">{book.chapters} {book.chapters === 1 ? "capítulo" : "capítulos"}</span><h3>{book.name}</h3><p>{book.genre}</p><div className="bgl-themes">{book.themes.map(theme => <span key={theme}>{theme}</span>)}</div></div><span className="bgl-open"><BookOpenText size={19} aria-hidden="true" />Conhecer este livro<ArrowRight size={18} aria-hidden="true" /></span></Link></li>)}</ol></section>)}
    {!shown.length && <div className="bgl-empty"><h2>Vamos procurar por outra palavra?</h2><p>Experimente o nome de um livro ou um tema mais simples, como amor, justiça ou oração.</p><button type="button" onClick={() => { setQuery(""); setTestament(""); }}>Voltar aos 66 livros</button></div>}
  </section>;
}
