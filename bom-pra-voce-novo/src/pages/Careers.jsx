import CandidaturaForm from "../Components/WorkWithUs/CandidaturaForm";
import { applicationReady } from "../services/applications";
import { Link } from "react-router-dom";
import Jobs from "../images/Jobs/equipe-bom-pra-voce.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartSimple, faHeart, faPeopleGroup } from "@fortawesome/free-solid-svg-icons";

const benefits = [
  { icon: faPeopleGroup, label: <>Ambiente<br />acolhedor</> },
  { icon: faChartSimple, label: <>Oportunidade<br />de crescimento</> },
  { icon: faHeart, label: <>Faça parte<br />do nosso time</> },
];

export default function Careers() {
  const ready = applicationReady();
  return <section className="careers-page" aria-labelledby="careers-page-title">
    <div className="careers-page__layout">
      <div className="careers-page__intro">
        <p className="careers-page__eyebrow">Trabalhe conosco</p>
        <h1 id="careers-page-title">Venha fazer<br />parte da<br /><mark>nossa equipe!</mark></h1>
        <p className="careers-page__lead">{ready
          ? "Preencha o formulário e envie seu currículo. Estamos sempre em busca de pessoas comprometidas e que queiram crescer com a gente."
          : "Estamos sempre em busca de pessoas comprometidas e que queiram crescer com a gente. O envio de currículos pelo site será liberado assim que o canal seguro estiver disponível."}</p>
        <ul className="careers-page__benefits" aria-label="Benefícios de trabalhar conosco">
          {benefits.map(({ icon, label }, index) => <li key={index}><span><FontAwesomeIcon icon={icon} aria-hidden="true" /></span>{label}</li>)}
        </ul>
        <img className="careers-page__people" src={Jobs} alt="Integrantes da equipe Bom Pra Você" />
      </div>
      {ready ? <CandidaturaForm /> : <div className="application-card application-card--unavailable">
        <header className="application-card__header"><span aria-hidden="true">!</span><div>
          <h2>Envio de currículos indisponível no momento</h2>
          <p>O recebimento pelo site ainda não está disponível.</p>
        </div></header>
        <p>Nenhum arquivo ou dado pessoal é coletado enquanto o serviço estiver indisponível. Consulte as orientações de privacidade antes de retornar.</p>
        <Link className="application-submit" to="/privacidade">Informações de privacidade</Link>
      </div>}
    </div>
  </section>;
}
