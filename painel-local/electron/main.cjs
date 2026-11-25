const { app, BrowserWindow, dialog, ipcMain, powerMonitor, shell } = require("electron");
const path = require("node:path");
const { createAssistantController } = require("./assistant.cjs");

function createWindow() {
  let closeState = "saved";
  let allowClose = false;
  const window = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 640,
    show: false,
    autoHideMenuBar: true,
    title: "Bom Pra Você - Painel local",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  // The accented productName can become a malformed User-Agent byte sequence
  // in Electron on Windows. Supabase Auth stores that header when opening a session.
  window.webContents.setUserAgent(window.webContents.getUserAgent().replace(/[^\x20-\x7E]/g, ""));

  // Surface the panel's structured diagnostics in the npm/Electron terminal.
  window.webContents.on('console-message', ({ message }) => {
    if (typeof message !== 'string' || !message.startsWith('[BPV] ')) return;
    try {
      const data = JSON.parse(message.slice(6));
      const safe = value => typeof value === 'string' && /^[A-Za-z0-9_.:-]{1,80}$/.test(value) ? value : undefined;
      console.error('[BPV]', JSON.stringify({ at: safe(data.at), operation: safe(data.operation), kind: safe(data.kind), code: safe(data.code), remoteCode: safe(data.remoteCode), status: Number.isInteger(data.status) ? data.status : 0, cause: safe(data.cause), requestId: safe(data.requestId) }));
    } catch { /* Ignore console text outside the diagnostics format. */ }
  });
  window.webContents.on('render-process-gone', (_event, details) => {
    console.error('[BPV] renderer stopped', { reason: details.reason, exitCode: details.exitCode });
  });

  window.once("ready-to-show", () => window.show());
  window.webContents.session.setPermissionRequestHandler((_webContents, _permission, callback) => callback(false));
  window.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https://")) shell.openExternal(url);
    return { action: "deny" };
  });

  createAssistantController({ app, ipcMain, window });
  const lockScreenListener = () => {
    if (!window.isDestroyed()) window.webContents.send("bpv-lock-screen");
  };
  powerMonitor.on("lock-screen", lockScreenListener);

  const closeStateListener = (event, status) => {
    if (event.sender === window.webContents && ["saved", "pending", "saving", "error", "loading"].includes(status)) closeState = status;
  };
  ipcMain.on("bpv-close-state", closeStateListener);
  window.on("close", event => {
    if (allowClose || !["pending", "saving", "error"].includes(closeState)) return;
    event.preventDefault();
    const saving = closeState !== "error";
    const choice = dialog.showMessageBoxSync(window, {
      type: saving ? "info" : "warning",
      title: "Alterações ainda não salvas",
      message: saving ? "O painel ainda está salvando suas alterações." : "Algumas alterações não puderam ser salvas.",
      detail: saving ? "Aguarde alguns instantes e tente fechar novamente, ou feche sem salvar." : "Continue no painel para tentar novamente, ou feche sem salvar as alterações pendentes.",
      buttons: [saving ? "Aguardar" : "Continuar no painel", "Fechar sem salvar"],
      defaultId: 0,
      cancelId: 0,
      noLink: true
    });
    if (choice === 1) { allowClose = true; window.close(); }
  });
  window.on("closed", () => {
    ipcMain.removeListener("bpv-close-state", closeStateListener);
    powerMonitor.removeListener("lock-screen", lockScreenListener);
  });

  const devUrl = process.env.VITE_DEV_SERVER_URL;
  const loadPromise = devUrl
    ? window.loadURL(devUrl)
    : window.loadFile(path.join(__dirname, "..", "dist", "index.html"));

  if (process.env.BPV_ELECTRON_SMOKE === "1") {
    loadPromise.then(async () => {
      await window.webContents.executeJavaScript("console.error('[BPV] {\"operation\":\"smoke\",\"code\":\"TEST\"}')");
      console.log("BPV_ELECTRON_USER_AGENT_ASCII", /^[\x20-\x7E]+$/.test(window.webContents.getUserAgent()));
      console.log("BPV_ELECTRON_READY");
      app.quit();
    }).catch(error => {
      console.error(error);
      app.exit(1);
    });
  }
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
