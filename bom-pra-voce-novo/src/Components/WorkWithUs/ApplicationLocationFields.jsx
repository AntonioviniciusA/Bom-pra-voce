import { useState } from "react";
import { applicationLocations, locationGroups } from "./applicationLocations";

export default function ApplicationLocationFields({ onChange, error }) {
  const [city, setCity] = useState("");
  const [customCity, setCustomCity] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [customNeighborhood, setCustomNeighborhood] = useState("");
  const neighborhoods = applicationLocations.find(item => item.value === city)?.neighborhoods || [];
  const cityName = city === "other" ? customCity.trim() : city;
  function emit(nextCity, nextNeighborhood) {
    onChange([nextCity.trim(), nextNeighborhood.trim()].filter(Boolean).join(" — "));
  }
  return <>
    <div className="form-field">
      <label htmlFor="address">Cidade / região administrativa (opcional)</label>
      <select id="address" name="city" value={city} aria-invalid={Boolean(error)} aria-describedby={error ? "address-error" : undefined} onChange={event => {
        const next = event.target.value;
        setCity(next); setCustomCity(""); setNeighborhood(""); setCustomNeighborhood("");
        emit(next === "other" ? "" : next, "");
      }}>
        <option value="">Selecione a cidade ou região</option>
        {locationGroups.map(group => <optgroup key={group.state} label={group.label}>
          {group.cities.map(item => <option key={item.value} value={item.value}>{item.value}</option>)}
        </optgroup>)}
        <option value="other">Outra cidade / região</option>
      </select>
      {city === "other" && <><label htmlFor="custom-city">Informe a cidade e UF</label>
        <input id="custom-city" maxLength={90} autoComplete="address-level2" value={customCity} onChange={event => {
          setCustomCity(event.target.value); setNeighborhood(""); setCustomNeighborhood(""); emit(event.target.value, "");
        }} /></>}
      {error && <p id="address-error" className="field-error">{error}</p>}
    </div>
    <div className="form-field">
      <label htmlFor="neighborhood">Bairro / setor (opcional)</label>
      <select id="neighborhood" name="neighborhood" value={neighborhood} disabled={!cityName} aria-describedby="neighborhood-help" onChange={event => {
        const next = event.target.value;
        setNeighborhood(next); setCustomNeighborhood(""); emit(cityName, next === "other" ? "" : next);
      }}>
        <option value="">{cityName ? "Selecione o bairro ou setor" : "Selecione primeiro a cidade"}</option>
        {neighborhoods.map(name => <option key={name} value={name}>{name}</option>)}
        <option value="other">Outro bairro / setor — informar</option>
      </select>
      <small id="neighborhood-help">{cityName && !neighborhoods.length ? "Ainda não há bairros listados para esta localidade. Escolha “Outro bairro / setor” para informar." : "Não encontrou seu bairro? Escolha “Outro bairro / setor”."}</small>
      {neighborhood === "other" && <><label htmlFor="custom-neighborhood">Informe o bairro ou setor</label>
        <input id="custom-neighborhood" maxLength={90} autoComplete="address-level3" value={customNeighborhood} onChange={event => {
          setCustomNeighborhood(event.target.value); emit(cityName, event.target.value);
        }} /></>}
    </div>
  </>;
}
