import Link from "next/link";
import type { ReactNode } from "react";
import "./app-shell.css";

export type AppSection = "home" | "learn" | "bible" | "profile";
export type AppIconName = AppSection | "arrow" | "spark" | "check" | "layers" | "heart" | "search" | "clock" | "compass";

export function AppIcon({ name, className = "" }: { name: AppIconName; className?: string }) {
  return <svg className={className} aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    {name === "home" && <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z" /></>}
    {name === "learn" && <><path d="m2 8 10-5 10 5-10 5L2 8Z" /><path d="M6 10v7c4 3 8 3 12 0v-7m4-2v7" /></>}
    {name === "bible" && <><path d="M12 5C8 3 5 3 2 5v15c3-2 6-2 10 0 4-2 7-2 10 0V5c-3-2-6-2-10 0Zm0 0v15M6 8h2m-2 4h2m8-4h2m-2 4h2" /></>}
    {name === "profile" && <><circle cx="12" cy="8" r="4" /><path d="M4 21v-2a8 8 0 0 1 16 0v2" /></>}
    {name === "arrow" && <path d="M4 12h16m-6-6 6 6-6 6" />}
    {name === "spark" && <><path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z" /><path d="m20 2 .6 1.4L22 4l-1.4.6L20 6l-.6-1.4L18 4l1.4-.6L20 2Z" /></>}
    {name === "check" && <path d="m5 12 4 4L19 6" />}
    {name === "layers" && <><path d="m12 3 10 5-10 5L2 8l10-5Z" /><path d="m3 12 9 5 9-5m-18 5 9 5 9-5" /></>}
    {name === "heart" && <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />}
    {name === "search" && <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>}
    {name === "clock" && <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>}
    {name === "compass" && <><circle cx="12" cy="12" r="9" /><path d="m16 8-2 6-6 2 2-6 6-2Z" /></>}
  </svg>;
}

const destinations = [
  { id: "home", label: "Início", href: "/" },
  { id: "learn", label: "Aprender", href: "/aprender" },
  { id: "bible", label: "Bíblia", href: "/biblia" },
  { id: "profile", label: "Meu percurso", href: "/meu-percurso" }
] as const;

function Navigation({ active, mobile = false }: { active: AppSection; mobile?: boolean }) {
  return <nav className={mobile ? "app-bottom-nav" : "app-side-nav"} aria-label={mobile ? "Navegação no celular" : "Navegação principal"}>
    {destinations.map((item) => <Link key={item.id} href={item.href} aria-current={active === item.id ? "page" : undefined} prefetch={false}><span className="app-nav-icon"><AppIcon name={item.id} /></span><span>{item.label}</span>{!mobile && active === item.id && <span className="app-nav-current" aria-hidden="true" />}</Link>)}
  </nav>;
}

export function AppShell({ active, title, subtitle, children }: { active: AppSection; title: string; subtitle?: string; children: ReactNode }) {
  return <div className="app-shell">
    <a className="skip-link" href="#app-main">Pular para o conteúdo</a>
    <aside className="app-sidebar">
      <Link className="app-logo" href="/" aria-label="InJessusName, início"><span className="app-logo-mark"><AppIcon name="bible" /></span><span>InJessusName<small>CONHECER. COMPREENDER. VIVER.</small></span></Link>
      <p className="app-nav-label">SEU ESPAÇO DE ESTUDO</p>
      <Navigation active={active} />
      <div className="app-side-invitation"><span className="app-side-symbol"><AppIcon name="spark" /></span><strong>Profundidade, um passo de cada vez.</strong><p>Leia, pratique e leve o aprendizado para a vida.</p><Link href="/aprender/primeiros-passos">Começar pelos fundamentos <AppIcon name="arrow" /></Link></div>
      <div className="app-sidebar-footer"><Link href="/privacidade">Privacidade e escolhas</Link><span>Um projeto educacional independente.</span></div>
    </aside>
    <div className="app-workspace">
      <header className="app-topbar"><div className="app-topbar-location"><Link className="app-mobile-mark" href="/" aria-label="InJessusName, início"><AppIcon name="bible" /></Link><div><p className="app-topbar-title">{title}</p>{subtitle && <p className="app-topbar-subtitle">{subtitle}</p>}</div></div><div className="app-topbar-actions">{active !== "bible" && <Link className="app-topbar-bible" href="/biblia"><AppIcon name="bible" /><span>Abrir a Bíblia</span></Link>}<Link className="app-account-link" href="/entrar" aria-label="Entrar na minha conta"><AppIcon name="profile" /></Link></div></header>
      <main id="app-main" className="app-content">{children}</main>
    </div>
    <Navigation active={active} mobile />
  </div>;
}
