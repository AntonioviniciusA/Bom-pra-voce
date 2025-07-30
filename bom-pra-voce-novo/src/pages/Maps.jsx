import { useState, useEffect } from "react";
import supermarketAreas from "../Data/supermarketAreas";

export default function SupermarketTour() {
  const [currentArea, setCurrentArea] = useState("entrance");
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [showMap, setShowMap] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const current = supermarketAreas[currentArea];

  // Navigation
  const navigateTo = (targetId) => {
    if (targetId === currentArea) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentArea(targetId);
      setRotation(0);
      setZoom(1);
      setIsTransitioning(false);
    }, 300);
  };

  // Zoom
  const handleZoom = (direction) => {
    setZoom((prev) => {
      const newZoom = prev + direction * 0.1;

      if (newZoom < 1.0) {
        return 1.0;
      }

      return Math.min(2, newZoom);
    });
  };

  // Navegação por teclado
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case "ArrowUp":
          handleZoom(1);
          break;
        case "ArrowDown":
          handleZoom(-1);
          break;
        case "m":
        case "M":
          setShowMap(!showMap);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [showMap]);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Viewport  */}
      <div className="relative w-full h-full">
        <div
          className={`w-full h-full transition-all duration-300 ${
            isTransitioning ? "opacity-50 blur-sm" : "opacity-100"
          }`}
          style={{
            transform: `rotate(${rotation}deg) scale(${zoom})`,
            transformOrigin: "center center",
          }}>
          <img
            src={current.image}
            alt={current.name}
            className="w-full h-full object-cover"
          />

          {/* Hotspots */}
          {!isTransitioning &&
            current.hotspots.map((hotspot, index) => (
              <button
                key={index}
                className="absolute w-6 h-6 bg-yellow-500 rounded-full border-2 border-white shadow-lg hover:bg-yellow-600 hover:scale-110 transition-all duration-200 flex items-center justify-center group"
                style={{
                  left: `${hotspot.x}%`,
                  top: `${hotspot.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                onClick={() => navigateTo(hotspot.target)}>
                <span className="text-white text-xs">→</span>
                <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {hotspot.label}
                </span>
              </button>
            ))}
        </div>

        {isTransitioning && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="text-white text-xl">Navegando...</div>
          </div>
        )}
      </div>

      <div className="absolute top-4 left-4 bg-black/80 text-white p-4 rounded-lg border border-gray-600 max-w-xs">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-yellow-400">📍</span>
          <h2 className="text-lg font-bold">{current.name}</h2>
        </div>
        <p className="text-sm text-gray-300 mb-2">{current.description}</p>
        <p className="text-xs text-gray-400">{current.info}</p>
      </div>

      {/* Contr0ols */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 p-3 rounded-lg border border-gray-600 flex gap-4">
        {/* Controls to zoom */}
        <div className="flex gap-2">
          <button
            onClick={() => handleZoom(-1)}
            className="w-10 h-10 bg-gray-700 text-white rounded flex items-center justify-center hover:bg-gray-600 transition-colors">
            -
          </button>
          <button
            onClick={() => handleZoom(1)}
            className="w-10 h-10 bg-gray-700 text-white rounded flex items-center justify-center hover:bg-gray-600 transition-colors">
            +
          </button>
        </div>

        {/* Controls to map  */}
        <button
          onClick={() => setShowMap(!showMap)}
          className="w-20 h-10 bg-gray-700 text-white rounded flex items-center justify-center hover:bg-gray-600 transition-colors">
          Mapa
        </button>
      </div>

      {/* quick navigation */}
      <div className="absolute bottom-4 right-4 bg-black/80 p-3 rounded-lg border border-gray-600">
        <h3 className="text-white text-sm mb-2">Navegação Rápida:</h3>
        <div className="flex flex-wrap gap-2">
          {current.connections.map((connectionId) => {
            const target = supermarketAreas[connectionId];
            return (
              <button
                key={connectionId}
                onClick={() => navigateTo(connectionId)}
                className="bg-gray-700 text-white text-xs px-3 py-1 rounded hover:bg-gray-600 transition-colors">
                {target.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mini map */}
      {showMap && (
        <div className="absolute top-20 right-4 bg-black/90 p-4 rounded-lg border border-gray-600 w-72 z-10">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-white font-semibold">Mapa do Supermercado</h3>
            <button
              onClick={() => setShowMap(false)}
              className="text-white hover:text-gray-300 text-xl">
              ×
            </button>
          </div>

          <div className="relative bg-gray-800 rounded h-48">
            {/* grid to map */}
            <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 opacity-20">
              {Array.from({ length: 100 }).map((_, i) => (
                <div key={i} className="border border-gray-600"></div>
              ))}
            </div>

            {/* conection */}
            <svg className="absolute inset-0 w-full h-full">
              {Object.values(supermarketAreas).map((area) =>
                area.connections.map((connectionId) => {
                  const target = supermarketAreas[connectionId];
                  return (
                    <line
                      key={`${area.id}-${connectionId}`}
                      x1={`${area.position.x}%`}
                      y1={`${area.position.y}%`}
                      x2={`${target.position.x}%`}
                      y2={`${target.position.y}%`}
                      stroke="rgba(59, 130, 246, 0.3)"
                      strokeWidth="1"
                    />
                  );
                })
              )}
            </svg>

            {/* areas */}
            {Object.values(supermarketAreas).map((area) => (
              <button
                key={area.id}
                className={`absolute w-2 h-2 rounded-full border-2 ${
                  area.id === currentArea
                    ? "bg-yellow-500 border-white"
                    : "bg-gray-600 border-gray-400"
                } hover:bg-yellow-500 transition-colors`}
                style={{
                  left: `${area.position.x}%`,
                  top: `${area.position.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                onClick={() => navigateTo(area.id)}
                title={area.name}
              />
            ))}
          </div>

          <div className="mt-3 text-xs text-gray-400">
            <p>• Ponto azul: sua localização atual</p>
            <p>• Clique nos pontos para navegar</p>
          </div>
        </div>
      )}

      {/* instructions */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full border border-gray-600 text-sm">
        Clique nos pontos ou use as teclas de seta para navegar
      </div>
    </div>
  );
}
