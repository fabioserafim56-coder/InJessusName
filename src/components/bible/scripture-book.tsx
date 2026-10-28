"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { FlipCorner, PageFlip, SizeType } from "page-flip";
import "./scripture-book.css";

type Verse = { number: number; text: string };
type Fragment = { verse: number; text: string; continued: boolean };

// The published runtime accepts these literal strings; its declarations model
// them as enums, but the browser bundle exports only PageFlip at runtime.
const fixedSize = "fixed" as SizeType;
const topCorner = "top" as FlipCorner;
const bottomCorner = "bottom" as FlipCorner;

type ScriptureBookProps = {
  bookName: string;
  chapterNumber: number;
  verses: readonly Verse[];
  fontSize: number;
  highlightedVerse?: number;
  onSimpleReading: () => void;
};

function makeFragment(fragment: Fragment, highlightedVerse?: number) {
  const paragraph = document.createElement("p");
  paragraph.className = `sb-verse${fragment.verse === highlightedVerse ? " sb-highlight" : ""}`;
  paragraph.dataset.verseNumber = String(fragment.verse);
  paragraph.dataset.verse = String(fragment.verse);
  paragraph.dataset.continued = String(fragment.continued);
  const number = document.createElement("sup");
  number.textContent = `${fragment.verse}${fragment.continued ? "…" : ""}`;
  number.setAttribute("aria-label", `Versículo ${fragment.verse}${fragment.continued ? ", continuação" : ""}`);
  const text = document.createElement("span");
  text.dataset.verseText = "";
  text.textContent = fragment.text;
  paragraph.append(number, text);
  return paragraph;
}

// The browser measures the exact font, line spacing and available paper area.
// Very long verses may continue on the next leaf; every original character is retained.
function paginate(verses: readonly Verse[], measure: HTMLElement, availableHeight: number) {
  const pages: Fragment[][] = [];
  let page: Fragment[] = [];
  const fits = (fragment: Fragment) => {
    const node = makeFragment(fragment);
    measure.append(node);
    const result = measure.scrollHeight <= availableHeight;
    node.remove();
    return result;
  };
  const commit = (fragment: Fragment) => { page.push(fragment); measure.append(makeFragment(fragment)); };
  const nextPage = () => { if (page.length) pages.push(page); page = []; measure.replaceChildren(); };
  for (const verse of verses) {
    const words = verse.text.match(/\s*\S+\s*/gu) ?? [verse.text];
    let offset = 0;
    while (offset < words.length) {
      const fragment = { verse: verse.number, text: words.slice(offset).join(""), continued: offset > 0 };
      if (fits(fragment)) { commit(fragment); break; }
      let low = 0;
      let high = words.length - offset;
      while (low < high) {
        const middle = Math.ceil((low + high) / 2);
        if (fits({ ...fragment, text: words.slice(offset, offset + middle).join("") })) low = middle;
        else high = middle - 1;
      }
      if (low === 0 && page.length) { nextPage(); continue; }
      // One unbreakable token still wraps with overflow-wrap:anywhere in the paper.
      const count = Math.max(1, low);
      commit({ ...fragment, text: words.slice(offset, offset + count).join("") });
      offset += count;
      nextPage();
    }
  }
  nextPage();
  for (const verse of verses) {
    const reconstructed = pages.flat().filter((item) => item.verse === verse.number).map((item) => item.text).join("");
    if (reconstructed !== verse.text) throw new Error("O texto paginado precisa corresponder integralmente à edição.");
  }
  return pages;
}

function cover(back = false) {
  const page = document.createElement("div");
  page.className = "sb-leaf sb-leather-cover";
  page.dataset.density = "hard";
  const frame = document.createElement("div");
  frame.className = "sb-cover-frame";
  const detail = document.createElement("span");
  detail.className = "sb-cover-detail";
  detail.textContent = "✦";
  detail.setAttribute("aria-hidden", "true");
  const title = document.createElement("strong");
  title.textContent = back ? "A Palavra permanece." : "BÍBLIA";
  const subtitle = document.createElement("span");
  subtitle.textContent = back ? "Volte sempre que precisar." : "SAGRADA";
  const edition = document.createElement("small");
  edition.textContent = "BÍBLIA LIVRE · TR 2018";
  frame.append(detail, title, subtitle, edition);
  page.append(frame);
  return page;
}

