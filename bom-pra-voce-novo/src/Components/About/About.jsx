import React from "react";
import AboutImage from "../../images/About.webp";

export default function About() {
  return (
    <div className="w-full flex flex-col items-center justify-center pt-[5%] pb-[5%]">
      <div
        className="flex flex-col lg:flex-row w-full max-w-7xl  p-8 rounded-2xl gap-14"
        // style={{
        //   boxShadow:
        //     "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.1) 0px 6px 6px",
        // }}
      >
        <div className="text-white max-w-xl flex flex-col justify-center">
          <h1 className="text-5xl md:text-5xl font-bold mb-4 text-black">
            Sobre o Bom Pra Você{" "}
            <span className=" text-yellow-300">Supermercado</span>
          </h1>
          <p className="text-lg md:text-2xl leading-relaxed text-black">
            O Bom Pra Você Supermercado nasceu com o objetivo de oferecer
            produtos de qualidade, bons preços e um atendimento próximo e
            humano. Desde a nossa fundação, buscamos ser mais do que um mercado
            — queremos fazer parte da rotina das famílias, com um ambiente
            acolhedor e setores completos: hortifrúti, padaria, açougue,
            freezer, bebidas e muito mais. Aqui, cada detalhe é pensado para
            garantir praticidade, economia e confiança para o seu dia a dia.
          </p>
          <div className="mt-6 flex gap-4">
            <div
              className=" w-[200px] h-[50px] border-2 border-yellow-400 m-[1%] flex items-center justify-center rounded-xl"
              style={{
                boxShadow:
                  "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.1) 0px 6px 6px",
              }}>
              <p className="text-black p-4 text-center">+20 anos no mercado</p>
            </div>

            <div
              className="w-[200px] h-[50px] border-2 border-yellow-400 m-[1%] flex items-center justify-center rounded-xl"
              style={{
                boxShadow:
                  "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.1) 0px 6px 6px",
              }}>
              <p className="text-black p-4  text-center">
                Atendimento personalizado
              </p>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <div
              className="w-[200px] h-[50px] border-2 border-yellow-400 m-[1%] flex items-center justify-center rounded-xl"
              style={{
                boxShadow:
                  "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.1) 0px 6px 6px",
              }}>
              <p className="text-black p-4  text-center">
                Garantia de qualidade
              </p>
            </div>

            <div
              className="w-[200px] h-[50px] border-2 border-yellow-400 m-[1%] flex items-center justify-center rounded-xl"
              style={{
                boxShadow:
                  "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.1) 0px 6px 6px",
              }}>
              <p className="text-black   text-center text-bold">
                Clientes satisfeitos
              </p>
            </div>
          </div>
        </div>

        <div
          className="relative h-[220px] lg:h-[520px] w-full max-w-[520px] mx-auto overflow-hidden rounded-lg bg-yellow-300"
          style={{
            boxShadow:
              "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.1) 0px 6px 6px",
          }}>
          <img src={AboutImage} alt="" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
}
