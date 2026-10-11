import { useCallback, useEffect, useState } from "react";
import { RefreshCw, RotateCw } from "lucide-react";
import { listSocialPublications, retrySocialPublication } from "./services/adminApi";

const labels = { queued: "Na fila", processing: "Em processamento", published: "Publicada", failed: "Falhou", cancelled: "Cancelada", expired: "Story expirado" };
const surface = { feed: "Feed", story: "Story" };
const date = value => value ? new Date(value).toLocaleString("pt-BR") : "—";

export default function InstagramPublications({ notice, setNotice }) {
  const [items, setItems] = useState([]); const [loading, setLoading] = useState(true); const [busy, setBusy] = useState(false);
  const load = useCallback(async () => { setLoading(true); try { setItems(await listSocialPublications()); } catch (error) { setNotice(error.message); } finally { setLoading(false); } }, [setNotice]);
  useEffect(() => { load(); }, [load]);
  async function retry(item) { setBusy(true); setNotice(""); try { await retrySocialPublication(item.id); await load(); setNotice("Publicação colocada novamente na fila."); } catch (error) { setNotice(error.message); } finally { setBusy(false); } }
  return <section className="admin-content"><div className="admin-section-head"><div><span className="admin-kicker">Instagram</span><h2>Publicações e Stories</h2><p>Esta fila mostra o que o site enviará ao Instagram conectado. Stories ficam disponíveis por 24 horas.</p></div><button className="admin-quiet" disabled={loading || busy} onClick={load}><RefreshCw size={17} /> Atualizar</button></div>{notice && <div className="admin-alert" role="status">{notice}</div>}{loading ? <p role="status">Carregando publicações…</p> : !items.length ? <div className="admin-empty"><h3>Nenhuma publicação programada</h3><p>Na edição de uma oferta, marque Feed ou Story para enviar o panfleto automaticamente.</p></div> : <div className="admin-list">{items.map(item => <article className="admin-row" key={item.id}><div><div className="admin-row-title"><strong>{item.campaign_title}</strong><span className={`status status-${item.status}`}>{labels[item.status] || item.status}</span></div><p>{surface[item.surface] || item.surface} · prevista para {date(item.scheduled_at)}</p>{item.published_at && <small>Publicada em {date(item.published_at)}{item.expires_at ? ` · expira em ${date(item.expires_at)}` : ""}</small>}{item.failure_message && <p className="social-error">{item.failure_message}</p>}</div><div className="admin-actions">{item.permalink && <a className="admin-quiet" href={item.permalink} target="_blank" rel="noreferrer">Ver no Instagram</a>}{item.status === "failed" && <button className="admin-quiet" disabled={busy} onClick={() => retry(item)}><RotateCw size={17} /> Tentar novamente</button>}</div></article>)}</div>}</section>;
}
