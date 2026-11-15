import {useEffect, useRef, useState} from 'react';
import {Download, FileText, LoaderCircle, Share2, X} from 'lucide-react';
import {createCampaignFlyerPdf, downloadFile} from './flyerPdf';

export default function ShareDownloadMenu({
  campaign,
  items,
  item,
  getArtwork,
  triggerClassName,
  triggerLabel,
  triggerContent,
  shareUrl,
  disabled = false,
  onOpen,
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState('');
  const [message, setMessage] = useState('');
  const [artworkFile, setArtworkFile] = useState(null);
  const [artworkLoading, setArtworkLoading] = useState(false);
  const firstAction = useRef(null);
  const wrapper = useRef(null);
  const trigger = useRef(null);

  useEffect(() => {
    if (!open || !getArtwork) return undefined;
    let active = true;
    setArtworkFile(null); setArtworkLoading(true);
    getArtwork().then(file => {if (active) setArtworkFile(file);}).catch(error => {
      if (active) setMessage(error?.message || 'Não foi possível preparar a arte deste produto.');
    }).finally(() => {if (active) setArtworkLoading(false);});
    return () => {active = false;};
  }, [open, campaign.id, campaign.revision, item?.id, item?.product?.id]); // eslint-disable-line react-hooks/exhaustive-deps -- prepara a oferta ativa, sem reiniciar por funções recriadas na renderização

  useEffect(() => {
    if (!open) return undefined;
    const close = event => {
      if (event.key === 'Escape') closePanel();
      if (event.type === 'pointerdown' && !wrapper.current?.contains(event.target)) closePanel();
    };
    document.addEventListener('keydown', close);
    document.addEventListener('pointerdown', close);
    requestAnimationFrame(() => firstAction.current?.focus());
    return () => {
      document.removeEventListener('keydown', close);
      document.removeEventListener('pointerdown', close);
    };
  }, [open]);

  function closePanel() {
    setOpen(false);
    requestAnimationFrame(() => trigger.current?.focus());
  }

  function toggle(event) {
    event.stopPropagation();
    if (!open) onOpen?.();
    setOpen(value => !value);
    setMessage('');
  }

  async function run(action, work) {
    if (busy) return;
    setBusy(action); setMessage('');
    try { await work(); }
    catch (error) { if (error?.name !== 'AbortError') setMessage(error?.message || 'Não foi possível concluir. Tente novamente.'); }
    finally { setBusy(''); }
  }

  function nativeShare() {
    let payload = {title:item?.product.name || campaign.title, text:item ? `Confira a oferta de ${item.product.name}.` : `Confira ${campaign.title}.`};
    if (artworkFile) {
      if (navigator.canShare?.({files:[artworkFile]})) payload = {...payload, files:[artworkFile]};
      else if (shareUrl) payload.url = shareUrl;
    } else if (shareUrl) payload.url = shareUrl;
    return navigator.share(payload);
  }

  const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';
  return <div className="share-download" ref={wrapper}>
    <button ref={trigger} className={triggerClassName} type="button" aria-label={triggerLabel} aria-haspopup="dialog" aria-expanded={open} disabled={disabled} onClick={toggle}>
      {triggerContent || <Share2 aria-hidden="true"/>}
    </button>
    {open && <div className="share-download__panel" role="dialog" aria-modal="false" aria-label={item ? `Opções para ${item.product.name}` : 'Opções para as ofertas'} onPointerDown={event => event.stopPropagation()}>
      <header>
        <div><strong>{item ? 'Compartilhar oferta' : 'Levar as ofertas com você'}</strong><small>Escolha o formato que precisa</small></div>
        <button type="button" onClick={closePanel} aria-label="Fechar opções"><X aria-hidden="true"/></button>
      </header>
      <div className="share-download__actions">
        {canNativeShare && <button ref={firstAction} type="button" disabled={!!busy || (getArtwork && !artworkFile)} onClick={() => run('share', nativeShare)}>
          <span><Share2 aria-hidden="true"/></span><div><strong>Compartilhar</strong><small>{artworkLoading ? 'Preparando a arte…' : 'Abrir os aplicativos do celular'}</small></div>{(busy === 'share' || artworkLoading) && <LoaderCircle className="is-spinning" aria-hidden="true"/>}
        </button>}
        {getArtwork && <button ref={canNativeShare ? undefined : firstAction} type="button" disabled={!!busy || !artworkFile} onClick={() => run('artwork', async () => {downloadFile(artworkFile); setMessage('Arte baixada em alta qualidade.');})}>
          <span><Download aria-hidden="true"/></span><div><strong>Baixar arte do produto</strong><small>{artworkLoading ? 'Preparando imagem…' : 'Imagem PNG pronta para publicar'}</small></div>{(busy === 'artwork' || artworkLoading) && <LoaderCircle className="is-spinning" aria-hidden="true"/>}
        </button>}
        <button ref={!canNativeShare && !getArtwork ? firstAction : undefined} type="button" disabled={!!busy || !items?.length} onClick={() => run('pdf', async () => {downloadFile(await createCampaignFlyerPdf(campaign, items)); setMessage('Panfleto completo baixado em PDF.');})}>
          <span><FileText aria-hidden="true"/></span><div><strong>Baixar panfleto completo</strong><small>PDF com {items?.length || 0} {items?.length === 1 ? 'produto' : 'produtos'}</small></div>{busy === 'pdf' && <LoaderCircle className="is-spinning" aria-hidden="true"/>}
        </button>
      </div>
      {message && <p className="share-download__message" role="status">{message}</p>}
    </div>}
  </div>;
}
