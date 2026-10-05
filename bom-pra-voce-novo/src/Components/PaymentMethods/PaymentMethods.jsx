import { paymentsDescription, storeConfig } from "../../Data/storeConfig";
import acceptedPayments from "../../images/PaymentsImage/cartoes-aceitos-bom-pra-voce.jpg";

export default function PaymentMethods() {
  return (
    <section id="pagamentos" className="payments-showcase" tabIndex="-1" aria-labelledby="payments-title">
      <div className="payments-copy">
        <p className="eyebrow">FACILIDADE PARA VOCÊ</p>
        <h2 id="payments-title">Formas de pagamento aceitas</h2>
        <p>Na loja, você pode pagar com Pix, carteiras digitais, cartões de crédito, débito e benefícios.</p>
      </div>

      <img
        className="payments-artwork"
        src={acceptedPayments}
        alt="Cartões e pagamentos aceitos no Bom Pra Você Supermercado"
      />

      {storeConfig.payments.length ? (
        <ul className="payment-list" aria-label="Bandeiras e formas de pagamento aceitas">
          {storeConfig.payments.map((payment) => <li key={payment}>{payment}</li>)}
        </ul>
      ) : <p className="payments-unconfirmed">{paymentsDescription()}</p>}

      {storeConfig.paymentConditions && <p className="payment-conditions">{storeConfig.paymentConditions}</p>}
    </section>
  );
}
