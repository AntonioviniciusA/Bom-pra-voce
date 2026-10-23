import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faLeaf } from "@fortawesome/free-solid-svg-icons";
import AboutImage from "../../images/sobre-loja-v2.png";
import "./About.css";
export default function About() {
  return <section id="sobre" className="about-showcase" aria-labelledby="about-title">
    <div className="about-showcase__inner">
      <div className="about-showcase__content">
        <p className="about-showcase__eyebrow">Sobre nós</p>
        <h2 id="about-title">Sobre o Bom Pra Você Supermercado</h2>
        <p>O Bom Pra Você Supermercado nasceu com o objetivo de oferecer produtos de qualidade, bons preços e um atendimento próximo e humano.</p>
        <p>Queremos fazer parte da rotina das famílias, com um ambiente acolhedor e setores completos para as compras do dia a dia.</p>
        <div className="about-showcase__actions"><a className="about-showcase__primary" href="#setores">Conheça nossos setores <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" /></a>
          <a className="about-showcase__secondary" href="#promocoes">Ver ofertas da semana</a></div>
      </div>
      <div className="about-showcase__visual">
        <img className="about-showcase__image" src={AboutImage} alt="Ilustração de hortifrúti com frutas e verduras frescas" width="1774" height="887" loading="lazy" decoding="async" />
        <div className="about-showcase__badge">
          <span className="about-showcase__badge-icon" aria-hidden="true"><FontAwesomeIcon icon={faLeaf} /></span>
          <div><strong>Qualidade todos os dias</strong><span>Do campo para a sua mesa</span></div>
        </div>
      </div>
    </div>
  </section>;
}
