import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpenText, MagnifyingGlass, Path } from "@phosphor-icons/react/ssr";
import { suggestedBibleTopics } from "@/content/bible/topics";
import type { BibleSearchResponse } from "@/lib/bible-search";
import "./bible-search.css";

function searchHref(query: string, page = 1) {
  const parameters = new URLSearchParams({ busca: query });
  if (page > 1) parameters.set("pagina", String(page));
  return `/biblia?${parameters.toString()}#busca-biblica`;
}

export function BibleSearch({ search }: { search: BibleSearchResponse }) {
  const pages = search.pageCount > 0 ? [...new Set([1, search.page - 1, search.page, search.page + 1, search.pageCount])].filter(page => page > 0 && page <= search.pageCount).sort((a, b) => a - b) : [];
  return <section id="busca-biblica" className="bsearch" aria-labelledby="bsearch-title" data-bible-search>
    <header className="bsearch-heading"><span className="bsearch-heading-icon"><MagnifyingGlass size={26} aria-hidden="true" /></span><div><p className="bsearch-eyebrow">SUA PERGUNTA TEM LUGAR NA PALAVRA</p><h2 id="bsearch-title">O que você deseja compreender?</h2><p>Procure palavras do texto ou comece por um tema. Vamos encontrar as passagens e ler ao redor delas.</p></div></header>
    <form action="/biblia#busca-biblica" method="get" role="search" aria-label="Buscar palavras ou temas na Bíblia" className="bsearch-form">
      <label htmlFor="bsearch-query">Palavra, expressão ou tema</label>
      <div className="bsearch-input-row"><input id="bsearch-query" name="busca" type="search" defaultValue={search.query} maxLength={120} placeholder="Ex.: batismo, perdão, Jesus chorou" autoComplete="off" /><button type="submit"><MagnifyingGlass size={21} aria-hidden="true" /><span>Buscar na Bíblia</span></button></div>
      <p className="bsearch-help">Acentos e maiúsculas não mudam a busca. Use aspas para uma expressão exata, como “Jesus chorou”.</p>
    </form>
    <nav className="bsearch-suggestions" aria-label="Temas para começar">{suggestedBibleTopics.map(topic => <Link key={topic} href={searchHref(topic)} prefetch={false}>{topic}</Link>)}</nav>
    {search.message && <p className="bsearch-message" role="status">{search.message}</p>}
    {search.searched && !search.message && <div className="bsearch-results" data-search-query={search.query}>
      <header className="bsearch-query-heading"><p>Explorando <strong>“{search.query}”</strong></p><Link href="/biblia#busca-biblica" prefetch={false}>Limpar busca</Link></header>
      {search.topics.length > 0 && <section className="bsearch-topics" aria-labelledby="bsearch-topics-title" data-search-topics>
        <div className="bsearch-section-heading"><Path size={23} aria-hidden="true" /><div><h3 id="bsearch-topics-title">Um caminho para estudar esse tema</h3><p>Seleção editorial por assunto. As passagens podem tratar do tema sem conter a palavra pesquisada.</p></div></div>
        {search.topics.map(topic => <article key={topic.id} className="bsearch-topic" data-search-topic={topic.id}><h4>{topic.title}</h4><p>{topic.introduction}</p><div className="bsearch-topic-readings">{topic.readings.map(reading => <details key={reading.href} className="bsearch-reading"><summary><BookOpenText size={20} aria-hidden="true" /><span>{reading.reference}</span><span className="bsearch-reading-action">Ler passagem <span aria-hidden="true">+</span></span></summary><div className="bsearch-reading-body"><p className="bsearch-reading-context">{reading.note}</p><blockquote>{reading.verses.map(verse => <p key={verse.verse}><sup>{verse.verse}</sup> {verse.text}</p>)}</blockquote><Link href={reading.href} prefetch={false}>Abrir o capítulo e ler o contexto <ArrowRight size={18} aria-hidden="true" /></Link></div></details>)}</div></article>)}
      </section>}
      <section className="bsearch-literal" aria-labelledby="bsearch-literal-title" data-search-literal data-search-total={search.total}>
        <div className="bsearch-section-heading"><BookOpenText size={23} aria-hidden="true" /><div><h3 id="bsearch-literal-title">Palavras encontradas no texto</h3><p>{search.total.toLocaleString("pt-BR")} {search.total === 1 ? "versículo contém" : "versículos contêm"} {search.terms.length > 1 ? "todos os termos pesquisados" : "a palavra pesquisada"}. Resultados em ordem bíblica, nesta edição.</p></div></div>
        {search.total === 0 ? <div className="bsearch-empty"><p>A forma exata dessa palavra não apareceu no texto desta edição.</p><p>{search.topics.length ? "Você pode começar pelas passagens do tema acima ou tentar outra palavra, como “batizar” em vez de “batismo”." : "Tente uma palavra mais simples ou outra expressão. Por exemplo: “perdão”, “perdoar” ou “misericórdia”."}</p></div> : <ol className="bsearch-verse-list" start={(search.page - 1) * search.pageSize + 1}>{search.results.map(verse => <li key={`${verse.bookId}-${verse.chapter}-${verse.verse}`} data-search-verse={`${verse.bookId}.${verse.chapter}.${verse.verse}`}><Link href={verse.href} prefetch={false}><span className="bsearch-reference">{verse.reference}<ArrowRight size={18} aria-hidden="true" /></span><span className="bsearch-verse-text">{verse.text}</span><span className="bsearch-context-link">Ler no contexto do capítulo</span></Link></li>)}</ol>}
        {search.pageCount > 1 && <nav className="bsearch-pagination" aria-label="Páginas de resultados bíblicos"><p>Página {search.page} de {search.pageCount}</p><div>{search.page > 1 && <Link href={searchHref(search.query, search.page - 1)} prefetch={false} aria-label="Resultados anteriores"><ArrowLeft size={19} aria-hidden="true" /></Link>}{pages.map((page, index) => <span key={page}>{index > 0 && page - pages[index - 1] > 1 && <span className="bsearch-page-gap" aria-hidden="true">…</span>}<Link href={searchHref(search.query, page)} prefetch={false} aria-label={`Página ${page} dos resultados`} aria-current={page === search.page ? "page" : undefined}>{page}</Link></span>)}{search.page < search.pageCount && <Link href={searchHref(search.query, search.page + 1)} prefetch={false} aria-label="Próximos resultados"><ArrowRight size={19} aria-hidden="true" /></Link>}</div></nav>}
      </section>
    </div>}
    <footer className="bsearch-footer">Busca nos 66 livros e 31.102 versículos da Bíblia Livre · TR 2018. Texto de Diego Santos, Mario Sérgio e Marco Teles, sob <a href="https://creativecommons.org/licenses/by/3.0/br/" target="_blank" rel="noreferrer">CC BY 3.0 BR</a>. Esta edição segue o cânon protestante; outros cânones cristãos incluem livros adicionais. Os guias temáticos são comentários editoriais, apresentados separadamente das Escrituras.</footer>
  </section>;
}
