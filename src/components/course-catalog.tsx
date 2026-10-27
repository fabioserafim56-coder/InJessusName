"use client";

import { useState } from "react";
import { AppIcon } from "@/components/app-shell";
import { LessonCard } from "@/components/lesson-card";
import type { CatalogLesson } from "@/lib/course-catalog";

function normalize(value: string) { return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); }

export function CourseCatalog({ lessons }: { lessons: readonly CatalogLesson[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");
  const shown = lessons.filter((lesson) => (category === "Todas" || lesson.category === category) && normalize(`${lesson.title} ${lesson.description} ${lesson.reference}`).includes(normalize(query.trim())));
  return <section className="course-catalog" aria-label="Aulas disponíveis">
    <div className="catalog-controls"><div className="catalog-categories" role="group" aria-label="Filtrar por tema">{["Todas", "Fundamentos", "Vida cristã"].map((item) => <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)}>{item}<span>{item === "Todas" ? lessons.length : lessons.filter((lesson) => lesson.category === item).length}</span></button>)}</div><label className="catalog-search"><AppIcon name="search" /><span className="sr-only">Buscar aulas</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar aulas ou passagens" /></label></div>
    <p className="catalog-count" role="status">{shown.length} aula{shown.length !== 1 ? "s" : ""} disponível{shown.length !== 1 ? "is" : ""}{query && ` para “${query}”`}</p>
    {shown.length ? <div className="lesson-card-grid">{shown.map((lesson) => <LessonCard key={lesson.id} lesson={lesson} />)}</div> : <div className="catalog-empty"><AppIcon name="search" /><h2>Vamos tentar outra busca?</h2><p>Procure por um tema, como criação, oração ou cuidado com o próximo.</p><button className="app-secondary-button" onClick={() => { setQuery(""); setCategory("Todas"); }}>Mostrar todas as aulas</button></div>}
  </section>;
}
