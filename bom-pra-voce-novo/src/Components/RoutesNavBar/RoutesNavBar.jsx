import React from "react";

const RoutesNavBar = () => {
  return (
    <div className="hidden md:flex items-center space-x-8">
      <a
        href="#home"
        className="text-white font-bold hover:text-yellow-400 transition-colors">
        Início
      </a>
      <a
        href="#produtos"
        className="text-white font-bold hover:text-yellow-400 transition-colors">
        Produtos
      </a>
      <a
        href="#servicos"
        className="text-white font-bold hover:text-yellow-400 transition-colors">
        Serviços
      </a>
      <a
        href="#contato"
        className="text-white font-bold hover:text-yellow-400 transition-colors">
        Contato
      </a>
    </div>
  );
};

export default RoutesNavBar;