export function ScriptureBook({ bookName, chapterNumber, verses, fontSize, highlightedVerse, onSimpleReading }: ScriptureBookProps) {
  const stage = useRef<HTMLDivElement>(null);
  const engineHost = useRef<HTMLDivElement>(null);
  const engine = useRef<PageFlip | null>(null);
  const reduced = useRef(false);
  const [status, setStatus] = useState({ ready: false, failed: false, page: 0, count: 0, textPages: 0, state: "loading" });

  useEffect(() => {
    const host = engineHost.current;
    const container = stage.current;
    if (!host || !container) return;
    let disposed = false;
    let frame = 0;
    let measuredWidth = 0;
    let rebuild = 0;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduced.current = media.matches;
    const onPreference = () => { reduced.current = media.matches; };
    media.addEventListener("change", onPreference);

    async function createBook() {
      const thisBuild = ++rebuild;
      const { PageFlip: Flip } = await import("page-flip");
      await document.fonts.ready;
      if (disposed || thisBuild !== rebuild) return;
      engine.current?.destroy();
      engine.current = null;
      // StPageFlip owns only this disposable mount, never React's host element.
      host!.replaceChildren();
      const mount = document.createElement("div");
      mount.className = "sb-engine-mount";
      host!.append(mount);
      const totalWidth = Math.floor(container!.clientWidth);
      const spread = totalWidth >= 680;
      const width = Math.min(410, spread ? Math.floor(totalWidth / 2) - 8 : totalWidth - 12);
      const height = Math.min(640, Math.max(300, Math.floor(window.innerHeight - 280)));
      container!.style.setProperty("--sb-page-height", `${height}px`);
      container!.style.setProperty("--sb-page-width", `${width}px`);
      const padding = width < 330 ? 23 : 34;
      container!.style.setProperty("--sb-page-padding", `${padding}px`);
      const contentHeight = height - 132;
      const measure = document.createElement("div");
      measure.className = "sb-paper-text sb-measure";
      measure.style.cssText = `width:${width - padding * 2 - 2}px;font-size:${fontSize}px;`;
      container!.append(measure);
      const pages = paginate(verses, measure, contentHeight);
      measure.remove();
      const leaves: HTMLElement[] = [cover()];
      pages.forEach((fragments, index) => {
        const leaf = document.createElement("div");
        leaf.className = "sb-leaf sb-paper";
        leaf.dataset.bookPage = String(index + 1);
        leaf.setAttribute("role", "group");
        leaf.setAttribute("aria-label", `${bookName} ${chapterNumber}, página ${index + 1}`);
        const header = document.createElement("div");
        header.className = "sb-paper-header";
        header.textContent = `${bookName.toLocaleUpperCase("pt-BR")} · ${chapterNumber}`;
        const content = document.createElement("div");
        content.className = "sb-paper-text";
        content.style.fontSize = `${fontSize}px`;
        content.style.height = `${contentHeight}px`;
        fragments.forEach((fragment) => content.append(makeFragment(fragment, highlightedVerse)));
        const footer = document.createElement("div");
        footer.className = "sb-paper-footer";
        footer.textContent = `${index + 1}  /  ${pages.length}`;
        leaf.append(header, content, footer);
        leaves.push(leaf);
      });
      if (pages.length % 2) {
        const last = document.createElement("div");
        last.className = "sb-leaf sb-paper sb-end-leaf";
        const line = document.createElement("p");
        line.textContent = `Fim de ${bookName} ${chapterNumber}`;
        const invitation = document.createElement("span");
        invitation.textContent = "Guarde uma palavra para levar ao seu dia.";
        last.append(line, invitation);
        leaves.push(last);
      }
      leaves.push(cover(true));
      mount.append(...leaves);
      const flip = new Flip(mount, { width, height, size: fixedSize, minWidth: width, maxWidth: width, minHeight: height, maxHeight: height, showCover: true, usePortrait: !spread, autoSize: false, maxShadowOpacity: .35, drawShadow: true, flippingTime: media.matches ? 1 : 650, startZIndex: 1, mobileScrollSupport: true, useMouseEvents: !media.matches, swipeDistance: 35, showPageCorners: !media.matches, clickEventForward: false });
      engine.current = flip;
      let opening = true;
      const publish = (ready: boolean, state: string) => {
        if (disposed || thisBuild !== rebuild) return;
        const current = flip.getCurrentPageIndex();
        // Hidden leaves must not be announced as if they were the current page.
        const portrait = flip.getOrientation() === "portrait";
        leaves.forEach((leaf, index) => leaf.setAttribute("aria-hidden", String(index !== current && (portrait || index !== current + 1))));
        setStatus({ ready, failed: false, page: current, count: leaves.length, textPages: pages.length, state });
      };
      flip.on("flip", () => publish(!opening && flip.getState() === "read", flip.getState()));
      flip.on("changeState", (event) => publish(!opening && event.data === "read", String(event.data)));
      flip.loadFromHTML(leaves);
      publish(false, "opening");
      frame = requestAnimationFrame(() => {
        if (disposed || engine.current !== flip) return;
        opening = false;
        const target = highlightedVerse ? pages.findIndex((fragments) => fragments.some((fragment) => fragment.verse === highlightedVerse)) + 1 : 1;
        if (media.matches || highlightedVerse) { flip.turnToPage(Math.max(1, target)); publish(true, "read"); }
        else flip.flipNext(topCorner);
      });
    }
    const load = () => { void createBook().catch(() => { if (!disposed) setStatus({ ready: false, failed: true, page: 0, count: 0, textPages: 0, state: "failed" }); }); };
    const observer = new ResizeObserver((entries) => {
      const width = Math.floor(entries[0]?.contentRect.width ?? 0);
      if (width > 0 && width !== measuredWidth) { measuredWidth = width; load(); }
    });
    observer.observe(container);
    return () => {
      disposed = true;
      rebuild++;
      cancelAnimationFrame(frame);
      observer.disconnect();
      media.removeEventListener("change", onPreference);
      engine.current?.destroy();
      engine.current = null;
    };
  }, [bookName, chapterNumber, verses, fontSize, highlightedVerse]);

  function turn(direction: "next" | "previous") {
    const flip = engine.current;
    if (!flip) return;
    if (reduced.current) {
      if (direction === "next") flip.turnToNextPage();
      else flip.turnToPrevPage();
    } else if (direction === "next") flip.flipNext(bottomCorner);
    else flip.flipPrev(bottomCorner);
  }
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey || ["INPUT", "SELECT", "TEXTAREA"].includes((event.target as HTMLElement).tagName)) return;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); turn(event.key === "ArrowRight" ? "next" : "previous"); }
  }
  return <div className="scripture-book" onKeyDown={onKeyDown}>
    <div className="sb-book-stage" ref={stage} aria-busy={!status.ready && !status.failed}>
      {status.count === 0 && <p className="sb-loading" role="status">{status.failed ? "O modo livro não abriu agora. A leitura simples continua disponível." : "Preparando as páginas da sua Bíblia…"}</p>}
      <div ref={engineHost} className="sb-engine-host" data-book-ready={status.ready} data-book-state={status.state} data-current-page={status.page} data-page-count={status.count} data-verse-count={verses.length} />
    </div>
    <div className="sb-book-controls"><button type="button" onClick={() => turn("previous")} disabled={!status.ready || status.page === 0} aria-label="Virar página para trás"><span aria-hidden="true">←</span><span>Voltar</span></button><p aria-live="polite">{status.ready ? status.page === 0 ? "A capa da sua Bíblia" : status.page > status.textPages ? "Fim deste capítulo" : `Página ${status.page} de ${status.textPages}` : "Um instante de cuidado"}</p><button type="button" onClick={() => turn("next")} disabled={!status.ready || status.page >= status.count - 1} aria-label="Virar página para frente"><span>Virar página</span><span aria-hidden="true">→</span></button></div>
    <div className="sb-mode-note"><span>Arraste o canto da folha ou use as setas.</span><button type="button" onClick={onSimpleReading}>Prefiro a leitura simples</button></div>
  </div>;
}
