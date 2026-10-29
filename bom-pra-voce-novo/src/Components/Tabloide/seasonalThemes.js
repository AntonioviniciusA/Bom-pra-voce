import t0_celular from "../../images/offer-themes/padrao/padrao-celular.webp";
import t0_notebook from "../../images/offer-themes/padrao/padrao-notebook.webp";
import t0_miniatura from "../../images/offer-themes/padrao/padrao-miniatura.webp";
import t1_celular from "../../images/offer-themes/verao/verao-celular.webp";
import t1_notebook from "../../images/offer-themes/verao/verao-notebook.webp";
import t1_miniatura from "../../images/offer-themes/verao/verao-miniatura.webp";
import t2_celular from "../../images/offer-themes/volta-a-rotina/volta-a-rotina-celular.webp";
import t2_notebook from "../../images/offer-themes/volta-a-rotina/volta-a-rotina-notebook.webp";
import t2_miniatura from "../../images/offer-themes/volta-a-rotina/volta-a-rotina-miniatura.webp";
import t3_celular from "../../images/offer-themes/carnaval/carnaval-celular.webp";
import t3_notebook from "../../images/offer-themes/carnaval/carnaval-notebook.webp";
import t3_miniatura from "../../images/offer-themes/carnaval/carnaval-miniatura.webp";
import t4_celular from "../../images/offer-themes/volta-as-aulas/volta-as-aulas-celular.webp";
import t4_notebook from "../../images/offer-themes/volta-as-aulas/volta-as-aulas-notebook.webp";
import t4_miniatura from "../../images/offer-themes/volta-as-aulas/volta-as-aulas-miniatura.webp";
import t5_celular from "../../images/offer-themes/consumidor/consumidor-celular.webp";
import t5_notebook from "../../images/offer-themes/consumidor/consumidor-notebook.webp";
import t5_miniatura from "../../images/offer-themes/consumidor/consumidor-miniatura.webp";
import t6_celular from "../../images/offer-themes/pascoa/pascoa-celular.webp";
import t6_notebook from "../../images/offer-themes/pascoa/pascoa-notebook.webp";
import t6_miniatura from "../../images/offer-themes/pascoa/pascoa-miniatura.webp";
import t7_celular from "../../images/offer-themes/maes/maes-celular.webp";
import t7_notebook from "../../images/offer-themes/maes/maes-notebook.webp";
import t7_miniatura from "../../images/offer-themes/maes/maes-miniatura.webp";
import t8_celular from "../../images/offer-themes/festa-junina/festa-junina-celular.webp";
import t8_notebook from "../../images/offer-themes/festa-junina/festa-junina-notebook.webp";
import t8_miniatura from "../../images/offer-themes/festa-junina/festa-junina-miniatura.webp";
import t9_celular from "../../images/offer-themes/namorados/namorados-celular.webp";
import t9_notebook from "../../images/offer-themes/namorados/namorados-notebook.webp";
import t9_miniatura from "../../images/offer-themes/namorados/namorados-miniatura.webp";
import t10_celular from "../../images/offer-themes/ferias/ferias-celular.webp";
import t10_notebook from "../../images/offer-themes/ferias/ferias-notebook.webp";
import t10_miniatura from "../../images/offer-themes/ferias/ferias-miniatura.webp";
import t11_celular from "../../images/offer-themes/inverno/inverno-celular.webp";
import t11_notebook from "../../images/offer-themes/inverno/inverno-notebook.webp";
import t11_miniatura from "../../images/offer-themes/inverno/inverno-miniatura.webp";
import t12_celular from "../../images/offer-themes/pais/pais-celular.webp";
import t12_notebook from "../../images/offer-themes/pais/pais-notebook.webp";
import t12_miniatura from "../../images/offer-themes/pais/pais-miniatura.webp";
import t13_celular from "../../images/offer-themes/primavera/primavera-celular.webp";
import t13_notebook from "../../images/offer-themes/primavera/primavera-notebook.webp";
import t13_miniatura from "../../images/offer-themes/primavera/primavera-miniatura.webp";
import t14_celular from "../../images/offer-themes/setembro-amarelo/setembro-amarelo-celular.webp";
import t14_notebook from "../../images/offer-themes/setembro-amarelo/setembro-amarelo-notebook.webp";
import t14_miniatura from "../../images/offer-themes/setembro-amarelo/setembro-amarelo-miniatura.webp";
import t15_celular from "../../images/offer-themes/criancas/criancas-celular.webp";
import t15_notebook from "../../images/offer-themes/criancas/criancas-notebook.webp";
import t15_miniatura from "../../images/offer-themes/criancas/criancas-miniatura.webp";
import t16_celular from "../../images/offer-themes/outubro-rosa/outubro-rosa-celular.webp";
import t16_notebook from "../../images/offer-themes/outubro-rosa/outubro-rosa-notebook.webp";
import t16_miniatura from "../../images/offer-themes/outubro-rosa/outubro-rosa-miniatura.webp";
import t17_celular from "../../images/offer-themes/black-friday/black-friday-celular.webp";
import t17_notebook from "../../images/offer-themes/black-friday/black-friday-notebook.webp";
import t17_miniatura from "../../images/offer-themes/black-friday/black-friday-miniatura.webp";
import t18_celular from "../../images/offer-themes/natal/natal-celular.webp";
import t18_notebook from "../../images/offer-themes/natal/natal-notebook.webp";
import t18_miniatura from "../../images/offer-themes/natal/natal-miniatura.webp";
import t19_celular from "../../images/offer-themes/ano-novo/ano-novo-celular.webp";
import t19_notebook from "../../images/offer-themes/ano-novo/ano-novo-notebook.webp";
import t19_miniatura from "../../images/offer-themes/ano-novo/ano-novo-miniatura.webp";
import t20_celular from "../../images/offer-themes/aniversario-loja/aniversario-loja-celular.webp";
import t20_notebook from "../../images/offer-themes/aniversario-loja/aniversario-loja-notebook.webp";
import t20_miniatura from "../../images/offer-themes/aniversario-loja/aniversario-loja-miniatura.webp";

