"use client";

import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import { AppIcon } from "@/components/app-shell";
import { LessonCard } from "@/components/lesson-card";
import type { CatalogLesson } from "@/lib/course-catalog";

export function CourseCatalog({ lessons }: { lessons: readonly CatalogLesson[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");
  const search = useMemo(() => new Fuse(lessons, { keys: [{ name: "title", weight: 0.55 }, { name: "description", weight: 0.3 }, { name: "reference", weight: 0.15 }], threshold: 0.35, ignoreDiacritics: true, ignoreLocation: true, minMatchCharLength: 2 }), [lessons]);
  const matches = query.trim() ? search.search(query.trim()).map((result) => result.item) : lessons;
  const shown = matches.filter((lesson) => category === "Todas" || lesson.category === category);
  return <section className="course-catalog" aria-label="Aulas disponíveis">
    <div className="catalog-controls"><div className="catalog-categories" role="group" aria-label="Filtrar por tema">{["Todas", "Fundamentos", "Vida cristã"].map((item) => <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)}>{item}<span>{item === "Todas" ? lessons.length : lessons.filter((lesson) => lesson.category === item).length}</span></button>)}</div><label className="catalog-search"><AppIcon name="search" /><span className="sr-only">Buscar aulas</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar aulas ou passagens" /></label></div>
    <p className="catalog-count" role="status">{shown.length} aula{shown.length !== 1 ? "s" : ""} disponível{shown.length !== 1 ? "is" : ""}{query && ` para “${query}”`}</p>
    {shown.length ? <div className="lesson-card-grid">{shown.map((lesson) => <LessonCard key={lesson.id} lesson={lesson} />)}</div> : <div className="catalog-empty"><AppIcon name="search" /><h2>Vamos procurar por outro caminho?</h2><p>Você pode buscar um tema que esteja no seu coração, como oração, criação ou cuidado com o próximo.</p><button className="app-secondary-button" onClick={() => { setQuery(""); setCategory("Todas"); }}>Voltar a todos os estudos</button></div>}
  </section>;
}
