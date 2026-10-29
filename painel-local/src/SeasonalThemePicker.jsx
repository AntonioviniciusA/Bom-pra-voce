import { seasonalThemes, seasonalTheme } from "../../bom-pra-voce-novo/src/Components/Tabloide/seasonalThemes";
export default function SeasonalThemePicker({value,onChange}) {
  const selected=seasonalTheme(value);
  return <fieldset className="wide visual-picker seasonal-picker"><legend>Decoração sazonal</legend><p className="field-help">Escolha a decoração e confira a prévia. A mudança só é enviada ao salvar; os meses não ativam temas automaticamente.</p><div>{seasonalThemes.map(theme=><button type="button" key={theme.key} aria-pressed={value===theme.key} onClick={()=>onChange(theme.key)}><img src={theme.thumbnail} width="48" height="48" alt="" loading="lazy"/><span>{theme.label}</span></button>)}</div>{selected?.institutional && <p className="field-help" role="status">Mensagem institucional separada das ofertas, sem associar o laço a preços ou descontos.</p>}</fieldset>;
}
