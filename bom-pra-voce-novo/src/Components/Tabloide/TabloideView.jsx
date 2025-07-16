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
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-screen h-full flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold"></h2>
          <div className="flex items-center gap-4">
            <button onClick={handlePrevious} disabled={page <= 1}>
              Anterior
            </button>
            <span>
              Página {page} de {pages || "--"}
            </span>
            <button onClick={handleNext} disabled={page >= pages}>
              Próxima
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 ml-4">
              <span className="text-2xl">&times;</span>
            </button>
          </div>
        </div>
        <div className="flex-grow flex justify-center overflow-auto p-4">
          <PDF
            file={pdfUrl}
            page={page}
            onDocumentComplete={onDocumentComplete}
            loading="Carregando..."
          />
        </div>
      </div>
    </div>
  );
}
