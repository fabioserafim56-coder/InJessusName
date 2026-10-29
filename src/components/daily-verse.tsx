"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BookOpenText, Copy, SunHorizon } from "@phosphor-icons/react/ssr";
import type { DailyVerse as DailyVerseData } from "@/lib/daily-verse";
import "./daily-verse.css";

export function DailyVerse({ initialVerse }: { initialVerse: DailyVerseData }) {
  const [verse, setVerse] = useState(initialVerse);
  const [copyStatus, setCopyStatus] = useState("");
  const current = useRef(initialVerse.date);
  useEffect(() => {
    let active = true;
    let fetching = false;
    const controller = new AbortController();
    const refresh = async () => {
      if (document.visibilityState === "hidden" || fetching) return;
      const parts = new Intl.DateTimeFormat("en-CA", { timeZone: initialVerse.timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
      const part = (name: string) => parts.find((item) => item.type === name)?.value;
      const today = `${part("year")}-${part("month")}-${part("day")}`;
      if (today === current.current) return;
      fetching = true;
      try {
        const response = await fetch("/api/daily-verse", { cache: "no-store", signal: controller.signal });
        if (!response.ok) return;
        const next: DailyVerseData = await response.json();
        if (active && typeof next.date === "string" && typeof next.text === "string") {
          current.current = next.date;
          setVerse(next);
          setCopyStatus("");
        }
      } catch { /* Retry on the next visible minute; keep the last complete reading. */ }
      finally { fetching = false; }
    };
    const timer = window.setInterval(refresh, 15_000);
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("focus", refresh);
    void refresh();
    return () => { active = false; controller.abort(); clearInterval(timer); document.removeEventListener("visibilitychange", refresh); window.removeEventListener("focus", refresh); };
  }, [initialVerse.timeZone]);
  async function copy() {
    try { await navigator.clipboard.writeText(`${verse.text}\n${verse.reference} — ${verse.edition}\n${verse.attribution}`); setCopyStatus("Versículo e referência copiados."); }
    catch { setCopyStatus("Você pode selecionar o texto e copiar junto com a referência."); }
  }
  const displayDate = verse.date.split("-").reverse().join("/");
  return <section className="daily-verse" aria-labelledby="daily-verse-title" data-daily-date={verse.date}>
    <header><p><SunHorizon size={19} aria-hidden="true" /> VERSÍCULO DO DIA</p><time dateTime={verse.date}>{displayDate}</time></header>
    <div className="dv-reading"><div><h2 id="daily-verse-title">{verse.title}</h2><blockquote>{verse.text}</blockquote><Link className="dv-reference" href={verse.href}>{verse.reference}<BookOpenText size={18} aria-hidden="true" /></Link></div><aside><p className="dv-context-title">LEVE A PASSAGEM COM VOCÊ</p><p>{verse.context}</p><Link href={verse.href}>Ler no contexto <span aria-hidden="true">↗</span></Link></aside></div>
    <footer><p>{verse.edition} · <a href={verse.licenseUrl} target="_blank" rel="noreferrer">{verse.attribution}</a><span>Uma nova leitura a cada dia, pelo horário de Brasília.</span></p><button type="button" onClick={copy}><Copy size={18} aria-hidden="true" />Copiar versículo</button></footer><p role="status" className="dv-copy-status">{copyStatus}</p>
  </section>;
}
