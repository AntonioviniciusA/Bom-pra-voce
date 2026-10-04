import { assertEquals, assertThrows } from "jsr:@std/assert@1";
import { validateBirthDate, validatePdf, validatePromotion } from "./validation.ts";

Deno.test("accepts a structurally recognizable PDF within the byte limit", () => {
  validatePdf(new TextEncoder().encode("%PDF-1.7\nobject\n%%EOF"));
});

Deno.test("rejects an extension-only fake PDF", () => {
  assertThrows(() => validatePdf(new TextEncoder().encode("<html>fake</html>")));
});

Deno.test("validates real promotion signatures", () => {
  assertEquals(validatePromotion(new Uint8Array([137,80,78,71,13,10,26,10,0]), "image/png"), "png");
  assertThrows(() => validatePromotion(new TextEncoder().encode("<svg></svg>"), "image/svg+xml"));
});

Deno.test("rejects impossible and future birth dates", () => {
  assertThrows(() => validateBirthDate("2026-02-30"));
  assertThrows(() => validateBirthDate("2999-01-01"));
  assertEquals(validateBirthDate("2000-02-29"), "2000-02-29");
});

