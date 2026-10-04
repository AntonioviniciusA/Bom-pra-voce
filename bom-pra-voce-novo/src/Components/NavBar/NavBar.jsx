import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Search, X } from "lucide-react";
import Logo from "../Logo/Logo";
import { navigation } from "../../Data/navigation";

const searchItems = [
  ...navigation,
  { href: "/#pagamentos", label: "Pagamentos" },
];

function normalizeSearch(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(() => window.scrollY > 24);
  const [activeSection, setActiveSection] = useState(() => window.location.hash.slice(1) || "home");
  const [query, setQuery] = useState("");
  const menuButton = useRef(null);
  const searchButton = useRef(null);
  const location = useLocation();
  const normalizedQuery = normalizeSearch(query.trim());
  const results = searchItems.filter(item =>
    normalizeSearch(item.label).includes(normalizedQuery)
  );

  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > 24);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  useEffect(() => {
    if (location.pathname !== "/") return undefined;
    const ids = navigation.map(item => item.href.split("#")[1]);
    const sections = ids.map(id => document.getElementById(id)).filter(Boolean);
    const updateActiveSection = () => {
      // Considera a seção ativa quando seu início alcança a área principal
      // de leitura, não apenas quando encosta no topo sob o cabeçalho fixo.
      const marker = Math.min(window.innerHeight * 0.48, 380);
      let current = "home";
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= marker) current = section.id;
      }
      setActiveSection(current);
    };
    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [location.pathname]);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location]);

  function closeOnEscape(event) {
    if (event.key !== "Escape") return;
    if (searchOpen) {
      setSearchOpen(false);
      searchButton.current?.focus();
    } else if (menuOpen) {
      setMenuOpen(false);
      menuButton.current?.focus();
    }
  }

  return (
    <header className={scrolled ? "site-header is-scrolled" : "site-header"} onKeyDown={closeOnEscape}>
      <div className="shell header-row">
        <Link to="/#home" className="brand-link" aria-label="Bom Pra Você — início">
          <Logo />
        </Link>

        <button
          ref={menuButton}
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          aria-label="Menu"
          onClick={() => setMenuOpen(value => !value)}
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          <span>{menuOpen ? "Fechar" : "Menu"}</span>
        </button>

        <nav
          id="main-navigation"
          aria-label="Principal"
          className={menuOpen ? "site-nav is-open" : "site-nav"}
        >
          {navigation.map(item => (
            <Link
              key={item.href}
              to={item.href}
              aria-current={
                (location.pathname === "/" && activeSection === item.href.split("#")[1]) ||
                (location.pathname === "/trabalhe-conosco" && item.href === "/#trabalhe-conosco")
                  ? "location"
                  : undefined
              }
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <button
            ref={searchButton}
            className="nav-search"
            type="button"
            aria-label={searchOpen ? "Fechar busca" : "Buscar no site"}
            aria-expanded={searchOpen}
            aria-controls="site-search"
            onClick={() => setSearchOpen(value => !value)}
          >
            {searchOpen ? <X aria-hidden="true" /> : <Search aria-hidden="true" />}
          </button>
        </nav>
      </div>

      {searchOpen && (
        <div id="site-search" className="site-search">
          <label htmlFor="site-search-input">O que você procura?</label>
          <div className="site-search-field">
            <Search aria-hidden="true" />
            <input
              autoFocus
              id="site-search-input"
              type="search"
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Ofertas, horários, pagamentos…"
            />
          </div>
          <ul aria-label={normalizedQuery ? "Resultados da busca" : "Atalhos sugeridos"}>
            {results.map(item => (
              <li key={item.href}>
                <Link to={item.href} onClick={() => setSearchOpen(false)}>{item.label}</Link>
              </li>
            ))}
          </ul>
          {normalizedQuery && results.length === 0 && <p className="site-search-empty">Nenhuma seção encontrada.</p>}
          <p className="small">Para produtos e preços, consulte as ofertas.</p>
        </div>
      )}
    </header>
  );
}
