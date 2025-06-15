import React from "react";
import LogoImage from "../../images/Logo.png";

const Logo = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="h-10 rounded-full flex items-center justify-center">
        <img
          src={LogoImage}
          alt="logo-bom-pra-voce"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Logo;
