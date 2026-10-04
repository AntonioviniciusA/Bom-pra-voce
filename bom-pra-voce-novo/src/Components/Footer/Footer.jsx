import { Link } from "react-router-dom";
import { Clock3, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { navigation } from "../../Data/navigation";
import { storeConfig } from "../../Data/storeConfig";
import Logo from "../Logo/Logo";
export default function Footer() {
  const hasDirectContact = storeConfig.phone || storeConfig.email || storeConfig.whatsappUrl;

  return <footer className="site-footer">
    <div className="shell footer-grid">
      <div className="footer-intro"><Link to="/" aria-label="Bom Pra Você — início"><Logo /></Link>
        <p>Supermercado físico. Informações para planejar sua visita.</p>
      </div>
      <nav aria-label="Rodapé"><h2>Encontre no site</h2>
        {navigation.map(item => <Link key={item.href} to={item.href}>{item.label}</Link>)}
      </nav>
      <div className="footer-careers"><h2>Trabalhe conosco</h2><p>Veja as orientações para enviar seu currículo.</p>
        <Link to="/trabalhe-conosco">Envio de currículo</Link>
        <p><Link to="/privacidade">Privacidade</Link></p>
      </div>
      <div className="footer-visit"><h2>Visite a loja</h2>
        {storeConfig.address && <p><MapPin aria-hidden="true" /><span>{storeConfig.address}</span></p>}
        {storeConfig.hours.map(row => <p key={row.day}><Clock3 aria-hidden="true" /><span><strong>{row.day}</strong><br />{row.time}</span></p>)}
        {storeConfig.holidayHours && <p className="footer-holiday">{storeConfig.holidayHours}</p>}
      </div>
      {hasDirectContact && <div className="footer-contact"><h2>Fale conosco</h2>
        {storeConfig.whatsappUrl && <a href={storeConfig.whatsappUrl} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden="true" />WhatsApp <span className="sr-only">(abre em nova aba)</span></a>}
        {storeConfig.phone && <a href={"tel:" + storeConfig.phone.replace(/[^+\d]/g, "")}><Phone aria-hidden="true" />{storeConfig.phone}</a>}
        {storeConfig.email && <a href={"mailto:" + storeConfig.email}><Mail aria-hidden="true" />{storeConfig.email}</a>}
      </div>}
    </div>
    <div className="shell footer-bottom">© {new Date().getFullYear()} {storeConfig.name}</div>
  </footer>;
}
