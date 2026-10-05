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
    approved: true,
    version: "2026-10-05",
    controller: "Comercial de Produtos Alimenticios Bom Pra Voce LTDA - ME — CNPJ 05.428.120/0001-08",
    controllerAddress: "QD QS 118, conjunto 6, lote 2, Samambaia Sul, Brasília–DF, CEP 72302-576",
    contact: "antoniovinicius_@outlook.com",
    purpose: "Receber e avaliar candidaturas para oportunidades de trabalho no Bom Pra Você.",
    retention: "Os dados e o currículo serão conservados por até 6 meses após o recebimento e depois eliminados, salvo quando a conservação for necessária para cumprir obrigação legal ou exercer direitos.",
    rights: "O candidato poderá solicitar informações, acesso, correção ou eliminação pelos canais oficiais do controlador, observadas as hipóteses legais aplicáveis.",
  },
};
export const paymentsDescription = () => storeConfig.payments.length
  ? storeConfig.payments.join(", ") + "."
  : "As formas de pagamento serão divulgadas após confirmação pela loja.";
export function privacyReady() {
  const p = storeConfig.privacy;
  return p.approved && ["version", "controller", "controllerAddress", "contact", "purpose", "retention", "rights"]
    .every(key => typeof p[key] === "string" && p[key].trim());
}
