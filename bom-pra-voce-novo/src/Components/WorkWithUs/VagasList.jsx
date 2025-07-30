export default function VagasList({
  vagas,
  onSelect,
  onCandidaturaEspontanea,
  onBack,
}) {
  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border  ">
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
          Voltar
        </button>
        <h2 className="text-3xl font-bold text-white">Vagas Disponíveis</h2>
      </div>

      {vagas.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <h3 className="text-xl font-semibold mb-4">
            Nenhuma vaga disponível no momento
          </h3>
          <p className="text-gray-600 mb-6">
            Mas você pode enviar uma candidatura espontânea e entraremos em
            conto quando surgir uma oportunidade.
          </p>
          <button
            onClick={onCandidaturaEspontanea}
            className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
            Candidatura Espontânea
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {vagas.map((vaga) => (
            <div
              key={vaga.id}
              className="bg-white/35 border-[2px] rounded-lg  overflow-hidden "
              style={{
                boxShadow:
                  "rgba(255, 255, 255, 0.19) 0px 10px 20px, rgba(255, 255, 255, 0.23) 0px 6px 6px",
              }}>
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-white">
                    {vaga.titulo}
                  </h3>
                  <span className="px-3 py-1 bg-yellow-100 border text-yellow-800 text-sm rounded-full">
                    {vaga.tipo}
                  </span>
                </div>
                <p className="text-gray-600 mt-2">{vaga.departamento}</p>
                {/* 
                <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                  <svg
                    className="w-4 h-4"
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
                </div> */}

                <p className="text-gray-700 mt-4 line-clamp-2">
                  {vaga.descricao}
                </p>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => onSelect(vaga)}
                    className="flex-1 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition-colors">
                    Ver Detalhes
                  </button>
                  <button
                    onClick={() => {
                      onSelect(vaga);
                      onCandidaturaEspontanea();
                    }}
                    className="flex-1 py-2 bg-white border border-yellow-400 text-yellow-400 rounded-lg hover:bg-yellow-50 transition-colors">
                    Candidatar-se
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        className="mt-8 bg-white/35 p-6 rounded-lg border-[2px] border-dashed  text-center"
        style={{
          boxShadow:
            "rgba(255, 255, 255, 0.19) 0px 10px 20px, rgba(255, 255, 255, 0.23) 0px 6px 6px",
        }}>
        <h3 className="text-lg font-semibold mb-2 text-white">
          Não encontrou o que procura?
        </h3>
        <p className="text-gray-800 mb-4">
          Envie uma candidatura espontânea e entraremos em conto quando surgir
          uma vaga adequada.
        </p>
        <button
          onClick={onCandidaturaEspontanea}
          className="px-6 py-2 bg-white border-2 border-yellow-400 text-yellow-400 rounded-lg hover:bg-yellow-50 transition-colors">
          Candidatura Espontânea
        </button>
      </div>
    </div>
  );
}
