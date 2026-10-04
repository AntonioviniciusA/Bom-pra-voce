import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SiteRoutes } from "./Routes";
beforeAll(() => { Element.prototype.scrollIntoView = jest.fn(); });
function renderRoute(route = "/") {
  return render(<MemoryRouter initialEntries={[route]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><SiteRoutes /></MemoryRouter>);
}
test("real mounted routes show informative home, navigation and no fake actions", async () => {
  renderRoute();
  expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent("Bom Pra Você Supermercado");
  expect(screen.getByRole("heading", { name: "Pagamentos na loja" })).toBeInTheDocument();
  expect(await screen.findByRole("heading", { name: /Panfletos indisponíveis no momento|Não conseguimos consultar as ofertas/ })).toBeInTheDocument();
  const menu = screen.getByRole("button", { name: "Menu" });
  fireEvent.click(menu);
  expect(menu).toHaveAttribute("aria-expanded", "true");
  fireEvent.keyDown(menu, { key: "Escape" });
  expect(menu).toHaveAttribute("aria-expanded", "false");
  expect(menu).toHaveFocus();
  expect(document.querySelectorAll('a[href="#"]').length).toBe(0);
  expect(screen.queryByText("Inscrever")).not.toBeInTheDocument();
  expect(screen.queryByText("Iniciar o Tour")).not.toBeInTheDocument();
});
test("career route fails closed until receiving and privacy are ready", async () => {
  renderRoute("/trabalhe-conosco");
  expect(await screen.findByRole("heading", { name: "Envio de currículos indisponível no momento" })).toBeInTheDocument();
  expect(screen.queryByLabelText("Currículo em PDF")).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Enviar currículo" })).not.toBeInTheDocument();
});
test("no administrative route or public protocol lookup is provided", async () => {
  renderRoute("/admin/curriculos");
  expect(await screen.findByRole("heading", { name: "Página não encontrada" })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("link", { name: "Voltar ao início" }));
  await waitFor(() => expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Bom Pra Você Supermercado"));
});
