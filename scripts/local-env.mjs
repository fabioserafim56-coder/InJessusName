import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const target = resolve(root, ".env.local");

if (existsSync(target)) {
  const current = readFileSync(target, "utf8");
  if (/^NEXT_PUBLIC_SUPABASE_URL=\S+/m.test(current)
    && /^NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=\S+/m.test(current)) {
    console.log("Configuração existente preservada; nenhum valor foi exibido ou substituído.");
    process.exit(0);
  }
  console.error("O arquivo .env.local já existe. Preserve seu conteúdo e configure as variáveis públicas manualmente.");
  process.exit(1);
}

const status = spawnSync(process.execPath, [resolve(root, "scripts/supabase.mjs"), "status", "-o", "json"], {
  cwd: root,
  encoding: "utf8",
  stdio: ["ignore", "pipe", "pipe"]
});
if (status.status !== 0) {
  console.error("Inicie primeiro o Supabase local completo e confirme sua integridade.");
  process.exit(1);
}

let metadata;
try { metadata = JSON.parse(status.stdout); }
catch {
  console.error("Não foi possível ler os metadados públicos do Supabase local.");
  process.exit(1);
}

const url = metadata.API_URL || metadata.api_url;
const publicKey = metadata.PUBLISHABLE_KEY || metadata.publishable_key || metadata.ANON_KEY || metadata.anon_key;
let localURL;
try { localURL = new URL(url); } catch { /* Invalid local metadata is rejected below. */ }
if (!publicKey || /[\r\n]/.test(publicKey) || !localURL
  || !["127.0.0.1", "localhost", "[::1]"].includes(localURL.hostname)
  || localURL.username || localURL.password || localURL.search || localURL.hash) {
  console.error("O status local não disponibilizou URL e chave pública utilizáveis.");
  process.exit(1);
}

try {
  const response = await fetch(new URL("/auth/v1/health", url), {
    headers: { apikey: publicKey },
    signal: AbortSignal.timeout(10000)
  });
  const health = await response.json();
  if (!response.ok || health.name !== "GoTrue") throw new Error("Auth indisponível");
} catch {
  console.error("A API local de Auth não passou pela verificação funcional; configuração não foi gravada.");
  process.exit(1);
}

writeFileSync(target, [
  "# Configuração pública do Supabase local, gerada após verificar Auth.",
  "# Não contém chave administrativa nem credenciais de produção.",
  `NEXT_PUBLIC_SUPABASE_URL=${url}`,
  `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=${publicKey}`,
  ""
].join("\n"), { flag: "wx", mode: 0o600 });
console.log(".env.local criado com URL e chave pública locais; valores não exibidos.");
