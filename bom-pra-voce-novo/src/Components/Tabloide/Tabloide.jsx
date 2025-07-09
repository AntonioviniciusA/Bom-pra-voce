import React from "react";
import FOTOTESTEE from "../../images/TabloidCard/Quarta.png";

export default function Tabloide() {
  return (
    <div className=" py-10 flex items-center justify-center w-full h-full p-8">
      <div className="p-4">
        <div className="flex items-center flex-col mb-4 text-center">
          <h1 className="text-4xl font-extrabold text-yellow-400">
            Corre que dá tempo!
          </h1>
          <p className="text-lg text-white font-bold mt-2 ">
            As melhores ofertas da semana te esperam aqui.
          </p>
        </div>
        {/* cada div dessa tera uma imagem de "banner" para abrir o tabloide vulgo panfleto da semana ou do mes  */}
        <div className="flex gap-4">
          {/* primeiro panfleto */}
          <div className="relative h-32 lg:h-40 overflow-hidden rounded-lg bg-yellow-400">
            <img
              src={FOTOTESTEE}
              alt=""
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
            />
          </div>
          {/* segundo panfleto */}
          <div className="relative h-32 lg:h-40 overflow-hidden rounded-lg bg-yellow-400">
            <img
              src={FOTOTESTEE}
              alt=""
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
