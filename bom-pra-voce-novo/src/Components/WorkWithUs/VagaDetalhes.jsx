export default function VagaDetalhes({ vaga, onBack, onCandidatar }) {
  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors mb-6">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Voltar às Vagas
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{vaga.titulo}</h2>
              <p className="text-lg text-gray-600 mt-2">{vaga.departamento}</p>
            </div>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">
              {vaga.tipo}
            </span>
          </div>

          <div className="flex items-center gap-4 mt-4 text-gray-600">
            <div className="flex items-center gap-1">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {vaga.localizacao}
            </div>
          </div>

          <div className="mt-8 space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-3">Descrição da Vaga</h3>
              <p className="text-gray-700">{vaga.descricao}</p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xl font-semibold mb-3">Requisitos</h3>
              <ul className="space-y-2">
                {vaga.requisitos.map((requisito, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700">{requisito}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xl font-semibold mb-3">Benefícios</h3>
              <ul className="space-y-2">
                {vaga.beneficios.map((beneficio, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700">{beneficio}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4">
              <button
                onClick={onCandidatar}
                className="w-full py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-bold">
                Candidatar-se para esta Vaga
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
