import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import NavBar from "./Components/NavBar/NavBar";
import Footer from "./Components/Footer/Footer";
export default function App() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const titles = { "/": "Ofertas e informações da loja", "/trabalhe-conosco": "Trabalhe conosco", "/privacidade": "Privacidade" };
    document.title = (titles[pathname] || "Página não encontrada") + " | Bom Pra Você";
    const frame = requestAnimationFrame(() => {
      const target = hash ? document.getElementById(hash.slice(1)) : document.getElementById("conteudo");
      if (target) {
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
        if (hash) {
          target.scrollIntoView({ block: "start", behavior: "instant" });
        } else {
          // Reinicia rotas independentes no topo sem posicionar o conteúdo
          // por baixo do cabeçalho sticky.
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        }
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);
  return <>
    <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
    <NavBar />
    <main id="conteudo" tabIndex="-1"><Outlet /></main>
    <Footer />
  </>;
}
