export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({ status: "ok", application: "InJessusName" }, {
    headers: { "Cache-Control": "no-store" }
  });
}
