import { useCallback, useEffect, useState } from "react";
import { Plus, RefreshCw, Upload, X } from "lucide-react";
import { createCampaign, listCampaigns, publishCampaign, updateCampaign, withdrawCampaign } from "./services/adminApi";
import { campaignPayload, icons, localDateTime, themes } from "./promotionOptions";

const empty = { title: "", summary: "", conditions: "", starts_at: "", ends_at: "", category_key: "other", display_order: 100, hud_label: "", icon_key: "tag", theme_key: "purple" };
const date = value => new Date(value).toLocaleString("pt-BR");
const visibility = campaign => campaign.state !== "published" ? "Fora do site" :
  new Date(campaign.ends_at).getTime() <= Date.now() ? "Expirada — não aparece no site" :
  new Date(campaign.starts_at).getTime() > Date.now() ? "Agendada — ainda não aparece no site" : "Dentro da validade de exibição";

export default function Offers({ notice, setNotice }) {
  const [campaigns, setCampaigns] = useState([]), [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null), [open, setOpen] = useState(false);
  const [file, setFile] = useState(null), [preview, setPreview] = useState("");
  const [busy, setBusy] = useState(false), [loading, setLoading] = useState(true), [failed, setFailed] = useState(false);
  const load = useCallback(async () => {
    setLoading(true); setFailed(false);
    try { setCampaigns(await listCampaigns()); } catch (error) { setFailed(true); setNotice(error.message); } finally { setLoading(false); }
  }, [setNotice]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (!file || !file.type.startsWith("image/")) { setPreview(""); return; }
    const url = URL.createObjectURL(file); setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  function edit(campaign) {
    setEditing(campaign); setFile(null); setNotice("");
    setForm(campaign ? { ...empty, ...Object.fromEntries(Object.keys(empty).map(key => [key, campaign[key] ?? empty[key]])), starts_at: localDateTime(campaign.starts_at), ends_at: localDateTime(campaign.ends_at) } : empty);
    setOpen(true);
  }
  async function save(event) {
    event.preventDefault(); setBusy(true); setNotice("");
    try {
      const values = campaignPayload(form);
      if (file && (!['application/pdf', 'image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 10000000 || file.size === 0)) throw new Error("Escolha um PDF, PNG, JPEG ou WebP de até 10 MB.");
      let campaign = editing;
      if (!campaign) { campaign = await createCampaign(values); setEditing(campaign); }
      if (file) await publishCampaign(campaign, file, values);
      else await updateCampaign(campaign, values);
      setOpen(false); setFile(null);
      await load(); setNotice(file ? "Oferta e panfleto publicados com sucesso." : "Alterações salvas. O panfleto atual foi mantido.");
    } catch (error) { setNotice(error.message); } finally { setBusy(false); }
  }
  async function withdraw(campaign) {
    if (!window.confirm(`Retirar “${campaign.title}” das ofertas públicas?`)) return;
    setBusy(true);
    try { await withdrawCampaign(campaign); await load(); setNotice("Oferta retirada."); }
    catch (error) { setNotice(error.message); } finally { setBusy(false); }
  }
  const field = key => ({ value: form[key], onChange: event => setForm({ ...form, [key]: event.target.value }) });
  const theme = themes.find(value => value.key === form.theme_key) || themes[0];
  const Icon = (icons.find(value => value.key === form.icon_key) || icons[0]).Icon;
  return <section className="admin-content">
    <div className="admin-section-head"><div><span className="admin-kicker">Panfletos</span><h2>Controle de promoções</h2><p>Edite os textos, personalize os cartões e substitua o panfleto da campanha.</p></div><div className="admin-actions"><button className="admin-quiet" disabled={busy || loading} onClick={load}><RefreshCw size={17} /> Atualizar</button><button className="admin-primary" disabled={busy} onClick={() => edit(null)}><Plus size={17} /> Nova oferta</button></div></div>
    {notice && <div className="admin-alert" role="status">{notice}</div>}
    {open && <form className="admin-form" onSubmit={save}>
      <div className="admin-form-head"><h3>{editing ? "Editar oferta" : "Nova oferta"}</h3><button type="button" disabled={busy} className="icon-button" onClick={() => setOpen(false)} aria-label="Fechar edição"><X /></button></div>
      <fieldset disabled={busy} className="admin-fields"><div className="admin-form-grid">
        <label>Título<input required maxLength={120} {...field("title")} /></label>
        <label>Nome no cartão (HUD)<input maxLength={60} placeholder="Ex.: Ofertas de açougue" {...field("hud_label")} /></label>
        <label>Categoria<select {...field("category_key")}><option value="other">Geral</option><option value="meat-frozen">Açougue e congelados</option><option value="grocery-drinks">Mercearia e bebidas</option><option value="cleaning-beauty">Limpeza e beleza</option><option value="home-baby">Casa e bebê</option></select></label>
        <label>Ordem de exibição<input type="number" min="0" max="999" required {...field("display_order")} /></label>
        <label>Início (horário deste computador)<input required type="datetime-local" {...field("starts_at")} /></label><label>Fim (horário deste computador)<input required type="datetime-local" {...field("ends_at")} /></label>
        <label className="wide">Resumo<textarea required maxLength={280} {...field("summary")} /></label><label className="wide">Condições<textarea required maxLength={2000} {...field("conditions")} /></label>
        <fieldset className="wide visual-picker"><legend>Ícone do cartão</legend><div>{icons.map(({ key, label, Icon: Choice }) => <button type="button" key={key} aria-pressed={form.icon_key === key} onClick={() => setForm({ ...form, icon_key: key })}><Choice aria-hidden="true" /><span>{label}</span></button>)}</div></fieldset>
        <fieldset className="wide visual-picker"><legend>Tema da promoção</legend><div>{themes.map(choice => <button type="button" key={choice.key} aria-pressed={form.theme_key === choice.key} onClick={() => setForm({ ...form, theme_key: choice.key })}><span className="theme-swatch" style={{ background: choice.color }} /><span>{choice.label}</span></button>)}</div></fieldset>
        <div className="wide campaign-preview" style={{ color: theme.color, background: theme.background }}><small>Prévia do cartão</small><div><Icon /><strong>{form.hud_label || form.title || "Nome da oferta"}</strong></div></div>
        <label className="wide file-drop"><Upload size={20} />{editing ? "Substituir imagem ou PDF do panfleto (opcional)" : "Imagem ou PDF do panfleto"}<input key={editing?.id || "new"} required={!editing || !editing.active_version_id} type="file" accept="application/pdf,image/png,image/jpeg,image/webp" onChange={e => setFile(e.target.files?.[0] || null)} /><small>Até 10 MB. Confira os produtos, preços e datas antes de publicar.</small>{file && <span>{file.name}</span>}</label>
        {preview && <img className="wide flyer-preview" src={preview} alt="Prévia do novo panfleto" />}
      </div><button className="admin-primary">{busy ? "Salvando…" : file || !editing ? "Salvar e publicar panfleto" : "Salvar alterações"}</button></fieldset>
    </form>}
    {loading ? <p role="status">Carregando ofertas…</p> : failed ? <p>Não foi possível carregar as ofertas. Tente atualizar.</p> : <div className="admin-list">{!campaigns.length ? <div className="admin-empty">Nenhuma oferta cadastrada.</div> : campaigns.map(campaign => <article className="admin-row" key={campaign.id}><div><div className="admin-row-title"><strong>{campaign.title}</strong><span className={`status status-${campaign.state}`}>{({ published: "Publicada", withdrawn: "Retirada", draft: "Rascunho" })[campaign.state]}</span></div><p>{campaign.summary}</p><small>{date(campaign.starts_at)} até {date(campaign.ends_at)}</small><p>{visibility(campaign)}</p></div><div className="admin-actions"><button className="admin-quiet" disabled={busy} onClick={() => edit(campaign)}>Editar / trocar panfleto</button>{campaign.state === "published" && <button className="admin-quiet danger" disabled={busy} onClick={() => withdraw(campaign)}>Retirar</button>}</div></article>)}</div>}
  </section>;
}
