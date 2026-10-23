import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SiteRoutes } from "./Routes";
beforeAll(() => { Element.prototype.scrollIntoView = jest.fn(); });
function renderRoute(route = "/") {
  return render(<MemoryRouter initialEntries={[route]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><SiteRoutes /></MemoryRouter>);
}

test("repeated section navigation restores focus and scroll", async () => {
  renderRoute("/#setores");
  const sector = await screen.findByRole("region", { name: "Conheça nossos setores" });
  await waitFor(() => expect(sector).toHaveFocus());
  const link = within(screen.getByRole("navigation", { name: "Rodapé" })).getByRole("link", { name: "Setores" });
  link.focus();
  Element.prototype.scrollIntoView.mockClear();
  fireEvent.click(link);
  await waitFor(() => expect(sector).toHaveFocus());
  expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
});
test("real mounted routes show informative home, navigation and no fake actions", async () => {
  renderRoute();
  expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent("Bom Pra Você Supermercado");
  expect(screen.getByRole("heading", { name: "Formas de pagamento aceitas" })).toBeInTheDocument();
  expect(screen.getByRole("list", { name: "Bandeiras e formas de pagamento aceitas" })).toHaveTextContent("Pix");
  expect(screen.getByRole("img", { name: "Cartões e pagamentos aceitos no Bom Pra Você Supermercado" })).toBeInTheDocument();
  expect(await screen.findByRole("heading", { name: /Ofertas da loja|Sem ofertas vigentes no momento|Panfletos indisponíveis no momento|Não conseguimos consultar as ofertas/ })).toBeInTheDocument();
  const menu = screen.getByRole("button", { name: "Menu" });
  fireEvent.click(menu);
  expect(menu).toHaveAttribute("aria-expanded", "true");
  fireEvent.keyDown(menu, { key: "Escape" });
  expect(menu).toHaveAttribute("aria-expanded", "false");
  expect(menu).toHaveFocus();
  expect(screen.getAllByRole("link").some(link => link.getAttribute("href") === "#")).toBe(false);
  expect(screen.queryByText("Inscrever")).not.toBeInTheDocument();
  expect(screen.queryByText("Iniciar o Tour")).not.toBeInTheDocument();
});
test("mobile navigation closes when clicking outside the header", async () => {
  renderRoute("/trabalhe-conosco");
  const menu = await screen.findByRole("button", { name: "Menu" }, { timeout: 10000 });
  fireEvent.click(menu);
  expect(menu).toHaveAttribute("aria-expanded", "true");
  fireEvent.pointerDown(screen.getByRole("main"));
  expect(menu).toHaveAttribute("aria-expanded", "false");
});
test("career route fails closed until receiving and privacy are ready", async () => {
  renderRoute("/trabalhe-conosco");
  expect(await screen.findByRole("heading", { name: "Envio de currículos indisponível no momento" })).toBeInTheDocument();
  expect(screen.getAllByRole("banner")[0]).toHaveClass("site-header");
  expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  expect(within(screen.getByRole("navigation", { name: "Principal" })).getByRole("link", { name: "Trabalhe conosco" })).toHaveAttribute("aria-current", "location");
  expect(screen.queryByLabelText("Currículo em PDF")).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Enviar currículo" })).not.toBeInTheDocument();
});
test("no administrative route or public protocol lookup is provided", async () => {
  renderRoute("/admin/curriculos");
  expect(await screen.findByRole("heading", { name: "Página não encontrada" })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("link", { name: "Voltar ao início" }));
  await waitFor(() => expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Bom Pra Você Supermercado"));
});

test("legal routes with trailing slash retain canonical metadata", async () => {
  renderRoute("/termos/");
  expect(await screen.findByRole("heading", { name: "Termos de uso" })).toBeInTheDocument();
  await waitFor(() => expect(document.title).toBe("Termos de uso | Bom Pra Você"));
  // Head metadata has no accessible role; inspect the actual document contract.
  // eslint-disable-next-line testing-library/no-node-access
  expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute("href", "https://www.bompravocesupermercado.com.br/termos");
  // eslint-disable-next-line testing-library/no-node-access
  expect(document.querySelector('meta[name="robots"]')).toHaveAttribute("content", "index,follow");
});
