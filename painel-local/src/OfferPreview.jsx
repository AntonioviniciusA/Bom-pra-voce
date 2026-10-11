import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import PromotionShowcase from "../../bom-pra-voce-novo/src/Components/Tabloide/PromotionShowcase";
import siteCss from "../../bom-pra-voce-novo/src/index.css?inline";
import themeCss from "../../bom-pra-voce-novo/src/Components/Tabloide/promotionThemes.css?inline";
import { apiConfig } from "./services/config";

const documentHtml = '<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><style>' + siteCss + themeCss + '</style></head><body><div id="preview-root"></div></body></html>';
const normalize = campaign => ({ ...campaign, starts: Date.parse(campaign.starts_at), ends: Date.parse(campaign.ends_at), file_url: campaign.public_path ? `${apiConfig().url}/storage/v1/object/public/promotion-public/${encodeURI(campaign.public_path)}` : campaign.file_url });

export default function OfferPreview({ form, preview, file, editing, campaigns = [] }) {
  const [expanded, setExpanded] = useState(false);
  const [mobile, setMobile] = useState(false), [document, setDocument] = useState(null);
  const [availableWidth, setAvailableWidth] = useState(440), [height, setHeight] = useState(900);
  const [windowHeight, setWindowHeight] = useState(() => window.innerHeight);
  const host = useRef(null);
  const width = mobile ? 390 : 1440;
  // Fit the complete section, not just its width. The iframe keeps the site's
  // actual viewport so scaling never changes line wrapping or breakpoints.
  const maxHeight = expanded ? Math.max(240, windowHeight - 260) : 420;
  const scale = Math.min(expanded ? 1 : 0.85, Math.max(1, availableWidth - 16) / width, maxHeight / height);
  useEffect(() => {
    const resize = () => setWindowHeight(window.innerHeight);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);
  const id = editing?.id || "preview-draft";
  const items = useMemo(() => {
    const draft = normalize({ ...editing, ...form, id, file_url: file ? preview : editing?.file_url, public_path: file ? null : editing?.public_path, mime_type: file?.type || editing?.mime_type });
    return [...campaigns.filter(item => item.id !== id && item.state === "published" && Date.parse(item.starts_at) <= Date.now() && Date.parse(item.ends_at) > Date.now()).map(normalize), draft]
      .sort((a, b) => Number(a.display_order) - Number(b.display_order) || b.starts - a.starts || a.id.localeCompare(b.id));
  }, [form, editing, campaigns, id, file, preview]);
  useEffect(() => {
    if (!host.current || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => setAvailableWidth(entry.contentRect.width));
    observer.observe(host.current); return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!document || typeof ResizeObserver === "undefined") return;
    const root = document.getElementById("preview-root");
    const observer = new ResizeObserver(() => setHeight(Math.ceil(root.getBoundingClientRect().height) + 2));
    observer.observe(root); return () => observer.disconnect();
  }, [document]);
  const start = Date.parse(form.starts_at), end = Date.parse(form.ends_at);
  return <aside className={`offer-preview${expanded ? " is-expanded" : ""}`} aria-label="Prévia da oferta no site">
    <header><strong>Prévia real da seção Ofertas</strong><p>Mesmo componente, fontes e estilos do site. Suas alterações ainda não foram salvas.</p>
      <div className="preview-devices"><button type="button" aria-pressed={!mobile} onClick={() => setMobile(false)}>Computador</button><button type="button" aria-pressed={mobile} onClick={() => setMobile(true)}>Celular</button><button type="button" onClick={() => setExpanded(!expanded)}>{expanded ? "Reduzir prévia" : "Ampliar prévia"}</button></div>
      <small>{width} px de largura original · miniatura a {Math.round(scale * 100)}%, ajustada para mostrar a seção inteira. Use “Ampliar prévia” para conferir detalhes.</small>
    </header>
    <div ref={host} className="preview-viewport" style={{ height: height * scale }}>
      <iframe title="Oferta no site" srcDoc={documentHtml} onLoad={event => setDocument(event.currentTarget.contentDocument)} style={{ position: "absolute", left: Math.max(0, (availableWidth - width * scale) / 2), top: 0, width, height, transform: `scale(${scale})`, transformOrigin: "top left", border: 0 }} />
      {document && createPortal(<div onClick={event => { if (event.target.closest("a")) event.preventDefault(); }}><PromotionShowcase campaigns={items} selectedId={id} /></div>, document.getElementById("preview-root"))}
    </div>
    <p className="preview-note">Links de abertura ficam inativos nesta prévia. PDF mantém a apresentação do site: um cartão para abrir o arquivo, sem páginas embutidas.</p>
    {!file && editing?.active_version_id && !editing?.public_path && !editing?.file_url && <p role="status">A listagem ainda não trouxe o arquivo atual. Atualize o painel após aplicar a migração de prévia ou selecione uma nova imagem.</p>}
    <p className="preview-note">{!Number.isFinite(start) || !Number.isFinite(end) || end <= start ? "Preencha uma validade válida." : end <= Date.now() ? "Oferta expirada: aparece aqui para edição, mas não no site." : start > Date.now() ? "Oferta agendada: aparece aqui para edição, mas só entrará no site no início informado." : "Validade atual: a exibição pública depende de salvar e publicar."} {editing?.state === "withdrawn" && !file ? "Salvar textos não republica uma oferta retirada: anexe o panfleto para republicar." : ""}</p>
  </aside>;
}
