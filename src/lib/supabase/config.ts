export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return url && key ? { url, key } : null;
}

// Esta etapa usa autenticação por rotas do servidor; a sessão não é exposta ao JS.
export function authCookieOptions(request?: { host: string | null; protocol: string | null }) {
  let local = false;
  try {
    const hostname = new URL(`http://${request?.host}`).hostname;
    local = ["localhost", "127.0.0.1", "[::1]"].includes(hostname);
  } catch { /* Uma origem desconhecida recebe o padrão seguro de produção. */ }
  const protocol = request?.protocol?.split(",")[0].trim().toLowerCase();
  const secure = protocol === "https"
    || (process.env.NODE_ENV === "production" && !(local && protocol === "http"));
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure,
    path: "/"
  };
}
