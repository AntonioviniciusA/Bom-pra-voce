import { useEffect, useRef, useState } from "react";
import { LogOut, ShieldCheck } from "lucide-react";
import { authorizeAssistant, clearAdminToken, enrollMfa, getAuthState, signIn, updatePassword, verifyMfa } from "./services/adminApi";
import {panelErrorMessage} from './services/diagnostics';
import { registerSensitiveActionHandler, requireSensitiveAction } from "./services/sensitiveAction";
import "./AdminPanel.css";
import "./controls.css";
import Offers from "./OffersWorkspace";

function ErrorBox({ message }) { return message ? <div className="admin-alert" role="alert">{message}</div> : null; }

function OtpInput({ label, value, onChange, autoFocus = false }) {
  const inputRef = useRef(null);
  const digits = Array.from({ length: 6 }, (_, index) => value[index] || "");
  const activeIndex = Math.min(value.length, 5);

  return <label className="otp-field">
    <span>{label}</span>
    <span className="otp-boxes">
      {digits.map((digit, index) => <span
        aria-hidden="true"
        className={`otp-cell${digit ? " filled" : ""}${index === activeIndex ? " active" : ""}`}
        key={index}
      >{digit}</span>)}
      <input
        ref={inputRef}
        autoFocus={autoFocus}
        className="otp-native-input"
        aria-label={label}
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9]{6}"
        maxLength="6"
        required
        value={value}
        onChange={event => onChange(event.target.value.replace(/\D/g, "").slice(0, 6))}
      />
    </span>
  </label>;
}

function Login({ onAuthenticated }) {
  const [values, setValues] = useState({ email: localStorage.getItem("bpv-last-admin-email-v1") || "", password: "" }); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(event) { event.preventDefault(); setBusy(true); setError(""); try { const state=await signIn(values.email, values.password);localStorage.setItem("bpv-last-admin-email-v1",values.email.trim());onAuthenticated(state); } catch (e) { setError(panelErrorMessage('login-screen',e)); } finally { setBusy(false); } }
  return <main className="admin-login"><div className="admin-login-card"><span className="admin-kicker">Bom Pra Você · gestão</span><h1>Painel local</h1><p>Entre para administrar as ofertas e consultar os currículos recebidos.</p><ErrorBox message={error} /><form onSubmit={submit}><label>E-mail<input type="email" required value={values.email} onChange={e => setValues({ ...values, email: e.target.value })} /></label><label>Senha<input type="password" required value={values.password} onChange={e => setValues({ ...values, password: e.target.value })} /></label><button className="admin-primary" disabled={busy}>{busy ? "Entrando…" : "Entrar no painel"}</button></form><small>Acesso restrito a contas com permissão administrativa.</small></div></main>;
}

function SecurityPrompt({ reason, required = false, onConfirmed, onCancel }) {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function confirm(event) {
    event.preventDefault(); setBusy(true); setError("");
    try { await authorizeAssistant(code); onConfirmed(); }
    catch (problem) { setError(panelErrorMessage("sensitive-action", problem)); }
    finally { setBusy(false); }
  }
  return <div className="assistant-dialog security-lock" role="dialog" aria-modal="true" aria-labelledby="security-title"><form onSubmit={confirm}><ShieldCheck size={34} /><h2 id="security-title">{required ? "Painel bloqueado" : "Confirme a ação sensível"}</h2><p>{required ? "O painel ficou 1 hora e 30 minutos sem atividade ou o Windows foi bloqueado." : `Confirme com o celular antes de ${reason}.`}</p><ErrorBox message={error} /><OtpInput autoFocus label="Código do autenticador" value={code} onChange={setCode} /><div>{!required && <button type="button" className="admin-quiet" onClick={onCancel}>Cancelar</button>}<button className="admin-primary" disabled={busy || code.length !== 6}>{busy ? "Confirmando…" : required ? "Desbloquear painel" : "Confirmar ação"}</button></div></form></div>;
}

