export class AdminApiError extends Error {
  constructor(code, message, status = 0) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export function apiConfig() {
  const url = (import.meta.env.VITE_SUPABASE_URL || "").replace(/\/$/, "");
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";
  let valid = false;
  try {
    valid = new URL(url).protocol === "https:" && /^sb_publishable_[A-Za-z0-9_-]+$/.test(key);
  } catch {}
  return { url, key, ready: valid };
}
