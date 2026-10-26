"use client";

import { useRef, useState, type KeyboardEvent } from "react";

const chapters = [
  {
    title: "O princípio",
    period: "Criação e patriarcas",
    description:
      "Começar pelas grandes perguntas: criação, humanidade, aliança e promessa. Ler Gênesis com atenção à narrativa, ao contexto e aos temas que atravessam a Bíblia.",
    topics: ["A narrativa da criação", "Humanidade e relação com Deus", "Abraão e a promessa"],
    reference: "Gênesis",
    symbol: "sun",
  },
  {
    title: "Um povo em caminho",
    period: "Êxodo, aliança e reino",
    description:
      "Acompanhar a formação de Israel, a saída do Egito, a aliança e os desafios da vida em comunidade. Conectar acontecimentos, lugares e gêneros literários.",
    topics: ["Libertação e aliança", "A vida de um povo", "Juízes, reis e responsabilidades"],
    reference: "Do Êxodo aos livros históricos",
    symbol: "path",
  },
  {
    title: "Vozes de esperança",
    period: "Sabedoria e profetas",
    description:
      "Ouvir poesia, sabedoria e mensagens proféticas em seus próprios contextos. Investigar como fé, justiça, sofrimento e esperança aparecem nesses livros.",
    topics: ["Poesia e sabedoria", "O contexto dos profetas", "Justiça e esperança"],
    reference: "Livros poéticos, sapienciais e proféticos",
    symbol: "leaf",
  },
  {
    title: "Jesus Cristo",
    period: "A vida nos Evangelhos",
    description:
      "Estudar a vida, os ensinamentos, a morte e a ressurreição de Jesus a partir dos Evangelhos. Perceber o contexto e a contribuição particular de cada relato.",
    topics: ["O mundo dos Evangelhos", "A vida e o ensino de Jesus", "A cruz e a ressurreição"],
    reference: "Mateus, Marcos, Lucas e João",
    symbol: "cross",
  },
  {
    title: "A Igreja em missão",
    period: "Atos e cartas",
    description:
      "Conhecer as primeiras comunidades cristãs, seus caminhos e suas perguntas. Ler as cartas considerando quem escreveu, para quem e em quais circunstâncias.",
    topics: ["As primeiras comunidades", "As viagens e as cartas", "Fé vivida em comunidade"],
    reference: "Atos, cartas e Apocalipse",
    symbol: "people",
  },
  {
    title: "A fé através do tempo",
    period: "História e dias atuais",
    description:
      "Percorrer a história do Cristianismo até os dias de hoje, identificando fontes, continuidades e diferenças entre tradições. Relacionar o estudo com a vida cotidiana.",
    topics: ["A história da Igreja", "As tradições cristãs", "Aprender e viver hoje"],
    reference: "História, teologia e prática cristã",
    symbol: "tree",
  },
] as const;

function ChapterSymbol({ kind }: { kind: (typeof chapters)[number]["symbol"] }) {
  const paths: Record<typeof kind, React.ReactNode> = {
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4m0-14.2-1.4 1.4M6.3 17.7l-1.4 1.4" /></>,
    path: <><path d="M6 21c0-5 12-4 12-9S6 9 6 4" /><path d="m3 6 3-3 3 3M15 21h6" /></>,
    leaf: <><path d="M20 3c0 9-1 16-9 16a7 7 0 0 1-7-7c0-7 8-8 16-9Z" /><path d="M3 21 15 9" /></>,
    cross: <path d="M10 3h4v5h5v4h-5v9h-4v-9H5V8h5V3Z" />,
    people: <><circle cx="9" cy="7" r="3" /><path d="M3 21v-3a6 6 0 0 1 12 0v3m3-17a3 3 0 0 1 0 6m1 5a5 5 0 0 1 2 4v2" /></>,
    tree: <><path d="m12 2 6 7h-3l5 7h-6v6h-4v-6H4l5-7H6l6-7Z" /></>,
  };

  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{paths[kind]}</svg>;
}

export function JourneyExplorer() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const chapter = chapters[active];

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number | undefined;
    if (event.key === "ArrowRight") next = (index + 1) % chapters.length;
    if (event.key === "ArrowLeft") next = (index - 1 + chapters.length) % chapters.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = chapters.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      setActive(next);
      tabs.current[next]?.focus();
    }
  }

  return (
    <div className="journey-explorer">
      <div className="journey-tabs" role="tablist" aria-label="Explore os temas da jornada cristã">
        {chapters.map((item, index) => (
          <button
            className={`journey-tab ${active === index ? "is-active" : ""}`}
            key={item.title}
            id={`journey-tab-${index}`}
            ref={(element) => { tabs.current[index] = element; }}
            role="tab"
            aria-selected={active === index}
            aria-controls="journey-panel"
            tabIndex={active === index ? 0 : -1}
            onClick={() => setActive(index)}
            onKeyDown={(event) => navigate(event, index)}
            type="button"
          >
            <span className="journey-dot"><span>{String(index + 1).padStart(2, "0")}</span></span>
            <span className="journey-tab-title">{item.title}</span>
            <span className="journey-tab-period">{item.period}</span>
          </button>
        ))}
      </div>

      <div
        className="journey-panel"
        id="journey-panel"
        role="tabpanel"
        aria-labelledby={`journey-tab-${active}`}
        tabIndex={0}
      >
        <div className="journey-panel-symbol"><ChapterSymbol kind={chapter.symbol} /></div>
        <div className="journey-panel-copy">
          <span className="eyebrow">UM OLHAR SOBRE {chapter.period.toLocaleUpperCase("pt-BR")}</span>
          <h3>{chapter.title}</h3>
          <p>{chapter.description}</p>
          <div className="journey-topics">{chapter.topics.map((topic) => <span key={topic}>{topic}</span>)}</div>
        </div>
        <div className="journey-panel-aside">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M12 5c-3-2-7-2-10 0v15c3-2 7-2 10 0m0-15c3-2 7-2 10 0v15c-3-2-7-2-10 0V5Z" /></svg>
          <span>CAMPO DE ESTUDO</span>
          <strong>{chapter.reference}</strong>
          <small>Percurso em preparação</small>
        </div>
      </div>
      <p className="journey-footnote">Este panorama organiza os temas de estudo. Narrativa bíblica e investigação histórica serão apresentadas com suas fontes e perspectivas.</p>
    </div>
  );
}
