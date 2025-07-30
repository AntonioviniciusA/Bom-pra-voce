import React, { useState } from "react";
import PDF from "react-pdf-js";

export default function TabloideView({ pdfUrl, onClose }) {
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);

  const onDocumentComplete = (pages) => {
    setPages(pages);
    setPage(1);
  };

  const handlePrevious = () => setPage(Math.max(page - 1, 1));
  const handleNext = () => setPage(Math.min(page + 1, pages));

  return (
    <div className="flex flex-col h-full rounded-lg">
      <div className="flex bg-yellow-400 justify-between items-center p-4 rounded-lg">
        <h2 className="text-xl font-bold text-white">Bom Pra Você</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={handlePrevious}
            disabled={page <= 1}
            className="text-white">
            Anterior
          </button>
          <span className="text-white">
            Página {page} de {pages || "0"}
          </span>
          <button
            onClick={handleNext}
            disabled={page >= pages}
            className="text-white">
            Próxima
          </button>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-700 ml-4">
            <span className="text-2xl">&times;</span>
          </button>
        </div>
      </div>

      <div className="flex-grow flex justify-center items-center overflow-auto p-4">
        <PDF
          file={pdfUrl}
          page={page}
          onDocumentComplete={onDocumentComplete}
          loading="Carregando..."
        />
      </div>
    </div>
  );
}
