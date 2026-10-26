import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

export type SyntheticAccount = { email: string; password: string };

const loopbackHosts = new Set(["127.0.0.1", "localhost", "[::1]"]);

function configuredSupabaseUrl() {
  const fromProcess = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (fromProcess) return fromProcess;

  try {
    const line = readFileSync(".env.local", "utf8").split(/\r?\n/)
      .find((value) => value.startsWith("NEXT_PUBLIC_SUPABASE_URL="));
    const value = line?.slice("NEXT_PUBLIC_SUPABASE_URL=".length).trim();
    if (value) return value.replace(/^(["'])(.*)\1$/, "$2");
  } catch {
    // The error below contains no configuration or credential values.
  }
  throw new Error("Os testes de contas exigem o Supabase local configurado em .env.local.");
}

export function isLocalAuthTarget() {
  try {
    return loopbackHosts.has(new URL(configuredSupabaseUrl()).hostname);
  } catch (error) {
    if (error instanceof Error && error.message.includes(".env.local")) throw error;
    throw new Error("A URL do Supabase não é válida para executar os testes de contas locais.");
  }
}

export function createLocalAuthHarness() {
  const expectedUrl = new URL(configuredSupabaseUrl());
  if (!loopbackHosts.has(expectedUrl.hostname)) {
    throw new Error("A criação de contas sintéticas só é permitida no Supabase de loopback.");
  }

  let metadata: Record<string, unknown>;
  try {
    const output = execFileSync(process.execPath, ["scripts/supabase.mjs", "status", "-o", "json"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      timeout: 30000,
      maxBuffer: 1024 * 1024
    });
    metadata = JSON.parse(output) as Record<string, unknown>;
  } catch {
    // Never attach the child-process output: status contains local credentials.
    throw new Error("Não foi possível consultar o Supabase local para preparar e limpar as contas de teste.");
  }

  const apiUrl = metadata.API_URL || metadata.api_url;
  const serviceKey = metadata.SERVICE_ROLE_KEY || metadata.service_role_key;
  if (typeof apiUrl !== "string" || typeof serviceKey !== "string"
    || !loopbackHosts.has(new URL(apiUrl).hostname)
    || new URL(apiUrl).origin !== expectedUrl.origin) {
    throw new Error("Os metadados do CLI não correspondem ao Supabase local configurado no aplicativo.");
  }

  // Administrative access exists only in the test runner, for fixture cleanup.
  // The application and the browser never receive this key.
  const admin = createClient(apiUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false }
  });
  const emails = new Set<string>();

  return {
    account(): SyntheticAccount {
      const id = randomUUID();
      const account = { email: `e2e-${id}@example.test`, password: `Test-only!8-${randomUUID()}` };
      emails.add(account.email);
      return account;
    },
    async cleanup() {
      if (!emails.size) return;
      for (let page = 1; ; page += 1) {
        const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
        if (error) throw new Error("Não foi possível localizar as contas sintéticas para limpeza.");
        for (const user of data.users) {
          if (user.email && emails.has(user.email)) {
            const result = await admin.auth.admin.deleteUser(user.id);
            if (result.error) throw new Error("Não foi possível remover uma conta sintética após o teste.");
            emails.delete(user.email);
          }
        }
        if (!emails.size || data.users.length < 1000) break;
      }
    }
  };
}

export type LocalAuthHarness = ReturnType<typeof createLocalAuthHarness>;
