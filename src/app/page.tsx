import { BookIllustration } from "@/components/book-illustration";
import { JourneyExplorer } from "@/components/journey-explorer";

function Arrow({ down = false }: { down?: boolean }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{down ? <path d="M12 5v14m-6-6 6 6 6-6" /> : <path d="M4 12h15m-6-6 6 6-6 6" />}</svg>;
}

function BookMark({ compact = false }: { compact?: boolean }) {
  return <svg aria-hidden="true" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round"><path d="M16 9c-4-3-8-3-12-1v18c4-2 8-2 12 1 4-3 8-3 12-1V8c-4-2-8-2-12 1Zm0 0v18" />{!compact && <path d="M16 2v4M9 3l2 3m12-3-2 3" />}</svg>;
}

const methods = [
  { number: "01", title: "Prepare a sua mesa", description: "Sua Bíblia aberta, um caderno ao lado e um momento para se dedicar ao estudo.", icon: "book" },
  { number: "02", title: "Encontre o contexto", description: "Mapas, imagens e histórias ajudam a compreender onde, quando e para quem o texto foi escrito.", icon: "map" },
  { number: "03", title: "Olhe com profundidade", description: "Seis lentes conectam o texto, o mundo bíblico e as perguntas que surgem durante a leitura.", icon: "search" },
  { number: "04", title: "Leve para a vida", description: "Observe, anote, reflita e ore. O método S.O.A.P. ajuda a transformar o estudo em prática.", icon: "pen" },
] as const;

