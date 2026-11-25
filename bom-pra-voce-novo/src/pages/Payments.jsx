import PaymentMethods from "../Components/PaymentMethods/PaymentMethods";
import "./Payments.css";

export default function Payments() {
  return <section className="payments-page" aria-labelledby="payments-title">
    <div className="shell payments-page__shell">
      <PaymentMethods headingLevel="h1" />
    </div>
  </section>;
}
