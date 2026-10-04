import { render, screen, fireEvent, act } from "@testing-library/react";
import BannerHome from "./BannerHome";
beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());
test("cycles every three seconds with dot controls", () => {
  render(<BannerHome />);
  expect(screen.getAllByRole("button")).toHaveLength(3);
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
