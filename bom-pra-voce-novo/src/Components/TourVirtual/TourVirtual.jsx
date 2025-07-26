import React from "react";
import Freezer from "../../images/SupermarketAreasImages/VitualImage.png";

export default function TourVirtual() {
  return (
    <div className="w-full flex flex-col items-center justify-center pt-[5%]">
      <div
        className="flex flex-col lg:flex-row items-center justify-center lg:w-full bg-yellow-400 p-8 rounded-3xl"
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
        }}>
        <div className="relative w-full max-w-[520px] aspect-square overflow-hidden rounded-lg mb-6 lg:mb-0 lg:mr-[5%]">
          <img
            src={Freezer}
            alt="Imagem da Seção de Freezer"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="text-white max-w-xl flex flex-col justify-center text-center lg:text-left">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Faça um tour virtual pelo nosso supermercado!
          </h1>

          <p className="text-lg md:text-2xl leading-relaxed mb-6">
            Conheça nosso espaço, veja de perto nossos produtos e sinta-se em
            casa antes mesmo de nos visitar. Venha viver essa experiência
            interativa!
          </p>
          <button className="w-[200px] bg-blue-400 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl transition duration-300 mx-auto lg:mx-0">
            Iniciar o Tour
          </button>
        </div>
      </div>
    </div>
  );
}
