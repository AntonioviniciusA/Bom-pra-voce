import React from "react";
import Freezer from "../../images/Setores/Freezer.webp";

export default function About() {
  return (
    <div className="w-full flex flex-col items-center justify-center pt-[5%]">
      <div
        className="flex flex-col lg:flex-row w-full max-w-7xl bg-blue-500 p-8 rounded-2xl gap-14"
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
        }}>
        <div className="text-white max-w-xl flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Sobre o Bom Pra Você{" "}
            <span className=" text-yellow-400">Supermercado</span>
          </h1>
          <p className="text-lg md:text-xl leading-relaxed">
            O Bom Pra Você Supermercado nasceu com o objetivo de oferecer
            produtos de qualidade, bons preços e um atendimento próximo e
            humano. Desde a nossa fundação, buscamos ser mais do que um mercado
            — queremos fazer parte da rotina das famílias, com um ambiente
            acolhedor e setores completos: hortifrúti, padaria, açougue,
            freezer, bebidas e muito mais. Aqui, cada detalhe é pensado para
            garantir praticidade, economia e confiança para o seu dia a dia.
          </p>
        </div>

        <div className="relative h-[220px] lg:h-[520px] w-full max-w-[520px] mx-auto overflow-hidden rounded-lg bg-yellow-400">
          <img
            src={Freezer}
            alt="Imagem da Seção de Freezer"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
