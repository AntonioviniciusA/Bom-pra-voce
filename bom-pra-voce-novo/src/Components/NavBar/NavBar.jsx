import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BadgePercent, CircleHelp, CreditCard, Info, MapPin, Menu, ShoppingCart, Store, UsersRound, X } from "lucide-react";
import Logo from "../Logo/Logo";
import { navigation } from "../../Data/navigation";
import LogoImage from "../../images/logo_bom_pra_voce_vetorizada.svg";
import GroceryBasketImage from "../../images/navigation/mobile-menu-grocery-basket.png";
import "./NavBar.css";

const headerNavigation = navigation
  .filter(item => item.href !== "/#home")
  .sort((first, second) => {
    const order = ["/#promocoes", "/#sobre", "/#duvidas", "/nossa-loja", "/trabalhe-conosco", "/formas-de-pagamento"];
    return order.indexOf(first.href) - order.indexOf(second.href);
  });
const HEADER_SCROLL_ENTER = 48;
const HEADER_SCROLL_EXIT = 12;
const quickAccessIcons = {
  "/#promocoes": BadgePercent,
  "/#sobre": Info,
  "/#duvidas": CircleHelp,
  "/nossa-loja": Store,
  "/trabalhe-conosco": UsersRound,
  "/formas-de-pagamento": CreditCard,
};

export function resolveHeaderScrolled(scrollY, wasScrolled) {
  return wasScrolled
    ? scrollY > HEADER_SCROLL_EXIT
    : scrollY > HEADER_SCROLL_ENTER;
}

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(() => window.scrollY > HEADER_SCROLL_ENTER);
  const [activeSection, setActiveSection] = useState(() => window.location.hash.slice(1) || "home");
  const header = useRef(null);
  const menuButton = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const updateHeader = () => {
      setScrolled(current => resolveHeaderScrolled(window.scrollY, current));
    };
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  useEffect(() => {
    if (location.pathname !== "/") return undefined;
    const ids = headerNavigation.map(item => item.href.split("#")[1]);
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
  }, [location]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const closeMenuOnOutsidePointer = (event) => {
      if (!header.current?.contains(event.target)) setMenuOpen(false);
    };
    document.addEventListener("pointerdown", closeMenuOnOutsidePointer);
    return () => document.removeEventListener("pointerdown", closeMenuOnOutsidePointer);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  function closeOnEscape(event) {
    if (event.key !== "Escape") return;
    if (menuOpen) {
      setMenuOpen(false);
      menuButton.current?.focus();
    }
  }

  function isItemActive(item) {
    const [itemPath, itemHash] = item.href.split("#");
    if (itemHash) {
      return location.pathname === itemPath && activeSection === itemHash;
    }
    return location.pathname === itemPath;
  }

  return (
    <header
      ref={header}
      className={`${scrolled ? "site-header is-scrolled" : "site-header"}${menuOpen ? " has-open-menu" : ""}`}
      onKeyDown={closeOnEscape}
    >
      <div className="shell header-row">
        <Link to="/#home" className="brand-link" aria-label="Bom Pra Você — início">
          <Logo />
          <ShoppingCart className="brand-cart-mark" aria-hidden="true" />
        </Link>

        <button
          ref={menuButton}
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          onClick={() => setMenuOpen(value => !value)}
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>

        <nav
          id="main-navigation"
          aria-label="Principal"
          className={menuOpen ? "site-nav is-open" : "site-nav"}
        >
          <p className="quick-access-title">Acesso rápido</p>
          <div className="quick-access-grid">
            {headerNavigation.map(item => {
              const Icon = quickAccessIcons[item.href] || MapPin;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  aria-current={isItemActive(item) ? "location" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  <Icon aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
          <div className="mobile-menu-detail" aria-hidden="true">
            <ShoppingCart className="mobile-menu-detail__cart" />
            <span className="mobile-menu-detail__basket">
              <img className="mobile-menu-detail__basket-image" src={GroceryBasketImage} alt="" />
              <span className="mobile-menu-detail__brand-badge">
                <img src={LogoImage} alt="" />
              </span>
            </span>
          </div>
        </nav>
      </div>

    </header>
  );
}
