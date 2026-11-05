import Link from "next/link";
import type { ReactNode } from "react";
import "./focus-shell.css";

type FocusShellProps = {
  children: ReactNode;
  title: string;
  subtitle?: string;
  eyebrow?: string;
  backHref?: string;
  backLabel?: string;
  controls?: ReactNode;
  className?: string;
  mainClassName?: string;
  theme?: "light" | "dark";
};

/** A dedicated reading space. Route-specific tools stay optional, never a fixed rail. */
export function FocusShell({ children, title, subtitle, eyebrow = "INJESSUSNAME", backHref = "/", backLabel = "Voltar", controls, className = "", mainClassName = "", theme = "light" }: FocusShellProps) {
  return <div className={`focus-shell focus-shell-${theme} ${className}`} data-focus-shell>
    <a className="focus-skip" href="#focus-main">Ir para o conteúdo</a>
    <header className="focus-topbar">
      <Link className="focus-back" href={backHref}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m14 6-6 6 6 6M8 12h12" /></svg><span>{backLabel}</span></Link>
      <div className="focus-heading">
        <svg className="focus-emblem" viewBox="0 0 40 42" fill="none" aria-hidden="true"><path d="M20 5v19M14 12h12M20 35C15 31 9 30 4 32V19c5-2 11-1 16 3 5-4 11-5 16-3v13c-5-2-11-1-16 3Zm0-13v13" /></svg>
        <div><span className="focus-eyebrow">{eyebrow}</span><p>{title}</p>{subtitle && <span className="focus-subtitle">{subtitle}</span>}</div>
      </div>
      <div className="focus-controls">{controls ?? <span className="focus-peace"><span aria-hidden="true" />No seu tempo</span>}</div>
    </header>
    <main className={`focus-main ${mainClassName}`} id="focus-main" tabIndex={-1}>{children}</main>
  </div>;
}
