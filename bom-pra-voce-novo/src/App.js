import { siteUrl, pageMetadata, localBusiness } from "./Data/seo";
import { storeConfig } from "./Data/storeConfig";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import NavBar from "./Components/NavBar/NavBar";
import PrivacyPreferences from "./Components/PrivacyPreferences";
import "./accessibility.css";
import Footer from "./Components/Footer/Footer";
export default function App() {
  const { pathname: routePath, hash, key: navigationKey } = useLocation();
  const pathname = routePath.replace(/\/+$/, "") || "/";
  useEffect(() => {
    const meta = pageMetadata[pathname];
    document.title = meta?.title || "Página não encontrada | Bom Pra Você";
    const setMeta = (selector, attributes) => {
      let node = document.head.querySelector(selector);
      if (!node) { node = document.createElement(selector.startsWith("link") ? "link" : "meta"); document.head.appendChild(node); }
      Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
    };
    setMeta('meta[name="robots"]', { name: "robots", content: meta ? "index,follow" : "noindex,follow" });
    setMeta('meta[name="description"]', { name: "description", content: meta?.description || "Página não encontrada." });
    setMeta('meta[property="og:title"]', { property: "og:title", content: document.title });
    setMeta('meta[property="og:description"]', { property: "og:description", content: meta?.description || "Página não encontrada." });
    if (meta) {
      setMeta('link[rel="canonical"]', { rel: "canonical", href: siteUrl + pathname });
      setMeta('meta[property="og:url"]', { property: "og:url", content: siteUrl + pathname });
    } else {
      document.head.querySelector('link[rel="canonical"]')?.remove();
      document.head.querySelector('meta[property="og:url"]')?.remove();
    }
    document.getElementById("store-schema")?.remove();
    if (pathname === "/") {
      const schema = document.createElement("script");
      schema.id = "store-schema"; schema.type = "application/ld+json";
      schema.textContent = JSON.stringify(localBusiness(storeConfig)); document.head.appendChild(schema);
    }
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
  }, [pathname, hash, navigationKey]);
  return <PrivacyPreferences>
    <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
    <NavBar />
    <main id="conteudo" tabIndex="-1"><Outlet /></main>
    <Footer />
  </PrivacyPreferences>;
}
