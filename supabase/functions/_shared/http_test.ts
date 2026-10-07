import { assertEquals } from "jsr:@std/assert@1";
import { failure, preflight } from "./http.ts";

Deno.test("allows Electron and local panel origins only on authenticated administrative functions", () => {
  for (const name of ["promotion-admin", "rh-applications"]) {
    for (const origin of ["null", "http://127.0.0.1:5174", "http://localhost:5174"]) {
      const response = preflight(new Request(`https://example.supabase.co/functions/v1/${name}`, { method: "OPTIONS", headers: { origin } }));
      assertEquals(response.status, 204);
      assertEquals(response.headers.get("Access-Control-Allow-Origin"), origin);
    }
  }
  assertEquals(preflight(new Request("http://edge-runtime/rh-applications", { method: "OPTIONS", headers: { origin: "null" } })).status, 204);
  let error: unknown;
  const req = new Request("https://example.supabase.co/functions/v1/application-submit", { method: "OPTIONS", headers: { origin: "null" } });
  try { preflight(req); } catch (caught) { error = caught; }
  assertEquals(failure(req, error).status, 403);
});

Deno.test("allows preflight from the deployed public site", () => {
  const req = new Request("https://example.supabase.co/functions/v1/public-promotions", {
    method: "OPTIONS",
    headers: { origin: "https://bom-pra-voce-vert.vercel.app" },
  });

  const response = preflight(req);

  assertEquals(response.status, 204);
  assertEquals(response.headers.get("Access-Control-Allow-Origin"), "https://bom-pra-voce-vert.vercel.app");
});

Deno.test("returns a 403 for a disallowed origin without throwing a second CORS error", () => {
  const req = new Request("https://example.supabase.co/functions/v1/public-promotions", {
    method: "OPTIONS",
    headers: { origin: "https://untrusted.example" },
  });

  let error: unknown;
  try {
    preflight(req);
  } catch (caught) {
    error = caught;
  }
  const response = failure(req, error);

  assertEquals(response.status, 403);
  assertEquals(response.headers.get("Access-Control-Allow-Origin"), null);
});
