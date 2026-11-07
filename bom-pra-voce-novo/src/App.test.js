import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SiteRoutes } from "./Routes";
jest.mock('./services/productShowcase',()=>({getProductShowcase:async()=>({serverTime:Date.parse('2026-10-28T12:00:00-03:00'),version:'empty',campaigns:[],nextChangeAt:null})}));
beforeAll(() => { Element.prototype.scrollIntoView = jest.fn(); });
function renderRoute(route = "/") {
  return render(<MemoryRouter initialEntries={[route]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><SiteRoutes /></MemoryRouter>);
}

test("store section anchors restore focus and scroll on the dedicated page", async () => {
  renderRoute("/nossa-loja#setores");
  const sector = await screen.findByRole("region", { name: "Conheça nossos setores" }, { timeout: 10000 });
  await waitFor(() => expect(sector).toHaveFocus());
  expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
});
test("real mounted routes show informative home, navigation and no fake actions", async () => {
  renderRoute();
  expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent("Bom Pra Você Supermercado");
  expect(screen.queryByRole("heading", { name: "Formas de pagamento aceitas" })).not.toBeInTheDocument();
  expect(screen.queryByRole("region", { name: "Conheça nossos setores" })).not.toBeInTheDocument();
  expect(screen.queryByRole("heading", { name: "Como chegar e quando visitar" })).not.toBeInTheDocument();
  expect(await screen.findByRole("heading", { name: 'Ofertas da semana' })).toBeInTheDocument();
  const primaryNavigation = screen.getByRole("navigation", { name: "Principal" });
  const primaryLinks = within(primaryNavigation).getAllByRole("link");
  expect(within(primaryNavigation).queryByRole("link", { name: "Início" })).not.toBeInTheDocument();
  expect(primaryLinks.map(link => link.textContent)).toEqual([
    "Ofertas", "Sobre", "Dúvidas", "Nossa loja", "Trabalhe conosco", "Pagamentos"
  ]);
  expect(primaryLinks.filter(link => link.hasAttribute("aria-current"))).toHaveLength(1);
  expect(within(primaryNavigation).getByRole("link", { name: "Trabalhe conosco" })).toHaveAttribute("href", "/trabalhe-conosco");
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
test("store page reuses sectors, location and opening hours", async () => {
  renderRoute("/nossa-loja");
  expect(await screen.findByRole("region", { name: "Conheça nossos setores" }, { timeout: 10000 })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Como chegar e quando visitar" })).toBeInTheDocument();
  expect(within(screen.getByRole("navigation", { name: "Principal" })).getByRole("link", { name: "Nossa loja" })).toHaveAttribute("aria-current", "location");
});
test("payment methods have a dedicated page and are removed from home", async () => {
  renderRoute("/formas-de-pagamento");
  expect(await screen.findByRole("heading", { level: 1, name: "Formas de pagamento" }, { timeout: 10000 })).toBeInTheDocument();
  expect(screen.getByRole("list", { name: "Bandeiras e formas de pagamento aceitas" })).toHaveTextContent("Pix");
  expect(screen.getByRole("list", { name: "Alimentação e refeição" })).toHaveTextContent("Alelo");
  expect(screen.getByRole("list", { name: "Crédito" })).toHaveTextContent("Mastercard");
  expect(screen.getByRole("list", { name: "Débito" })).toHaveTextContent("Visa Electron");
  expect(screen.getByRole("list", { name: "À vista e digitais" })).toHaveTextContent("Dinheiro");
  expect(screen.getByRole("list", { name: "À vista e digitais" })).toHaveTextContent("PicPay");
  expect(screen.getByRole("complementary", { name: "Transparência no pagamento" })).toHaveTextContent("Não exigimos valor mínimo");
  expect(screen.getByRole("img", { name: "Cartões e pagamentos aceitos no Bom Pra Você Supermercado" })).toBeInTheDocument();
  expect(within(screen.getByRole("navigation", { name: "Principal" })).getByRole("link", { name: "Pagamentos" })).toHaveAttribute("aria-current", "location");
});
test("mobile navigation closes when clicking outside the header", async () => {
  renderRoute("/trabalhe-conosco");
  const menu = await screen.findByRole("button", { name: "Menu" }, { timeout: 10000 });
  fireEvent.click(menu);
  expect(menu).toHaveAttribute("aria-expanded", "true");
  fireEvent.pointerDown(screen.getByRole("main"));
  expect(menu).toHaveAttribute("aria-expanded", "false");
});
test("header scroll state stays stable while its size transition changes the scroll offset", async () => {
  Object.defineProperty(window, "scrollY", { configurable: true, writable: true, value: 0 });
  const { unmount } = renderRoute("/termos");
  const header = (await screen.findAllByRole("banner"))[0];

  window.scrollY = 49;
  fireEvent.scroll(window);
  expect(header).toHaveClass("is-scrolled");

  // The compact header is about 20 px shorter on desktop. Remaining inside
  // this neutral band must not switch the class back and start a flicker loop.
  window.scrollY = 24;
  fireEvent.scroll(window);
  expect(header).toHaveClass("is-scrolled");

  window.scrollY = 12;
  fireEvent.scroll(window);
  expect(header).not.toHaveClass("is-scrolled");

  unmount();
  window.scrollY = 0;
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