function MfaGate({ authState, onReady, onLogout }) {
  const [setup, setSetup] = useState(null); const [code, setCode] = useState(""); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  const factorId = setup?.factorId || authState.factors?.[0]?.id;
  async function startEnrollment() { setBusy(true); setError(""); try { setSetup(await enrollMfa()); } catch (e) { setError(panelErrorMessage('mfa-enroll-screen',e)); } finally { setBusy(false); } }
  async function confirm(event) { event.preventDefault(); if (!factorId) return; setBusy(true); setError(""); try { onReady(await verifyMfa(factorId, code.replace(/\s/g, ""))); } catch (e) { setError(panelErrorMessage('mfa-verify-screen',e)); } finally { setBusy(false); } }
  const enrolling = authState.step === "enroll";
  return <main className="admin-login"><div className="admin-login-card mfa-card"><ShieldCheck size={38} className="mfa-icon" /><span className="admin-kicker">Verificação em duas etapas</span><h1>{enrolling ? "Proteja sua conta" : "Confirme seu acesso"}</h1><p>{enrolling ? "Configure um aplicativo autenticador para liberar as funções administrativas." : "Digite o código atual exibido no seu aplicativo autenticador."}</p><ErrorBox message={error} />{enrolling && !setup ? <button className="admin-primary" disabled={busy} onClick={startEnrollment}>{busy ? "Preparando…" : "Configurar autenticador"}</button> : <form onSubmit={confirm}>{setup && <><img className="mfa-qr" src={setup.qrCode} alt="QR Code para configurar o aplicativo autenticador" /><p className="mfa-help">Escaneie o QR Code com Google Authenticator, Microsoft Authenticator, Authy ou outro aplicativo TOTP.</p><details><summary>Não consegue escanear?</summary><code className="mfa-secret">{setup.secret}</code></details></>}<OtpInput label="Código de 6 dígitos" value={code} onChange={setCode} /><button className="admin-primary" disabled={busy || code.length !== 6}>{busy ? "Confirmando…" : enrolling ? "Ativar e entrar" : "Confirmar e entrar"}</button></form>}<button className="admin-link" onClick={onLogout}>Voltar ao login</button></div></main>;
}

function AssistedMode({ onNotice }) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState({ active: false, expiresAt: 0 });
  useEffect(() => window.panelAssistant?.onState?.(setState), []);
  const remaining = state.active ? Math.max(0, Math.ceil((state.expiresAt - Date.now()) / 60000)) : 0;
  async function activate(event) {
    event.preventDefault();
    setBusy(true);
    onNotice("");
    try {
      const accessToken = await authorizeAssistant(code);
      const next = await window.panelAssistant.start(accessToken);
      setState(next);
      setCode("");
      setOpen(false);
      onNotice("Modo assistido autorizado por 1 hora. Ações manuais pausam a automação.");
    } catch (error) {
      onNotice(panelErrorMessage("assistant-authorization", error));
    } finally {
      setBusy(false);
    }
  }
  async function disconnect() {
    setBusy(true);
    try {
      await window.panelAssistant?.stop?.();
      setState({ active: false, expiresAt: 0 });
      onNotice("Modo assistido desconectado.");
    } finally {
      setBusy(false);
    }
  }
  if (!window.panelAssistant) return null;
  return <div className={`assistant-mode ${state.active ? "active" : ""}`}>
    <div><ShieldCheck size={18} /><span><strong>{state.active ? "Codex conectado" : "Modo assistido desativado"}</strong><small>{state.active ? `Expira em até ${remaining} min · sua interação pausa o trabalho` : "Controle local sem usar seu mouse ou teclado"}</small></span></div>
    {state.active ? <><button className="admin-quiet" disabled={busy} onClick={() => setOpen(true)}>Renovar 1 hora</button><button className="admin-quiet danger" disabled={busy} onClick={disconnect}>Desconectar agora</button></> : <button className="admin-quiet" onClick={() => { setOpen(true); onNotice(""); }}>Ativar modo assistido</button>}
    {open && <div className="assistant-dialog" role="dialog" aria-modal="true" aria-labelledby="assistant-title"><form onSubmit={activate}><h2 id="assistant-title">Autorizar por 1 hora</h2><p>Digite o código atual de 6 dígitos do aplicativo autenticador no seu celular.</p><OtpInput autoFocus label="Código do autenticador" value={code} onChange={setCode} /><div><button type="button" className="admin-quiet" onClick={() => { setOpen(false); setCode(""); }}>Cancelar</button><button className="admin-primary" disabled={busy || code.length !== 6}>{busy ? "Confirmando…" : "Autorizar conexão"}</button></div></form></div>}
  </div>;
}

