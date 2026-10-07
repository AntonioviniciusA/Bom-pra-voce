const { spawn } = require("node:child_process");
const path = require("node:path");

const bin = name => path.join(__dirname, "..", "node_modules", ".bin", process.platform === "win32" ? `${name}.cmd` : name);
const vite = spawn(bin("vite"), [], { stdio: "inherit", shell: process.platform === "win32" });
let electron;
let stopping = false;

async function waitForVite() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (vite.exitCode !== null) throw new Error("O servidor da interface foi encerrado antes de ficar pronto.");
    try {
      const response = await fetch("http://127.0.0.1:5174", { signal: AbortSignal.timeout(1000) });
      if (response.ok) return;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  throw new Error("Tempo esgotado ao iniciar a interface do painel.");
}

function stop(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  if (electron?.exitCode === null) electron.kill();
  if (vite.exitCode === null) vite.kill();
  process.exitCode = exitCode;
}

waitForVite().then(() => {
  electron = spawn(bin("electron"), ["."], {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: { ...process.env, VITE_DEV_SERVER_URL: "http://127.0.0.1:5174" }
  });
  electron.on("exit", code => stop(code || 0));
}).catch(error => {
  console.error(error.message);
  stop(1);
});

vite.on("exit", code => {
  if (!stopping) stop(code || 1);
});
process.on("SIGINT", () => stop(0));
process.on("SIGTERM", () => stop(0));
