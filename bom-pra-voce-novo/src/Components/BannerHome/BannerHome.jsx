import React, { useEffect, useState } from "react";
import { bannerImages } from "../../Data/BannerData";
import BouncingScroll from "../BouncingScroll/BouncingScroll";

const BannerHome = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 7500);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + bannerImages.length) % bannerImages.length
    );
  };

  return (
    <>
      <div className="w-full  relative overflow-hidden">
        <div
          className="flex h-full transition-transform duration-500"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {bannerImages.map((image) => (
            <div
              key={image.id}
              className=" w-full h-full flex-shrink-0 relative">
              <img
                src={image.desktop}
                alt={image.alt}
                className="w-full h-full object-contain  "
              />
            </div>
          ))}
          <BouncingScroll />
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 backdrop-blur-xl bg-white/10 border border-white/45 text-white p-2 rounded-full z-10"
          aria-label="Slide anterior">
          &lt;
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 backdrop-blur-xl bg-white/10 border border-white/45 text-white p-2 rounded-full z-10"
          aria-label="Próximo slide">
          &gt;
        </button>
      </div>
    </>
  );
};

export default BannerHome;
