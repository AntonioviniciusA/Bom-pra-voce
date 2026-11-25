import React from "react";
import "./Cards.css";
import Hortifrut from "../../images/Setores/hortifruti-institucional.jpg";
import Bebidas from "../../images/Setores/bebidas-institucional.jpg";
import PadariaEmReforma from "../../images/Setores/padaria-institucional.jpg";
import Freezer from "../../images/Setores/congelados-institucional.jpg";
import Laticinios from "../../images/Setores/laticinios-institucional.jpg";
import ArteBebidas from "../../images/Setores/ilustracoes/bebidas.webp";
import ArteHortifruti from "../../images/Setores/ilustracoes/hortifruti.webp";
import ArteCongelados from "../../images/Setores/ilustracoes/congelados.webp";
import ArtePadaria from "../../images/Setores/ilustracoes/padaria.webp";
import ArteLaticinios from "../../images/Setores/ilustracoes/laticinios.webp";
import Bebidas2 from "../../images/Setores/bebidas-galeria-2.jpg";
import Hortifruti2 from "../../images/Setores/hortifruti-galeria-2.jpg";
import Congelados2 from "../../images/Setores/congelados-galeria-2.jpg";
import Laticinios2 from "../../images/Setores/laticinios-galeria-2.jpg";
import AdegaVinhos from "../../images/Setores/adega-vinhos-galeria.jpg";
import { X, ChevronLeft, ChevronRight, Milk, Croissant, Wine, Snowflake, Apple, ShoppingCart, LayoutGrid } from "lucide-react";
const sectors = [
  { name: "Bebidas e Adega", image: Bebidas, alt: "Geladeiras de bebidas do mercado", description: "Das bebidas do dia a dia aos vinhos para acompanhar uma refeição, conheça as opções do nosso setor de bebidas e adega.", tags: ["Refrigerantes", "Sucos", "Águas", "Cervejas", "Vinhos", "Energéticos"] },
  { name: "Hortifrúti", image: Hortifrut, alt: "Bancas de frutas e legumes do mercado", description: "Frutas, verduras e legumes para suas compras do dia a dia. Conheça as bancas do nosso hortifrúti.", tags: ["Frutas", "Verduras", "Legumes"] },
  { name: "Laticínios e Frios", image: Laticinios, alt: "Balcão refrigerado de laticínios e frios", description: "Nosso balcão de laticínios foi reformado para melhor atender você. Encontre opções para o café da manhã, lanches e receitas.", tags: ["Iogurtes", "Queijos", "Requeijões", "Frios"] },
  { name: "Congelados", image: Freezer, alt: "Ilha de congelados no centro do mercado", description: "Conheça nossa ilha de congelados e confira na loja as opções para preparar suas refeições.", tags: ["Alimentos congelados", "Praticidade"] },
  { name: "Padaria", status: "Em breve", image: PadariaEmReforma, alt: "Padaria em reforma, com faixa Em breve", description: "Padaria em reforma para trazer a melhor qualidade para sua mesa. Estamos preparando esse espaço para receber você.", tags: ["Em reforma"] },
];
const tagIcons = [Wine, Apple, Milk, Snowflake, Croissant];
const covers = [ArteBebidas, ArteHortifruti, ArteLaticinios, ArteCongelados, ArtePadaria];
const secondPhotos = [Bebidas2, Hortifruti2, Laticinios2, Congelados2, PadariaEmReforma];
const getPhotos = (index) => [sectors[index].image, secondPhotos[index], ...(index === 0 ? [AdegaVinhos] : [])];

