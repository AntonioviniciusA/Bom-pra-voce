"use client";

import React, { useState } from "react";
import VagasList from "./VagasList";
import VagaDetalhes from "./VagaDetalhes";
import CandidaturaForm from "./CandidaturaForm";

const vagasDisponiveis = [
  {
    id: 1,
    titulo: "Atendente de Loja",
    departamento: "Vendas",
    localizacao: "Rio de Janeiro, RJ",
    tipo: "CLT",
    descricao:
      "Responsável pelo atendimento ao cliente, organização da loja e reposição de produtos.",
    requisitos: [
      "Ensino médio completo",
      "Boa comunicação",
      "Disponibilidade para finais de semana",
    ],
    beneficios: [
      "Vale transporte",
      "Vale refeição",
      "Desconto em produtos da loja",
    ],
  },
  {
    id: 2,
    titulo: "Repositor de Mercadorias",
    departamento: "Estoque",
    localizacao: "Belo Horizonte, MG",
    tipo: "CLT",
    descricao:
      "Auxiliar na organização das prateleiras e reposição de mercadorias.",
    requisitos: [
      "Ensino fundamental completo",
      "Organização e agilidade",
      "Disponibilidade de horário",
    ],
    beneficios: ["Vale transporte", "Assistência médica", "Cesta básica"],
  },
  {
    id: 3,
    titulo: "Operador de Caixa",
    departamento: "Financeiro",
    localizacao: "Curitiba, PR",
    tipo: "CLT",
    descricao:
      "Realizar atendimento ao cliente e operação de caixa em supermercado.",
    requisitos: [
      "Ensino médio completo",
      "Experiência com caixa será um diferencial",
      "Pontualidade e responsabilidade",
    ],
    beneficios: ["Plano de saúde", "Vale alimentação", "Bonificação por metas"],
  },
  {
    id: 4,
    titulo: "Auxiliar de Limpeza",
    departamento: "Serviços Gerais",
    localizacao: "Fortaleza, CE",
    tipo: "CLT",
    descricao: "Responsável pela limpeza e conservação dos ambientes da loja.",
    requisitos: ["Ensino fundamental", "Experiência na função", "Proatividade"],
    beneficios: ["Vale transporte", "Vale refeição", "Convênio odontológico"],
  },
];

export default function TrabalheConosco() {
  const [selectedVaga, setSelectedVaga] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [view, setView] = useState("inicial"); // "inicial", "vagas", "detalhes", "form"

  const handleOpenDetails = (vaga) => {
    setSelectedVaga(vaga);
    setView("detalhes");
  };

  const handleOpenForm = (vaga = null) => {
    setSelectedVaga(vaga);
    setView("form");
  };

  const handleBack = () => {
    if (view === "detalhes") setView("vagas");
    else if (view === "form" && selectedVaga) setView("detalhes");
    else if (view === "form") setView("vagas");
    else setView("inicial");
  };

  return (
    <div
      className="flex flex-col lg:flex-row items-center justify-center lg:w-full bg-yellow-400 p-8 rounded-3xl"
      style={{
        boxShadow:
          "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
      }}>
      <div className="p-4 w-full max-w-6xl">
        {view === "inicial" && (
          <div className="text-center">
            <div className="flex items-center flex-col mb-8 text-center">
              <h1 className="text-4xl font-extrabold text-white">
                Trabalhe Conosco
              </h1>
              <p className="text-lg font-bold mt-2 text-white">
                Faça parte de uma equipe inovadora e apaixonada por tecnologia
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="h-16 w-16 mx-auto mb-4 text-yellow-600">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Ambiente Colaborativo
                </h3>
                <p className="text-gray-600">
                  Trabalhe com profissionais talentosos em um ambiente dinâmico
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="h-16 w-16 mx-auto mb-4 text-green-600">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Crescimento Profissional
                </h3>
                <p className="text-gray-600">
                  Oportunidades de desenvolvimento e progressão na carreira
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setView("vagas")}
                className="px-8 py-3 bg-yellow-600 text-white font-bold rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-2"
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
                Ver Vagas
              </button>

              <button
                onClick={() => handleOpenForm()}
                className="px-8 py-3 bg-white border-2 border-yellow-600 text-yellow-600 font-bold rounded-lg hover:bg-yellow-50 transition-colors">
                Candidatura Espontânea
              </button>
            </div>
          </div>
        )}

        {view === "vagas" && (
          <VagasList
            vagas={vagasDisponiveis}
            onSelect={handleOpenDetails}
            onCandidaturaEspontanea={() => handleOpenForm()}
            onBack={handleBack}
          />
        )}

        {view === "detalhes" && selectedVaga && (
          <VagaDetalhes
            vaga={selectedVaga}
            onBack={handleBack}
            onCandidatar={() => handleOpenForm(selectedVaga)}
          />
        )}

        {view === "form" && (
          <CandidaturaForm
            vaga={selectedVaga}
            onBack={handleBack}
            onSubmit={(formData) => {
              console.log("Formulário enviado:", {
                ...formData,
                vagaId: selectedVaga?.id || null,
              });
              alert("Candidatura enviada com sucesso!");
              setView(selectedVaga ? "detalhes" : "vagas");
            }}
          />
        )}
      </div>
    </div>
  );
}
