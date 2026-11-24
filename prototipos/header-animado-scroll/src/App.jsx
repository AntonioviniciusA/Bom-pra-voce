import { useEffect, useState } from "react";
import { Menu, Search, X } from "lucide-react";

const items = ["Início", "Ofertas", "Sobre", "Setores", "Trabalhe conosco", "Como chegar", "Dúvidas"];

export function App() {
  const [scrolled, setScrolled] = useState(window.scrollY > 24);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="page-shell">
      <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
        <a className="brand" href="#inicio" aria-label="Bom pra você — início">
          <img src="/assets/logo-bom-pra-voce.svg" alt="Bom pra você Supermercado" />
        </a>

        <span className="brand-divider" aria-hidden="true" />

        <button
          className="menu-button"
          type="button"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          <span>Menu</span>
        </button>

        <nav className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="Navegação principal">
          {items.map((item) => (
            <a
              key={item}
              href={`#${item.toLocaleLowerCase("pt-BR").replaceAll(" ", "-")}`}
              className={item === "Ofertas" ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </a>
          ))}
          <button
            className="search-button"
            type="button"
            aria-label={searchOpen ? "Fechar busca" : "Abrir busca"}
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((value) => !value)}
          >
            {searchOpen ? <X aria-hidden="true" /> : <Search aria-hidden="true" />}
          </button>
        </nav>

        {searchOpen && (
          <form className="search-panel" onSubmit={(event) => event.preventDefault()}>
            <label htmlFor="search">O que você procura?</label>
            <div>
              <Search aria-hidden="true" />
              <input id="search" autoFocus placeholder="Ofertas, setores, horários…" />
            </div>
          </form>
        )}
      </header>

      <main id="inicio">
        <section className="hero">
          <p>Do bairro, para a sua mesa.</p>
          <h1>Economia que faz parte da rotina.</h1>
          <a href="#ofertas">Ver ofertas da semana</a>
        </section>
        <section className="content" id="ofertas">
          <div>
            <span>Role para conferir</span>
            <h2>O cabeçalho acompanha você</h2>
          </div>
          <p>Ao sair do topo, ele reduz a largura e ganha cantos arredondados sem interromper a navegação.</p>
        </section>
        <section className="placeholder" aria-label="Continuação da página" />
      </main>
    </div>
  );
}
