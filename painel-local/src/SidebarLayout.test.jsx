import React from "react";
import { afterEach, expect, test, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import SidebarLayout from "./SidebarLayout";

afterEach(() => { cleanup(); vi.useRealTimers(); });
test("closes after ten seconds outside, resets on hover and preserves editing", () => {
  vi.useFakeTimers();
  render(<SidebarLayout tab="offers" onSelect={vi.fn()}><input aria-label="Título" defaultValue="Oferta em edição" /></SidebarLayout>);
  const sidebar = screen.getByLabelText("Menu do painel");
  act(() => vi.advanceTimersByTime(9000));
  expect(sidebar.hidden).toBe(false);
  fireEvent.mouseEnter(sidebar);
  act(() => vi.advanceTimersByTime(20000));
  expect(sidebar.hidden).toBe(false);
  fireEvent.mouseLeave(sidebar);
  act(() => vi.advanceTimersByTime(9999));
  expect(sidebar.hidden).toBe(false);
  act(() => vi.advanceTimersByTime(1));
  expect(sidebar.hidden).toBe(true);
  fireEvent.click(screen.getByRole("button", { name: "Abrir menu" }));
  expect(sidebar.hidden).toBe(false);
  fireEvent.click(screen.getByRole("button", { name: "Fechar menu" }));
  expect(sidebar.hidden).toBe(true);
  expect(screen.getByLabelText("Título").value).toBe("Oferta em edição");
});
test("does not hide keyboard navigation while focused and supports Escape", () => {
  vi.useFakeTimers();
  render(<SidebarLayout tab="offers" onSelect={vi.fn()} />);
  const sidebar = screen.getByLabelText("Menu do painel");
  act(() => screen.getByRole("button", { name: "Ofertas" }).focus());
  act(() => vi.advanceTimersByTime(10000));
  expect(sidebar.hidden).toBe(false);
  fireEvent.keyDown(sidebar, { key: "Escape" });
  expect(sidebar.hidden).toBe(true);
  expect(document.activeElement).toBe(screen.getByRole("button", { name: "Abrir menu" }));
});
