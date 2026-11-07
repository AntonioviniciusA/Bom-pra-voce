import { usePrivacyPreferences } from "../PrivacyPreferences";
import { Link } from "react-router-dom";
import { Clock3, Cookie, LayoutGrid, Mail, MapPin, MessageCircle, Phone, ShoppingCart } from "lucide-react";
import { navigation } from "../../Data/navigation";
import { storeConfig } from "../../Data/storeConfig";
import Logo from "../Logo/Logo";
import "./Footer.css";
export default function Footer() {
  const { openPreferences } = usePrivacyPreferences();
  const hasDirectContact = storeConfig.phone || storeConfig.email || storeConfig.whatsappUrl;

  return <footer className="site-footer footer-reference">
    <div className="shell footer-grid">
      <div className="footer-intro"><Link to="/" aria-label="Bom Pra Você — início"><Logo /></Link>
        <p>Supermercado físico. Informações para planejar sua visita.</p>
        <ShoppingCart className="footer-cart" aria-hidden="true" strokeWidth={1.5} />
      </div>
      <nav aria-label="Rodapé"><h2><LayoutGrid aria-hidden="true" />Navegação</h2>
        {navigation.map(item => <Link key={item.href} to={item.href}>{item.label}</Link>)}
      </nav>
      <div className="footer-careers"><h2><Mail aria-hidden="true" />Atendimento</h2><p>Veja as orientações para enviar seu currículo.</p>
        <Link to="/trabalhe-conosco">Envio de currículo</Link>
        <p><Link to="/privacidade">Privacidade</Link></p>
        <p><Link to="/termos">Termos de uso</Link></p>
        <button type="button" className="privacy-settings" onClick={openPreferences}><Cookie aria-hidden="true" />Preferências de cookies</button>
      </div>
      <div className="footer-visit"><h2><MapPin aria-hidden="true" />Visite a loja</h2>
        {storeConfig.address && <p><MapPin aria-hidden="true" /><span>{storeConfig.address}</span></p>}
        {storeConfig.hours.map(row => <p key={row.day}><Clock3 aria-hidden="true" /><span><strong>{row.day}</strong><br />{row.time}</span></p>)}
        {storeConfig.holidayHours && <p className="footer-holiday">{storeConfig.holidayHours}</p>}
      </div>
    </div>
    <div className="footer-legal"><div className="shell footer-bottom">
      <p className="footer-copyright">© {new Date().getFullYear()} {storeConfig.name}</p>
      {hasDirectContact && <div className="footer-contact"><h2>Fale conosco</h2>
        {storeConfig.whatsappUrl && <a href={storeConfig.whatsappUrl} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden="true" />WhatsApp <span className="sr-only">(abre em nova aba)</span></a>}
        {storeConfig.phone && <a href={"tel:" + storeConfig.phone.replace(/[^+\d]/g, "")}><Phone aria-hidden="true" />{storeConfig.phone}</a>}
        {storeConfig.email && <a href={"mailto:" + storeConfig.email}><Mail aria-hidden="true" />{storeConfig.email}</a>}
      </div>}
      <dl className="footer-company"><div><dt>Razão social</dt><dd>{storeConfig.legalName}</dd></div><div><dt>CNPJ</dt><dd>{storeConfig.cnpj}</dd></div></dl>
    </div></div>
  </footer>;
}
