import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Hand, Pause, Play, Share2, X } from 'lucide-react';
import {createProductStory} from './story';
import ShareDownloadMenu from './ShareDownloadMenu';
import { productCategories } from './model';
import blackFridayBackground from '../../images/offer-themes/black-friday/explosao-neon-roxa-dourada.png';
import blackFridayTag from '../../images/offer-themes/black-friday/black-friday-etiqueta-desconto-3d.png';
import originalLogo from '../../images/logo_bom_pra_voce_vetorizada.svg';
import produceCover from '../../images/offer-categories/stories-hortifruti.webp';
import meatCover from '../../images/offer-categories/stories-acougue-carnes.webp';
import groceryCover from '../../images/offer-categories/stories-mercearia.webp';
import drinksCover from '../../images/offer-categories/stories-bebidas.webp';
import cleaningCover from '../../images/offer-categories/stories-limpeza.webp';
import personalCareCover from '../../images/offer-categories/stories-higiene-pessoal.webp';
import bakeryCover from '../../images/offer-categories/stories-padaria.webp';
import deliCover from '../../images/offer-categories/stories-frios-laticinios.webp';
import householdCover from '../../images/offer-categories/stories-utilidades-domesticas.webp';
import storeCover from '../../images/SupermarketAreasImages/Entrada.webp';

const STORY_DURATION = 7000;
const HOLD_DELAY = 220;
const CATEGORY_COVERS = {
  hortifruti: produceCover,
  acougue: meatCover,
  mercearia: groceryCover,
  bebidas: drinksCover,
  limpeza: cleaningCover,
  higiene: personalCareCover,
  padaria: bakeryCover,
  frios: deliCover,
  utilidades: householdCover,
};

function GuidedTour({onFinish}) {
  const startButton = useRef(null);

  useEffect(() => {
    startButton.current?.focus();
  }, []);

  return <div className="offer-story-guided-tour" role="document" aria-labelledby="offer-story-tour-title" aria-describedby="offer-story-tour-description">
    <button className="offer-story-guided-tour__skip" type="button" onClick={onFinish} aria-label="Pular tour e começar stories"><X aria-hidden="true"/>Pular tour</button>
    <div className="offer-story-guided-tour__intro">
      <span>É rapidinho</span>
      <h2 id="offer-story-tour-title">Navegue como nos stories</h2>
      <p id="offer-story-tour-description">Toque, segure e solte. Você controla o ritmo.</p>
    </div>
    <div className="offer-story-guided-tour__gesture-map" aria-hidden="true">
      <span className="is-previous"><ChevronLeft/>Voltar<i/></span>
      <span className="is-hold"><Hand/>Segure<i/></span>
      <span className="is-next">Avançar<ChevronRight/><i/></span>
    </div>
    <ol className="offer-story-guided-tour__steps">
      <li><span><ChevronLeft aria-hidden="true"/></span><p><strong>Toque à esquerda</strong><small>Volta para a oferta anterior</small></p></li>
      <li><span><Hand aria-hidden="true"/></span><p><strong>Segure a tela</strong><small>Pausa; ao soltar, continua</small></p></li>
      <li><span><ChevronRight aria-hidden="true"/></span><p><strong>Toque à direita</strong><small>Avança para a próxima oferta</small></p></li>
    </ol>
    <button ref={startButton} className="offer-story-guided-tour__start" type="button" onClick={onFinish}>Começar stories <ChevronRight aria-hidden="true"/></button>
  </div>;
}

