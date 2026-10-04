import { HttpError } from "./http.ts";

export const MAX_RESUME_BYTES = 5_000_000;
export const MAX_PROMOTION_BYTES = 10_000_000;

export function text(value: FormDataEntryValue | null, max: number, required = false) {
  const normalized = typeof value === "string" ? value.trim().normalize("NFC") : "";
  if ((required && !normalized) || normalized.length > max || /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(normalized)) {
    throw new HttpError(422, "INVALID_FIELDS", "Revise os campos informados.");
  }
  return normalized;
}

export function validateEmail(value: string) {
  if (value.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) throw new HttpError(422, "INVALID_FIELDS", "Revise os campos informados.");
}

export function validateBirthDate(value: string) {
  if (!value) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new HttpError(422, "INVALID_FIELDS", "Data de nascimento inválida.");
  const date = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(date.valueOf()) || date.toISOString().slice(0, 10) !== value || value > new Date().toISOString().slice(0, 10)) {
    throw new HttpError(422, "INVALID_FIELDS", "Data de nascimento inválida.");
  }
  return value;
}

export function validatePdf(bytes: Uint8Array) {
  if (!bytes.length || bytes.length > MAX_RESUME_BYTES) throw new HttpError(413, "FILE_TOO_LARGE", "O PDF excede o limite de 5 MB.");
  const head = new TextDecoder().decode(bytes.slice(0, 8));
  const tail = new TextDecoder().decode(bytes.slice(Math.max(0, bytes.length - 2048)));
  if (!head.startsWith("%PDF-") || !tail.includes("%%EOF")) throw new HttpError(415, "INVALID_FILE_TYPE", "O arquivo não é um PDF válido.");
}

export function validatePromotion(bytes: Uint8Array, mime: string) {
  if (!bytes.length || bytes.length > MAX_PROMOTION_BYTES) throw new HttpError(413, "FILE_TOO_LARGE", "O material excede o limite de 10 MB.");
  const isPdf = mime === "application/pdf" && new TextDecoder().decode(bytes.slice(0, 5)) === "%PDF-";
  const isJpeg = mime === "image/jpeg" && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes.at(-2) === 0xff && bytes.at(-1) === 0xd9;
  const isPng = mime === "image/png" && [137,80,78,71,13,10,26,10].every((value, index) => bytes[index] === value);
  const isWebp = mime === "image/webp" && new TextDecoder().decode(bytes.slice(0, 4)) === "RIFF" && new TextDecoder().decode(bytes.slice(8, 12)) === "WEBP";
  if (!isPdf && !isJpeg && !isPng && !isWebp) throw new HttpError(415, "INVALID_FILE_TYPE", "Use PDF, JPEG, PNG ou WebP válido.");
  return mime === "application/pdf" ? "pdf" : mime === "image/jpeg" ? "jpg" : mime === "image/png" ? "png" : "webp";
}

