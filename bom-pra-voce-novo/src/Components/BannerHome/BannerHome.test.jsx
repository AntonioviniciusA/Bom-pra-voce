import { render, screen, fireEvent, act } from "@testing-library/react";
import BannerHome, { storeExperience } from "./BannerHome";
test.each([
  ["2026-10-16T12:00:00Z", "há quase 24 anos"],
  ["2026-12-09T02:59:59Z", "há quase 24 anos"],
  ["2026-12-09T03:00:00Z", "há 24 anos"],
  ["2027-10-16T12:00:00Z", "há quase 25 anos"],
])("updates store experience at the anniversary in Brasilia: %s", (date, expected) => {
  expect(storeExperience(new Date(date))).toBe(expected);
});
beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());
test("cycles every three seconds with dot controls", () => {
  render(<BannerHome />);
  expect(screen.getAllByRole("button")).toHaveLength(4);
  act(() => jest.advanceTimersByTime(2999));
  expect(screen.getByRole("button", { name: "Mostrar imagem 1" })).toHaveAttribute("aria-pressed", "true");
  act(() => jest.advanceTimersByTime(1));
  expect(screen.getByRole("button", { name: "Mostrar imagem 2" })).toHaveAttribute("aria-pressed", "true");
  fireEvent.click(screen.getByRole("button", { name: "Mostrar imagem 3" }));
  act(() => jest.advanceTimersByTime(3000));
  expect(screen.getByRole("button", { name: "Mostrar imagem 1" })).toHaveAttribute("aria-pressed", "true");
});
test("pauses while a carousel control has keyboard focus", () => {
  render(<BannerHome />);
  const control = screen.getByRole("button", { name: "Mostrar imagem 1" });
  fireEvent.focus(control);
  act(() => jest.advanceTimersByTime(10000));
  expect(screen.getByRole("button", { name: "Mostrar imagem 1" })).toHaveAttribute("aria-pressed", "true");
  fireEvent.blur(control, { relatedTarget: null });
  act(() => jest.advanceTimersByTime(3000));
  expect(screen.getByRole("button", { name: "Mostrar imagem 2" })).toHaveAttribute("aria-pressed", "true");
});

test("explicit pause persists after keyboard focus leaves the carousel", () => {
  render(<BannerHome />);
  fireEvent.click(screen.getByRole("button", { name: "Pausar destaques" }));
  fireEvent.blur(screen.getByRole("button", { name: "Retomar destaques" }), { relatedTarget: null });
  act(() => jest.advanceTimersByTime(12000));
  expect(screen.getByRole("button", { name: "Mostrar imagem 1" })).toHaveAttribute("aria-pressed", "true");
});
