import React from "react";
import Hortifrut from "../../images/Setores/Hortifrut.webp";
import Bebidas from "../../images/Setores/Bebidas.webp";
import Padaria from "../../images/Setores/Padaria.webp";
import Adega from "../../images/Setores/Adega.webp";
import Freezer from "../../images/Setores/Freezer.webp";
import HortifrutDetail from "../../images/Setores/Hortifrut1.png";
import BebidasDetail from "../../images/Setores/Bebidas1.png";
import PadariaDetail from "../../images/Setores/Padaria.png";
import AdegaDetail from "../../images/Setores/Adega1.png";
import FreezerDetail from "../../images/Setores/Freezer1.png";
import { X, ChevronLeft, ChevronRight, Milk, Croissant, Wine, Snowflake, Apple } from "lucide-react";
const sectors = [
  { name: "Bebidas", image: Bebidas, detail: BebidasDetail, description: "Uma grande variedade de bebidas para acompanhar suas refeições e momentos especiais, com qualidade e ótimo preço.", tags: ["Refrigerantes", "Sucos", "Águas", "Cervejas", "Vinhos", "Energéticos"] },
  { name: "Hortifrúti", image: Hortifrut, detail: HortifrutDetail, description: "Frutas, verduras e legumes frescos, selecionados diariamente para levar mais sabor e saúde à sua mesa.", tags: ["Frutas", "Verduras", "Legumes", "Orgânicos", "Temperos"] },
  { name: "Padaria", image: Padaria, detail: PadariaDetail, description: "Pães, bolos e quitandas fresquinhos, preparados com carinho para deixar seu dia ainda melhor.", tags: ["Pães", "Bolos", "Doces", "Salgados", "Café"] },
  { name: "Adega", image: Adega, detail: AdegaDetail, description: "Rótulos para todos os momentos, com vinhos, cervejas especiais e bebidas selecionadas.", tags: ["Vinhos", "Espumantes", "Cervejas especiais", "Destilados"] },
  { name: "Congelados", image: Freezer, detail: FreezerDetail, description: "Praticidade para a sua rotina com uma seleção completa de alimentos congelados e sobremesas.", tags: ["Pratos prontos", "Pizzas", "Carnes", "Legumes", "Sorvetes"] },
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
        <li key={sector.name} role="button" tabIndex="0" onClick={() => setActiveIndex(sectors.indexOf(sector))} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setActiveIndex(sectors.indexOf(sector)); } }} aria-label={`Conheça o setor ${sector.name}`}><img src={sector.image} alt="" loading="lazy" />
          <h3>{sector.name}</h3><span aria-hidden="true" /></li>)}</ul>
    </div>
    {activeSector && <div className="sector-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveIndex(null); }}>
      <div className="sector-modal" role="dialog" aria-modal="true" aria-labelledby="sector-modal-title">
        <button className="sector-modal__close" type="button" onClick={() => setActiveIndex(null)} aria-label="Fechar detalhes do setor"><X size={30} /></button>
        <button className="sector-modal__arrow sector-modal__arrow--prev" type="button" onClick={() => setActiveIndex((activeIndex - 1 + sectors.length) % sectors.length)} aria-label="Setor anterior"><ChevronLeft /></button>
        <div className="sector-modal__gallery"><img className="sector-modal__main-image" src={activeSector.detail} alt={`Interior do setor ${activeSector.name}`} /><div className="sector-modal__dots" aria-label="Posição do setor">{sectors.map((sector, index) => <button key={sector.name} className={index === activeIndex ? "is-active" : ""} onClick={() => setActiveIndex(index)} aria-label={`Ver ${sector.name}`} type="button" />)}</div></div>
        <div className="sector-modal__content"><p className="sector-modal__eyebrow">Nosso setor</p><h3 id="sector-modal-title">{activeSector.name}</h3><p className="sector-modal__description">{activeSector.description}</p><div className="sector-modal__tags">{activeSector.tags.map((tag, index) => { const TagIcon = tagIcons[index % tagIcons.length]; return <span key={tag}><TagIcon size={24} aria-hidden="true" />{tag}</span>; })}</div><div className="sector-modal__thumbs"><img src={activeSector.image} alt="" /><img src={sectors[(activeIndex + 1) % sectors.length].image} alt="" /></div></div>
        <button className="sector-modal__arrow sector-modal__arrow--next" type="button" onClick={() => setActiveIndex((activeIndex + 1) % sectors.length)} aria-label="Próximo setor"><ChevronRight /></button>
      </div>
    </div>}
  </section>;
}
