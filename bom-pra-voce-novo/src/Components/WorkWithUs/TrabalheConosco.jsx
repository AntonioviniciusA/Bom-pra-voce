import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faChartSimple, faHeart, faPeopleGroup } from "@fortawesome/free-solid-svg-icons";
import Jobs from "../../images/Jobs/equipe-bom-pra-voce.png";

const benefits = [
  { icon: faPeopleGroup, label: <>Ambiente<br />acolhedor</> },
  { icon: faChartSimple, label: <>Oportunidade<br />de crescimento</> },
  { icon: faHeart, label: <>Faça parte<br />do nosso time</> },
];

export default function TrabalheConosco() {
  return <section id="trabalhe-conosco" className="careers-spotlight" aria-labelledby="careers-title">
    <div className="careers-spotlight__inner">
      <div className="careers-spotlight__visual">
        <span className="careers-spotlight__accent" aria-hidden="true"><i /><i /><i /></span>
        <img src={Jobs} alt="Dois integrantes da equipe Bom Pra Você sorrindo" loading="lazy" />
      </div>
      <div className="careers-spotlight__content">
        <h2 id="careers-title">Venha fazer parte<br />da <mark>nossa equipe!</mark></h2>
        <p>Quer trabalhar no Bom Pra Você? Confira as orientações e a disponibilidade para enviar seu currículo.</p>
        <Link className="careers-spotlight__button" to="/trabalhe-conosco">
          Trabalhe conosco <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
        </Link>
        <ul className="careers-benefits" aria-label="Benefícios de trabalhar conosco">
          {benefits.map(({ icon, label }, index) => <li key={index}>
            <span className="careers-benefits__icon"><FontAwesomeIcon icon={icon} aria-hidden="true" /></span>
            <span>{label}</span>
          </li>)}
        </ul>
      </div>
    </div>
  </section>;
}
