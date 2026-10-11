import React from "react";
import { afterEach, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import InstagramPublications from "./InstagramPublications";
import { listSocialPublications, retrySocialPublication } from "./services/adminApi";

vi.mock("./services/adminApi", () => ({ listSocialPublications: vi.fn(), retrySocialPublication: vi.fn() }));

afterEach(() => { cleanup(); vi.clearAllMocks(); });

test("shows a failed Story and places it back in the queue", async () => {
  listSocialPublications
    .mockResolvedValueOnce([{ id: "story", campaign_title: "Ofertas de sábado", surface: "story", status: "failed", scheduled_at: "2026-10-09T12:00:00Z", failure_message: "Token expirado" }])
    .mockResolvedValueOnce([{ id: "story", campaign_title: "Ofertas de sábado", surface: "story", status: "queued", scheduled_at: "2026-10-09T12:00:00Z" }]);
  retrySocialPublication.mockResolvedValue({ id: "story", status: "queued" });
  render(<InstagramPublications notice="" setNotice={vi.fn()} />);
  expect(await screen.findByText("Token expirado")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
  await waitFor(() => expect(retrySocialPublication).toHaveBeenCalledWith("story"));
  expect(await screen.findByText("Na fila")).toBeTruthy();
});
