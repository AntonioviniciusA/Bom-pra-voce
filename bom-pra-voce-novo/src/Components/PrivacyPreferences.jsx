import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Cookie } from "lucide-react";
import { Link } from "react-router-dom";

const Context = createContext({ mapsAllowed: false, openPreferences: () => {} });
const KEY = "bpv-privacy-v1";
const MAX_AGE = 180 * 24 * 60 * 60 * 1000;
function readChoice() {
  try {
    const value = JSON.parse(localStorage.getItem(KEY));
    return value?.version === 1 && typeof value.maps === "boolean" &&
      value.at <= Date.now() && Date.now() - value.at < MAX_AGE ? value : null;
  } catch { return null; }
}
export const usePrivacyPreferences = () => useContext(Context);
export default function PrivacyPreferences({ children }) {
  const [choice, setChoice] = useState(readChoice);
  const [open, setOpen] = useState(false);
  const [storageFailed, setStorageFailed] = useState(false);
  const returnFocus = useRef(null);
  const panel = useRef(null);
  const visible = !choice || open;
  useEffect(() => {
    if (!visible || !panel.current) return undefined;
    const measure = () => document.documentElement.style.setProperty("--privacy-panel-height", `${panel.current?.getBoundingClientRect().height + 24 || 0}px`);
    measure();
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    observer?.observe(panel.current);
    window.addEventListener("resize", measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measure);
      document.documentElement.style.removeProperty("--privacy-panel-height");
    };
  }, [visible]);
  function save(maps) {
    const next = { version: 1, maps, at: Date.now() };
    try { localStorage.setItem(KEY, JSON.stringify(next)); setStorageFailed(false); }
    catch { setStorageFailed(true); }
    setChoice(next);
    setOpen(false);
    requestAnimationFrame(() => {
      const target = returnFocus.current?.isConnected ? returnFocus.current : document.getElementById("conteudo");
      target?.focus({ preventScroll: true });
    });
  }
  function openPreferences() {
    returnFocus.current = document.activeElement;
    setOpen(true);
    requestAnimationFrame(() => { panel.current?.focus({ preventScroll: true }); });
  }
  return <Context.Provider value={{ mapsAllowed: choice?.maps === true, openPreferences }}>
    {children}
    {visible && <section ref={panel} tabIndex="-1" className="privacy-preferences" aria-labelledby="privacy-preferences-title">
      <div className="privacy-summary">
      <h2 id="privacy-preferences-title"><Cookie size={24} aria-hidden="true" /> Sua privacidade importa</h2>
      <p>Você escolhe se deseja carregar o mapa do Google, que pode usar cookies e receber dados do navegador. Sem permissão, o mapa fica desativado e você continua usando o site.</p>
      <details><summary>Entenda o uso de cookies</summary><p>Guardamos sua escolha por até 180 dias. Também usamos cache de panfletos públicos e proteção antispam no formulário de currículo. Você pode mudar sua escolha nas preferências do rodapé. <Link to="/privacidade#cookies">Leia a política de privacidade</Link>.</p></details>
      </div>
      <div className="privacy-actions">
        <button type="button" onClick={() => save(false)}>Rejeitar opcionais</button>
        <button type="button" onClick={() => save(true)}>Permitir mapa do Google</button>
      </div>
    </section>}
    {storageFailed && <p className="shell" role="status">Sua escolha vale nesta visita. O navegador não permitiu salvá-la para outras visitas.</p>}
  </Context.Provider>;
}
