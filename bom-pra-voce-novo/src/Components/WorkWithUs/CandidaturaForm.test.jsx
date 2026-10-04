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
  fireEvent.change(screen.getByLabelText("Currículo em PDF"), { target: { files: [new File(["%PDF"], "cv.pdf", { type: "application/pdf" })] } });
  await waitFor(() => expect(screen.getByRole("button", { name: "Enviar currículo" })).toBeEnabled());
  fireEvent.click(screen.getByRole("button", { name: "Enviar currículo" }));
  expect(await screen.findByText("Recebimento não confirmado")).toBeInTheDocument();
  expect(screen.queryByText("Currículo recebido")).not.toBeInTheDocument();
  expect(screen.getByLabelText("Nome completo")).toHaveValue("Pessoa Teste");
  expect(screen.getByLabelText("Nome completo")).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "Tentar confirmar novamente" }));
  expect(await screen.findByRole("heading", { name: "Currículo recebido" })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Imprimir ou salvar em PDF" }));
  await waitFor(() => expect(window.print).toHaveBeenCalledTimes(1));
  expect(submit).toHaveBeenCalledTimes(2);
  expect(createApplicationSession).toHaveBeenCalledTimes(1);
});
