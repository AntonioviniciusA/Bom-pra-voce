import React from "react";
import Logo from "../Logo/Logo";
import RoutesNavBar from "../RoutesNavBar/RoutesNavBar";

const NavBar = () => {
  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-7xl">
      <div className="backdrop-blur-sm bg-white/30 border border-white/55 rounded-full px-6 py-3 shadow-2xl">
        <div className="flex items-center">
          <Logo />
          <div className="flex-1 flex justify-center">
            <RoutesNavBar />
          </div>
          {/* elemento vazio imitando o tamanho da logo para centralizar as rotas */}
          <div></div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
