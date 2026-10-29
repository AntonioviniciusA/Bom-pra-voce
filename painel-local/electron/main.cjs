const { app, BrowserWindow, shell } = require("electron");
const path = require("node:path");

function createWindow() {
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
