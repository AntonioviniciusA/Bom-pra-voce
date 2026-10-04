import { CreditCard } from "lucide-react";
import { paymentsDescription, storeConfig } from "../../Data/storeConfig";
export default function PaymentMethods() {
  return <div id="pagamentos" className="payments-inline" tabIndex="-1">
    <span className="visit-icon payment-icon"><CreditCard aria-hidden="true" /></span>
    <div><h3 id="payments-title">Pagamentos na loja</h3>
      {storeConfig.payments.length ? <ul className="payment-list">{storeConfig.payments.map(payment =>
        <li key={payment}>{payment}</li>)}</ul> : <p>{paymentsDescription()}</p>}
      {storeConfig.paymentConditions && <p>{storeConfig.paymentConditions}</p>}
    </div>
  </div>;
}
