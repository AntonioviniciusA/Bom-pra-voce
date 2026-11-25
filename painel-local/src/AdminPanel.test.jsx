import React from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";

const api = vi.hoisted(() => ({
  authorizeAssistant: vi.fn(),
  clearAdminToken: vi.fn(),
  enrollMfa: vi.fn(),
  getAuthState: vi.fn(),
  signIn: vi.fn(),
  updatePassword: vi.fn(),
  verifyMfa: vi.fn(),
}));
vi.mock("./services/adminApi", () => api);
vi.mock("./OffersWorkspace", () => ({ default: () => <div>Área de ofertas</div> }));

import AdminPanel from "./AdminPanel";

beforeEach(() => {
  api.getAuthState.mockResolvedValue({ step: "ready", factors: [{ id: "factor" }] });
  api.authorizeAssistant.mockResolvedValue("fresh-aal2-token");
  window.panelAssistant = {
    onState: vi.fn(() => () => {}),
    start: vi.fn().mockResolvedValue({ active: true, expiresAt: Date.now() + 60 * 60 * 1000 }),
    stop: vi.fn().mockResolvedValue({ active: false }),
  };
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  localStorage.clear();
  delete window.panelAssistant;
});

test("requires the phone authenticator code before opening a one hour assisted session", async () => {
  render(<AdminPanel />);
  fireEvent.click(await screen.findByRole("button", { name: "Ativar modo assistido" }));
  const code = screen.getByLabelText("Código do autenticador");
  expect(document.querySelectorAll(".otp-cell")).toHaveLength(6);
  fireEvent.change(code, { target: { value: "123456" } });
  expect([...document.querySelectorAll(".otp-cell")].map(cell => cell.textContent).join("")).toBe("123456");
  fireEvent.click(screen.getByRole("button", { name: "Autorizar conexão" }));
  await waitFor(() => expect(api.authorizeAssistant).toHaveBeenCalledWith("123456"));
  expect(window.panelAssistant.start).toHaveBeenCalledWith("fresh-aal2-token");
  expect(await screen.findByText("Codex conectado")).toBeTruthy();
});

test("remembers only the last successful login email", async () => {
  localStorage.setItem("bpv-last-admin-email-v1", "lembrado@example.com");
  api.getAuthState.mockResolvedValue({ step: "login", factors: [] });
  api.signIn.mockResolvedValue({ step: "challenge", factors: [{ id: "factor" }] });
  render(<AdminPanel />);
  const email = await screen.findByLabelText("E-mail");
  expect(email.value).toBe("lembrado@example.com");
  fireEvent.change(screen.getByLabelText("Senha"), { target: { value: "segredo-nao-salvo" } });
  fireEvent.click(screen.getByRole("button", { name: "Entrar no painel" }));
  await waitFor(() => expect(api.signIn).toHaveBeenCalledWith("lembrado@example.com", "segredo-nao-salvo"));
  expect(localStorage.getItem("bpv-last-admin-email-v1")).toBe("lembrado@example.com");
  expect(JSON.stringify(localStorage)).not.toContain("segredo-nao-salvo");
});
