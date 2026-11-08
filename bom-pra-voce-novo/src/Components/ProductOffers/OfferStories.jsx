import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Logo from '../../images/Logo.png';
import blackFridayBackground from '../../images/offer-themes/black-friday/black-friday-papel-v2.webp';
import blackFridaySparks from '../../images/offer-themes/black-friday/black-friday-raios-finos.webp';

const STORY_DURATION = 7000;

export default function OfferStories({campaign, items}) {
  const [activeIndex, setActiveIndex] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const closeButton = useRef(null);
  const previousFocus = useRef(null);
  const activeItem = activeIndex === null ? null : items[activeIndex];
  const isBlackFriday = campaign.theme_key === 'black-friday';
  const campaignPeriod = campaign.startDate && campaign.endDate
    ? `De ${campaign.startDate.slice(8)} a ${campaign.endDate.split('-').reverse().join('/')}`
    : '';

  function close() {
    setActiveIndex(null);
    setShowInstructions(false);
    requestAnimationFrame(() => previousFocus.current?.focus());
  }

  function open(index, event) {
    previousFocus.current = event.currentTarget;
    setActiveIndex(index);
    setShowInstructions(true);
  }

  function move(step) {
    setActiveIndex(index => (index + step + items.length) % items.length);
    setShowInstructions(false);
  }

  useEffect(() => {
    if (activeIndex === null) return undefined;
    closeButton.current?.focus();
    const instructionsTimer = window.setTimeout(() => setShowInstructions(false), STORY_DURATION);
    const storyTimer = window.setTimeout(() => move(1), STORY_DURATION);
    const onKeyDown = event => {
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowRight') move(1);
      if (event.key === 'ArrowLeft') move(-1);
    };
    document.body.classList.add('offer-story-open');
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(instructionsTimer);
      window.clearTimeout(storyTimer);
      document.body.classList.remove('offer-story-open');
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!items.length) return null;

  return <>
    <div className={`offer-stories${isBlackFriday ? ' offer-stories--black-friday' : ''}`} aria-label="Ofertas em destaque">
      <p>Ofertas do dia</p>
      <div className="offer-stories__rail">
        {items.map((item, index) => <button key={item.id} type="button" onClick={event => open(index, event)} aria-label={`Ver oferta de ${item.product.name}`}>
          <span className="offer-stories__ring"><span>{item.product.image ? <img src={item.product.imageSmall || item.product.image} alt="" /> : item.product.name.slice(0, 1)}</span></span>
          <strong>{item.product.name}</strong>
        </button>)}
      </div>
    </div>

    {activeItem && <div className={`offer-story-viewer${isBlackFriday ? ' offer-story-viewer--black-friday' : ''}`} style={isBlackFriday ? {'--story-background': `url(${blackFridayBackground})`} : undefined} role="dialog" aria-modal="true" aria-label={`Oferta de ${activeItem.product.name}`}>
      <div className="offer-story-viewer__progress" aria-hidden="true"><span key={activeIndex}/></div>
      <button ref={closeButton} className="offer-story-viewer__close" type="button" onClick={close} aria-label="Fechar oferta"><X /></button>
      <button className="offer-story-viewer__previous" type="button" onClick={() => move(-1)} aria-label="Oferta anterior"><ChevronLeft /></button>
      <article className="offer-story-card">
        {isBlackFriday && <div className="offer-story-card__brand"><img src={Logo} alt="Bom pra você Supermercado" /></div>}
        <div className="offer-story-card__campaign">
          {isBlackFriday ? <><span>Seleção</span><strong>Black Friday</strong>{campaignPeriod && <small>{campaignPeriod}</small>}</> : campaign.title}
          {isBlackFriday && <img src={blackFridaySparks} alt="" aria-hidden="true" />}
        </div>
        <div className="offer-story-card__photo">{activeItem.product.image ? <img src={activeItem.product.image} alt={activeItem.product.name} /> : <span>Imagem em preparação</span>}</div>
        <div className="offer-story-card__copy">
          {activeItem.product.brand && <span>{activeItem.product.brand}</span>}
          <h3>{activeItem.product.name}</h3>
          {activeItem.product.content && <p>{activeItem.product.content}</p>}
          <strong>{(activeItem.priceCents / 100).toLocaleString('pt-BR', {style:'currency', currency:'BRL'})}<small>/{activeItem.unit}</small></strong>
        </div>
        {isBlackFriday && <footer className="offer-story-card__footer"><span>Não guarde o segredo da economia.</span><strong>Compartilhe!</strong></footer>}
      </article>
      <button className="offer-story-viewer__next" type="button" onClick={() => move(1)} aria-label="Próxima oferta"><ChevronRight /></button>
      {showInstructions && <div className="offer-story-instructions" role="status"><strong>Veja como usar</strong><span>Toque nas laterais para avançar ou voltar.</span><span>Toque no × para fechar.</span></div>}
    </div>}
  </>;
}
