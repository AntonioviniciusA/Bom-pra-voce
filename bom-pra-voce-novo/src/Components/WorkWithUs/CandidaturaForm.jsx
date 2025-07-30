import { useState } from "react";

export default function CandidaturaForm({ vaga, onBack, onSubmit }) {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    linkedin: "",
    experiencia: "",
    motivacao: "",
    arquivo: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, arquivo: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

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
        Voltar
      </button>

      {vaga && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <svg
              className="h-5 w-5 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <div>
              <p className="font-medium text-yellow-900">Candidatura para:</p>
              <p className="text-yellow-700">{vaga.titulo}</p>
            </div>
          </div>
        </div>
      )}

      <div
        className="bg-white/35 border-[2px] rounded-lg p-6"
        style={{
          boxShadow:
            "rgba(255, 255, 255, 0.19) 0px 10px 20px, rgba(255, 255, 255, 0.23) 0px 6px 6px",
        }}>
        <h2 className="text-2xl font-bold mb-2">
          {vaga ? `Candidatar-se: ${vaga.titulo}` : "Candidatura Espontânea"}
        </h2>
        <p className="text-gray-600 mb-6">
          Preencha os dados abaixo para enviar sua candidatura
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="nome"
                className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo *
              </label>
              <input
                id="nome"
                name="nome"
                type="text"
                value={formData.nome}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1">
                E-mail *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="telefone"
                className="block text-sm font-medium text-gray-700 mb-1">
                Telefone *
              </label>
              <input
                id="telefone"
                name="telefone"
                type="tel"
                value={formData.telefone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                required
              />
            </div>

            {/* <div>
              <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn
              </label>
              <input
                id="linkedin"
                name="linkedin"
                type="url"
                value={formData.linkedin}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="https://linkedin.com/in/seuperfil"
              />
            </div> */}
          </div>

          <div>
            <label
              htmlFor="experiencia"
              className="block text-sm font-medium text-gray-700 mb-1">
              Experiência Profissional *
            </label>
            <textarea
              id="experiencia"
              name="experiencia"
              value={formData.experiencia}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
              required></textarea>
          </div>

          <div>
            <label
              htmlFor="motivacao"
              className="block text-sm font-medium text-gray-700 mb-1">
              {vaga
                ? "Por que você se interessa por esta vaga?"
                : "Por que quer trabalhar conosco?"}{" "}
              *
            </label>
            <textarea
              id="motivacao"
              name="motivacao"
              value={formData.motivacao}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
              required></textarea>
          </div>

          <div>
            <label
              htmlFor="arquivo"
              className="block text-sm font-medium text-gray-700 mb-1">
              Currículo (PDF) *
            </label>
            <div className="flex items-center gap-2">
              <input
                id="arquivo"
                name="arquivo"
                type="file"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-yellow-50 file:text-yellow-700
                  hover:file:bg-yellow-100"
                accept=".pdf,.doc,.docx"
                required
              />
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Formatos aceitos: PDF, DOC, DOCX (máx. 5MB)
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 px-6 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
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
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-bold">
              Enviar Candidatura
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
