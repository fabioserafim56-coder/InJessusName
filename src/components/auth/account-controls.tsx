"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./auth.css";

export function AccountControls({ hasProfile = false }: { hasProfile?: boolean }) {
  const router = useRouter();
  const [pending, setPending] = useState<"signout" | "revoke" | null>(null);
  const [error, setError] = useState("");

  async function act(action: "signout" | "revoke") {
    if (pending) return;
    setPending(action);
    setError("");
    try {
      const response = await fetch(action === "signout" ? "/api/auth/signout" : "/api/onboarding", {
        method: action === "signout" ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        cache: "no-store",
        body: "{}"
      });
      const result: { error?: string } = await response.json();
      if (!response.ok) {
        setError(typeof result.error === "string" ? result.error.slice(0, 240) : "Não foi possível concluir esta ação. Tente novamente.");
        return;
      }
      router.replace(action === "signout" ? "/" : "/jornada/adultos");
      router.refresh();
    } catch {
      setError("Não conseguimos acessar o aplicativo agora. Nenhuma alteração foi confirmada.");
    } finally {
      setPending(null);
    }
  }

  return (
    <section className="account-controls" aria-labelledby="account-controls-title" aria-busy={pending !== null}>
      <div className="account-controls-heading"><h2 id="account-controls-title">Você mantém suas escolhas.</h2><button className="account-signout" type="button" onClick={() => act("signout")} disabled={pending !== null}>{pending === "signout" ? "Saindo…" : "Sair da conta"}</button></div>
      {hasProfile && <div className="account-revoke"><p>Você pode retirar a autorização de personalização e apagar as respostas da pré-entrevista. Sua conta e o registro da revogação permanecem, e o percurso público continua disponível.</p><button type="button" onClick={() => act("revoke")} disabled={pending !== null}>{pending === "revoke" ? "Revogando a personalização…" : "Revogar personalização e apagar respostas"}</button></div>}
      {error && <p className="auth-error" role="alert">{error}</p>}
    </section>
  );
}
