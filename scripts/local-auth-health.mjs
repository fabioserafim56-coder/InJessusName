import http from "node:http";
import { existsSync } from "node:fs";
import { setTimeout as delay } from "node:timers/promises";

const LOCAL_HEALTH = "http://127.0.0.1:9999/health";
const TEST = ["CMD", "wget", "-Y", "off", "-q", "--spider", LOCAL_HEALTH];

// Docker's container-create API supports per-container healthcheck configuration.
// No image is changed: only this loopback probe avoids BusyBox's proxy handling.
// All original environment variables (including external proxies), mounts and
// networking are retained in memory and are never written to disk or logged.
function docker(socketPath, method, path, body) {
  return new Promise((resolve, reject) => {
    const serialized = body === undefined ? undefined : JSON.stringify(body);
    const request = http.request({
      socketPath,
      method,
      path,
      headers: serialized === undefined ? {} : {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(serialized)
      }
    }, (response) => {
      let buffer = "";
      response.on("data", (chunk) => { buffer += chunk; });
      response.on("end", () => {
        let value;
        try { value = buffer ? JSON.parse(buffer) : null; }
        catch { return reject(new Error("Resposta inesperada da API local do Docker.")); }
        resolve({ status: response.statusCode, value });
      });
    });
    request.setTimeout(10000, () => request.destroy(new Error("Docker local não respondeu.")));
    request.on("error", () => reject(new Error("Não foi possível acessar a API local do Docker.")));
    request.end(serialized);
  });
}

async function replaceHealthcheck(socketPath, containerName, original) {
  const name = encodeURIComponent(containerName);
  const config = structuredClone(original.Config);
  config.Image = original.Image; // Preserve the exact, already verified image content.
  config.Healthcheck = { ...config.Healthcheck, Test: TEST };
  const networking = {};
  for (const [network, endpoint] of Object.entries(original.NetworkSettings.Networks || {})) {
    networking[network] = { Aliases: endpoint.Aliases || [] };
  }
  const body = {
    ...config,
    HostConfig: original.HostConfig,
    NetworkingConfig: { EndpointsConfig: networking }
  };

  const stopped = await docker(socketPath, "POST", `/containers/${name}/stop?t=3`);
  if (![204, 304].includes(stopped.status)) throw new Error("Não foi possível reiniciar a sonda local de Auth.");
  const removed = await docker(socketPath, "DELETE", `/containers/${name}`);
  if (removed.status !== 204) throw new Error("Não foi possível atualizar a configuração local de Auth.");
  const created = await docker(socketPath, "POST", `/containers/create?name=${name}`, body);
  if (created.status !== 201) {
    throw new Error("Não foi possível recriar o container de Auth com a mesma imagem. Execute novamente o startup local.");
  }
  const verified = await docker(socketPath, "GET", `/containers/${name}/json`);
  if (verified.status !== 200 || verified.value.Image !== original.Image
    || JSON.stringify(verified.value.Config.Env) !== JSON.stringify(original.Config.Env)) {
    throw new Error("A imagem e o ambiente originais de Auth não foram preservados; startup interrompido.");
  }
  const started = await docker(socketPath, "POST", `/containers/${name}/start`);
  if (started.status !== 204) throw new Error("A nova sonda de Auth não pôde ser iniciada.");
}

export async function monitorLocalAuthHealth({ projectId, signal, notice }) {
  const socketPath = process.env.DOCKER_HOST?.startsWith("unix://")
    ? process.env.DOCKER_HOST.slice("unix://".length)
    : "/var/run/docker.sock";
  if (!existsSync(socketPath)) return;
  const containerName = `supabase_auth_${projectId}`;
  let adjusted = false;

  while (!signal.aborted) {
    const inspected = await docker(socketPath, "GET", `/containers/${encodeURIComponent(containerName)}/json`);
    if (inspected.status === 200 && !adjusted) {
      const original = inspected.value;
      const test = original.Config.Healthcheck?.Test || [];
      const hasProxy = (original.Config.Env || []).some((entry) => /^http_proxy=.+/i.test(entry));
      const loopbackWget = test.some((part) => part === "wget" || part.startsWith("wget "))
        && test.some((part) => part.includes(LOCAL_HEALTH));
      if (loopbackWget && test.includes("-Y") && test.includes("off")) return;
      if (hasProxy && loopbackWget && original.State.Running) {
        if (!/^(ghcr\.io\/supabase\/|public\.ecr\.aws\/supabase\/|supabase\/)(cli\/auth|gotrue)(:|@)/.test(original.Config.Image)) {
          throw new Error("Container de Auth existente não reconhecido; nenhuma configuração foi alterada.");
        }
        await replaceHealthcheck(socketPath, containerName, original);
        adjusted = true;
        notice("Sonda local de Auth ajustada para acesso direto ao loopback; proxies externos preservados.");
      }
    } else if (![200, 404].includes(inspected.status)) {
      throw new Error("Não foi possível verificar a sonda de Auth no Docker local.");
    }
    await delay(500, undefined, { signal });
  }
}
