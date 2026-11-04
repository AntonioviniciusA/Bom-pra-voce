import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const descriptorPath = path.join(os.tmpdir(), "bpv-assistant-session.json");

async function main() {
  const raw = process.argv[2];
  if (!raw) throw new Error("Informe um comando JSON.");
  const command = JSON.parse(raw);
  const descriptor = JSON.parse(await fs.readFile(descriptorPath, "utf8"));
  if (Date.now() >= descriptor.expiresAt) throw new Error("A autorização do modo assistido expirou.");
  const response = await fetch(`http://127.0.0.1:${descriptor.port}/v1/command`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${descriptor.token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(command),
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body.message || `Falha HTTP ${response.status}`);
  process.stdout.write(`${JSON.stringify(body)}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
