import React from "react";
import PaymentMethodsImages from "../../Data/PaymentsData";

export default function CardPayments() {
  return (
    <div className="grid grid-cols-5 gap-2 max-w-[600px] mx-auto">
      {PaymentMethodsImages.map((method, index) => (
        <div
          key={index}
          className="w-full aspect-square flex flex-col items-center justify-center bg-gray-50 rounded-lg p-1 shadow-sm">
          <img
            src={method.image}
            alt={method.name}
            className="max-w-[80%] max-h-[60%] object-contain"
          />
        </div>
      ))}
    </div>
  );
}
