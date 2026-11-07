import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CandidaturaForm from "./CandidaturaForm";
import { createApplicationSession } from "../../services/applications";
jest.mock("./TurnstileWidget", () => {
  const React = require("react");
  return React.forwardRef(function FakeTurnstile({ onToken }, ref) {
    React.useImperativeHandle(ref, () => ({ reset: () => onToken("") }));
    React.useEffect(() => { onToken("test-challenge"); }, [onToken]);
    return <div aria-label="Verificação de segurança" />;
  });
});
jest.mock("../../services/applications", () => ({
  ...jest.requireActual("../../services/applications"),
  createApplicationSession: jest.fn(),
}));
test("failed submission preserves fields, retry confirms and printing never resubmits", async () => {
  const submit = jest.fn().mockRejectedValueOnce(new Error("network")).mockResolvedValueOnce({
    protocol: "BPV-2026-" + "a".repeat(32), received_at: "2026-10-01T12:00:00Z",
    candidate_name: "Pessoa Teste", file_name: "cv.pdf", area: "",
  });
  createApplicationSession.mockReturnValue({ submit });
  window.print = jest.fn();
  render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><CandidaturaForm /></MemoryRouter>);
  fireEvent.change(screen.getByLabelText("Nome completo"), { target: { value: "Pessoa Teste" } });
  fireEvent.change(screen.getByLabelText("E-mail"), { target: { value: "teste@example.com" } });
  fireEvent.change(screen.getByLabelText("Cidade / região administrativa (opcional)"), { target: { value: "Ceilândia - DF" } });
  fireEvent.change(screen.getByLabelText("Bairro / setor (opcional)"), { target: { value: "Setor P Sul" } });
  fireEvent.change(screen.getByLabelText("Currículo em PDF"), { target: { files: [new File(["%PDF-1.4 teste %%EOF"], "cv.pdf", { type: "application/pdf" })] } });
  await waitFor(() => expect(screen.getByRole("button", { name: "Enviar currículo" })).toBeEnabled());
  fireEvent.click(screen.getByRole("button", { name: "Enviar currículo" }));
  expect(await screen.findByText("Recebimento não confirmado")).toBeInTheDocument();
  expect(screen.queryByText("Currículo recebido")).not.toBeInTheDocument();
  expect(screen.getByLabelText("Nome completo")).toHaveValue("Pessoa Teste");
  expect(screen.getByLabelText("Nome completo")).toBeDisabled();
  expect(screen.getByLabelText("Cidade / região administrativa (opcional)")).toBeDisabled();
  expect(screen.getByLabelText("Bairro / setor (opcional)")).toHaveValue("Setor P Sul");
  expect(createApplicationSession).toHaveBeenCalledWith(expect.objectContaining({ address: "Ceilândia - DF — Setor P Sul" }), expect.any(File), "test-challenge");
  fireEvent.click(screen.getByRole("button", { name: "Tentar confirmar novamente" }));
  expect(await screen.findByRole("heading", { name: "Currículo recebido" })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Imprimir ou salvar em PDF" }));
  await waitFor(() => expect(window.print).toHaveBeenCalledTimes(1));
  expect(submit).toHaveBeenCalledTimes(2);
  expect(createApplicationSession).toHaveBeenCalledTimes(1);
});

test("drop reads and validates PDF, rejects multiple files and exposes age choices", async () => {
  render(<MemoryRouter><CandidaturaForm /></MemoryRouter>);
  expect(screen.queryByLabelText("Data de nascimento")).not.toBeInTheDocument();
  expect(screen.getByLabelText("Idade (15 a 60 anos)").options).toHaveLength(47);
  const zone = screen.getByRole("button", { name: "Selecionar ou arrastar currículo em PDF" });
  const pdf = new File(["%PDF-1.4 test %%EOF"], "valido.pdf", { type: "application/pdf" });
  fireEvent.dragEnter(zone, { dataTransfer: { files: [pdf] } });
  expect(zone).toHaveClass("is-dragging");
  fireEvent.drop(zone, { dataTransfer: { files: [pdf] } });
  expect(await screen.findByText("valido.pdf")).toBeInTheDocument();
  expect(zone).not.toHaveClass("is-dragging");
  fireEvent.drop(zone, { dataTransfer: { files: [pdf, pdf] } });
  expect(await screen.findByText("Selecione apenas um currículo.", { selector: ".field-error" })).toBeInTheDocument();
  const fake = new File(["not a PDF"], "falso.pdf", { type: "application/pdf" });
  fireEvent.drop(zone, { dataTransfer: { files: [fake] } });
  expect(await screen.findByText("O arquivo não é um PDF válido.", { selector: ".field-error" })).toBeInTheDocument();
});
