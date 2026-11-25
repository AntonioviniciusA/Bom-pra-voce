import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp, faFileLines, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { createApplicationSession, validateApplication } from "../../services/applications";
import ApplicationReceipt from "./ApplicationReceipt";
import TurnstileWidget from "./TurnstileWidget";
import ApplicationLocationFields from "./ApplicationLocationFields";

export default function CandidaturaForm({ available = true }) {
  const [values, setValues] = useState({ name: "", phone: "", email: "", age: "", address: "", area: "" });
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [reading, setReading] = useState(false);
  const [readPercent, setReadPercent] = useState(null);
  const [progress, setProgress] = useState({ phase: "preparing" });
  const reader = useRef(null);
  const fileInput = useRef(null);
  const dragDepth = useRef(0);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("editing");
  const [message, setMessage] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [challengeToken, setChallengeToken] = useState("");
  const challenge = useRef(null);
  const session = useRef(null);
  const busy = useRef(false);
  const errorSummary = useRef(null);
  const active = useRef(true);
  useEffect(() => { active.current = true; return () => { active.current = false; reader.current?.abort(); }; }, []);
  useEffect(() => {
    if (message || Object.keys(errors).length) errorSummary.current?.focus();
  }, [message, errors]);
  useEffect(() => {
    if (status === "editing" || status === "received") return;
    const warn = event => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [status]);
  function selectFile(files) {
    if (status !== "editing") return;
    reader.current?.abort();
    reader.current = null;
    setReading(false);
    setFile(null);
    const candidate = files?.[0];
    const invalid = files?.length > 1 ? "Selecione apenas um currículo." : validateApplication(values, candidate).file;
    if (invalid) { setErrors(current => ({ ...current, file: invalid })); return; }
    setErrors(current => { const next = { ...current }; delete next.file; return next; });
    setReading(true);
    setReadPercent(null);
    const currentReader = new FileReader();
    reader.current = currentReader;
    currentReader.onprogress = event => {
      if (active.current && reader.current === currentReader && event.lengthComputable) setReadPercent(Math.floor(event.loaded / event.total * 100));
    };
    currentReader.onload = () => {
      if (!active.current || reader.current !== currentReader) return;
      const bytes = new Uint8Array(currentReader.result);
      const head = String.fromCharCode(...bytes.slice(0, 5));
      const tail = String.fromCharCode(...bytes.slice(-2048));
      setReading(false);
      if (head !== "%PDF-" || !tail.includes("%%EOF")) {
        setErrors(current => ({ ...current, file: "O arquivo não é um PDF válido." }));
      } else { setFile(candidate); setReadPercent(100); }
    };
    currentReader.onerror = () => {
      if (active.current && reader.current === currentReader) {
        setReading(false);
        setErrors(current => ({ ...current, file: "Não foi possível ler o arquivo. Selecione-o novamente." }));
      }
    };
    currentReader.readAsArrayBuffer(candidate);
  }
  async function submit(event) {
    event.preventDefault();
    if (reading || busy.current || status === "expired" || status === "conflict") return;
    if (!available) {
      setMessage("O recebimento de currículos pelo site está temporariamente indisponível. Seus dados não foram enviados.");
      return;
    }
    const invalid = validateApplication(values, file);
    if (!challengeToken) invalid.challenge = "Conclua a verificação de segurança.";
    setErrors(invalid);
    if (Object.keys(invalid).length) return;
    busy.current = true;
    setMessage("");
    setStatus("sending");
    try {
      if (!session.current) session.current = createApplicationSession(values, file, challengeToken);
      const result = await session.current.submit(update => { if (active.current) setProgress(update); });
      if (active.current) { setReceipt(result); setStatus("received"); }
    } catch (error) {
      if (active.current) {
        const correctable = [400, 413, 415, 422].includes(error.status);
        if (correctable) { session.current = null; challenge.current?.reset(); }
        setStatus(correctable ? "editing" : error.code === "EXPIRED" ? "expired" : error.code === "CONFLICT" ? "conflict" : "uncertain");
        setMessage(error.code === "EXPIRED" ? "A sessão expirou. Não conseguimos confirmar este envio pelo site. Não faça outro envio sem orientação da loja." :
          error.code === "PRIVACY_NOTICE_CHANGED" ? "O aviso de privacidade foi atualizado. Recarregue a página, leia a nova versão e só então faça um novo envio." :
          error.code === "CONFLICT" ? "Os dados deste envio não puderam ser conciliados. Não faça outro envio sem orientação da loja." :
          correctable ? "O envio foi rejeitado antes do recebimento. Revise os campos, refaça a verificação e tente novamente." :
          "Não conseguimos confirmar o recebimento. Tente novamente com os mesmos dados; o sistema reutilizará este envio.");
      }
    } finally { busy.current = false; }
  }
  if (receipt) return <ApplicationReceipt receipt={receipt} />;
  const locked = status !== "editing";
  return <form onSubmit={submit} noValidate className="application-form application-card">
    <header className="application-card__header">
      <span><FontAwesomeIcon icon={faFileLines} aria-hidden="true" /></span>
      <div><h2>Envie seu currículo</h2><p>Preencha suas informações e anexe seu currículo.</p></div>
    </header>
    {(message || Object.keys(errors).length > 0) && <div ref={errorSummary} tabIndex="-1" className="notice error-notice" role="alert">
      <h2>{message ? "Recebimento não confirmado" : "Revise os campos"}</h2>
      {message && <p>{message}</p>}
      {Object.entries(errors).map(([key, value]) => <p key={key}><a href={"#" + key}>{value}</a></p>)}
    </div>}
    <p>Campos com * são obrigatórios. Telefone, idade, endereço e área são opcionais. Não inclua CPF, RG, dados bancários, de saúde ou outros dados sensíveis no currículo.</p>
    <fieldset disabled={locked}>
      <div className="application-fields">
        <div className="form-field application-field--full"><label htmlFor="name">Nome completo <span aria-hidden="true">*</span></label>
          <input id="name" name="name" type="text" maxLength="120" autoComplete="name" required aria-label="Nome completo" placeholder="Digite seu nome completo" value={values.name} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} onChange={event => setValues({ ...values, name: event.target.value })} />
          {errors.name && <p id="name-error" className="field-error">{errors.name}</p>}
        </div>
        <div className="form-field"><label htmlFor="phone">Telefone</label>
          <input id="phone" name="phone" type="tel" maxLength="24" autoComplete="tel" placeholder="(00) 00000-0000" value={values.phone} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "phone-error" : undefined} onChange={event => setValues({ ...values, phone: event.target.value })} />
        </div>
        {errors.phone && <p id="phone-error" className="field-error">{errors.phone}</p>}
        <div className="form-field"><label htmlFor="email">E-mail <span aria-hidden="true">*</span></label>
          <input id="email" name="email" type="email" maxLength="254" autoComplete="email" required aria-label="E-mail" placeholder="seuemail@exemplo.com" value={values.email} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} onChange={event => setValues({ ...values, email: event.target.value })} />
          {errors.email && <p id="email-error" className="field-error">{errors.email}</p>}
        </div>
        <div className="form-field"><label htmlFor="age">Idade (15 a 60 anos)</label>
          <select id="age" name="age" value={values.age} aria-invalid={Boolean(errors.age)} aria-describedby={errors.age ? "age-error" : undefined} onChange={event => setValues({ ...values, age: event.target.value })}>
            <option value="">Selecione sua idade (opcional)</option>
            {Array.from({ length: 46 }, (_, index) => index + 15).map(age => <option key={age} value={age}>{age} anos</option>)}
          </select>
          {errors.age && <p id="age-error" className="field-error">{errors.age}</p>}
        </div>
        <ApplicationLocationFields error={errors.address} onChange={address => setValues(current => ({ ...current, address }))} />
        <div className="form-field application-field--full"><label htmlFor="area">Área de interesse</label>
          <select id="area" name="area" value={values.area} onChange={event => setValues({ ...values, area: event.target.value })}>
            <option value="">Selecione uma área</option><option>Atendimento</option><option>Caixa</option><option>Hortifrúti</option><option>Padaria</option><option>Reposição</option><option>Administrativo</option><option>Outra área</option>
          </select>
        </div>
      </div>
      <div className="form-field application-field--file"><label htmlFor="file">Currículo <span aria-hidden="true">*</span></label>
        <input ref={fileInput} className="sr-only" id="file" name="file" type="file" accept=".pdf,application/pdf" required aria-label="Currículo em PDF" aria-invalid={Boolean(errors.file)} aria-describedby={"file-help" + (errors.file ? " file-error" : "")} onChange={event => { if (event.target.files?.length) selectFile(event.target.files); event.target.value = ""; }} />
        <label className={`application-dropzone${dragging ? " is-dragging" : ""}${reading ? " is-reading" : ""}${file ? " has-file" : ""}`} htmlFor="file"
          role="button" tabIndex={locked ? -1 : 0} aria-disabled={locked} aria-label="Selecionar ou arrastar currículo em PDF"
          onKeyDown={event => { if (!locked && ["Enter", " "].includes(event.key)) { event.preventDefault(); fileInput.current?.click(); } }}
          onDragEnter={event => { event.preventDefault(); if (!locked) { dragDepth.current += 1; setDragging(true); } }}
          onDragOver={event => { event.preventDefault(); event.dataTransfer.dropEffect = locked ? "none" : "copy"; }}
          onDragLeave={event => { event.preventDefault(); dragDepth.current = Math.max(0, dragDepth.current - 1); if (!dragDepth.current) setDragging(false); }}
          onDrop={event => { event.preventDefault(); dragDepth.current = 0; setDragging(false); if (!locked) selectFile(event.dataTransfer.files); }}>

          <span><FontAwesomeIcon icon={faCloudArrowUp} aria-hidden="true" /></span>
          <strong>{dragging ? "Solte seu currículo aqui" : reading ? "Lendo o PDF…" : file ? file.name : "Arraste ou clique para anexar seu currículo"}</strong>
          <small id="file-help">PDF (máx. 5 MB)</small>
          <small>{file ? `${(file.size / 1000).toLocaleString("pt-BR")} KB · PDF pronto para envio. Clique para trocar.` : "Selecione um PDF ou arraste-o até esta área"}</small>
        </label>
        {reading && <div role="status"><p>Lendo arquivo{readPercent !== null ? `: ${readPercent}%` : "…"}</p><progress aria-label="Leitura do arquivo" max="100" value={readPercent ?? undefined} /></div>}
        {errors.file && <p id="file-error" className="field-error">{errors.file}</p>}
      </div>
    </fieldset>
    <div id="challenge" tabIndex="-1"><TurnstileWidget ref={challenge} onToken={setChallengeToken} /></div>
    {errors.challenge && <p className="field-error">{errors.challenge}</p>}
    <p className="application-privacy">Seus dados serão usados para avaliar sua candidatura. Antes de enviar, leia o <Link to="/privacidade" target="_blank" rel="noopener noreferrer">aviso de privacidade (nova aba)</Link>.</p>
    {status === "sending" && <div className="application-progress" role="status">
      <p>{progress.phase === "preparing" ? "Preparando envio seguro…" : progress.phase === "confirming" ? "Arquivo enviado (100%). Aguardando confirmação do Supabase…" : `Enviando ao Supabase${progress.percent != null ? `: ${progress.percent}%` : "…"}`}</p>
      <progress aria-label="Envio ao Supabase" max="100" value={progress.phase === "uploading" ? progress.percent ?? undefined : undefined} />
    </div>}
    {locked && <p className="small">Os dados ficam preservados nesta sessão. Sair da página pode impedir a recuperação do comprovante; fechar a página não cancela um envio já recebido.</p>}
    <button type="submit" className="application-submit" disabled={reading || ["sending", "expired", "conflict"].includes(status) || !challengeToken}>
      <FontAwesomeIcon icon={faPaperPlane} aria-hidden="true" /> {status === "sending" ? "Aguardando confirmação…" : status === "uncertain" ? "Tentar confirmar novamente" : "Enviar currículo"}
    </button>
  </form>;
}
