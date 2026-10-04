const encoder = new TextEncoder();

export function base64Url(bytes: Uint8Array) {
  let raw = "";
  bytes.forEach((byte) => raw += String.fromCharCode(byte));
  return btoa(raw).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

export async function sha256(value: string | Uint8Array) {
  const data = typeof value === "string" ? encoder.encode(value) : value;
  const buffer = Uint8Array.from(data).buffer;
  return base64Url(new Uint8Array(await crypto.subtle.digest("SHA-256", buffer)));
}

export async function hmac(secret: string, value: string) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return base64Url(new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(value).buffer)));
}

export function randomToken(bytes = 32) {
  return base64Url(crypto.getRandomValues(new Uint8Array(bytes)));
}

export function constantTimeEqual(left: string, right: string) {
  const a = encoder.encode(left);
  const b = encoder.encode(right);
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a[i] ^ b[i];
  return diff === 0;
}

