import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Bank, BookOpenText, Check, Church, Clock, Compass, GraduationCap, Heart, House, List, MagnifyingGlass, Sparkle, Stack, Scroll, UserCircle } from "@phosphor-icons/react/ssr";
import "./app-shell.css";

export type AppSection = "home" | "learn" | "bible" | "museum" | "profile" | "stories" | "churches";
export type AppIconName = AppSection | "arrow" | "spark" | "check" | "layers" | "heart" | "search" | "clock" | "compass";

const icons = { home: House, learn: GraduationCap, bible: BookOpenText, museum: Bank, profile: UserCircle, stories: Scroll, churches: Church, arrow: ArrowRight, spark: Sparkle, check: Check, layers: Stack, heart: Heart, search: MagnifyingGlass, clock: Clock, compass: Compass } as const;

export function AppIcon({ name, className = "" }: { name: AppIconName; className?: string }) {
  const Icon = icons[name];
  return <Icon className={className} size={24} weight="regular" aria-hidden="true" />;
}

const destinations = [
  { id: "home", label: "Início", href: "/" },
  { id: "learn", label: "Aprender", href: "/aprender" },
  { id: "bible", label: "Bíblia", href: "/biblia" },
  { id: "stories", label: "Histórias bíblicas", href: "/historias" },
  { id: "churches", label: "Igrejas e pessoas", href: "/igrejas" },
  { id: "museum", label: "Museu", href: "/museu" },
  { id: "profile", label: "Meu percurso", href: "/meu-percurso" }
] as const;

function Navigation({ active, mobile = false }: { active: AppSection; mobile?: boolean }) {
  const items = mobile ? destinations.filter((item) => ["home", "learn", "bible", "profile"].includes(item.id)) : destinations;
  return <nav className={mobile ? "app-bottom-nav" : "app-side-nav"} aria-label={mobile ? "Navegação no celular" : "Navegação principal"}>
    {items.map((item) => <Link key={item.id} href={item.href} aria-current={active === item.id ? "page" : undefined} prefetch={false}><span className="app-nav-icon"><AppIcon name={item.id} /></span><span>{item.label}</span>{!mobile && active === item.id && <span className="app-nav-current" aria-hidden="true" />}</Link>)}
    {mobile && <details className="app-more-menu"><summary aria-label="Mais áreas do aplicativo"><span className="app-nav-icon"><List size={23} aria-hidden="true" /></span><span>Explorar</span></summary><div className="app-more-panel"><p>Conhecer e conectar</p>{destinations.filter((item) => ["stories", "churches", "museum"].includes(item.id)).map((item) => <Link key={item.id} href={item.href} aria-current={active === item.id ? "page" : undefined}><AppIcon name={item.id} /><span>{item.label}</span></Link>)}<Link href="/biblia?busca=batismo"><MagnifyingGlass aria-hidden="true" /><span>Pesquisar na Bíblia</span></Link></div></details>}
  </nav>;
}

export function AppShell({ active, title, subtitle, children }: { active: AppSection; title: string; subtitle?: string; children: ReactNode }) {
  return <div className="app-shell" data-active={active}>
    <a className="skip-link" href="#app-main">Pular para o conteúdo</a>
    <aside className="app-sidebar">
      <Link className="app-logo" href="/" aria-label="InJessusName, início"><span className="app-logo-mark"><AppIcon name="bible" /></span><span>InJessusName<small>CONHECER. COMPREENDER. VIVER.</small></span></Link>
      <p className="app-nav-label">SEU CAMINHO NA PALAVRA</p>
      <Navigation active={active} />
      <div className="app-side-invitation"><span className="app-side-symbol"><AppIcon name="heart" /></span><strong>Você pode chegar com suas perguntas.</strong><p>Vamos abrir a Bíblia com calma, cultivar a fé e aprender a cuidar uns dos outros.</p><Link href="/aprender/primeiros-passos">Dar o primeiro passo <AppIcon name="arrow" /></Link></div>
      <div className="app-sidebar-footer"><Link href="/privacidade">Privacidade e escolhas</Link><span>Um projeto educacional independente.</span></div>
    </aside>
    <div className="app-workspace">
      <header className="app-topbar"><div className="app-topbar-location"><Link className="app-mobile-mark" href="/" aria-label="InJessusName, início"><AppIcon name="bible" /></Link><div><p className="app-topbar-title">{title}</p>{subtitle && <p className="app-topbar-subtitle">{subtitle}</p>}</div></div><div className="app-topbar-actions"><Link className="app-global-search" href="/biblia#busca-biblica" aria-label="Pesquisar palavras e temas na Bíblia"><AppIcon name="search" /></Link>{active !== "bible" && <Link className="app-topbar-bible" href="/biblia?modo=igreja" title="Modo igreja: somente a Bíblia e seus controles de leitura"><AppIcon name="bible" /><span>Abrir a Bíblia</span></Link>}<Link className="app-account-link" href="/entrar" aria-label="Entrar na minha conta"><AppIcon name="profile" /></Link></div></header>
      <main id="app-main" className="app-content">{children}</main>
    </div>
    <Navigation active={active} mobile />
  </div>;
}
