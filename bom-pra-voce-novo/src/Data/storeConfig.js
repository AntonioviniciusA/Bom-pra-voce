// Publish only information confirmed by the store. Null means not yet confirmed.
export const storeConfig = {
  name: "Bom Pra Você",
  address: "QS 118, conjunto 6, lote 2 — Samambaia Sul, Brasília–DF",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Bom%20Pra%20Voc%C3%AA%20Supermercado%20QS%20118%20Conjunto%206%20Lote%202%20Samambaia%20Sul%20Bras%C3%ADlia%20DF",
  hours: [{ day: "Segunda a sábado", time: "08:00–21:00" }, { day: "Domingo", time: "08:00–20:00" }],
  holidayHours: "Feriados: consulte a loja antes de sair.",
  phone: null,
  email: null,
  whatsappUrl: null,
  payments: [],
  paymentConditions: null,
  sectors: ["Hortifrúti", "Padaria", "Bebidas", "Adega", "Congelados"],
  privacy: {
    approved: false,
    version: "",
    controller: "",
    contact: "",
    purpose: "",
    retention: "",
    rights: "",
  },
};
export const paymentsDescription = () => storeConfig.payments.length
  ? storeConfig.payments.join(", ") + "."
  : "As formas de pagamento serão divulgadas após confirmação pela loja.";
export function privacyReady() {
  const p = storeConfig.privacy;
  return p.approved && ["version", "controller", "contact", "purpose", "retention", "rights"]
    .every(key => typeof p[key] === "string" && p[key].trim());
}
