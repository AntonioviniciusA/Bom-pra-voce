import { assertEquals } from "jsr:@std/assert@1";
import { failure, preflight } from "./http.ts";

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
