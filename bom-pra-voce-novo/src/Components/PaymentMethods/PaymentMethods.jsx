import React from "react";
import CardPayments from "../CardPayments/CardPayments";
import FOTO from "../../images/fundo.png";

export default function PaymentsMethods() {
  return (
    <>
      <div
        className="bg-yellow-400 flex items-center justify-center w-full h-[250px]"
        style={{
          clipPath: "ellipse(50% 60% at 50% 100%)",
        }}>
        <div>
          <div className="flex items-center flex-col mt-[20%] text-center">
            <h1 className="text-4xl font-extrabold text-white">
              Suas Compras, Seu Jeito!
            </h1>
            <p className="text-lg font-extrabold text-white pt-4">
              No Bom pra Você, você escolhe a forma de <br />
              pagamento que combina com você. Compre fácil e com tranquilidade!
            </p>
          </div>
        </div>
      </div>

      {/* <div className="relative bg-yellow-400 flex flex-col items-center justify-center w-full p-14 overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full pointer-events-none z-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#f3f4f5"
              fillOpacity="1"
              d="M0,32L48,32C96,32,192,32,288,64C384,96,480,160,576,181.3C672,203,768,181,864,160C960,139,1056,117,1152,122.7C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div> */}

      <div className="relative bg-yellow-400 flex items-center justify-center w-full p-14 overflow-hidden">
        <img
          src={FOTO}
          alt="Ilustração de fundo"
          className="absolute bottom-0 left-0 w-full  opacity-45 z-0"
        />

        <div className="pt-4 pb-12 z-10">
          <div className="flex gap-4">
            <CardPayments />
          </div>
        </div>
      </div>
    </>
  );
}
