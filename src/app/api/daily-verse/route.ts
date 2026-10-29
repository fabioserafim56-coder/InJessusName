import { getDailyVerse } from "@/lib/daily-verse";

export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(getDailyVerse(), { headers: { "Cache-Control": "no-store, max-age=0" } });
}
