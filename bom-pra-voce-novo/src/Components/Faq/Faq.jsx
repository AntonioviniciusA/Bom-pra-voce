import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Clock3,
  CreditCard,
  FileText,
  MapPin,
  Minus,
  Plus,
  ShoppingCart,
  Tag,
  UserRound,
} from "lucide-react";
import { getFaqData } from "../../Data/FaqData";

const faqIcons = [ShoppingCart, Tag, MapPin, Clock3, CreditCard, FileText, UserRound];

export default function FaqSection() {
  const [openItem, setOpenItem] = useState(1);
  const items = getFaqData();
  const columns = [items.slice(0, 3), items.slice(3)];

  return <section id="duvidas" className="section section-tint faq-section" aria-labelledby="faq-title">
    <div className="shell">
      <header className="faq-heading">
        <p className="eyebrow"><span>Podemos ajudar?</span></p>
        <h2 id="faq-title">Dúvidas frequentes</h2>
        <p>Encontre respostas rápidas para as principais dúvidas sobre o Bom Pra Você.</p>
      </header>

      <div className="faq-grid">
        {columns.map((column, columnIndex) => <div className="faq-column" key={columnIndex}>
          {column.map((item, itemIndex) => {
            const index = columnIndex === 0 ? itemIndex : itemIndex + 3;
            const isOpen = openItem === index;
            const ItemIcon = faqIcons[index];
            const panelId = `faq-panel-${index}`;
            return <article className={`faq-item${isOpen ? " is-open" : ""}`} key={item.title}>
              <button
                className="faq-question"
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenItem(isOpen ? null : index)}
              >
                <span className="faq-icon" aria-hidden="true"><ItemIcon size={26} strokeWidth={2.4} /></span>
                <span>{item.title}</span>
                <span className="faq-toggle" aria-hidden="true">{isOpen ? <Minus /> : <Plus />}</span>
              </button>
              <div className="faq-answer" id={panelId} hidden={!isOpen}>
                <p>{item.content}</p>
                {item.href && <Link to={item.href}>{item.link}<ArrowRight size={17} aria-hidden="true" /></Link>}
              </div>
            </article>;
          })}
        </div>)}
      </div>

      <aside className="faq-help" aria-label="Ainda precisa de ajuda?">
        <span className="faq-help__icon" aria-hidden="true"><MapPin size={34} /></span>
        <div>
          <h3>Ainda ficou com alguma dúvida?</h3>
          <p>Consulte o endereço e os horários para planejar sua visita à loja.</p>
        </div>
        <Link className="faq-help__button" to="/#localizacao">Planejar visita <ArrowRight size={19} aria-hidden="true" /></Link>
      </aside>
    </div>
  </section>;
}