function SectorPage({ index, photoIndex, onPhotoChange, outgoing = false }) {
  const sector = sectors[index];
  const photos = getPhotos(index);
  const TagIcon = tagIcons[index];
  return <div className={`sector-modal__page${outgoing ? " is-outgoing" : ""}`} aria-hidden={outgoing || undefined} inert={outgoing ? true : undefined}>
    <div className="sector-modal__gallery">
      <div className="sector-gallery__frame">
        <img className={`sector-modal__main-image${sector.status && photoIndex === 1 ? ' is-detail-crop' : ''}`} src={photos[photoIndex]} alt={index === 0 && photoIndex === 2 ? 'Adega de madeira com vinhos, espumantes e destilados' : `${sector.alt} — ${photoIndex === 0 ? 'vista geral' : sector.status ? 'recorte da mesma foto' : 'outro ângulo'}`} />
        <button className="sector-modal__arrow sector-modal__arrow--prev" type="button" onClick={() => onPhotoChange((photoIndex - 1 + photos.length) % photos.length)} aria-label="Foto anterior"><ChevronLeft /></button>
        <button className="sector-modal__arrow sector-modal__arrow--next" type="button" onClick={() => onPhotoChange((photoIndex + 1) % photos.length)} aria-label="Próxima foto"><ChevronRight /></button>
        <p className="sector-gallery__counter" aria-live={outgoing ? 'off' : 'polite'}>{photoIndex + 1} / {photos.length}</p>
      </div>
      <div className="sector-gallery__thumbnails">{photos.map((photo, photoNumber) => <button type="button" key={photoNumber} aria-label={`Ver foto ${photoNumber + 1}`} aria-pressed={photoIndex === photoNumber} onClick={() => onPhotoChange(photoNumber)}><img className={sector.status && photoNumber === 1 ? 'is-detail-crop' : ''} src={photo} alt="" /></button>)}</div>
      {sector.status && <p className="sector-gallery__note">Vista e detalhe da mesma foto</p>}
    </div>
    <div className="sector-modal__content">
      <p className={`sector-modal__eyebrow${sector.status ? ' is-upcoming' : ''}`}>{sector.status || 'Conheça nosso setor'}</p>
      <h3 id={outgoing ? undefined : 'sector-modal-title'}>{sector.name}</h3>
      <p className="sector-modal__description">{sector.description}</p>
      <div className={`sector-modal__tags${sector.tags.length > 3 ? ' is-compact' : ''}`}>{sector.tags.map(tag => <span key={tag}><TagIcon size={24} aria-hidden="true" />{tag}</span>)}</div>
      <p className="sector-modal__note">{sector.status ? 'Estamos preparando esse espaço para você.' : 'Conheça as opções disponíveis na loja.'}</p>
    </div>
  </div>;
}

