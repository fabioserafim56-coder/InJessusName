import { createClient } from "@/lib/supabase/server";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { assertSameOrigin, privateJson, requestFailure, RequestError } from "@/lib/http";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    if (!getSupabaseConfig()) throw new RequestError(503, "As contas ainda não estão conectadas.");
    const client = await createClient();
    const { error } = await client.auth.signOut({ scope: "local" });
    if (error) throw error;
    return privateJson({ redirect: "/" });
  } catch (error) { return requestFailure(error); }
}
