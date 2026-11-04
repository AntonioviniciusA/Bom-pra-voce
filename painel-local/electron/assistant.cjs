"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");

const SESSION_MS = 60 * 60 * 1000;
const MAX_BODY_BYTES = 12 * 1024 * 1024;
const USER_IDLE_MS = 2500;

function decodeJwtPayload(token) {
  try {
    const encoded = String(token || "").split(".")[1];
    if (!encoded) return null;
    return JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

function freshAal2Token(token, now = Date.now()) {
  const payload = decodeJwtPayload(token);
  if (!payload || payload.aal !== "aal2" || !Number.isInteger(payload.iat)) return false;
  const age = now - payload.iat * 1000;
  return age >= -30_000 && age <= 2 * 60 * 1000;
}

function json(response, status, body) {
  const payload = Buffer.from(JSON.stringify(body));
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": payload.length,
    "cache-control": "no-store",
  });
  response.end(payload);
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    request.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(Object.assign(new Error("Payload muito grande."), { status: 413 }));
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });
    request.on("end", () => {
      try {
        resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString("utf8")) : {});
      } catch {
        reject(Object.assign(new Error("JSON inválido."), { status: 400 }));
      }
    });
    request.on("error", reject);
  });
}

function assistantScript(command) {
  return `(() => {
    const command = ${JSON.stringify(command)};
    const now = Date.now();
    const lastUser = Number(window.__bpvAssistantLastUserInteraction || 0);
    if (now - lastUser < ${USER_IDLE_MS}) return { ok: false, paused: true, code: "USER_ACTIVE" };
    const text = (node) => (node?.textContent || "").replace(/\\s+/g, " ").trim();
    const button = (label) => [...document.querySelectorAll("button")].find((node) => text(node).includes(label));
    const field = (label) => {
      const holder = [...document.querySelectorAll("label")].find((node) => text(node).startsWith(label));
      return holder?.querySelector("input, select, textarea") || null;
    };
    const setValue = (node, value) => {
      if (!node) throw new Error("Campo não encontrado.");
      const prototype = node instanceof HTMLSelectElement ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(prototype, "value").set.call(node, String(value ?? ""));
      node.dispatchEvent(new Event("input", { bubbles: true }));
      node.dispatchEvent(new Event("change", { bubbles: true }));
    };
    if (command.action === "status") return {
      ok: true,
      assistantVersion: 3,
      page: document.querySelector("h1")?.textContent?.trim() || "",
      userActive: now - lastUser < ${USER_IDLE_MS},
      imageProcessing: document.querySelector('[data-image-processing="true"]') !== null,
      saving: button("Salvando produto…") !== undefined,
      validationMessage: document.querySelector('.offer-error')?.textContent?.replace(/\s+/g, ' ').trim() || "",
      invalidFields: [...document.querySelectorAll('.offer-product-form :invalid')].map((node) => ({
        label: text(node.closest('label')) || node.getAttribute('aria-label') || node.name || node.type,
        message: node.validationMessage || "Campo inválido",
      })),
      catalogCount: Number(document.querySelector('[data-catalog-count]')?.dataset.catalogCount || 0),
      form: document.querySelector('.offer-product-form') ? {
        name: field("Nome do produto")?.value || "",
        code: field("Código interno")?.value || "",
        barcode: field("GTIN do produto")?.value || "",
        hasImage: Boolean(document.querySelector('.offer-file img')),
        imageAuthorized: Boolean(field("Tenho autorização de uso")?.checked),
      } : null,
    };
    if (command.action === "navigate-products") {
      const target = document.querySelector(".offer-back") || [...document.querySelectorAll("button")].find((node) => text(node) === "Produtos");
      if (!target) throw new Error("Botão Produtos não encontrado.");
      target.click();
      return { ok: true, draftPreserved: true };
    }
    if (command.action === "cancel-product") {
      const target = [...document.querySelectorAll("button")].find((node) => text(node) === "Cancelar");
      if (!target || !document.querySelector('.offer-product-form')) throw new Error("Botão Cancelar não encontrado.");
      target.click();
      return { ok: true, draftDiscarded: true };
    }
    if (command.action === "open-new-product") {
      const target = button("Cadastrar produto");
      if (!target) throw new Error("Botão Cadastrar produto não encontrado.");
      target.click();
      return { ok: true };
    }
    if (command.action === "set-image-authorization") {
      const checkbox = field("Tenho autorização de uso");
      if (!checkbox) throw new Error("Autorização de imagem não encontrada.");
      if (checkbox.checked !== Boolean(command.authorized)) checkbox.click();
      return { ok: true, imageAuthorized: Boolean(command.authorized) };
    }
    if (command.action === "fill-product") {
      const values = command.product || {};
      const mapping = {
        name: "Nome do produto",
        code: "Código interno",
        brand: "Marca",
        content: "Conteúdo",
        category: "Categoria",
        barcode: "GTIN do produto",
        imageSource: "Origem da imagem",
      };
      for (const [key, label] of Object.entries(mapping)) {
        if (values[key] !== undefined) setValue(field(label), values[key]);
      }
      if (values.imageAuthorized !== undefined) {
        const checkbox = field("Tenho autorização de uso");
        if (!checkbox) throw new Error("Autorização de imagem não encontrada.");
        if (checkbox.checked !== Boolean(values.imageAuthorized)) checkbox.click();
      }
      return { ok: true };
    }
    if (command.action === "attach-image") {
      const input = document.querySelector('.offer-file input[type="file"]');
      if (!input) throw new Error("Seletor de imagem não encontrado.");
      const binary = Uint8Array.from(atob(command.base64), (char) => char.charCodeAt(0));
      const transfer = new DataTransfer();
      transfer.items.add(new File([binary], command.name, { type: command.mime }));
      input.files = transfer.files;
      input.dispatchEvent(new Event("change", { bubbles: true }));
      return new Promise((resolve, reject) => {
        const startedAt = Date.now();
        const check = () => {
          const processing = document.querySelector('[data-image-processing="true"]');
          const preview = document.querySelector('.offer-file img');
          if (!processing && preview) return resolve({ ok: true, processed: true });
          if (Date.now() - startedAt > 30000) return reject(new Error("A imagem não terminou de processar em 30 segundos."));
          setTimeout(check, 100);
        };
        setTimeout(check, 0);
      });
    }
    if (command.action === "save-product") {
      const target = button("Salvar produto");
      if (!target || target.disabled) throw new Error("Produto ainda não pode ser salvo.");
      const form = target.closest('form');
      if (!form?.checkValidity()) {
        const invalid = [...form.querySelectorAll(':invalid')].map((node) => (text(node.closest('label')) || node.type) + ': ' + node.validationMessage).join(' · ');
        throw new Error('Revise os campos inválidos: ' + invalid);
      }
      const initialCount = Number(document.querySelector('[data-catalog-count]')?.dataset.catalogCount || 0);
      target.click();
      return new Promise((resolve, reject) => {
        const startedAt = Date.now();
        const check = () => {
          const form = document.querySelector('.offer-product-form');
          const error = document.querySelector('.offer-error')?.textContent?.replace(/\s+/g, ' ').trim();
          const catalogCount = Number(document.querySelector('[data-catalog-count]')?.dataset.catalogCount || 0);
          if (!form && document.querySelector('[data-catalog-count]')) {
            return resolve({ ok: true, saved: true, catalogCount, increased: catalogCount > initialCount });
          }
          if (error) return reject(new Error(error));
          if (Date.now() - startedAt > 30000) return reject(new Error("O produto não foi confirmado no catálogo em 30 segundos."));
          setTimeout(check, 100);
        };
        setTimeout(check, 0);
      });
    }
    throw new Error("Ação não permitida.");
  })()`;
}

