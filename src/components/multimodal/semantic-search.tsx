"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { ArrowUpRight, BookOpenText, MagnifyingGlass, Sparkle } from "@phosphor-icons/react/ssr";
import { semanticModel, type SemanticResult, type SemanticWorkerReply } from "@/lib/semantic/types";
import "./semantic-search.css";

type Props = { query?: string; initialQuery?: string; onQueryChange?: (query: string) => void };
const examples = ["Como perdoar alguém que me machucou?", "Estou preocupado e preciso de descanso.", "Por que Jesus multiplicou os pães?"];
const subscribeToHydration = () => () => {};

export function SemanticSearch({ query, initialQuery = "", onQueryChange }: Props) {
  const interactive = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const [ownQuery, setOwnQuery] = useState(initialQuery);
  const value = query ?? ownQuery;
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "searching" | "error">("idle");
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState<number | null>(null);
  const [results, setResults] = useState<SemanticResult[]>([]);
  const [searched, setSearched] = useState("");
  const [count, setCount] = useState<number | null>(null);
  const worker = useRef<Worker | null>(null);
  const pending = useRef("");
  const active = useRef(false);
  const resultHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => () => worker.current?.terminate(), []);

  function change(next: string) { setOwnQuery(next); onQueryChange?.(next); }
  function createWorker() {
    if (worker.current) return worker.current;
    if (typeof Worker === "undefined" || typeof WebAssembly === "undefined") throw new Error("Este navegador não oferece o processamento da busca. A pesquisa por palavras continua disponível.");
    const current = new Worker(new URL("./semantic-worker.ts", import.meta.url), { type: "module" });
    current.onmessage = (event: MessageEvent<SemanticWorkerReply>) => {
      if (worker.current !== current) return;
      const reply = event.data;
      if (reply.type === "progress") { setMessage(reply.message); setProgress(reply.progress ?? null); }
      if (reply.type === "ready") {
        setCount(reply.count); setProgress(null); setMessage("As leituras estão prontas para sua pergunta.");
        if (pending.current) { setStatus("searching"); current.postMessage({ type: "search", query: pending.current }); pending.current = ""; }
        else { active.current = false; setStatus("ready"); }
      }
      if (reply.type === "results") {
        active.current = false; setResults(reply.results); setSearched(reply.query); setStatus("ready"); setMessage("Abra uma leitura e confira o capítulo com calma.");
        requestAnimationFrame(() => resultHeading.current?.focus({ preventScroll: true }));
      }
      if (reply.type === "error") { active.current = false; setStatus("error"); setMessage(reply.message); setProgress(null); current.terminate(); worker.current = null; pending.current = ""; }
    };
    current.onerror = () => { if (worker.current !== current) return; active.current = false; setStatus("error"); setMessage("A busca não conseguiu iniciar neste dispositivo. Tente novamente ou procure pelas palavras da sua pergunta."); setProgress(null); current.terminate(); worker.current = null; pending.current = ""; };
    worker.current = current;
    return current;
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (active.current) return;
    const text = value.replace(/\s+/g, " ").trim();
    if (text.length < 4) { setMessage("Conte sua pergunta com pelo menos quatro caracteres."); return; }
    try {
      const current = createWorker();
      active.current = true;
      if (status === "ready") { setStatus("searching"); setMessage("Procurando leituras relacionadas à sua pergunta…"); current.postMessage({ type: "search", query: text }); }
      else { pending.current = text; setStatus("loading"); setMessage("Preparando a busca. Você pode continuar explorando esta página."); current.postMessage({ type: "load" }); }
    } catch (error) { active.current = false; setStatus("error"); setMessage(error instanceof Error ? error.message : "Não foi possível preparar a busca."); }
  }
  function stop() { worker.current?.terminate(); worker.current = null; pending.current = ""; active.current = false; setStatus("idle"); setProgress(null); setMessage("Preparação interrompida. Você pode tentar novamente quando desejar."); }
  const busy = status === "loading" || status === "searching";
  return <section className="semantic-search" data-semantic-search data-semantic-status={status} data-semantic-interactive={interactive} aria-labelledby="semantic-search-title">
    <header><span className="ss-symbol"><Sparkle size={25} aria-hidden="true" /></span><div><p className="ss-eyebrow">TRAGA SUA PERGUNTA À PALAVRA</p><h2 id="semantic-search-title">Há uma leitura para acompanhar sua pergunta.</h2><p>Escreva do seu jeito. Vamos procurar passagens relacionadas ao sentido do que você deseja compreender.</p></div></header>
    <form onSubmit={submit}><label htmlFor="semantic-query">O que você deseja compreender?</label><textarea id="semantic-query" value={value} onChange={event => change(event.target.value)} minLength={4} maxLength={280} rows={3} placeholder="Como perdoar alguém que me machucou?" disabled={!interactive} />{status === "idle" && <p className="ss-prepare-note">A primeira busca prepara cerca de {semanticModel.downloadMegabytes} MB do modelo neste aparelho, além do motor de processamento. Isso pode levar alguns minutos; a pesquisa por palavras continua disponível abaixo.</p>}<div className="ss-form-actions"><button type="submit" disabled={!interactive || busy || value.trim().length < 4}><MagnifyingGlass size={19} aria-hidden="true" />{status === "loading" ? "Preparando a busca…" : status === "searching" ? "Procurando leituras…" : status === "ready" ? "Buscar pelo sentido" : "Preparar e buscar pelo sentido"}</button>{busy && <button type="button" className="ss-stop" onClick={stop}>Interromper</button>}</div></form>
    <div className="ss-examples" aria-label="Exemplos de perguntas">{examples.map(example => <button type="button" key={example} disabled={!interactive} onClick={() => change(example)}>{example}</button>)}</div>
    <p className="ss-status" role="status">{message}</p>{progress !== null && <progress aria-label="Preparação do arquivo de busca" max={100} value={progress} />}
    {searched && <div className="ss-results" data-semantic-results><h3 tabIndex={-1} ref={resultHeading}>Leituras para explorar com sua pergunta</h3><p>Você perguntou: <strong>{searched}</strong>. As aproximações sugerem um começo; acompanhe também o contexto de cada passagem.</p>{results.map(result => <article key={result.id} data-semantic-result={result.id}><div className="ss-result-heading"><BookOpenText size={20} aria-hidden="true" /><div><small>{result.title}</small><h4>{result.reference}</h4></div></div><p>{result.context}</p><details><summary>Ler o trecho bíblico completo</summary><blockquote>{result.text}</blockquote><small>Bíblia Livre · TR 2018 · <a href="https://creativecommons.org/licenses/by/3.0/br/" target="_blank" rel="noreferrer">CC BY 3.0 BR</a></small></details><div className="ss-result-links"><Link href={result.href} prefetch={false}>Abrir o capítulo <ArrowUpRight size={17} aria-hidden="true" /></Link><Link href={result.sourceHref} prefetch={false}>Acompanhar o estudo <ArrowUpRight size={17} aria-hidden="true" /></Link></div></article>)}</div>}
    <details className="ss-about"><summary>Como esta busca acompanha a leitura?</summary><p>Este recurso usa o modelo aberto multilingual E5 no seu navegador. Na primeira preparação, baixa cerca de {semanticModel.downloadMegabytes} MB do modelo, além do motor de processamento, e pode demorar em celulares. A consulta permanece neste dispositivo; os arquivos do modelo podem ser mantidos no cache pelo navegador.</p><p>A busca reúne uma seleção de passagens dos 52 temas, 66 guias de livros, 24 etapas e 15 histórias{count ? `, com ${count} entradas de estudo` : ""}. A aproximação de sentido não é uma explicação gerada nem uma pesquisa semântica em todos os versículos.</p><a href="/semantic/proveniencia.json" target="_blank" rel="noreferrer">Fontes, modelo e alcance desta seleção</a></details>
    <p className="ss-literal">Para procurar as palavras na edição inteira, <Link href={`/biblia?busca=${encodeURIComponent(value.trim())}#busca-biblica`} prefetch={false}>abrir a busca nos 31.102 versículos <ArrowUpRight size={15} aria-hidden="true" /></Link>.</p>
    <noscript><p>A aproximação de sentido precisa de JavaScript. A pesquisa por palavras continua disponível no link acima.</p></noscript>
  </section>;
}