function MethodIcon({ kind }: { kind: (typeof methods)[number]["icon"] }) {
  return <svg aria-hidden="true" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    {kind === "book" && <><path d="M16 8c-4-3-8-3-12-1v19c4-2 8-2 12 1 4-3 8-3 12-1V7c-4-2-8-2-12 1Zm0 0v19" /><path d="M8 11c2-.4 3 .1 4 1m-4 4c2-.4 3 .1 4 1" /></>}
    {kind === "map" && <><path d="m3 9 9-4 8 4 9-4v20l-9 4-8-4-9 4V9Zm9-4v20m8-16v20" /><path d="M7 15h1m8 2h1m7-3h1" /></>}
    {kind === "search" && <><circle cx="14" cy="14" r="9" /><path d="m21 21 8 8M10 14h8m-4-4v8" /></>}
    {kind === "pen" && <><path d="m22 4 6 6-16 16-8 2 2-8L22 4Zm-3 3 6 6M6 20l6 6M4 28h24" /></>}
  </svg>;
}

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="#inicio" aria-label="InJessusName, início"><span className="brand-mark"><BookMark /></span><span>InJessusName<span className="brand-tagline">CONHECER · COMPREENDER · VIVER</span></span></a>
          <nav className="main-nav" aria-label="Navegação principal">
            <a href="#jornada">A jornada</a><a href="#metodo">Como aprender</a><a href="/biblia">Bíblia</a><a href="/aprender">Estudar</a>
          </nav>
          <a className="header-link" href="/entrar">Entrar <Arrow /></a>
        </div>
      </header>

      <main id="conteudo">
        <section className="hero section-anchor" id="inicio" aria-labelledby="hero-title">
          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="hero-kicker"><span /> UM CAMINHO DE FÉ E CONHECIMENTO</div>
              <h1 id="hero-title">Conhecer a Palavra.<br />Viver com <em>propósito.</em></h1>
              <p className="hero-description">Há espaço para as suas perguntas. E um caminho para aprofundar a sua fé — da criação aos dias de hoje, uma descoberta de cada vez.</p>
              <div className="hero-actions"><a className="button button-primary" href="/comecar">Começar meu percurso <Arrow /></a><a className="text-link" href="#metodo">Conhecer o método <Arrow down /></a></div>
              <div className="hero-bottom"><span className="hero-bottom-icon"><BookMark compact /></span><p>Bíblia, teologia e vida cristã.<br /><strong>Profundidade para aprender. Clareza para viver.</strong></p></div>
              <a className="text-link" style={{ marginTop: 22 }} href="/aprender/primeiros-passos">Experimentar a primeira aula <Arrow /></a>
            </div>
            <BookIllustration />
          </div>
        </section>

        <section className="welcome-strip" aria-label="Um lugar para cada começo">
          <div className="container welcome-inner"><span className="welcome-sprig" aria-hidden="true">✧</span><p>Para quem está dando o primeiro passo.<br className="mobile-break" /> Para quem deseja ir mais fundo. <strong>Este caminho também é seu.</strong></p></div>
        </section>

        <section className="journey-section section-anchor" id="jornada" aria-labelledby="journey-title">
          <div className="container">
            <div className="section-heading journey-heading"><div><span className="eyebrow">UMA GRANDE HISTÓRIA. MUITAS DESCOBERTAS.</span><h2 id="journey-title">Da criação à <em>vida de hoje.</em></h2></div><p>Conheça os grandes eixos que orientarão nossos estudos. Escolha um momento para explorar.</p></div>
            <JourneyExplorer />
          </div>
        </section>

        <section className="method-section section-anchor" id="metodo" aria-labelledby="method-title">
          <div className="container">
            <div className="section-heading method-heading"><div><span className="eyebrow">O MÉTODO BEREANO HÍBRIDO</span><h2 id="method-title">A Bíblia aberta.<br />O coração <em>atento.</em></h2></div><div><span className="duration-pill"><svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="10" cy="10" r="7" /><path d="M10 6v4l3 2" /></svg> Aulas planejadas para 15–20 minutos</span><p>Um jeito de estudar que aproxima conhecimento e vivência, com tempo para conferir, perguntar e refletir.</p></div></div>
            <div className="method-grid">{methods.map((method) => <article className="method-card" key={method.number}><div className="method-card-top"><span className="method-icon"><MethodIcon kind={method.icon} /></span><span className="method-number">{method.number}</span></div><h3>{method.title}</h3><p>{method.description}</p></article>)}</div>
            <div className="lenses"><span>SEIS LENTES, UM ESTUDO MAIS COMPLETO</span><div>{["Literária", "Espacial", "Histórica", "Cultural", "Bíblica", "Prática"].map((lens) => <span key={lens}>{lens}</span>)}</div></div>
          </div>
        </section>

        <section className="traditions-section section-anchor" id="trilhas" aria-labelledby="traditions-title">
          <div className="container">
            <div className="section-heading traditions-heading"><div><span className="eyebrow">UM NÚCLEO COMUM. CAMINHOS COM IDENTIDADE.</span><h2 id="traditions-title">Sua história de fé<br /><em>merece respeito.</em></h2></div><p>Um fundamento bíblico e teológico, com trilhas que apresentam a perspectiva de cada tradição e identificam suas fontes.</p></div>
            <div className="tradition-grid">
              <article className="tradition-card"><span className="tradition-icon"><svg aria-hidden="true" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M7 31V16l11-9 11 9v15H7Zm11-24V2m-3 3h6M4 18l14-12 14 12M15 31v-8a3 3 0 0 1 6 0v8M12 17v3m12-3v3" /></svg></span><span className="tradition-label">TRILHA CONFESSIONAL</span><h3>Congregação Cristã<br />no Brasil</h3><p>Conhecimento bíblico, zelo doutrinário e compreensão dos santos serviços, com atenção às fontes e ao bom testemunho.</p><span className="tradition-foot">Zelo, comunhão e serviço</span></article>
              <article className="tradition-card"><span className="tradition-icon"><svg aria-hidden="true" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M8 31V17a10 10 0 0 1 20 0v14H8Zm10-24V2m-3 3h6M12 17h12M18 12v10m-4 9v-5a4 4 0 0 1 8 0v5M5 31h26" /></svg></span><span className="tradition-label">TRILHA CONFESSIONAL</span><h3>Tradição<br />católica</h3><p>Escritura, história, tradição e vida cristã na perspectiva católica, respeitando seu cânone e suas fontes de ensino.</p><span className="tradition-foot">Escritura, tradição e vivência</span></article>
              <article className="tradition-card"><span className="tradition-icon"><svg aria-hidden="true" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13c-4-3-9-3-14-1v18c5-2 10-2 14 1 4-3 9-3 14-1V12c-5-2-10-2-14 1Zm0 0v18m0-23V1m-4 3h8M8 16l5 1m10 0 5-1M8 21l5 1m10 0 5-1" /></svg></span><span className="tradition-label">TRILHAS CONFESSIONAIS</span><h3>Tradições evangélicas<br />e protestantes</h3><p>Raízes da Reforma, discipulado e perspectivas históricas, reformadas, batistas e pentecostais, com suas diferenças identificadas.</p><span className="tradition-foot">Bíblia, história e discipulado</span></article>
            </div>
            <div className="seeker-note"><span aria-hidden="true">✦</span><p><strong>Ainda está conhecendo a fé?</strong> Você também tem lugar aqui. O percurso inicial será acolhedor para quem está começando, sem exigir uma denominação.</p></div>
          </div>
        </section>

        <section className="purpose-section section-anchor" id="proposito" aria-labelledby="purpose-title"><div className="container"><div className="purpose-card"><div className="purpose-emblem"><BookMark /></div><span className="eyebrow">UMA JORNADA EM CONSTRUÇÃO</span><h2 id="purpose-title">Um passo de cada vez.<br /><em>Com cuidado em cada passo.</em></h2><p>O leitor bíblico e a primeira aula piloto já estão disponíveis neste ambiente. Experimente uma leitura com contexto e atividades comentadas. Os cursos completos serão ampliados por etapas, com fontes, revisão e avaliação com estudantes.</p><a className="text-link" href="/aprender">Conhecer os estudos <Arrow /></a></div></div></section>
      </main>

      <footer className="site-footer"><div className="container"><div className="footer-top"><a className="brand footer-brand" href="#inicio"><span className="brand-mark"><BookMark /></span><span>InJessusName<span className="brand-tagline">CONHECIMENTO QUE SE TORNA VIDA</span></span></a><a className="back-to-top" href="#inicio">Voltar ao início <Arrow down /></a></div><div className="footer-bottom"><p>Plataforma educacional independente, sem vínculo institucional oficial com a Congregação Cristã no Brasil ou com as demais igrejas e instituições mencionadas.</p><span>Feito para aprender com cuidado.</span></div></div></footer>
    </>
  );
}