// Explicit selection only: the calendar suggests themes, never activates campaigns.
export const seasonalThemes = [
  { key: "padrao", label: "Padrão Bom pra você", month: 0, institutional: false, mobile: t0_celular, desktop: t0_notebook, thumbnail: t0_miniatura },
  { key: "verao", label: "Verão", month: 1, institutional: false, mobile: t1_celular, desktop: t1_notebook, thumbnail: t1_miniatura },
  { key: "volta-a-rotina", label: "Volta à rotina", month: 1, institutional: false, mobile: t2_celular, desktop: t2_notebook, thumbnail: t2_miniatura },
  { key: "carnaval", label: "Carnaval", month: 2, institutional: false, mobile: t3_celular, desktop: t3_notebook, thumbnail: t3_miniatura },
  { key: "volta-as-aulas", label: "Volta às aulas", month: 2, institutional: false, mobile: t4_celular, desktop: t4_notebook, thumbnail: t4_miniatura },
  { key: "consumidor", label: "Mês do consumidor", month: 3, institutional: false, mobile: t5_celular, desktop: t5_notebook, thumbnail: t5_miniatura },
  { key: "pascoa", label: "Páscoa", month: 4, institutional: false, mobile: t6_celular, desktop: t6_notebook, thumbnail: t6_miniatura },
  { key: "maes", label: "Dia das Mães", month: 5, institutional: false, mobile: t7_celular, desktop: t7_notebook, thumbnail: t7_miniatura },
  { key: "festa-junina", label: "Festa junina", month: 6, institutional: false, mobile: t8_celular, desktop: t8_notebook, thumbnail: t8_miniatura },
  { key: "namorados", label: "Dia dos Namorados", month: 6, institutional: false, mobile: t9_celular, desktop: t9_notebook, thumbnail: t9_miniatura },
  { key: "ferias", label: "Férias", month: 7, institutional: false, mobile: t10_celular, desktop: t10_notebook, thumbnail: t10_miniatura },
  { key: "inverno", label: "Inverno", month: 7, institutional: false, mobile: t11_celular, desktop: t11_notebook, thumbnail: t11_miniatura },
  { key: "pais", label: "Dia dos Pais", month: 8, institutional: false, mobile: t12_celular, desktop: t12_notebook, thumbnail: t12_miniatura },
  { key: "primavera", label: "Primavera", month: 9, institutional: false, mobile: t13_celular, desktop: t13_notebook, thumbnail: t13_miniatura },
  { key: "setembro-amarelo", label: "Setembro Amarelo", month: 9, institutional: true, mobile: t14_celular, desktop: t14_notebook, thumbnail: t14_miniatura },
  { key: "criancas", label: "Dia das Crianças", month: 10, institutional: false, mobile: t15_celular, desktop: t15_notebook, thumbnail: t15_miniatura },
  { key: "outubro-rosa", label: "Outubro Rosa", month: 10, institutional: true, mobile: t16_celular, desktop: t16_notebook, thumbnail: t16_miniatura },
  { key: "black-friday", label: "Black Friday", month: 11, institutional: false, mobile: t17_celular, desktop: t17_notebook, thumbnail: t17_miniatura },
  { key: "natal", label: "Natal", month: 12, institutional: false, mobile: t18_celular, desktop: t18_notebook, thumbnail: t18_miniatura },
  { key: "ano-novo", label: "Ano-Novo", month: 12, institutional: false, mobile: t19_celular, desktop: t19_notebook, thumbnail: t19_miniatura },
  { key: "aniversario-loja", label: "Aniversário da loja", month: 0, institutional: false, mobile: t20_celular, desktop: t20_notebook, thumbnail: t20_miniatura },
];
const byKey = new Map(seasonalThemes.map(theme => [theme.key, theme]));
export const seasonalTheme = key => byKey.get(key) || null;