export default function Cards() {
  const [activeIndex, setActiveIndex] = React.useState(null);
  const [photoIndex, setPhotoIndex] = React.useState(0);
  const [transition, setTransition] = React.useState(null);
  const dialogRef = React.useRef(null);
  const stageRef = React.useRef(null);
  const triggerRef = React.useRef(null);
  const touchRef = React.useRef(null);
  const transitionLock = React.useRef(false);
  const isOpen = activeIndex !== null;
  const openSector = (index) => { triggerRef.current = document.activeElement; setPhotoIndex(0); setTransition(null); setActiveIndex(index); };
  const closeSector = React.useCallback(() => { setActiveIndex(null); setTransition(null); transitionLock.current = false; }, []);
  const activeSector = isOpen ? sectors[activeIndex] : null;
  const photoCount = isOpen ? getPhotos(activeIndex).length : 0;
  const changeSector = React.useCallback((direction) => {
    if (activeIndex === null || transitionLock.current) return;
    // Keep focus on persistent controls when the old page leaves the DOM.
    if (stageRef.current?.contains(document.activeElement)) dialogRef.current?.querySelector('button')?.focus();
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion) {
      transitionLock.current = true;
      setTransition({ index: activeIndex, photoIndex, direction });
    }
    setPhotoIndex(0);
    setActiveIndex((activeIndex + direction + sectors.length) % sectors.length);
    if (stageRef.current) stageRef.current.scrollTop = 0;
  }, [activeIndex, photoIndex]);
  React.useEffect(() => {
    if (!transition) return undefined;
    const timer = window.setTimeout(() => { setTransition(null); transitionLock.current = false; }, 480);
    return () => window.clearTimeout(timer);
  }, [transition]);
  React.useEffect(() => {
    if (!isOpen) return undefined;
    const muted = [];
    let branch = dialogRef.current?.parentElement;
    while (branch && branch !== document.body) {
      for (const sibling of branch.parentElement.children) {
        if (sibling !== branch && !sibling.hasAttribute('inert')) { sibling.setAttribute('inert', ''); muted.push(sibling); }
      }
      branch = branch.parentElement;
    }
    dialogRef.current?.querySelector('button')?.focus();
    document.body.classList.add('sector-modal-open');
    return () => { muted.forEach(node => node.removeAttribute('inert')); document.body.classList.remove('sector-modal-open'); triggerRef.current?.focus(); };
  }, [isOpen]);
  React.useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeSector();
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        if (event.altKey) changeSector(event.key === 'ArrowLeft' ? -1 : 1);
        else setPhotoIndex(index => (index + (event.key === 'ArrowLeft' ? -1 : 1) + photoCount) % photoCount);
      }
      if (event.key === 'Tab') {
        const buttons = Array.from(dialogRef.current.querySelectorAll('button')).filter(button => !button.closest('[inert]'));
        const first = buttons[0], last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, closeSector, photoCount, changeSector]);
  const startSwipe = (event) => {
    touchRef.current = event.touches.length === 1 && !event.target.closest('button') ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
  };
  const endSwipe = (event) => {
    const start = touchRef.current;
    touchRef.current = null;
    if (!start || !event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - start.x;
    const dy = event.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) changeSector(dx < 0 ? 1 : -1);
  };
  return <section id="setores" className="sectors-showcase" aria-labelledby="sectors-title">
    <div className="sectors-showcase__inner"><h2 id="sectors-title" className="section-title">Conheça nossos setores</h2>
      <p className="sectors-showcase__intro">Um passeio pelo mercado e pelos setores que fazem parte do seu dia a dia.</p>
      <ul className="photo-sectors">{sectors.map((sector, index) =>
        <li key={sector.name}>
          <button type="button" className="sector-card-trigger" onClick={() => openSector(index)} aria-label={sector.status ? `${sector.name} — ${sector.status}` : `Conheça o setor ${sector.name}`}>
            <img src={covers[index]} alt="" width="720" height="720" loading="lazy" decoding="async" />
            <span className="sector-card-copy"><span className="sector-card-title">{sector.name}</span>
              <span className={sector.status ? "sector-card-status" : "sector-card-action"}>{sector.status ? "Em reforma · em breve" : "Conhecer o setor →"}</span>
            </span>
          </button>
        </li>)}</ul>
      <p className="sector-art-note">Ilustrações representativas dos setores. Selecione um cartão para ver os detalhes e as imagens do ambiente.</p>
    </div>
    {activeSector && <div className="sector-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeSector(); }}>
      <div ref={dialogRef} className="sector-modal" role="dialog" aria-modal="true" aria-labelledby="sector-modal-title">
        <header className="sector-modal__header">
          <div className="sector-modal__brand"><span><ShoppingCart size={24} aria-hidden="true" /></span>Conheça nossos setores</div>
          <button className="sector-modal__close" type="button" onClick={closeSector} aria-label="Fechar detalhes do setor"><X size={26} /></button>
        </header>
        <div ref={stageRef} className={`sector-modal__stage${transition ? ` is-turning is-${transition.direction > 0 ? 'next' : 'prev'}` : ''}`} onTouchStart={startSwipe} onTouchEnd={endSwipe} onTouchCancel={() => { touchRef.current = null; }}>
          <SectorPage key={activeIndex} index={activeIndex} photoIndex={photoIndex} onPhotoChange={setPhotoIndex} />
          {transition && <SectorPage key={`out-${transition.index}`} index={transition.index} photoIndex={transition.photoIndex} outgoing />}
        </div>
        <footer className="sector-modal__footer">
          <div className="sector-modal__explore"><LayoutGrid size={22} aria-hidden="true" /><span>Explore nossos setores<small aria-live="polite" aria-atomic="true">{activeIndex + 1} de {sectors.length} · {activeSector.name}</small></span></div>
          <nav className="sector-modal__navigation" aria-label="Navegar entre setores">
            <button type="button" onClick={() => changeSector(-1)} aria-keyshortcuts="Alt+ArrowLeft"><ChevronLeft size={22} aria-hidden="true" /><span>Setor anterior</span></button>
            <button type="button" className="sector-modal__next" onClick={() => changeSector(1)} aria-keyshortcuts="Alt+ArrowRight"><span>Próximo setor</span><ChevronRight size={22} aria-hidden="true" /></button>
          </nav>
        </footer>
      </div>
    </div>}
  </section>;
}
