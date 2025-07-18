import Fachada from "../images/SupermarketAreasImages/Facade.png";

const supermarketAreas = {
  facade: {
    id: "entrance",
    name: "Entrada Principal",
    description: "Área de entrada do supermercado",
    image: Fachada,
    position: { x: 20, y: 50 },
    connections: ["produce", "bakery", "dairy"],
    hotspots: [
      { x: 70, y: 40, target: "produce", label: "Hortifruti" },
      { x: 60, y: 60, target: "bakery", label: "Padaria" },
      { x: 50, y: 70, target: "dairy", label: "Laticínios" },
    ],
    info: "Bem-vindo ao nosso supermercado! Aqui você encontra tudo o que precisa.",
  },
  entrance: {
    id: "entrance",
    name: "Entrada Principal",
    description: "Área de entrada do supermercado",
    image: Fachada,
    position: { x: 20, y: 50 },
    connections: ["produce", "bakery", "dairy"],
    hotspots: [
      { x: 70, y: 40, target: "produce", label: "Hortifruti" },
      { x: 60, y: 60, target: "bakery", label: "Padaria" },
      { x: 50, y: 70, target: "dairy", label: "Laticínios" },
    ],
    info: "Bem-vindo ao nosso supermercado! Aqui você encontra tudo o que precisa.",
  },
  produce: {
    id: "produce",
    name: "Hortifruti",
    description: "Frutas, verduras e legumes frescos",
    image: "/produce-section.jpg",
    position: { x: 40, y: 30 },
    connections: ["entrance", "meat"],
    hotspots: [
      { x: 20, y: 70, target: "entrance", label: "Voltar para Entrada" },
      { x: 80, y: 50, target: "meat", label: "Açougue" },
    ],
    info: "Nossos produtos são selecionados diariamente para garantir frescor e qualidade.",
  },
  bakery: {
    id: "bakery",
    name: "Padaria",
    description: "Pães, bolos e doces frescos",
    image: "/bakery-section.jpg",
    position: { x: 35, y: 60 },
    connections: ["entrance", "frozen"],
    hotspots: [
      { x: 30, y: 30, target: "entrance", label: "Voltar para Entrada" },
      { x: 70, y: 70, target: "frozen", label: "Congelados" },
    ],
    info: "Forno a lenha e produtos artesanais feitos diariamente.",
  },
  dairy: {
    id: "dairy",
    name: "Laticínios",
    description: "Leite, queijos e derivados",
    image: "/dairy-section.jpg",
    position: { x: 25, y: 75 },
    connections: ["entrance", "beverages"],
    hotspots: [
      { x: 70, y: 30, target: "entrance", label: "Voltar para Entrada" },
      { x: 50, y: 80, target: "beverages", label: "Bebidas" },
    ],
    info: "Variedade de laticínios com opções de marcas locais e importadas.",
  },
  meat: {
    id: "meat",
    name: "Açougue",
    description: "Carnes e aves",
    image: "/meat-section.jpg",
    position: { x: 60, y: 40 },
    connections: ["produce", "seafood"],
    hotspots: [
      { x: 20, y: 50, target: "produce", label: "Voltar para Hortifruti" },
      { x: 80, y: 50, target: "seafood", label: "Peixaria" },
    ],
    info: "Cortes selecionados e preparados sob encomenda por nossos açougueiros.",
  },
  seafood: {
    id: "seafood",
    name: "Peixaria",
    description: "Peixes e frutos do mar frescos",
    image: "/seafood-section.jpg",
    position: { x: 80, y: 40 },
    connections: ["meat", "frozen"],
    hotspots: [
      { x: 20, y: 50, target: "meat", label: "Voltar para Açougue" },
      { x: 50, y: 80, target: "frozen", label: "Congelados" },
    ],
    info: "Peixes frescos entregues diariamente e frutos do mar selecionados.",
  },
  frozen: {
    id: "frozen",
    name: "Congelados",
    description: "Alimentos congelados",
    image: "/frozen-section.jpg",
    position: { x: 90, y: 70 },
    connections: ["bakery", "seafood", "beverages"],
    hotspots: [
      { x: 30, y: 30, target: "bakery", label: "Voltar para Padaria" },
      { x: 20, y: 70, target: "seafood", label: "Peixaria" },
      { x: 70, y: 70, target: "beverages", label: "Bebidas" },
    ],
    info: "Ampla seleção de congelados incluindo refeições prontas e sorvetes.",
  },
  beverages: {
    id: "beverages",
    name: "Bebidas",
    description: "Águas, sucos, refrigerantes e bebidas alcoólicas",
    image: "/beverages-section.jpg",
    position: { x: 40, y: 85 },
    connections: ["dairy", "frozen", "checkout"],
    hotspots: [
      { x: 50, y: 20, target: "dairy", label: "Voltar para Laticínios" },
      { x: 30, y: 70, target: "frozen", label: "Congelados" },
      { x: 70, y: 70, target: "checkout", label: "Caixas" },
    ],
    info: "Variedade de bebidas para todos os gostos e ocasiões.",
  },
  checkout: {
    id: "checkout",
    name: "Caixas",
    description: "Área de pagamento",
    image: "/checkout-area.jpg",
    position: { x: 80, y: 85 },
    connections: ["beverages", "entrance"],
    hotspots: [
      { x: 30, y: 50, target: "beverages", label: "Voltar para Bebidas" },
      { x: 50, y: 20, target: "entrance", label: "Saída" },
    ],
    info: "Nossos caixas estão prontos para atendê-lo com agilidade e simpatia.",
  },
};

export default supermarketAreas;
