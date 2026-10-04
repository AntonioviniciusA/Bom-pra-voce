import { useEffect, useState } from "react";
import { Baby, CalendarDays, Droplets, ExternalLink, PackageOpen, Percent, ShoppingCart, Snowflake, Sparkles, Star, Tag } from "lucide-react";
import usePromotions from "../../hooks/usePromotions";

const dateFormat = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeZone: "America/Sao_Paulo" });
const categoryMeta = {
  "meat-frozen": { label: "Açougue e congelados", icon: Snowflake },
  "home-baby": { label: "Utilidades e bebê", icon: Baby },
  "grocery-drinks": { label: "Mercearia e bebidas", icon: ShoppingCart },
  "cleaning-beauty": { label: "Limpeza e beleza", icon: Droplets },
  other: { label: "Outras ofertas", icon: PackageOpen },
};
const inferCategory = campaign => {
  if (campaign.category_key && campaign.category_key !== "other") return campaign.category_key;
  const title = campaign.title.toLocaleLowerCase("pt-BR");
  if (title.includes("açougue") || title.includes("congelado")) return "meat-frozen";
  if (title.includes("bebê") || title.includes("utilidade")) return "home-baby";
  if (title.includes("mercearia") || title.includes("bebida")) return "grocery-drinks";
  if (title.includes("limpeza") || title.includes("higiene") || title.includes("beleza")) return "cleaning-beauty";
  return "other";
};

export default function Tabloide() {
  const { status, campaigns, reload } = usePromotions();
  const [active, setActive] = useState(0);
  useEffect(() => { setActive(current => Math.min(current, Math.max(0, campaigns.length - 1))); }, [campaigns.length]);

  const select = index => {
    if (!campaigns.length) return;
    setActive((index + campaigns.length) % campaigns.length);
  };
  const onKeyDown = event => {
    if (event.key === "ArrowLeft") { event.preventDefault(); select(active - 1); }
    if (event.key === "ArrowRight") { event.preventDefault(); select(active + 1); }
    if (event.key === "Home") { event.preventDefault(); select(0); }
    if (event.key === "End") { event.preventDefault(); select(campaigns.length - 1); }
  };
  const item = campaigns[active];

  return <section id="promocoes" className="offers-showcase" aria-labelledby="offers-title">
    <div className="offers-showcase__shell">
      {status === "loading" && <p role="status" className="notice">Consultando ofertas…</p>}
      {status === "unavailable" && <div className="notice"><h3>Panfletos indisponíveis no momento</h3><p>Volte mais tarde para conferir as promoções da loja.</p></div>}
      {status === "error" && <div className="notice" role="alert"><h3>Não conseguimos consultar as ofertas</h3><p>Verifique a conexão e tente novamente.</p><button type="button" className="button button-outline" onClick={reload}>Tentar novamente</button></div>}
      {status === "ready" && !campaigns.length && <p className="notice" role="status">Nenhum panfleto vigente disponível no momento.</p>}
      {item && <div className="offers-stage" role="region" aria-roledescription="carrossel" aria-label="Panfletos vigentes" onKeyDown={onKeyDown}>
        <p className="sr-only" aria-live="polite">Panfleto {active + 1} de {campaigns.length}: {item.title}</p>
        <div className="offers-intro">
          <span className="offers-intro__badge"><Tag size={20} aria-hidden="true" /> Ofertas</span>
          <h2 id="offers-title">Ofertas da loja</h2>
          <p className="offers-intro__lead">Qualidade e economia para o seu final de semana!</p>
          <ul className="offers-benefits">
            <li><span><ShoppingCart aria-hidden="true" /></span><div><strong>Produtos fresquinhos</strong><small>Açougue, mercearia e muito mais</small></div></li>
            <li><span><Percent aria-hidden="true" /></span><div><strong>Preços especiais</strong><small>Economia de verdade</small></div></li>
            <li><span><Star aria-hidden="true" /></span><div><strong>Qualidade que você confia</strong><small>As melhores marcas para sua família</small></div></li>
          </ul>
        </div>

        <a id="offers-active-flyer" className="offers-flyer" href={item.file_url} target="_blank" rel="noopener noreferrer" aria-label={`Ver panfleto completo: ${item.title} (nova aba)`}>
          {item.mime_type.startsWith("image/")
            ? <img key={item.id} src={item.file_url} alt={`Panfleto ${item.title}`} loading={active === 0 ? "eager" : "lazy"} decoding="async" />
            : <div className="offers-flyer__pdf"><strong>Panfleto em PDF</strong><span>Abra para visualizar o conteúdo completo.</span></div>}
        </a>

        <article className="offers-details">
          <p className="offers-details__date"><CalendarDays size={20} aria-hidden="true" /> Válido de <time dateTime={item.starts_at}>{dateFormat.format(item.starts)}</time> a <time dateTime={item.ends_at}>{dateFormat.format(item.ends - 1)}</time></p>
          <h3>Ofertas de<br />final de semana</h3>
          <span className="offers-details__stroke" aria-hidden="true" />
          <p>{item.summary} Qualidade e economia para a sua família!</p>
          <a className="offers-details__cta" href={item.file_url} target="_blank" rel="noopener noreferrer">Ver panfleto completo <ExternalLink size={20} aria-hidden="true" /></a>
          <p className="offers-details__conditions"><Sparkles size={18} aria-hidden="true" /> {item.conditions}</p>
        </article>

        {campaigns.length > 1 && <div className="offers-hud" role="tablist" aria-label="Escolha o setor do panfleto">
          {campaigns.map((campaign, index) => {
            const meta = categoryMeta[inferCategory(campaign)];
            const Icon = meta.icon;
            return <button key={campaign.id} type="button" role="tab" aria-selected={index === active} aria-controls="offers-active-flyer" className={index === active ? "is-active" : ""} onClick={() => select(index)}>
              <Icon size={22} aria-hidden="true" /><span>{meta.label}</span>
            </button>;
          })}
        </div>}
      </div>}
    </div>
  </section>;
}
