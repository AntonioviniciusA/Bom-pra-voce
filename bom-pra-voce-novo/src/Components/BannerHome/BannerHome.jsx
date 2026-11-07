import PrecoBaixo from "../../images/PrecoBaixo.png";
import Compras from "../../images/banner-compras.png";
import ConhecaLoja from "../../images/banner-conheca-nossa-loja-v2.png";
import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";
import { storeConfig } from "../../Data/storeConfig";
import "./BannerHome.css";

export function storeExperience(today = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo", year: "numeric", month: "numeric", day: "numeric",
  }).formatToParts(today);
  const value = (type) => Number(parts.find((part) => part.type === type).value);
  const [year, month, day] = storeConfig.foundedOn.split("-").map(Number);
  const months = (value("year") - year) * 12 + value("month") - month
    - (value("day") < day ? 1 : 0);
  const years = Math.floor(months / 12);
  return months % 12 >= 9 ? `há quase ${years + 1} anos` : `há ${years} anos`;
}
const slides = [
  {
    image: PrecoBaixo,
    alt: "Preço baixo todo dia. Venha conferir no Bom Pra Você Supermercado.",
    width: 1913,
    height: 765,
  },
  { image: Compras, alt: "Tudo para o seu dia a dia. Bom pra você.", width: 1983, height: 793 },
  { image: ConhecaLoja, alt: "Conheça nossa loja. Tudo o que sua família precisa em um só lugar.", href: "/nossa-loja#setores", width: 1983, height: 793 },
];
export default function BannerHome() {
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [stopped, setStopped] = useState(false);
  useEffect(() => {
    if (
      paused || stopped ||
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches
    )
      return undefined;
    const timer = setInterval(() => {
      if (!document.hidden) setSlide((value) => (value + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [paused, stopped]);
  return (
    <section
      id="home"
      className="original-banner"
      aria-labelledby="hero-title"
      onFocusCapture={(event) => {
        if (event.target !== event.currentTarget) setPaused(true);
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setPaused(false);
      }}
    >
      <h1 id="hero-title" className="sr-only">
        Bom Pra Você Supermercado
      </h1>
      <div
        className="carousel-slide"
        role="group"
        aria-roledescription="carrossel"
        aria-label="Destaques da loja"
        style={{ aspectRatio: `${slides[slide].width} / ${slides[slide].height}` }}
      >
        {slides[slide].href ? <a className="carousel-slide-link" href={slides[slide].href} aria-label="Conhecer os setores da loja">
          <img
            src={slides[slide].image}
            alt={slides[slide].alt}
            width={slides[slide].width}
            height={slides[slide].height}
            fetchPriority="high"
          />
        </a> : <img
          src={slides[slide].image}
          alt={slides[slide].alt}
          width={slides[slide].width}
          height={slides[slide].height}
          fetchPriority="high"
        />}
        <div className="carousel-controls">
          <button type="button" className="carousel-pause" aria-label={stopped ? "Retomar destaques" : "Pausar destaques"} title={stopped ? "Retomar destaques" : "Pausar destaques"} onClick={() => setStopped(value => !value)}>{stopped ? <Play size={18} fill="currentColor" aria-hidden="true" /> : <Pause size={18} fill="currentColor" aria-hidden="true" />}</button>
          <div className="carousel-dots">
            {slides.map((item, index) => (
              <button
                key={item.image}
                aria-label={`Mostrar imagem ${index + 1}`}
                aria-pressed={index === slide}
                onClick={() => setSlide(index)}
              >
                <span className="sr-only">Imagem {index + 1}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      {slides[slide].status && <p className="hero-service-status">{slides[slide].status}</p>}
      <div className="heritage-banner" role="region" aria-label="Nossa história">
        <div className="heritage-banner-inner">
          <span className="heritage-banner-since"><span>Desde</span><strong>{storeConfig.foundedOn.slice(0, 4)}</strong></span>
          <div className="heritage-banner-copy">
            <p className="heritage-banner-age">{storeExperience().replace(/^há/, "Há")} com você.</p>
            <p className="heritage-banner-message">Qualidade na sua mesa, todos os dias.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
