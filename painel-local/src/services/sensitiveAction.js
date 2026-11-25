let handler = null;

export function registerSensitiveActionHandler(nextHandler) {
  handler = nextHandler;
  return () => { if (handler === nextHandler) handler = null; };
}

export async function requireSensitiveAction(reason) {
  if (!handler) throw new Error("A confirmação de segurança não está disponível.");
  return handler(reason);
}
