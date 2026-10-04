import PrecoBaixo from "../../images/PrecoBaixo.png";
import Compras from "../../images/banner-compras.png";
import Padaria from "../../images/banner-padaria.png";
import { useEffect, useState } from "react";
const slides = [
  {
    image: PrecoBaixo,
    alt: "Preço baixo todo dia. Venha conferir no Bom Pra Você Supermercado.",
  },
  { image: Compras, alt: "Tudo para o seu dia a dia. Bom pra você." },
  { image: Padaria, alt: "Sua próxima parada: a padaria. Bom pra você." },
];
export default function BannerHome() {
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (
      paused ||
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches
    )
      return undefined;
    const timer = setInterval(() => {
      if (!document.hidden) setSlide((value) => (value + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [paused]);
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
        aria-roledescription="carrossel"
        aria-label="Destaques da loja"
      >
        <img
          src={slides[slide].image}
          alt={slides[slide].alt}
          width="1913"
          height="765"
          fetchPriority="high"
        />
      </div>
      <div className="carousel-controls">
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
    </section>
  );
}
