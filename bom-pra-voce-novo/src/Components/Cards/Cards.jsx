import Hortifrut from "../../images/Setores/Hortifrut.webp";
import Bebidas from "../../images/Setores/Bebidas.webp";
import Padaria from "../../images/Setores/Padaria.webp";
import Adega from "../../images/Setores/Adega.webp";
import Freezer from "../../images/Setores/Freezer.webp";
const sectors = [
  { name: "Bebidas", image: Bebidas },
  { name: "Hortifrúti", image: Hortifrut },
  { name: "Padaria", image: Padaria },
  { name: "Adega", image: Adega },
  { name: "Congelados", image: Freezer },
];
export default function Cards() {
  return <section id="setores" className="sectors-showcase" aria-labelledby="sectors-title">
    <div className="sectors-showcase__inner"><h2 id="sectors-title" className="section-title">Conheça nossos setores</h2>
      <p className="sectors-showcase__intro">Tudo o que você precisa, em um só lugar, com qualidade e bom preço.</p>
      <ul className="photo-sectors">{sectors.map(sector =>
        <li key={sector.name}><img src={sector.image} alt="" loading="lazy" />
          <h3>{sector.name}</h3><span aria-hidden="true" /></li>)}</ul>
    </div>
  </section>;
}
