import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

const SCRIPT_ID = "cloudflare-turnstile-script";

const TurnstileWidget = forwardRef(function TurnstileWidget({ onToken }, ref) {
  const container = useRef(null);
  const widget = useRef(null);
  const sitekey = process.env.REACT_APP_TURNSTILE_SITE_KEY;

  useImperativeHandle(ref, () => ({
    reset() {
      onToken("");
      if (widget.current != null && window.turnstile) window.turnstile.reset(widget.current);
    },
  }), [onToken]);

  useEffect(() => {
    if (!sitekey) return undefined;
    let cancelled = false;
    const render = () => {
      if (cancelled || !container.current || !window.turnstile || widget.current != null) return;
      widget.current = window.turnstile.render(container.current, {
        sitekey, action: "application-init", language: "pt-BR", size: "flexible",
        callback: token => onToken(token),
        "expired-callback": () => onToken(""),
        "error-callback": () => onToken(""),
      });
    };
    const existing = document.getElementById(SCRIPT_ID);
    if (window.turnstile) render();
    else if (existing) existing.addEventListener("load", render);
    else {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.addEventListener("load", render);
      document.head.appendChild(script);
    }
    return () => {
      cancelled = true;
      existing?.removeEventListener("load", render);
      if (widget.current != null && window.turnstile) window.turnstile.remove(widget.current);
      widget.current = null;
    };
  }, [sitekey, onToken]);

  if (!sitekey) return <p className="field-error">A verificação de segurança ainda não foi configurada.</p>;
  return <div ref={container} aria-label="Verificação de segurança" />;
});

export default TurnstileWidget;
