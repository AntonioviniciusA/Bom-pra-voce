import { useState } from "react";
import Hortifrut from "../../images/Setores/Hortifrut.webp";
import Bebidas from "../../images/Setores/Bebidas.webp";
import Padaria from "../../images/Setores/Padaria.webp";
import Adega from "../../images/Setores/Adega.webp";
import Freezer from "../../images/Setores/Freezer.webp";

const sectors = [
  {
    id: 0,
    name: "Bebidas",
    mainImage: Bebidas,
    // images: [
    //   Hortifrut,
    //   "https://via.placeholder.com/600x400",
    //   "https://via.placeholder.com/600x400",
    //   "https://via.placeholder.com/600x400",
    // ],
  },
  {
    id: 0,
    name: "Hortifrut",
    mainImage: Hortifrut,
    // images: [
    //   Hortifrut,
    //   "https://via.placeholder.com/600x400",
    //   "https://via.placeholder.com/600x400",
    //   "https://via.placeholder.com/600x400",
    // ],
  },
  {
    id: 0,
    name: "Padaria",
    mainImage: Padaria,
    // images: [
    //   Hortifrut,
    //   "https://via.placeholder.com/600x400",
    //   "https://via.placeholder.com/600x400",
    //   "https://via.placeholder.com/600x400",
    // ],
  },
  {
    id: 0,
    name: "Adega",
    mainImage: Adega,
    // images: [
    //   Hortifrut,
    //   "https://via.placeholder.com/600x400",
    //   "https://via.placeholder.com/600x400",
    //   "https://via.placeholder.com/600x400",
    // ],
  },
  {
    id: 0,
    name: "Congelados",
    mainImage: Freezer,
    // images: [
    //   Hortifrut,
    //   "https://via.placeholder.com/600x400",
    //   "https://via.placeholder.com/600x400",
    //   "https://via.placeholder.com/600x400",
    // ],
  },
];

export default function Card() {
  const [selectedSector, setSelectedSector] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openModal = (sector) => {
    setSelectedSector(sector);
    setCurrentImageIndex(0);
  };

  const closeModal = () => {
    setSelectedSector(null);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev < selectedSector.images.length - 1 ? prev + 1 : 0
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev > 0 ? prev - 1 : selectedSector.images.length - 1
    );
  };

  return (
    <div
      className="w-full flex flex-col items-center justify-center"
      style={{
        background:
          "linear-gradient(to bottom, #FFDD00 60%,rgb(255, 255, 255) 50%)",
      }}>
      <div className="relative z-10 m-12">
        <h1 className="text-4xl font-bold text-center text-white">
          Conheça Nosso Setores
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-5 gap-4 md:gap-6 px-4">
        {sectors.map((sector) => (
          <div
            key={sector.id}
            className="group cursor-pointer relative"
            onClick={() => openModal(sector)}>
            <div className="w-[220px] relative overflow-hidden rounded-xl md:rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1">
              <div className="relative overflow-hidden w-full h-full">
                <img
                  src={sector.mainImage}
                  alt={sector.name}
                  className="w-full h-full object-contain group-hover:scale-102 transition-transform duration-300"
                />
                <div className="absolute bottom-0 left-0 w-full bg-black/50 text-white text-center py-4 z-20">
                  <h2 className="text-sm font-medium">{sector.name}</h2>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal  */}
      {selectedSector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-md sm:max-w-xl lg:max-w-4xl bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl overflow-hidden">
            <div className="p-2 sm:p-2">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center text-white">
                {selectedSector.name}
              </h2>
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white hover:text-gray-300 text-xl sm:text-2xl">
                &times;
              </button>
            </div>

            <div className="relative px-4 sm:px-4 pb-2 sm:pb-2">
              <div className="relative max-h-[80vh] overflow-hidden rounded-lg">
                <img
                  src={selectedSector.images[currentImageIndex]}
                  alt={`${selectedSector.name} - Imagem ${
                    currentImageIndex + 1
                  }`}
                  className="w-full h-full object-contain"
                />
              </div>

              <button
                onClick={prevImage}
                className="absolute left-1 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-white text-sm sm:text-base">
                &lt;
              </button>
              <button
                onClick={nextImage}
                className="absolute right-1 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-white text-sm sm:text-base">
                &gt;
              </button>

              <div className="flex justify-center mt-2 sm:mt-4 space-x-1 sm:space-x-2">
                {selectedSector.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                      index === currentImageIndex ? "bg-white" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
