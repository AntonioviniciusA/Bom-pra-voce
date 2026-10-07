import React from "react";
import Hortifrut from "../../images/Setores/Hortifrut.webp";
import Bebidas from "../../images/Setores/Bebidas.webp";
import Padaria from "../../images/Setores/Padaria.webp";
import Adega from "../../images/Setores/Adega.webp";
import Freezer from "../../images/Setores/Freezer.webp";
import MarketWine from "../../images/Setores/unnamed.webp";
import MarketColdAisle from "../../images/Setores/unnamed (1).webp";
import MarketUtilities from "../../images/Setores/unnamed (2).webp";
import MarketGrocery from "../../images/Setores/unnamed (3).webp";
import MarketProduce from "../../images/Setores/unnamed (4).webp";
import { X, ChevronLeft, ChevronRight, Milk, Croissant, Wine, Snowflake, Apple } from "lucide-react";
const sectors = [
  { name: "Bebidas", image: Bebidas, detail: MarketColdAisle, description: "Uma grande variedade de bebidas para acompanhar suas refeições e momentos especiais, com qualidade e ótimo preço.", tags: ["Refrigerantes", "Sucos", "Águas", "Cervejas", "Vinhos", "Energéticos"], thumbs: [MarketColdAisle, MarketWine] },
  { name: "Hortifrúti", image: Hortifrut, detail: MarketProduce, description: "Frutas, verduras e legumes frescos, selecionados diariamente para levar mais sabor e saúde à sua mesa.", tags: ["Frutas", "Verduras", "Legumes", "Orgânicos", "Temperos"], thumbs: [MarketProduce, MarketGrocery] },
  { name: "Padaria", status: "Em breve", image: Padaria, detail: MarketGrocery, description: "Estamos preparando nossa padaria para oferecer pães, bolos, doces, salgados e café fresquinhos. Em breve, esse setor estará disponível para você.", tags: ["Pães", "Bolos", "Doces", "Salgados", "Café"], thumbs: [MarketGrocery, MarketColdAisle] },
  { name: "Adega", image: Adega, detail: MarketWine, description: "Rótulos para todos os momentos, com vinhos, cervejas especiais e bebidas selecionadas.", tags: ["Vinhos", "Espumantes", "Cervejas especiais", "Destilados"], thumbs: [MarketWine, MarketColdAisle] },
  { name: "Congelados", image: Freezer, detail: MarketColdAisle, description: "Praticidade para a sua rotina com uma seleção completa de alimentos congelados e sobremesas.", tags: ["Pratos prontos", "Pizzas", "Carnes", "Legumes", "Sorvetes"], thumbs: [MarketColdAisle, MarketUtilities] },
];
const tagIcons = [Milk, Croissant, Wine, Snowflake, Apple];
export default function Cards() {
  const [activeIndex, setActiveIndex] = React.useState(null);
  const activeSector = activeIndex === null ? null : sectors[activeIndex];
  React.useEffect(() => {
    if (activeIndex === null) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowLeft") setActiveIndex((index) => (index - 1 + sectors.length) % sectors.length);
      if (event.key === "ArrowRight") setActiveIndex((index) => (index + 1) % sectors.length);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.classList.add("sector-modal-open");
    return () => { document.removeEventListener("keydown", onKeyDown); document.body.classList.remove("sector-modal-open"); };
  }, [activeIndex]);
  return <section id="setores" className="sectors-showcase" aria-labelledby="sectors-title">
    <div className="sectors-showcase__inner"><h2 id="sectors-title" className="section-title">Conheça nossos setores</h2>
      <p className="sectors-showcase__intro">Tudo o que você precisa, em um só lugar, com qualidade e bom preço.</p>
      <ul className="photo-sectors">{sectors.map(sector =>
        <li key={sector.name} role="button" tabIndex="0" onClick={() => setActiveIndex(sectors.indexOf(sector))} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setActiveIndex(sectors.indexOf(sector)); } }} aria-label={sector.status ? `${sector.name} — ${sector.status}` : `Conheça o setor ${sector.name}`}><img src={sector.image} alt="" loading="lazy" />
          {sector.status && <span className="sector-card__status">{sector.status}</span>}
          <h3>{sector.name}</h3><span className="sector-card__accent" aria-hidden="true" /></li>)}</ul>
    </div>
    {activeSector && <div className="sector-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveIndex(null); }}>
      <div className="sector-modal" role="dialog" aria-modal="true" aria-labelledby="sector-modal-title">
        <button className="sector-modal__close" type="button" onClick={() => setActiveIndex(null)} aria-label="Fechar detalhes do setor"><X size={30} /></button>
        <button className="sector-modal__arrow sector-modal__arrow--prev" type="button" onClick={() => setActiveIndex((activeIndex - 1 + sectors.length) % sectors.length)} aria-label="Setor anterior"><ChevronLeft /></button>
        <div className="sector-modal__gallery"><img className="sector-modal__main-image" src={activeSector.detail} alt={`Interior do setor ${activeSector.name}`} /><div className="sector-modal__dots" aria-label="Posição do setor">{sectors.map((sector, index) => <button key={sector.name} className={index === activeIndex ? "is-active" : ""} onClick={() => setActiveIndex(index)} aria-label={`Ver ${sector.name}`} type="button" />)}</div></div>
        <div className="sector-modal__content"><p className={`sector-modal__eyebrow${activeSector.status ? " is-upcoming" : ""}`}>{activeSector.status || "Nosso setor"}</p><h3 id="sector-modal-title">{activeSector.name}</h3><p className="sector-modal__description">{activeSector.description}</p><div className="sector-modal__tags">{activeSector.tags.map((tag, index) => { const TagIcon = tagIcons[index % tagIcons.length]; return <span key={tag}><TagIcon size={24} aria-hidden="true" />{tag}</span>; })}</div><div className="sector-modal__thumbs">{activeSector.thumbs.map((thumb, index) => <img key={thumb} src={thumb} alt={`Detalhe do setor ${activeSector.name} ${index + 1}`} />)}</div></div>
        <button className="sector-modal__arrow sector-modal__arrow--next" type="button" onClick={() => setActiveIndex((activeIndex + 1) % sectors.length)} aria-label="Próximo setor"><ChevronRight /></button>
      </div>
    </div>}
  </section>;
}
