// Keep terminal logs useful without printing passwords, tokens, request bodies or personal data.
const safeToken=value=>typeof value==='string'&&/^[A-Za-z0-9_.-]{1,80}$/.test(value)?value:undefined;
export function logPanelError(operation, error) {
  if (error?.panelLogged) return;
  const entry = {
    at: new Date().toISOString(),
    operation:safeToken(operation)||'unknown',
    kind:safeToken(error?.name)||'Error',
    code:safeToken(error?.code)||'UNKNOWN',
    remoteCode:safeToken(error?.remoteCode),
    status: Number.isInteger(error?.status) ? error.status : 0,
    cause:safeToken(error?.cause?.name),
    requestId:safeToken(error?.requestId),
  };
  console.error(`[BPV] ${JSON.stringify(entry)}`);
  if (error && typeof error === 'object') error.panelLogged = true;
}

export function panelErrorMessage(operation, error, fallback='Não foi possível concluir a operação. Tente novamente.') {
  logPanelError(operation,error);
  return error instanceof Error && error.message ? error.message : fallback;
}
