import React, { useState } from "react";
import { tabloidesData } from "../../Data/TabloideData";
import TabloideView from "./TabloideView";

export default function Tabloide() {
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const handleOpenPdf = (pdfUrl) => {
    setSelectedPdf(pdfUrl);
    setIsViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
    setSelectedPdf(null);
  };

  return (
    <div className="py-10 flex items-center justify-center w-full h-full p-8">
      <div className="p-4">
        <div className="flex items-center flex-col mb-4 text-center">
          <h1 className="text-4xl font-extrabold text-yellow-400">
            Corre que dá tempo!
          </h1>
          <p className="text-lg font-bold mt-2 text-black">
            As melhores ofertas da semana te esperam aqui.
          </p>
        </div>

        <div className="flex gap-4 flex-wrap justify-center">
          {tabloidesData.map((tabloide) => (
            <div key={tabloide.id} className="flex flex-col items-center">
              <div
                className="relative h-32 lg:h-40 overflow-hidden rounded-lg bg-yellow-400 cursor-pointer"
                style={{
                  boxShadow:
                    "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.1) 0px 6px 6px",
                }}
                onClick={() => handleOpenPdf(tabloide.pdfUrl)}>
                <img
                  src={tabloide.thumbnail}
                  alt={tabloide.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.05]"
                />
              </div>
              <button
                className="mt-8 backdrop-blur-sm bg-yellow-300/30 border-[2px] border-yellow-300 rounded-full px-8 py-2 shadow-2xl shadow-white/10"
                style={{ boxShadow: "rgba(255, 238, 0, 0.68) 0px 2px 30px" }}
                onClick={() => handleOpenPdf(tabloide.pdfUrl)}>
                <p
                  className="flex-1 flex justify-center text-black font-semibold"
                  style={{ textShadow: "0 1px 1px rgb(255, 255, 255)" }}>
                  Visualizar
                </p>
              </button>
            </div>
          ))}
        </div>

        {/* Modal */}
        {isViewerOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-screen h-full flex flex-col">
              <TabloideView pdfUrl={selectedPdf} onClose={handleCloseViewer} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
