export const siteUrl = "https://www.bompravocesupermercado.com.br";
export const pageMetadata = {
  "/": { title: "Supermercado em Samambaia Sul, Brasília–DF | Bom Pra Você", description: "Bom Pra Você Supermercado na QS 118, conjunto 6, lote 2, Samambaia Sul, Brasília–DF. Consulte localização, horários, setores e ofertas da loja." },
  "/trabalhe-conosco": { title: "Trabalhe conosco | Bom Pra Você", description: "Consulte as orientações para candidaturas no Bom Pra Você Supermercado, em Samambaia Sul, Brasília–DF." },
  "/privacidade": { title: "Privacidade | Bom Pra Você", description: "Saiba como o site trata dados de candidaturas, cookies, preferências e serviços externos, e como entrar em contato sobre seus direitos." },
  "/termos": { title: "Termos de uso | Bom Pra Você", description: "Condições de uso do site, consulta de ofertas, candidaturas e informações sobre o supermercado Bom Pra Você." },
};
export function localBusiness(store) {
  return {
    "@context": "https://schema.org", "@type": "GroceryStore", "@id": siteUrl + "/#loja",
    name: store.name + " Supermercado", legalName: store.legalName, url: siteUrl + "/",
    image: siteUrl + "/brand.png", hasMap: store.mapsUrl,
    address: { "@type": "PostalAddress", streetAddress: "QS 118, conjunto 6, lote 2, Samambaia Sul", addressLocality: "Brasília", addressRegion: "DF", postalCode: "72302-576", addressCountry: "BR" },
    openingHoursSpecification: store.hours.map((row, index) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: index === 0 ? ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] : ["Sunday"],
      opens: row.time.split("–")[0], closes: row.time.split("–")[1],
    })),
  };
}
