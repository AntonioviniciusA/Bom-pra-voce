"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { decodeJwtPayload, freshAal2Token, SESSION_MS } = require("./assistant.cjs");

function token(payload) {
  return `x.${Buffer.from(JSON.stringify(payload)).toString("base64url")}.y`;
}

test("decodes the JWT payload without exposing or persisting the token", () => {
  assert.deepEqual(decodeJwtPayload(token({ aal: "aal2", sub: "user" })), { aal: "aal2", sub: "user" });
  assert.equal(decodeJwtPayload("invalid"), null);
});

test("accepts only a recent aal2 token", () => {
  const now = Date.now();
  assert.equal(freshAal2Token(token({ aal: "aal2", iat: Math.floor(now / 1000) }), now), true);
  assert.equal(freshAal2Token(token({ aal: "aal1", iat: Math.floor(now / 1000) }), now), false);
  assert.equal(freshAal2Token(token({ aal: "aal2", iat: Math.floor((now - 180000) / 1000) }), now), false);
});

test("keeps an authorized assisted session active for one hour", () => {
  assert.equal(SESSION_MS, 60 * 60 * 1000);
});
