export default function SeasonalIdentity({ theme }) {
  if (!theme) return null;
  if (theme.institutional) return <aside className="seasonal-awareness" aria-label={`Comunicação institucional: ${theme.label}`}>
    <img src={theme.mobile} alt="" width="48" height="48" decoding="async" />
    <div><strong>{theme.label}</strong><p>Informação e cuidado, o ano inteiro.</p></div>
    {theme.key === "outubro-rosa" && <a href="https://www.gov.br/inca/pt-br/assuntos/eventos/outubro-rosa-2026" target="_blank" rel="noopener noreferrer">Conheça a campanha <span className="sr-only">no INCA (nova aba)</span><span aria-hidden="true">↗</span></a>}
  </aside>;
  return <picture className="seasonal-decoration"><source media="(max-width: 700px)" srcSet={theme.mobile} /><img src={theme.desktop} alt="" width="144" height="144" decoding="async" /></picture>;
}


