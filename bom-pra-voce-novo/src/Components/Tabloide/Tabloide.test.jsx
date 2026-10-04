import { fireEvent, render, screen } from "@testing-library/react";
import Tabloide from "./Tabloide";
import usePromotions from "../../hooks/usePromotions";

jest.mock("../../hooks/usePromotions");

const campaign = (id, title) => ({
  id, title, summary: `Resumo ${title}`, conditions: "Condições",
  starts_at: "2026-10-04T03:00:00Z", ends_at: "2026-10-06T03:00:00Z",
  starts: Date.parse("2026-10-04T03:00:00Z"), ends: Date.parse("2026-10-06T03:00:00Z"),
  file_url: `https://example.supabase.co/storage/v1/object/public/promotion-public/${id}.png`,
  mime_type: "image/png", size_bytes: 1000, category_key: id === "one" ? "meat-frozen" : "home-baby", display_order: id === "one" ? 10 : 20,
});

test("renders flyer images and navigates the carousel", () => {
  usePromotions.mockReturnValue({ status: "ready", campaigns: [campaign("one", "Primeiro"), campaign("two", "Segundo")], reload: jest.fn() });
  render(<Tabloide />);
  expect(screen.getByRole("img", { name: "Panfleto Primeiro" })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("tab", { name: "Utilidades e bebê" }));
  expect(screen.getByRole("img", { name: "Panfleto Segundo" })).toBeInTheDocument();
  fireEvent.keyDown(screen.getByRole("region", { name: "Panfletos vigentes" }), { key: "ArrowLeft" });
  expect(screen.getByRole("img", { name: "Panfleto Primeiro" })).toBeInTheDocument();
});