export default function AdminPanel() {
  const [authState, setAuthState] = useState({ step: "loading", factors: [] }); const [notice, setNotice] = useState(""); const [passwordForm, setPasswordForm] = useState({ password: "", confirm: "" }); const [showPasswordForm, setShowPasswordForm] = useState(false); const [passwordBusy, setPasswordBusy] = useState(false); const [locked,setLocked]=useState(false); const [sensitive,setSensitive]=useState(null);
  useEffect(() => { let active = true; getAuthState().then(state => { if (active) setAuthState(state); }).catch(error => { panelErrorMessage('session-restore-screen',error);if (active) setAuthState({ step: "login", factors: [] }); }); return () => { active = false; }; }, []);
  useEffect(() => {
    if (authState.step !== "ready") return;
    let lastActivity = Date.now();
    const mark = event => { if (event.isTrusted && !locked) lastActivity = Date.now(); };
    const timer = setInterval(() => { if (!locked && Date.now() - lastActivity >= 90 * 60 * 1000) setLocked(true); }, 30000);
    for (const type of ["pointerdown", "keydown", "input", "change"]) document.addEventListener(type, mark, true);
    const removeLockListener = window.panelWindow?.onLockScreen?.(() => setLocked(true));
    return () => { clearInterval(timer);for (const type of ["pointerdown", "keydown", "input", "change"]) document.removeEventListener(type, mark, true);removeLockListener?.(); };
  }, [authState.step, locked]);
  useEffect(() => registerSensitiveActionHandler(reason => new Promise(resolve => setSensitive({ reason, resolve }))), []);
  async function logout() { try { await clearAdminToken(); } catch(error) { setNotice(panelErrorMessage('sign-out-screen',error)); } finally { setAuthState({ step: "login", factors: [] }); } }
  if (authState.step === "loading") return <main className="admin-login"><div className="admin-login-card"><p role="status">Verificando sessão…</p></div></main>;
  if (authState.step === "login") return <Login onAuthenticated={setAuthState} />;
  if (authState.step !== "ready") return <MfaGate authState={authState} onReady={setAuthState} onLogout={logout} />;
  async function changePassword(event) { event.preventDefault(); if (passwordForm.password.length < 8) return setNotice("A nova senha deve ter pelo menos 8 caracteres."); if (passwordForm.password !== passwordForm.confirm) return setNotice("A confirmação da senha não confere."); setPasswordBusy(true); setNotice(""); try { await updatePassword(passwordForm.password); setPasswordForm({ password: "", confirm: "" }); setShowPasswordForm(false); setNotice("Senha alterada com sucesso."); } catch (e) { setNotice(panelErrorMessage('password-update-screen',e)); } finally { setPasswordBusy(false); } }
  return <div className="admin-shell"><header className="admin-top"><div><span className="admin-mark">BPV</span><div><strong>Painel local</strong><small>Vitrine de produtos · gestão protegida</small></div></div><div className="admin-top-actions"><button className="admin-quiet" onClick={async () => { if(await requireSensitiveAction("trocar a senha")){setShowPasswordForm(value => !value);setNotice("");} }}>Trocar senha</button><button className="admin-quiet" onClick={logout}><LogOut size={17} /> Sair</button></div></header><AssistedMode onNotice={setNotice} />{showPasswordForm && <form className="admin-password-form" onSubmit={changePassword}><label>Nova senha<input type="password" minLength="8" required value={passwordForm.password} onChange={e => setPasswordForm({ ...passwordForm, password: e.target.value })} /></label><label>Confirmar nova senha<input type="password" minLength="8" required value={passwordForm.confirm} onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })} /></label><button className="admin-primary" disabled={passwordBusy}>{passwordBusy ? "Salvando…" : "Salvar nova senha"}</button></form>}{notice&&<div className="admin-alert" role="status">{notice}</div>}<Offers/>{locked&&<SecurityPrompt required onConfirmed={()=>setLocked(false)}/>} {sensitive&&<SecurityPrompt reason={sensitive.reason} onConfirmed={()=>{sensitive.resolve(true);setSensitive(null);}} onCancel={()=>{sensitive.resolve(false);setSensitive(null);}}/>}</div>;
}
