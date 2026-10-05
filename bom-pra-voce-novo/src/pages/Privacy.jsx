import { privacyReady, storeConfig } from "../Data/storeConfig";
export default function Privacy() {
  const p = storeConfig.privacy;
  return <section className="shell section narrow"><p className="eyebrow">SEUS DADOS</p><h1>Privacidade</h1>
    {privacyReady() ? <>
      <h2>Responsável pelo tratamento</h2><p>{p.controller}</p><p>{p.controllerAddress}</p>
      <h2>Finalidade do recebimento</h2><p>{p.purpose}</p>
      <h2>Prazo de guarda</h2><p>{p.retention}</p>
      <h2>Seus direitos e contato</h2><p>{p.rights}</p><p>{p.contact}</p>
    </> : <p>O recebimento de currículos pelo site está indisponível enquanto as informações de privacidade são preparadas. Não envie dados pessoais por esta página.</p>}
  </section>;
}
