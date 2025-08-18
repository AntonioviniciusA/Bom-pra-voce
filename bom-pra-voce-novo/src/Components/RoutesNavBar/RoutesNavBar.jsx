import React from "react";

const RoutesNavBar = () => {
  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="hidden md:flex items-center space-x-8">
      <button
        onClick={() => handleScroll("home")}
        className="text-white font-bold hover:text-yellow-400 transition-colors text-2xl">
        Início
      </button>
      <button
        onClick={() => handleScroll("promocoes")}
        className="text-white font-bold hover:text-yellow-400 transition-colors text-2xl">
        Promoções
      </button>
      <button
        onClick={() => handleScroll("setores")}
        className="text-white font-bold hover:text-yellow-400 transition-colors text-2xl">
        Setores
      </button>
      <button
        onClick={() => handleScroll("tour")}
        className="text-white font-bold hover:text-yellow-400 transition-colors text-2xl">
        Tour
      </button>
      <button
        onClick={() => handleScroll("sobre")}
        className="text-white font-bold hover:text-yellow-400 transition-colors text-2xl">
        Sobre
      </button>
      <button
        onClick={() => handleScroll("vagas")}
        className="text-white font-bold hover:text-yellow-400 transition-colors text-2xl">
        Vagas
      </button>
    </div>
  );
};

export default RoutesNavBar;
