import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import { monitorLocalAuthHealth } from "./local-auth-health.mjs";

const require = createRequire(import.meta.url);
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cli = resolve(dirname(require.resolve("supabase/package.json")), "dist/supabase.js");
const args = process.argv.slice(2);
const excluded = args.some((argument, index) =>
  (["--exclude", "-x"].includes(argument) && args[index + 1]?.split(",").includes("gotrue"))
  || argument.startsWith("--exclude=") && argument.slice("--exclude=".length).split(",").includes("gotrue")
);
const healthController = new AbortController();
let healthFailure = false;

// SUPABASE_HOME é um override oficial do CLI, sem alterar HOME do sistema.
// GHCR é um dos registros oficiais usados pelo Supabase para as mesmas imagens.
const child = spawn(process.execPath, [cli, ...args], {
  cwd: root,
  stdio: "inherit",
  env: {
    ...process.env,
    SUPABASE_HOME: process.env.SUPABASE_HOME || resolve(root, ".cache/supabase"),
    SUPABASE_INTERNAL_IMAGE_REGISTRY: process.env.SUPABASE_INTERNAL_IMAGE_REGISTRY || "ghcr.io",
    SUPABASE_USE_SLIM_IMAGES: process.env.SUPABASE_USE_SLIM_IMAGES || "1"
  }
});

if (args[0] === "start" && !excluded) {
  const config = readFileSync(resolve(root, "supabase/config.toml"), "utf8");
  const projectId = config.match(/^project_id\s*=\s*"([A-Za-z0-9_-]+)"/m)?.[1];
  if (projectId) {
    void monitorLocalAuthHealth({
      projectId,
      signal: healthController.signal,
      notice: (message) => console.error(message)
    }).catch((error) => {
      if (error.name === "AbortError") return;
      healthFailure = true;
      console.error(error.message);
      child.kill("SIGTERM");
    });
  }
}

for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => child.kill(signal));
child.on("error", () => {
  console.error("Não foi possível iniciar o Supabase CLI. Execute npm ci e verifique o Docker.");
  process.exitCode = 1;
});
child.on("exit", (code, signal) => {
  healthController.abort();
  if (signal) process.kill(process.pid, signal);
  else process.exitCode = healthFailure ? 1 : code ?? 1;
});
