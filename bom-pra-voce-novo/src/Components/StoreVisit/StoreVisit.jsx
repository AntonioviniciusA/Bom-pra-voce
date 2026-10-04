import { CalendarDays, Clock3, Info, Map, MapPin, ExternalLink } from "lucide-react";
import { storeConfig } from "../../Data/storeConfig";
import PaymentMethods from "../PaymentMethods/PaymentMethods";
import "./StoreVisit.css";

export default function StoreVisit() {
  return <section id="localizacao" className="section store-visit" aria-labelledby="visit-title">
    <div className="shell visit-shell">
      <div className="visit-heading">
        <p className="eyebrow">PLANEJE SUA VISITA</p>
        <h2 id="visit-title">Como chegar e quando visitar</h2>
        <p className="visit-intro">Confira nossa localização e os horários de atendimento<br className="visit-desktop-break" /> para planejar sua visita à loja.</p>
      </div>
      <div className="visit-grid">
        <article className="visit-card visit-location">
          <div className="visit-card-heading">
            <span className="visit-icon"><MapPin aria-hidden="true" /></span>
            <div><h3>Localização</h3>
              {storeConfig.address ? <address>{storeConfig.address}</address> : <p>O endereço será disponibilizado após confirmação pela loja.</p>}
            </div>
          </div>
          {storeConfig.address && <div className="visit-map">
            <iframe title="Localização do supermercado Bom Pra Você" src={`https://maps.google.com/maps?q=${encodeURIComponent(`${storeConfig.name} Supermercado ${storeConfig.address}`)}&z=16&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            {storeConfig.mapsUrl && <a className="visit-map-link" href={storeConfig.mapsUrl} target="_blank" rel="noopener noreferrer"><Map size={22} aria-hidden="true" />Ver no Google Maps<ExternalLink size={19} aria-hidden="true" /><span className="sr-only"> (nova aba)</span></a>}
          </div>}
          {!storeConfig.address && storeConfig.mapsUrl && <a href={storeConfig.mapsUrl} target="_blank" rel="noopener noreferrer">Ver no Google Maps (nova aba)</a>}
        </article>
        <article className="visit-card visit-schedule">
          <div className="visit-card-heading"><span className="visit-icon"><Clock3 aria-hidden="true" /></span><h3>Horários de atendimento</h3></div>
          {storeConfig.hours.length ? <dl className="visit-hours">{storeConfig.hours.map(row => <div key={row.day}><dt><CalendarDays size={25} aria-hidden="true" />{row.day}</dt><dd>{row.time.replace("–", " – ")}</dd></div>)}</dl> : <p>Os horários de funcionamento estão em atualização.</p>}
          <p className="visit-holiday"><Info size={26} aria-hidden="true" /><span>{storeConfig.holidayHours || "Domingos e feriados: consulte a loja antes de sair."}</span></p>
        </article>
      </div>
      <PaymentMethods />
    </div>
  </section>;
}
