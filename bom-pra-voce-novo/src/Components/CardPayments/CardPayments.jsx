import React from "react";
import PaymentMethodsImages from "../../Data/PaymentsData";

export default function CardPayments() {
  return (
    <div className="grid grid-cols-5 gap-2 max-w-[600px] mx-auto">
      {PaymentMethodsImages.map((method, index) => (
        <div
          key={index}
          className="payment-card relative z-[1] text-white w-full aspect-square flex flex-col items-center justify-center  rounded-[12px] shadow-[0_0_30px_rgba(68,68,68,0.5)] overflow-hidden">
          <img
            src={method.image}
            alt={method.name}
            className="max-w-[80%] max-h-[80%] object-contain"
          />
        </div>
      ))}
    </div>
  );
}
