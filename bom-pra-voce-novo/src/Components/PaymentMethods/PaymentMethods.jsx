import { BadgeCheck, Banknote, CreditCard, Scale, Utensils } from "lucide-react";
import { paymentsDescription, storeConfig } from "../../Data/storeConfig";
import acceptedPayments from "../../images/PaymentsImage/cartoes-aceitos-bom-pra-voce.jpg";
import "./PaymentMethods.css";

const paymentGroups = [
  { key: "benefits", title: "Alimentação / Refeição", listLabel: "Alimentação e refeição", description: "Cartões de vale-alimentação e vale-refeição aceitos nesta loja.", Icon: Utensils, payments: ["Alelo", "Sodexo", "Ben", "VR", "Green Card", "Up"] },
  { key: "credit", title: "Crédito", description: "Principais bandeiras de cartão de crédito.", Icon: CreditCard, payments: ["Mastercard", "Visa", "Hipercard", "American Express", "Elo"] },
  { key: "debit", title: "Débito", description: "Cartões de débito.", Icon: CreditCard, payments: ["Maestro", "Visa Electron"] },
  { key: "digital", title: "À vista e digitais", listLabel: "À vista e digitais", description: "Dinheiro, Pix e carteira digital.", Icon: Banknote, payments: ["Dinheiro", "Pix", "PicPay"] },
];

export default function PaymentMethods({ headingLevel = "h2" }) {
  const Title = headingLevel;
  const groups = paymentGroups.map(group => ({ ...group, payments: group.payments.filter(payment => storeConfig.payments.includes(payment)) })).filter(group => group.payments.length);

  return <section id="pagamentos" className="payments-showcase" tabIndex="-1" aria-labelledby="payments-title">
    <div className="payments-heading">
      <span className="payments-heading__icon" aria-hidden="true"><CreditCard /></span>
      <div><Title id="payments-title">Formas de pagamento</Title><p>Conheça todas as bandeiras e meios de pagamento aceitos no Bom Pra Você.</p></div>
    </div>
    {groups.length ? <div className="payments-layout">
      <img className="payments-artwork" src={acceptedPayments} alt="Cartões e pagamentos aceitos no Bom Pra Você Supermercado" />
      <div className="payment-groups" role="list" aria-label="Bandeiras e formas de pagamento aceitas">
        {groups.map(({ key, title, listLabel = title, description, Icon, payments }) => <section className={`payment-group payment-group--${key}`} role="listitem" key={key} aria-labelledby={`payment-${key}`}>
          <header><span className="payment-group__icon" aria-hidden="true"><Icon /></span><h2 id={`payment-${key}`}>{title}</h2><p>{description}</p></header>
          <ul aria-label={listLabel}>{payments.map(payment => <li key={payment}>{payment}</li>)}</ul>
        </section>)}
        {storeConfig.paymentConditions && <aside className="payment-conditions"><span aria-hidden="true"><BadgeCheck /></span><div><strong>Informação importante</strong><p>{storeConfig.paymentConditions}</p></div></aside>}
        <aside className="payment-legal" aria-labelledby="payment-legal-title"><Scale aria-hidden="true" /><div><strong id="payment-legal-title">Transparência no pagamento</strong><p>Não exigimos valor mínimo para pagamentos com cartão, débito ou Pix. Eventuais descontos conforme o prazo ou o meio de pagamento são informados de forma clara antes da compra.</p></div></aside>
      </div>
    </div> : <p className="payments-unconfirmed">{paymentsDescription()}</p>}
  </section>;
}
