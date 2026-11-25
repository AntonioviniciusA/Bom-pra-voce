// Initial, non-exhaustive suggestions. See docs/candidaturas-localidades.md.
// DF uses administrative regions; sectors/districts are accepted as neighborhoods.
const df = {
  "Água Quente": ["Setor Habitacional Água Quente"], "Águas Claras": ["Águas Claras Vertical"],
  "Arapoanga": ["Nossa Senhora de Fátima", "Morada Nobre"], "Arniqueira": ["Areal", "ADE", "Vereda da Cruz"],
  "Brazlândia": ["Setor Tradicional", "Setor Sul", "Setor Norte", "Setor Veredas", "Vila São José", "INCRA 8"], "Candangolândia": [],
  "Ceilândia": ["Ceilândia Norte", "Ceilândia Sul", "Guariroba", "Setor O", "Setor P Norte", "Setor P Sul"],
  "Cruzeiro": ["Cruzeiro Novo", "Cruzeiro Velho"], "Fercal": ["Fercal Leste", "Fercal Oeste", "Queima Lençol", "Engenho Velho"],
  "Gama": ["Setor Norte", "Setor Sul", "Setor Leste", "Setor Oeste"],
  "Guará": ["Guará I", "Guará II", "Lúcio Costa"], "Itapoã": ["Fazendinha", "Del Lago", "Condomínio Entrelagos"],
  "Jardim Botânico": ["Solar de Brasília", "Ouro Vermelho I", "Ouro Vermelho II", "Quintas do Sol", "Ville de Montagne"],
  "Lago Norte": ["Taquari", "Granja do Torto", "Setor de Mansões Lago Norte"], "Lago Sul": ["Setor Habitacional Individual Sul"], "Núcleo Bandeirante": [], "Paranoá": [], "Park Way": [],
  "Planaltina": ["Setor Tradicional"], "Plano Piloto": ["Asa Norte", "Asa Sul"], "Recanto das Emas": [],
  "Riacho Fundo": [], "Riacho Fundo II": [], "Samambaia": ["Samambaia Norte", "Samambaia Sul"],
  "Santa Maria": ["Santa Maria Central", "Santa Maria Norte", "Santa Maria Sul", "Vila DVO", "Residencial Santos Dumont", "Residencial Total Ville"],
  "São Sebastião": ["Bela Vista", "Bom Sucesso", "Central", "João Cândido", "Residencial do Bosque", "Residencial Oeste", "São Bartolomeu", "São Francisco", "São José", "Tradicional", "Vila Nova"],
  "SCIA / Estrutural": ["Vila Estrutural", "Cidade do Automóvel"], "SIA": ["SAAN", "SOFN", "STRC"], "Sobradinho": ["Nova Colina", "Condomínio RK"], "Sobradinho II": ["Lago Oeste", "Grande Colorado"],
  "Sol Nascente / Pôr do Sol": ["Sol Nascente", "Pôr do Sol"],
  "Sudoeste / Octogonal": ["Sudoeste", "Octogonal"],
  "Taguatinga": ["Taguatinga Norte", "Taguatinga Sul"], "Varjão": [], "Vicente Pires": [],
};
const entorno = {
  "Águas Lindas de Goiás": ["Jardim Barragem"],
  "Cidade Ocidental": ["Jardim ABC de Goiás", "Parque Nova Friburgo", "Ocidental Park"],
  "Cocalzinho de Goiás": ["Girassol"], "Cristalina": ["Mansões Marajó"],
  "Formosa": ["Setor Nordeste", "Parque Lago", "Lagoa dos Santos", "Vila Vicentina"],
  "Luziânia": ["Jardim Ingá"],
  "Novo Gama": ["Pedregal", "Jardim Lago Azul", "Setor Central", "Boa Vista", "Vale do Pedregal"],
  "Padre Bernardo": ["Monte Alto"], "Planaltina": ["Setor Norte", "São José", "Paquetá"],
  "Santo Antônio do Descoberto": [],
  "Valparaíso de Goiás": ["Jardim Céu Azul", "Jardim Oriente", "Morada Nobre", "Parque Marajó", "Cruzeiro do Sul", "Valparaíso I"],
};
export const locationGroups = [
  { label: "Distrito Federal", state: "DF", locations: df },
  { label: "Entorno — Goiás", state: "GO", locations: entorno },
].map(group => ({ ...group, cities: Object.entries(group.locations)
  .sort(([a], [b]) => a.localeCompare(b, "pt-BR"))
  .map(([name, neighborhoods]) => ({ name, value: `${name} - ${group.state}`, neighborhoods: [...neighborhoods].sort((a, b) => a.localeCompare(b, "pt-BR")) })) }));

export const applicationLocations = locationGroups.flatMap(group => group.cities);
