import { paymentsDescription, storeConfig } from "./storeConfig";
export function getFaqData() {
  return [
    { title: "Posso fazer compras pelo site?", content: "O site é informativo. As compras são realizadas presencialmente na loja." },
    { title: "Onde encontro as promoções?", content: "Na seção Ofertas, consulte os panfletos disponíveis e confira a validade e as condições de cada campanha.", href: "/#promocoes", link: "Ver ofertas" },
    { title: "Onde fica o supermercado?", content: storeConfig.address || "O endereço será disponibilizado após confirmação pela loja.", href: "/#localizacao", link: "Ver localização e horários" },
    { title: "Quais são os horários de funcionamento?", content: storeConfig.hours.length ? storeConfig.hours.map(row => row.day + ": " + row.time).join(". ") : "Os horários estão em atualização. Confirme também o atendimento aos domingos e feriados.", href: "/#localizacao", link: "Planejar visita" },
    { title: "Quais formas de pagamento são aceitas?", content: paymentsDescription(), href: "/#pagamentos", link: "Ver pagamentos na loja" },
    { title: "Como envio meu currículo?", content: "A página Trabalhe conosco informa a disponibilidade do recebimento e as orientações para envio de PDF.", href: "/trabalhe-conosco", link: "Trabalhe conosco" },
    { title: "Posso consultar meu currículo pelo protocolo?", content: "Não há consulta de currículo ou de andamento pelo site. O comprovante confirma apenas o recebimento e não garante contratação." },
  ];
}
