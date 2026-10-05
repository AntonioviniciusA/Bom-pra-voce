import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp, faFileLines, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { createApplicationSession, validateApplication } from "../../services/applications";
import ApplicationReceipt from "./ApplicationReceipt";
import TurnstileWidget from "./TurnstileWidget";

export default function CandidaturaForm({ available = true }) {
  const [values, setValues] = useState({ name: "", phone: "", email: "", birthDate: "", address: "", area: "" });
  const [file, setFile] = useState(null);
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
  useEffect(() => { active.current = true; return () => { active.current = false; }; }, []);
  useEffect(() => {
    if (message || Object.keys(errors).length) errorSummary.current?.focus();
  }, [message, errors]);
  useEffect(() => {
    if (status === "editing" || status === "received") return;
    const warn = event => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [status]);
  async function submit(event) {
    event.preventDefault();
    if (busy.current || status === "expired" || status === "conflict") return;
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
      const result = await session.current.submit();
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
    <fieldset disabled={locked}>
      <div className="application-fields">
        <div className="form-field application-field--full"><label htmlFor="name">Nome completo <span aria-hidden="true">*</span></label>
          <input id="name" name="name" type="text" maxLength="120" autoComplete="name" required aria-label="Nome completo" placeholder="Digite seu nome completo" value={values.name} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} onChange={event => setValues({ ...values, name: event.target.value })} />
          {errors.name && <p id="name-error" className="field-error">{errors.name}</p>}
        </div>
        <div className="form-field"><label htmlFor="phone">Telefone</label>
          <input id="phone" name="phone" type="tel" maxLength="24" autoComplete="tel" placeholder="(00) 00000-0000" value={values.phone} onChange={event => setValues({ ...values, phone: event.target.value })} />
        </div>
        <div className="form-field"><label htmlFor="email">E-mail <span aria-hidden="true">*</span></label>
          <input id="email" name="email" type="email" maxLength="254" autoComplete="email" required aria-label="E-mail" placeholder="seuemail@exemplo.com" value={values.email} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} onChange={event => setValues({ ...values, email: event.target.value })} />
          {errors.email && <p id="email-error" className="field-error">{errors.email}</p>}
        </div>
        <div className="form-field"><label htmlFor="birthDate">Data de nascimento</label>
          <input id="birthDate" name="birthDate" type="date" autoComplete="bday" value={values.birthDate} aria-invalid={Boolean(errors.birthDate)} aria-describedby={errors.birthDate ? "birthDate-error" : undefined} onChange={event => setValues({ ...values, birthDate: event.target.value })} />
          {errors.birthDate && <p id="birthDate-error" className="field-error">{errors.birthDate}</p>}
        </div>
        <div className="form-field"><label htmlFor="address">Endereço</label>
          <input id="address" name="address" type="text" maxLength="200" autoComplete="street-address" placeholder="Rua, número, complemento e cidade" value={values.address} aria-invalid={Boolean(errors.address)} aria-describedby={errors.address ? "address-error" : undefined} onChange={event => setValues({ ...values, address: event.target.value })} />
          {errors.address && <p id="address-error" className="field-error">{errors.address}</p>}
        </div>
        <div className="form-field application-field--full"><label htmlFor="area">Área de interesse</label>
          <select id="area" name="area" value={values.area} onChange={event => setValues({ ...values, area: event.target.value })}>
            <option value="">Selecione uma área</option><option>Atendimento</option><option>Caixa</option><option>Hortifrúti</option><option>Padaria</option><option>Reposição</option><option>Administrativo</option><option>Outra área</option>
          </select>
        </div>
      </div>
      <div className="form-field application-field--file"><label htmlFor="file">Currículo <span aria-hidden="true">*</span></label>
        <input className="sr-only" id="file" name="file" type="file" accept=".pdf,application/pdf" required aria-label="Currículo em PDF" aria-invalid={Boolean(errors.file)} aria-describedby={"file-help" + (errors.file ? " file-error" : "")} onChange={event => setFile(event.target.files?.[0] || null)} />
        <label className="application-dropzone" htmlFor="file">
          <span><FontAwesomeIcon icon={faCloudArrowUp} aria-hidden="true" /></span>
          <strong>{file ? file.name : "Clique para anexar seu currículo"}</strong>
          <small id="file-help">PDF (máx. 5 MB)</small>
          <small>{file ? "Clique para escolher outro arquivo" : "ou arraste o arquivo aqui"}</small>
        </label>
        {errors.file && <p id="file-error" className="field-error">{errors.file}</p>}
      </div>
    </fieldset>
    <TurnstileWidget ref={challenge} onToken={setChallengeToken} />
    {errors.challenge && <p className="field-error">{errors.challenge}</p>}
    <p className="application-privacy">Ao enviar, você concorda com o <Link to="/privacidade" target="_blank" rel="noopener noreferrer">aviso de privacidade (nova aba)</Link>.</p>
    {status === "sending" && <p role="status">Enviando e aguardando confirmação. Aguarde nesta página.</p>}
    {locked && <p className="small">Os dados ficam preservados nesta sessão. Sair da página pode impedir a recuperação do comprovante; fechar a página não cancela um envio já recebido.</p>}
    <button type="submit" className="application-submit" disabled={["sending", "expired", "conflict"].includes(status) || !challengeToken}>
      <FontAwesomeIcon icon={faPaperPlane} aria-hidden="true" /> {status === "sending" ? "Aguardando confirmação…" : status === "uncertain" ? "Tentar confirmar novamente" : "Enviar currículo"}
    </button>
  </form>;
}
