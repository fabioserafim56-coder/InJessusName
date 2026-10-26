import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { authCookieOptions, getSupabaseConfig } from "@/lib/supabase/config";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const settings = getSupabaseConfig();
  if (!settings) return response;
  const cookieOptions = authCookieOptions({
    host: request.headers.get("host"),
    protocol: request.headers.get("x-forwarded-proto") || request.nextUrl.protocol.replace(":", "")
  });

  const client = createServerClient(settings.url, settings.key, {
    cookieOptions,
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(values, headers) {
        values.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        values.forEach(({ name, value, options }) => response.cookies.set(name, value, {
          ...options, ...cookieOptions
        }));
        Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
      }
    }
  });

  // Renovação de sessão. A autorização definitiva permanece nas rotas e na RLS.
  await client.auth.getUser().catch(() => undefined);
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("Vary", "Cookie");
  return response;
}

export const config = { matcher: ["/comecar", "/meu-percurso/:path*", "/entrar"] };
