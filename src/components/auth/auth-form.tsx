"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./auth.css";

type AuthDestination = "/comecar" | "/meu-percurso";

export function AuthForm({ configured, next }: { configured: boolean; next: AuthDestination }) {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adultConfirmation, setAdultConfirmation] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function changeMode(value: "signin" | "signup") {
    setMode(value);
    setError("");
    setNotice("");
    setPassword("");
    setAdultConfirmation(false);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || !configured) return;
    setError("");
    setNotice("");
    if (mode === "signup" && !adultConfirmation) {
      setError("Nesta etapa, o cadastro é destinado a pessoas com 18 anos ou mais.");
      return;
    }
    setPending(true);

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        cache: "no-store",
        body: JSON.stringify({
          mode,
          email: email.trim(),
          password,
          next,
          ...(mode === "signup" ? { adultConfirmation: true } : {})
        })
      });
      const result: { error?: string; redirect?: string; message?: string; requiresEmailConfirmation?: boolean } = await response.json();
      if (!response.ok) {
        setError(typeof result.error === "string" ? result.error.slice(0, 240) : "Não foi possível concluir o acesso. Tente novamente.");
        return;
      }

      setPassword("");
      if (response.status === 202 || result.requiresEmailConfirmation) {
        setNotice(result.message || "Confira seu e-mail para confirmar a conta antes de entrar.");
        return;
      }
      const destination = result.redirect === "/meu-percurso" || result.redirect === "/comecar"
        ? result.redirect : next;
      router.replace(destination);
      router.refresh();
    } catch {
      setError("Não conseguimos acessar sua conta agora. Confira a conexão e tente novamente em instantes.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="auth-card" aria-labelledby="auth-form-title">
      <div className="auth-switch" role="group" aria-label="Escolha como acessar">
        <button type="button" aria-pressed={mode === "signin"} disabled={pending} onClick={() => changeMode("signin")}>Já tenho conta</button>
        <button type="button" aria-pressed={mode === "signup"} disabled={pending} onClick={() => changeMode("signup")}>Criar conta</button>
      </div>
      <h2 id="auth-form-title">{mode === "signin" ? "Bem-vindo de volta." : "Um começo com cuidado."}</h2>
      <p className="auth-card-intro">{mode === "signin"
        ? "Entre para continuar o seu percurso de aprendizado."
        : "Crie sua conta para guardar um percurso que você poderá revisar quando quiser."}</p>

      {!configured && (
        <div className="auth-notice" role="status">
          <strong>O acesso às contas ainda está em preparação.</strong>
          <p>Você pode explorar a jornada como visitante, sem criar uma conta.</p>
          <Link href="/comecar">Conhecer meu caminho como visitante →</Link>
        </div>
      )}

      <form action="/api/auth" method="post" onSubmit={submit} className="auth-form" aria-busy={pending}>
        <div className="auth-field">
          <label htmlFor="auth-email">E-mail</label>
          <input id="auth-email" name="email" type="email" autoComplete="email" inputMode="email" maxLength={254} required value={email} onChange={(event) => setEmail(event.target.value)} disabled={pending || !configured} />
        </div>
        <div className="auth-field">
          <label htmlFor="auth-password">Senha</label>
          <input id="auth-password" name="password" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} minLength={8} maxLength={128} required value={password} onChange={(event) => setPassword(event.target.value)} disabled={pending || !configured} aria-describedby="password-help" />
          <span id="password-help">Use pelo menos 8 caracteres. Não compartilhe sua senha.</span>
        </div>
        {mode === "signup" && (
          <div className="auth-adult-check">
            <label htmlFor="auth-adult"><input id="auth-adult" name="adultConfirmation" type="checkbox" required checked={adultConfirmation} onChange={(event) => setAdultConfirmation(event.target.checked)} disabled={pending || !configured} /><span>Declaro que tenho 18 anos ou mais.</span></label>
            <p>Crianças e adolescentes podem conhecer os percursos públicos. O cadastro com proteção por responsável será preparado em uma próxima etapa.</p>
          </div>
        )}
        {error && <p className="auth-error" role="alert">{error}</p>}
        {notice && <p className="auth-notice" role="status">{notice}</p>}
        <button className="auth-submit" type="submit" disabled={pending || !configured || (mode === "signup" && !adultConfirmation)}>
          {pending ? "Aguarde um instante…" : mode === "signin" ? "Entrar" : "Criar minha conta"}
          {!pending && <span aria-hidden="true">→</span>}
        </button>
      </form>
      <p className="auth-privacy-note">Sua conta e suas respostas são escolhas diferentes. A autorização para personalizar o percurso será solicitada separadamente, na conversa inicial.</p>
      <div className="auth-card-links"><Link href="/comecar">Continuar como visitante</Link><Link href="/privacidade">Como cuidamos dos seus dados</Link></div>
    </section>
  );
}
