"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import { MuseumIcon } from "./museum-icons";
import type { MuseumExhibit } from "@/content/museum";
import "./museum.css";

export function MuseumGallery({ exhibits }: { exhibits: readonly MuseumExhibit[] }) {
  const [query, setQuery] = useState("");
  const [era, setEra] = useState("all");
  const [type, setType] = useState("all");
  const chronological = useMemo(() => [...exhibits].sort((a, b) => a.startYear - b.startYear), [exhibits]);
  const search = useMemo(() => new Fuse([...exhibits], { keys: ["title", "subtitle", "introduction", "place", "period", "collection"], threshold: .34, ignoreDiacritics: true, ignoreLocation: true }), [exhibits]);
  const found = query.trim() ? search.search(query.trim()).map((item) => item.item) : chronological;
  const shown = found.filter((item) => (era === "all" || item.era === era) && (type === "all" || item.objectType === type));
  const eras = [...new Set(exhibits.map((item) => item.era))];
  const types = [...new Set(exhibits.map((item) => item.objectType))];
  const featured = chronological[0];

  return <div className="museum-page">
    <section className="museum-welcome" aria-labelledby="museum-title"><div className="museum-welcome-copy"><span className="museum-eyebrow"><MuseumIcon name="museum" />CAMINHOS DE MEMÓRIA E FÉ</span><h1 id="museum-title">Museu da<br />história bíblica</h1><p>Há histórias que chegaram até nós pela Palavra. Há também vestígios do mundo em que elas foram vividas. Venha olhar de perto, aprender com cuidado e deixar nascer novas perguntas.</p><a href="#museum-collection" className="museum-primary-link">Entrar no acervo <MuseumIcon name="arrow" /></a><span className="museum-collection-size">Acervo inicial · {exhibits.length} peças para conhecer</span></div>{featured && <Link href={`/museu/${featured.id}`} className="museum-welcome-art" aria-label={`Conhecer ${featured.title}`}><Image src={featured.image.src} alt={featured.image.alt} fill sizes="(max-width: 760px) 100vw, 45vw" className="museum-featured-image" preload /><span className="museum-featured-caption"><span>UM ENCONTRO COM O PASSADO</span><strong>{featured.title}</strong><span>{featured.approxDate}</span></span><span className="museum-photo-tag">Fotografia da peça</span></Link>}</section>

    <section className="museum-invitation" aria-labelledby="museum-invitation-title"><span className="museum-invitation-icon"><MuseumIcon name="spark" /></span><div><h2 id="museum-invitation-title">Vamos caminhar com reverência e curiosidade.</h2><p>Cada peça tem uma história. Ao lado dela, encontraremos o contexto, uma passagem para ler e as perguntas que a pesquisa ainda mantém abertas.</p></div></section>

    <section className="museum-timeline-section" aria-labelledby="museum-timeline-title"><div className="museum-section-heading"><div><span className="museum-eyebrow">PELOS CAMINHOS DO TEMPO</span><h2 id="museum-timeline-title">Do vestígio à história.</h2></div><p>Um percurso da peça mais antiga à mais recente. As datas são aproximadas.</p></div><ol className="museum-timeline" aria-label="Linha do tempo das peças">{chronological.map((item) => <li key={item.id}><Link href={`/museu/${item.id}`}><span className="museum-timeline-dot" aria-hidden="true" /><span className="museum-timeline-date">{item.approxDate}</span><strong>{item.title}</strong><span>{item.place}</span></Link></li>)}</ol></section>

    <section id="museum-collection" className="museum-collection" aria-labelledby="museum-collection-title"><div className="museum-section-heading"><div><span className="museum-eyebrow">PARE UM POUCO. OLHE DE PERTO.</span><h2 id="museum-collection-title">Peças que guardam memória.</h2></div></div><div className="museum-filters"><label className="museum-search"><MuseumIcon name="search" /><span className="museum-sr-only">Buscar no museu</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Uma peça, um lugar, uma história…" /></label><label className="museum-filter-field"><span>Período histórico</span><select value={era} onChange={(event) => setEra(event.target.value)}><option value="all">Todos os períodos</option>{eras.map((item) => <option key={item} value={item}>{item}</option>)}</select></label><label className="museum-filter-field"><span>Tipo de peça</span><select value={type} onChange={(event) => setType(event.target.value)}><option value="all">Todos os tipos</option>{types.map((item) => <option key={item} value={item}>{item}</option>)}</select></label></div><p className="museum-result-count" role="status">{shown.length} peça{shown.length === 1 ? "" : "s"} para conhecer{query.trim() && ` nesta busca por “${query.trim()}”`}</p>
      {shown.length ? <div className="museum-exhibit-grid">{shown.map((item) => <Link key={item.id} href={`/museu/${item.id}`} className="museum-exhibit-card" aria-label={`Conhecer ${item.title}`}><div className="museum-card-image"><Image src={item.image.src} alt={item.image.alt} fill sizes="(max-width: 600px) 100vw, (max-width: 1100px) 50vw, 33vw" /><span className="museum-card-period">{item.approxDate}</span></div><div className="museum-card-copy"><span className="museum-card-type">{item.objectType}</span><h3>{item.title}</h3><p>{item.subtitle}</p><div className="museum-card-footer"><span><MuseumIcon name="location" />{item.place}</span><span className="museum-card-arrow"><MuseumIcon name="arrow" /></span></div></div></Link>)}</div> : <div className="museum-empty"><MuseumIcon name="search" /><h3>Vamos procurar por outro caminho?</h3><p>Tente um nome mais curto ou escolha outro período. Há outras histórias esperando por você.</p><button type="button" className="museum-secondary-button" onClick={() => { setQuery(""); setEra("all"); setType("all"); }}>Ver todo o acervo</button></div>}
    </section>

    <aside className="museum-visit-note"><MuseumIcon name="book" /><div><h2>O encontro continua na Palavra.</h2><p>A arqueologia nos ajuda a conhecer o mundo antigo. Nossa leitura da Bíblia merece também oração, contexto e a humildade de continuar aprendendo.</p><Link href="/biblia">Abrir a Bíblia <MuseumIcon name="arrow" /></Link></div></aside>
  </div>;
}
