import { useCallback, useEffect, useState } from "react";
import { FileDown, RefreshCw } from "lucide-react";
import { downloadApplication, listApplications } from "./services/adminApi";

const date = value => value ? new Date(value.length === 10 ? `${value}T12:00:00` : value).toLocaleDateString("pt-BR") : "Não informado";
const inspection = { clean: "Disponível para download", pending: "Aguardando inspeção", rejected: "Arquivo bloqueado", error: "Inspeção indisponível" };

export default function Resumes({ notice, setNotice }) {
  const [items, setItems] = useState([]), [busy, setBusy] = useState(true), [failed, setFailed] = useState(false);
  const [hasMore, setHasMore] = useState(false), [downloading, setDownloading] = useState(null), [query, setQuery] = useState("");
  const load = useCallback(async (cursor) => {
    setBusy(true); setFailed(false); setNotice("");
    try {
      const batch = await listApplications(cursor);
      setItems(previous => cursor ? [...previous, ...batch.filter(item => !previous.some(old => old.id === item.id))] : batch);
      setHasMore(batch.length === 50);
    } catch (error) { setFailed(true); setNotice(error.message); } finally { setBusy(false); }
  }, [setNotice]);
  useEffect(() => { load(); }, [load]);
  async function download(item) {
    setDownloading(item.id); setNotice("");
    try { await downloadApplication(item.id, item.file_name || `curriculo-${item.candidate_name}.pdf`); }
    catch (error) { setNotice(error.message); } finally { setDownloading(null); }
  }
  const filtered = items.filter(item => [item.candidate_name, item.email, item.area].some(value => value?.toLocaleLowerCase("pt-BR").includes(query.toLocaleLowerCase("pt-BR"))));
  const last = items.at(-1);
  return <section className="admin-content"><div className="admin-section-head"><div><span className="admin-kicker">Recursos humanos</span><h2>Currículos recebidos</h2><p>Dados enviados pelo site e download individual dos PDFs liberados.</p></div><button className="admin-quiet" disabled={busy} onClick={() => load()}><RefreshCw size={17} /> Atualizar</button></div>
    {notice && <div className="admin-alert" role="alert">{notice}</div>}
    <label className="resume-search">Buscar nos currículos carregados<input type="search" placeholder="Nome, e-mail ou área" value={query} onChange={event => setQuery(event.target.value)} /></label>
    <p>{items.length} candidatura(s) carregada(s)</p>
    {busy && <p role="status">Carregando currículos…</p>}
    {!busy && !failed && !filtered.length && <div className="admin-empty">{query ? "Nenhuma candidatura corresponde à busca." : "Nenhum currículo recebido."}</div>}
    <div className="admin-list">{filtered.map(item => <article className="admin-row resume-row" key={item.id}><div><strong>{item.candidate_name}</strong><p>{item.area || "Área não informada"} · {item.email}</p><small>Recebido em {date(item.received_at)} · {inspection[item.inspection_state] || "Arquivo em análise"}</small><details><summary>Ver dados da candidatura</summary><dl className="resume-data"><dt>Telefone</dt><dd>{item.phone || "Não informado"}</dd><dt>Nascimento</dt><dd>{date(item.birth_date)}</dd><dt>Endereço</dt><dd>{item.address || "Não informado"}</dd><dt>Arquivo</dt><dd>{item.file_name || "Currículo PDF"}</dd><dt>Disponível até</dt><dd>{date(item.delete_after)}</dd></dl></details></div><button className="admin-primary small-button" disabled={item.inspection_state !== "clean" || downloading !== null} onClick={() => download(item)}><FileDown size={17} />{downloading === item.id ? "Baixando…" : "Baixar currículo"}</button></article>)}</div>
    {hasMore && <button className="admin-quiet load-more" disabled={busy} onClick={() => load({ before: last.received_at, before_id: last.id })}>Carregar mais currículos</button>}
  </section>;
}
