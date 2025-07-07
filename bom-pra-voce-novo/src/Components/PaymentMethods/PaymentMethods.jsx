import React from "react";

export default function PaymentsMethods() {
  return (
    <div
      className="bg-yellow-400 flex items-center justify-center w-full h-[400px]"
      style={{
        clipPath: "ellipse(100% 60% at 50% 100%)",
      }}>
      <div className="p-4">
        <div className="flex items-center flex-col mt-10 mb-4 text-center">
          <h1 className="text-4xl font-extrabold text-white">
            Escolha a Melhor Forma de Pagar!!
          </h1>
        </div>
        <div className="flex gap-4"></div>
      </div>
    </div>
  );
}
