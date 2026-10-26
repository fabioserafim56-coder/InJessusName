(() => {
  const status = document.getElementById("connection-status");
  const button = document.getElementById("retry");
  let checking = false;

  async function reconnect() {
    if (checking) return;
    checking = true;
    button.disabled = true;
    status.textContent = "Verificando a conexão…";
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    try {
      const response = await fetch("/api/health", {
        cache: "no-store",
        signal: controller.signal
      });
      if (!response.ok) throw new Error("Aplicativo indisponível");
      const health = await response.json();
      if (health.status !== "ok" || health.application !== "InJessusName") {
        throw new Error("Resposta inesperada");
      }
      status.textContent = "Conexão restabelecida. Abrindo o aplicativo…";
      window.location.replace("/");
    } catch {
      status.textContent = "Ainda não conseguimos acessar o aplicativo. Tente novamente em instantes.";
    } finally {
      clearTimeout(timeout);
      button.disabled = false;
      checking = false;
    }
  }

  button.addEventListener("click", reconnect);
  window.addEventListener("online", reconnect);
  setInterval(reconnect, 15000);
  reconnect();
})();
