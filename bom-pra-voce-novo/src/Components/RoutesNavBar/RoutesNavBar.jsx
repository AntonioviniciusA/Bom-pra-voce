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
        Produtos
      </a>
      <a
        href="#servicos"
        className="text-white font-bold hover:text-yellow-400 transition-colors text-2xl">
        Serviços
      </a>
      <a
        href="#contato"
        className="text-white font-bold hover:text-yellow-400 transition-colors text-2xl">
        Contato
      </a>
    </div>
  );
};

export default RoutesNavBar;
