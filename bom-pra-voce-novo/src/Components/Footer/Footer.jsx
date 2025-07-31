import React from "react";
import Logo from "../Logo/Logo";
import { Icon } from "../../Lib/Ultils/Icons/icons";

const Footer = () => {
  return (
    <div
      className=" w-full bg-yellow-400   rounded-3xl"
      style={{
        boxShadow:
          "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
      }}>
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <Logo />
            </div>

            <p className="text-white max-w-md text-lg font-semibold">
              As melhores ofertas do mercado
            </p>

            <div
              className="bg-white rounded-2xl p-6"
              style={{ boxShadow: "rgba(0, 0, 0, 0.42) 0px 10px 30px" }}>
              <h3 className="font-semibold text-lg mb-3">
                Entre em contato via E-mail
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  className="flex-1 px-4 py-3 rounded-xl  border-yellow-400 border-[2px] focus:border-white focus:outline-none bg-white/90"
                />
                <button className="bg-white text-yellow-400 border-yellow-400 border-[2px] px-6 py-3 rounded-xl font-semibold hover:bg-white/80 transition-colors">
                  Inscrever
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b-2 text-white pb-2 ">
              Links Rápidos
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#home"
                  className="text-white font-bold hover:text-black transition-colors">
                  Início
                </a>
              </li>
              <li>
                <a
                  href="#produtos"
                  className="text-white font-bold hover:text-black transition-colors ">
                  Promoções
                </a>
              </li>
              <li>
                <a
                  href="#servicos"
                  className="text-white font-bold hover:text-black transition-colors">
                  Setores
                </a>
              </li>
              <li>
                <a
                  href="#contato"
                  className="text-white font-bold hover:text-black transition-colors">
                  Tour
                </a>
              </li>
              <li>
                <a
                  href="#contato"
                  className="text-white font-bold hover:text-black transition-colors">
                  Sobre
                </a>
              </li>
              <li>
                <a
                  href="#contato"
                  className="text-white font-bold hover:text-black transition-colors">
                  Vagas
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b-2 text-white pb-2">
              Contato
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Icon name="Phone" color="white" size={20} />
                <span className="font-medium text-white font-bold">
                  (61) 99374-2005
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Icon name="Mail" color="white" size={20} />
                <span className="font-medium text-white">
                  contato@bompravocê.com
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Icon name="MapPin" color="white" size={20} />
                <span className="font-medium text-white">Brasília - DF</span>
              </div>
            </div>

            <div className="pt-4">
              <h4 className="font-semibold mb-3 text-white">Siga-nos</h4>
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-white/80 transition-colors"
                  aria-label="Facebook">
                  <Icon name="Facebook" className="text-yellow-500" size={20} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-white/80 transition-colors"
                  aria-label="Instagram">
                  <Icon
                    name="Instagram"
                    className="text-yellow-500"
                    size={20}
                  />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-white/80 transition-colors"
                  aria-label="Twitter">
                  <Icon name="Twitter" className="text-yellow-500" size={20} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-white/80 transition-colors"
                  aria-label="Youtube">
                  <Icon name="Youtube" className="text-yellow-500" size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <svg viewBox="0 0 1200 120" className="w-full h-8 fill-yellow-500">
          <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"></path>
        </svg>
      </div>

      <div className="bg-yellow-500 py-6">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap items-center gap-6 text-sm font-medium">
              <p className="text-white text-lg font-semibold">
                © 2025 Bom Pra Você
              </p>
              {/* <a href="#" className="hover:underline">
                Política de Privacidade
              </a> */}
            </div>

            <div className="flex items-center space-x-4">
              <p className="text-lg font-semibold font-medium text-white">
                Pagamento seguro:
              </p>
              <div className="flex space-x-2">
                <button>Visualizar Metodos de Pagamento </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
