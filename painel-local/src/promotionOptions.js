import { Baby, Droplets, PackageOpen, ShoppingCart, Snowflake, Tag, Star, Sparkles } from "lucide-react";

export const icons = [
  { key: "tag", label: "Etiqueta", Icon: Tag },
  { key: "cart", label: "Carrinho", Icon: ShoppingCart },
  { key: "snowflake", label: "Congelados", Icon: Snowflake },
  { key: "baby", label: "Bebê", Icon: Baby },
  { key: "droplets", label: "Limpeza", Icon: Droplets },
  { key: "package", label: "Utilidades", Icon: PackageOpen },
  { key: "star", label: "Estrela", Icon: Star },
  { key: "sparkles", label: "Destaque", Icon: Sparkles },
];
export const themes = [
  { key: "purple", label: "Roxo", color: "#4913b8", background: "#f5efff" },
  { key: "green", label: "Verde", color: "#17633c", background: "#edf8ef" },
  { key: "red", label: "Vermelho", color: "#a51f32", background: "#fff0f1" },
  { key: "blue", label: "Azul", color: "#1854a0", background: "#edf5ff" },
  { key: "orange", label: "Laranja", color: "#994400", background: "#fff4e5" },
];
export function localDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}
export function campaignPayload(form) {
  const starts = new Date(form.starts_at), ends = new Date(form.ends_at);
  if (!Number.isFinite(starts.getTime()) || !Number.isFinite(ends.getTime()) || ends <= starts) throw new Error("O fim deve ser posterior ao início da oferta.");
  return { ...form, title: form.title.trim(), summary: form.summary.trim(), conditions: form.conditions.trim(), hud_label: form.hud_label.trim(), starts_at: starts.toISOString(), ends_at: ends.toISOString(), display_order: Number(form.display_order) };
}
