import React from "react";
import "./Cards.css";
import Hortifrut from "../../images/Setores/hortifruti-institucional.jpg";
import Bebidas from "../../images/Setores/bebidas-institucional.jpg";
import PadariaEmReforma from "../../images/Setores/padaria-institucional.jpg";
import Freezer from "../../images/Setores/congelados-institucional.jpg";
import Laticinios from "../../images/Setores/laticinios-institucional.jpg";
import ArteBebidas from "../../images/Setores/Bebidas.webp";
import ArteAdega from "../../images/Setores/Adega.webp";
import ArteHortifruti from "../../images/Setores/Hortifrut.webp";
import ArteCongelados from "../../images/Setores/Freezer.webp";
import ArtePadaria from "../../images/Setores/Padaria.webp";
import ArteLaticinios from "../../images/Setores/laticinios-arte.jpg";
import Bebidas2 from "../../images/Setores/bebidas-galeria-2.jpg";
import Hortifruti2 from "../../images/Setores/hortifruti-galeria-2.jpg";
import Congelados2 from "../../images/Setores/congelados-galeria-2.jpg";
import Laticinios2 from "../../images/Setores/laticinios-galeria-2.jpg";
import AdegaVinhos from "../../images/Setores/adega-vinhos-galeria.jpg";
import { X, ChevronLeft, ChevronRight, Milk, Croissant, Wine, Snowflake, Apple } from "lucide-react";
const sectors = [
  { name: "Bebidas e Adega", image: Bebidas, alt: "Geladeiras de bebidas do mercado", description: "Das bebidas do dia a dia aos vinhos para acompanhar uma refeição, conheça as opções do nosso setor de bebidas e adega.", tags: ["Refrigerantes", "Sucos", "Águas", "Cervejas", "Vinhos", "Energéticos"] },
  { name: "Hortifrúti", image: Hortifrut, alt: "Bancas de frutas e legumes do mercado", description: "Frutas, verduras e legumes para suas compras do dia a dia. Conheça as bancas do nosso hortifrúti.", tags: ["Frutas", "Verduras", "Legumes"] },
  { name: "Laticínios e Frios", image: Laticinios, alt: "Balcão refrigerado de laticínios e frios", description: "Nosso balcão de laticínios foi reformado para melhor atender você. Encontre opções para o café da manhã, lanches e receitas.", tags: ["Iogurtes", "Queijos", "Requeijões", "Frios"] },
  { name: "Congelados", image: Freezer, alt: "Ilha de congelados no centro do mercado", description: "Conheça nossa ilha de congelados e confira na loja as opções para preparar suas refeições.", tags: ["Alimentos congelados", "Praticidade"] },
  { name: "Padaria", status: "Em breve", image: PadariaEmReforma, alt: "Padaria em reforma, com faixa Em breve", description: "Nossa padaria está em reforma. Estamos preparando esse espaço para receber você. Em breve, novidades por aqui.", tags: ["Em reforma"] },
];
const tagIcons = [Wine, Apple, Milk, Snowflake, Croissant];
const covers = [ArteBebidas, ArteHortifruti, ArteLaticinios, ArteCongelados, ArtePadaria];
const secondPhotos = [Bebidas2, Hortifruti2, Laticinios2, Congelados2, PadariaEmReforma];
export default function Cards() {
  const [activeIndex, setActiveIndex] = React.useState(null);
  const [photoIndex, setPhotoIndex] = React.useState(0);
  const dialogRef = React.useRef(null);
  const triggerRef = React.useRef(null);
  const openSector = (index) => { triggerRef.current = document.activeElement; setPhotoIndex(0); setActiveIndex(index); };
  const closeSector = React.useCallback(() => { setActiveIndex(null); triggerRef.current?.focus(); }, []);
  const activeSector = activeIndex === null ? null : sectors[activeIndex];
  const photos = activeSector ? [activeSector.image, secondPhotos[activeIndex], ...(activeIndex === 0 ? [AdegaVinhos] : [])] : [];
  const photoCount = photos.length;
  React.useEffect(() => {
    if (activeIndex === null) return undefined;
    dialogRef.current?.querySelector('button')?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") closeSector();
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); setPhotoIndex(index => (index + (event.key === "ArrowLeft" ? -1 : 1) + photoCount) % photoCount); }
      if (event.key === "Tab") {
        const buttons = Array.from(dialogRef.current.querySelectorAll('button'));
        const first = buttons[0], last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.classList.add("sector-modal-open");
    return () => { document.removeEventListener("keydown", onKeyDown); document.body.classList.remove("sector-modal-open"); };
  }, [activeIndex, closeSector, photoCount]);
  return <section id="setores" className="sectors-showcase" aria-labelledby="sectors-title">
    <div className="sectors-showcase__inner"><h2 id="sectors-title" className="section-title">Conheça nossos setores</h2>
      <p className="sectors-showcase__intro">Um passeio pelo mercado e pelos setores que fazem parte do seu dia a dia.</p>
      <ul className="photo-sectors">{sectors.map(sector =>
        <li key={sector.name} className={sector.status ? "sector-card--upcoming" : ""} role="button" tabIndex="0" onClick={() => openSector(sectors.indexOf(sector))} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openSector(sectors.indexOf(sector)); } }} aria-label={sector.status ? `${sector.name} — ${sector.status}` : `Conheça o setor ${sector.name}`}><img src={covers[sectors.indexOf(sector)]} alt="" loading="lazy" />
          {sector.name === "Bebidas e Adega" && <img className="sector-card__wine-art" src={ArteAdega} alt="" loading="lazy" />}
          {sector.status && <span className="sector-card__coming-soon">Em breve</span>}
          <h3>{sector.name}</h3><span className="sector-card__accent" aria-hidden="true" /></li>)}</ul>
    </div>
    {activeSector && <div className="sector-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeSector(); }}>
      <div ref={dialogRef} className="sector-modal" role="dialog" aria-modal="true" aria-labelledby="sector-modal-title">
        <button className="sector-modal__close" type="button" onClick={closeSector} aria-label="Fechar detalhes do setor"><X size={30} /></button>
        <button className="sector-modal__arrow sector-modal__arrow--prev" type="button" onClick={() => setPhotoIndex((photoIndex - 1 + photos.length) % photos.length)} aria-label="Foto anterior"><ChevronLeft /></button>
        <div className="sector-modal__gallery">
          <img className={`sector-modal__main-image${activeSector.status && photoIndex === 1 ? ' is-detail-crop' : ''}`} src={photos[photoIndex]} alt={activeIndex === 0 && photoIndex === 2 ? 'Adega de madeira com vinhos, espumantes e destilados' : `${activeSector.alt} — ${photoIndex === 0 ? 'vista geral' : activeSector.status ? 'recorte da mesma foto' : 'outro ângulo'}`} />
          <p className="sector-gallery__counter" aria-live="polite">{photoIndex + 1} / {photos.length}{activeSector.status ? ' · Vista e detalhe da mesma foto' : ''}</p>
          <div className="sector-gallery__thumbnails">{photos.map((photo, index) => <button type="button" key={index} aria-label={`Ver foto ${index + 1}`} aria-pressed={photoIndex === index} onClick={() => setPhotoIndex(index)}><img className={activeSector.status && index === 1 ? 'is-detail-crop' : ''} src={photo} alt="" /></button>)}</div>
        </div>
        <div className="sector-modal__content"><p className={`sector-modal__eyebrow${activeSector.status ? " is-upcoming" : ""}`}>{activeSector.status || "Nosso setor"}</p><h3 id="sector-modal-title">{activeSector.name}</h3><p className="sector-modal__description">{activeSector.description}</p><div className="sector-modal__tags">{activeSector.tags.map((tag) => { const TagIcon = tagIcons[activeIndex]; return <span key={tag}><TagIcon size={24} aria-hidden="true" />{tag}</span>; })}</div></div>
        <button className="sector-modal__arrow sector-modal__arrow--next" type="button" onClick={() => setPhotoIndex((photoIndex + 1) % photos.length)} aria-label="Próxima foto"><ChevronRight /></button>
      </div>
    </div>}
  </section>;
}
