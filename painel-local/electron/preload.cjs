"use strict";

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("panelWindow", {
  setCloseState(status) { ipcRenderer.send("bpv-close-state", status); },
  onLockScreen(listener) {
    const handler = () => listener();
    ipcRenderer.on("bpv-lock-screen", handler);
    return () => ipcRenderer.removeListener("bpv-lock-screen", handler);
  }
});

contextBridge.exposeInMainWorld("panelAssistant", {
  start(accessToken) { return ipcRenderer.invoke("bpv-assistant-start", accessToken); },
  stop() { return ipcRenderer.invoke("bpv-assistant-stop"); },
  onState(listener) {
    const handler = (_event, state) => listener(state);
    ipcRenderer.on("bpv-assistant-state", handler);
    return () => ipcRenderer.removeListener("bpv-assistant-state", handler);
  }
});