function installUserActivityGuard(window) {
  return window.webContents.executeJavaScript(`(() => {
    if (window.__bpvAssistantGuardInstalled) return true;
    window.__bpvAssistantGuardInstalled = true;
    window.__bpvAssistantLastUserInteraction = 0;
    const mark = (event) => { if (event.isTrusted) window.__bpvAssistantLastUserInteraction = Date.now(); };
    for (const type of ["pointerdown", "keydown", "input", "change"]) {
      document.addEventListener(type, mark, true);
    }
    return true;
  })()`);
}

function createAssistantController({ app, ipcMain, window }) {
  let server = null;
  let session = null;
  const descriptorPath = path.join(os.tmpdir(), "bpv-assistant-session.json");

  function removeDescriptor() {
    try { fs.unlinkSync(descriptorPath); } catch (error) { if (error.code !== "ENOENT") console.error("[BPV] assistant descriptor", error); }
  }

  async function stop(reason = "disabled") {
    const active = server;
    server = null;
    session = null;
    removeDescriptor();
    if (active) await new Promise((resolve) => active.close(resolve));
    if (!window.isDestroyed()) window.webContents.send("bpv-assistant-state", { active: false, reason });
    return { active: false, reason };
  }

  async function execute(command) {
    if (!session || Date.now() >= session.expiresAt) {
      await stop("expired");
      return { ok: false, code: "SESSION_EXPIRED" };
    }
    if (!window.webContents || window.webContents.isDestroyed()) return { ok: false, code: "PANEL_CLOSED" };
    if (command.action === "attach-image") {
      const filePath = path.resolve(String(command.path || ""));
      const extension = path.extname(filePath).toLowerCase();
      if (!path.isAbsolute(filePath) || ![".png", ".jpg", ".jpeg", ".webp"].includes(extension)) {
        return { ok: false, code: "INVALID_IMAGE_PATH" };
      }
      const stat = fs.statSync(filePath);
      if (!stat.isFile() || stat.size > 10 * 1024 * 1024) return { ok: false, code: "INVALID_IMAGE_FILE" };
      command = {
        action: "attach-image",
        name: path.basename(filePath),
        mime: extension === ".png" ? "image/png" : extension === ".webp" ? "image/webp" : "image/jpeg",
        base64: fs.readFileSync(filePath).toString("base64"),
      };
    }
    if (!["status", "navigate-products", "cancel-product", "open-new-product", "fill-product", "set-image-authorization", "attach-image", "save-product"].includes(command.action)) {
      return { ok: false, code: "ACTION_NOT_ALLOWED" };
    }
    try {
      return await window.webContents.executeJavaScript(assistantScript(command), true);
    } catch (error) {
      return { ok: false, code: "PANEL_COMMAND_FAILED", message: String(error.message || error).slice(0, 200) };
    }
  }

  async function start(accessToken) {
    if (!freshAal2Token(accessToken)) throw new Error("Confirmação de dois fatores ausente ou antiga.");
    await stop("renewed");
    await installUserActivityGuard(window);
    const token = crypto.randomBytes(32).toString("base64url");
    const expiresAt = Date.now() + SESSION_MS;
    session = { token, expiresAt };
    server = http.createServer(async (request, response) => {
      if (request.socket.remoteAddress !== "127.0.0.1" && request.socket.remoteAddress !== "::1") return json(response, 403, { ok: false });
      if (request.method !== "POST" || request.url !== "/v1/command") return json(response, 404, { ok: false });
      if (request.headers.authorization !== `Bearer ${token}`) return json(response, 401, { ok: false });
      try { json(response, 200, await execute(await readJson(request))); }
      catch (error) { json(response, error.status || 500, { ok: false, message: String(error.message || error).slice(0, 200) }); }
    });
    await new Promise((resolve, reject) => {
      server.once("error", reject);
      server.listen(0, "127.0.0.1", resolve);
    });
    const port = server.address().port;
    const descriptor = { version: 3, port, token, expiresAt, allowedActions: ["status", "navigate-products", "cancel-product", "open-new-product", "fill-product", "set-image-authorization", "attach-image", "save-product"] };
    fs.writeFileSync(descriptorPath, JSON.stringify(descriptor), { encoding: "utf8", mode: 0o600 });
    window.webContents.send("bpv-assistant-state", { active: true, expiresAt });
    setTimeout(() => { if (session?.expiresAt === expiresAt) stop("expired"); }, SESSION_MS + 1000).unref();
    return { active: true, expiresAt };
  }

  ipcMain.handle("bpv-assistant-start", (event, accessToken) => {
    if (event.sender !== window.webContents) throw new Error("Janela não autorizada.");
    return start(accessToken);
  });
  ipcMain.handle("bpv-assistant-stop", (event) => {
    if (event.sender !== window.webContents) throw new Error("Janela não autorizada.");
    return stop("disabled");
  });
  window.webContents.on("did-finish-load", () => installUserActivityGuard(window).catch(() => {}));
  window.on("closed", () => {
    ipcMain.removeHandler("bpv-assistant-start");
    ipcMain.removeHandler("bpv-assistant-stop");
    stop("closed");
  });
  removeDescriptor();
  return { stop };
}

module.exports = { createAssistantController, decodeJwtPayload, freshAal2Token, SESSION_MS };
