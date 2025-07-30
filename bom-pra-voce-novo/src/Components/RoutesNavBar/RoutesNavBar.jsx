const RoutesNavBar = () => {
  return (
    <div className="hidden md:flex items-center space-x-8">
      <a
        href="#home"
        className="text-white font-bold hover:text-yellow-400 transition-colors text-2xl">
        Início
      </a>
      <a
        href="#produtos"
        className="text-white font-bold hover:text-yellow-400 transition-colors text-2xl">
        Promoções
      </a>
      <a
        href="#servicos"
        className="text-white font-bold hover:text-yellow-400 transition-colors text-2xl">
        Setores
      </a>
      <a
        href="#contato"
        className="text-white font-bold hover:text-yellow-400 transition-colors text-2xl">
        Tour
      </a>
      <a
        href="#contato"
        className="text-white font-bold hover:text-yellow-400 transition-colors text-2xl">
        Sobre
      </a>
      <a
        href="#contato"
        className="text-white font-bold hover:text-yellow-400 transition-colors text-2xl">
        Vagas
      </a>
      {/* <a
        href="#contato"
        className="text-white font-bold hover:text-yellow-400 transition-colors text-2xl">
        Contato
      </a> */}
    </div>
  );
};

export default RoutesNavBar;