export default function OfferStories({campaign, items, onVisualReady}) {
  const categories = useMemo(() => {
    const known = productCategories.map(category => ({
      ...category,
      items: items.filter(item => item.product.category === category.key),
    })).filter(category => category.items.length);
    const knownKeys = new Set(productCategories.map(category => category.key));
    const uncategorized = items.filter(item => !knownKeys.has(item.product.category));
    if (uncategorized.length) known.push({key:'other', label:'Outras ofertas', items:uncategorized});
    return known;
  }, [items]);
  const [activeCategoryKey, setActiveCategoryKey] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showGuidedTour, setShowGuidedTour] = useState(false);
  const [progressRun, setProgressRun] = useState(0);
  const card = useRef(null);
  const rail = useRef(null);
  const closeButton = useRef(null);
  const previousFocus = useRef(null);
  const guidedTourSeen = useRef(false);
  const timer = useRef(null);
  const startedAt = useRef(0);
  const remaining = useRef(STORY_DURATION);
  const press = useRef(null);
  const activeCategory = categories.find(category => category.key === activeCategoryKey) || null;
  const activeItem = activeCategory?.items[activeIndex] || null;
  const isBlackFriday = campaign.theme_key === 'black-friday';
  const campaignPeriod = campaign.startDate && campaign.endDate
    ? 'De ' + campaign.startDate.slice(8) + ' a ' + campaign.endDate.split('-').reverse().join('/')
    : '';

  function clearStoryTimer() {
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = null;
  }

  function close() {
    clearStoryTimer();
    setActiveCategoryKey(null);
    setActiveIndex(0);
    setIsPaused(false);
    setShowGuidedTour(false);
    requestAnimationFrame(() => previousFocus.current?.focus());
  }

  function open(categoryKey, event) {
    previousFocus.current = event.currentTarget;
    remaining.current = STORY_DURATION;
    setActiveCategoryKey(categoryKey);
    setActiveIndex(0);
    setProgressRun(run => run + 1);
    const shouldGuide = !guidedTourSeen.current;
    setShowGuidedTour(shouldGuide);
    setIsPaused(shouldGuide);
  }

  function move(step) {
    if (!activeCategory) return;
    const next = activeIndex + step;
    if (next >= activeCategory.items.length) {
      const categoryIndex = categories.findIndex(category => category.key === activeCategoryKey);
      const nextCategory = categories[(categoryIndex + 1) % categories.length];
      remaining.current = STORY_DURATION;
      setActiveCategoryKey(nextCategory.key);
      setActiveIndex(0);
      setIsPaused(false);
      setProgressRun(run => run + 1);
      return;
    }
    remaining.current = STORY_DURATION;
    setActiveIndex(Math.max(0, next));
    setIsPaused(false);
    setProgressRun(run => run + 1);
  }

  function pausePlayback() {
    if (isPaused || !activeItem) return;
    clearStoryTimer();
    remaining.current = Math.max(0, remaining.current - (performance.now() - startedAt.current));
    setIsPaused(true);
  }

  function resumePlayback() {
    if (!isPaused || showGuidedTour || !activeItem) return;
    setIsPaused(false);
    setProgressRun(run => run + 1);
  }

  function togglePlayback() {
    if (isPaused) resumePlayback();
    else pausePlayback();
  }

  function startHold(event) {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    press.current = {startedAt: performance.now(), wasPaused: isPaused};
    if (!isPaused) pausePlayback();
  }

  function finishHold(step = null) {
    if (!press.current) return;
    const heldFor = performance.now() - press.current.startedAt;
    const wasPaused = press.current.wasPaused;
    press.current = null;
    if (heldFor < HOLD_DELAY && step !== null) move(step);
    else if (!wasPaused) resumePlayback();
  }

  function finishGuidedTour() {
    guidedTourSeen.current = true;
    remaining.current = STORY_DURATION;
    setShowGuidedTour(false);
    setIsPaused(false);
    setProgressRun(run => run + 1);
  }

  useEffect(() => {
    if (!activeItem || isPaused || showGuidedTour) return undefined;
    startedAt.current = performance.now();
    timer.current = window.setTimeout(() => move(1), remaining.current);
    return clearStoryTimer;
  }, [activeCategoryKey, activeIndex, isPaused, showGuidedTour]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!activeItem) return undefined;
    if (!showGuidedTour) closeButton.current?.focus();
    const onKeyDown = event => {
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowRight' && !showGuidedTour) move(1);
      if (event.key === 'ArrowLeft' && !showGuidedTour) move(-1);
      if (event.key === ' ' && !showGuidedTour) {
        event.preventDefault();
        togglePlayback();
      }
    };
    document.body.classList.add('offer-story-open');
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.classList.remove('offer-story-open');
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeCategoryKey, activeIndex, isPaused, showGuidedTour]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!onVisualReady) return undefined;
    if (!categories.length) {
      onVisualReady();
      return undefined;
    }
    let cancelled = false;
    const frame = requestAnimationFrame(() => {
      const images = [...rail.current.querySelectorAll('img')]
        .filter(image => image.getBoundingClientRect().left < window.innerWidth + 120);
      const settled = images.map(image => image.complete
        ? (image.decode?.().catch(() => {}) || Promise.resolve())
        : new Promise(resolve => {
          image.addEventListener('load', resolve, {once:true});
          image.addEventListener('error', resolve, {once:true});
        }));
      Promise.race([Promise.all(settled), new Promise(resolve => setTimeout(resolve, 1600))])
        .then(() => { if (!cancelled) onVisualReady(); });
    });
    return () => { cancelled = true; cancelAnimationFrame(frame); };
  }, [categories, onVisualReady]);

  if (!categories.length) return null;
  const progressStart = Math.max(0, Math.min(1, 1 - remaining.current / STORY_DURATION));

  return <>
    <div className={'offer-stories' + (isBlackFriday ? ' offer-stories--black-friday' : '')} aria-label="Ofertas em stories por categoria">
      <div ref={rail} className="offer-stories__rail">
        {categories.map(category => {
          const cover = CATEGORY_COVERS[category.key]
            || category.items.find(item => item.product.image)?.product.image
            || storeCover;
          return <button key={category.key} type="button" onClick={event => open(category.key, event)} aria-label={'Ver stories de ' + category.label}>
            <span className="offer-stories__ring">
              <span>
                <img src={cover} alt="" loading="lazy" decoding="async" onError={event => {
                  if (event.currentTarget.getAttribute('src') !== storeCover) {
                    event.currentTarget.src = storeCover;
                  }
                }}/>
              </span>
              {isBlackFriday && <img className="offer-stories__badge" src={blackFridayTag} alt="" aria-hidden="true" loading="lazy" decoding="async"/>}
            </span>
            <strong>{category.label}</strong>
            <small>{category.items.length} {category.items.length === 1 ? 'oferta' : 'ofertas'}</small>
          </button>;
        })}
      </div>
      <header className="offer-stories__heading">
        <Hand className="offer-stories__tap" aria-hidden="true"/>
        <p>Arraste para o lado e descubra as ofertas</p>
      </header>
    </div>

    {activeItem && createPortal(<div className={'offer-story-viewer' + (isBlackFriday ? ' offer-story-viewer--black-friday' : '')} style={isBlackFriday ? {'--story-background': 'url(' + blackFridayBackground + ')'} : undefined} role="dialog" aria-modal="true" aria-label={'Oferta de ' + activeItem.product.name + ' em ' + activeCategory.label}>
      <div className="offer-story-viewer__progress" role="progressbar" aria-label={(activeIndex + 1) + ' de ' + activeCategory.items.length + ': ' + activeItem.product.name} aria-valuemin="1" aria-valuemax={activeCategory.items.length} aria-valuenow={activeIndex + 1}>
        {activeCategory.items.map((item, index) => <span className={index < activeIndex ? 'is-complete' : index === activeIndex ? 'is-current' : ''} key={item.id}><i key={index === activeIndex ? progressRun : undefined} style={index === activeIndex ? {'--story-progress-start': progressStart, '--story-progress-duration': remaining.current + 'ms', animationPlayState: isPaused ? 'paused' : 'running'} : undefined}/></span>)}
      </div>
      <button ref={closeButton} className="offer-story-viewer__close" type="button" onClick={close} aria-label="Fechar stories"><X /></button>
      <button className="offer-story-viewer__pause" type="button" onClick={togglePlayback} aria-label={isPaused ? 'Retomar story' : 'Pausar story'} aria-pressed={isPaused}>{isPaused ? <Play/> : <Pause/>}</button>
      <ShareDownloadMenu campaign={campaign} items={campaign.items?.length ? campaign.items : items} item={activeItem}
        getArtwork={() => createProductStory(campaign, activeItem)} onOpen={pausePlayback}
        triggerClassName="offer-story-viewer__share" triggerLabel="Compartilhar ou baixar esta oferta"
        triggerContent={<Share2 aria-hidden="true"/>}/>
      <button className="offer-story-viewer__previous" type="button" onPointerDown={startHold} onPointerUp={() => finishHold(-1)} onPointerCancel={() => finishHold()} onClick={event => {if (event.detail === 0) move(-1);}} aria-label="Oferta anterior"><ChevronLeft /></button>
      <article ref={card} className="offer-story-card" onPointerDown={startHold} onPointerUp={() => finishHold()} onPointerCancel={() => finishHold()}>
        <div className="offer-story-card__brand"><img src={originalLogo} alt="Bom pra você Supermercado" /></div>
        <div className="offer-story-card__campaign">
          {isBlackFriday ? <><span>{campaign.title?.replace(' Black Friday','') || 'Seleção'}</span><strong>Black Friday</strong>{campaignPeriod && <small>{campaignPeriod}</small>}</> : campaign.title}
        </div>
        <div className="offer-story-card__photo">{activeItem.product.image ? <img src={activeItem.product.imageSmall||activeItem.product.image} srcSet={activeItem.product.imageSmall?`${activeItem.product.imageSmall} 480w, ${activeItem.product.image} 1200w`:undefined} sizes="100vw" alt={activeItem.product.name} decoding="async" /> : <span>Imagem em preparação</span>}</div>
        <div className="offer-story-card__copy">
          <div className="offer-story-card__details">
            {activeItem.product.brand && <span>{activeItem.product.brand}</span>}
            <h3>{activeItem.product.name}</h3>
            {activeItem.product.content && <p>{activeItem.product.content}</p>}
          </div>
          <strong className="offer-story-card__price">{(activeItem.priceCents / 100).toLocaleString('pt-BR', {style:'currency', currency:'BRL'})}<small>/{activeItem.unit}</small></strong>
        </div>
        {isBlackFriday && <footer className="offer-story-card__footer"><span>Não guarde o segredo da economia.</span><strong>Compartilhe!</strong></footer>}
      </article>
      <button className="offer-story-viewer__next" type="button" onPointerDown={startHold} onPointerUp={() => finishHold(1)} onPointerCancel={() => finishHold()} onClick={event => {if (event.detail === 0) move(1);}} aria-label="Próxima oferta"><ChevronRight /></button>
      {showGuidedTour && <GuidedTour onFinish={finishGuidedTour}/>}
      {isPaused && !showGuidedTour && <span className="offer-story-viewer__paused" role="status" aria-label="Story pausado">Story pausado</span>}
    </div>, document.body)}
  </>;
}
