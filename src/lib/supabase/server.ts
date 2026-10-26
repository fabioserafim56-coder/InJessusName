import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";
import { authCookieOptions, getSupabaseConfig } from "./config";

export async function createClient() {
  const config = getSupabaseConfig();
  if (!config) throw new Error("A conexão Supabase ainda não foi configurada neste ambiente.");
  const cookieStore = await cookies();
  const requestHeaders = await headers();
  const cookieOptions = authCookieOptions({
    host: requestHeaders.get("host"), protocol: requestHeaders.get("x-forwarded-proto")
  });

  return createServerClient(config.url, config.key, {
    cookieOptions,
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(values) {
        try {
          values.forEach(({ name, value, options }) => cookieStore.set(name, value, {
            ...options, ...cookieOptions
          }));
        } catch {
          // Server Components só leem; o proxy atualiza cookies antes da renderização.
        }
      }
    }
  });
}

export async function getCurrentUser() {
  if (!getSupabaseConfig()) return null;
  const client = await createClient();
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
}
