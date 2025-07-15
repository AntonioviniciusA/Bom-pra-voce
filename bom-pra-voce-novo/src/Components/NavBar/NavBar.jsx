import React from "react";
import Logo from "../Logo/Logo";
import RoutesNavBar from "../RoutesNavBar/RoutesNavBar";

const NavBar = () => {
  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-7xl">
      <div
        className="backdrop-blur-sm bg-yellow-300/30 border-[3px] border-yellow-300 rounded-full px-8 py-4 shadow-2xl shadow-white/10"
        style={{ boxShadow: "rgba(255, 238, 0, 0.76) 0px 10px 30px" }}>
        <div className="flex items-center">
          <div>
            <Logo />
          </div>
          <div
            className="flex-1 flex justify-center text-black font-semibold"
            style={{ textShadow: "0 1px 1px rgba(0, 0, 0, 0.9)" }}>
            <RoutesNavBar />
          </div>
          <div className="w-[64px]" />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
