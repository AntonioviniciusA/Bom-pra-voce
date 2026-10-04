import { act, renderHook, waitFor } from "@testing-library/react";
import usePromotions from "./usePromotions";
import { getPromotions } from "../services/promotions";
jest.mock("../services/promotions", () => ({ getPromotions: jest.fn() }));
jest.mock("../services/publicApi", () => ({ apiConfig: () => ({ ready: true }) }));
afterEach(() => { jest.clearAllMocks(); jest.useRealTimers(); });
test("stale responses cannot replace a newer request", async () => {
  let resolveOld;
  getPromotions.mockImplementationOnce(() => new Promise(resolve => { resolveOld = resolve; }))
    .mockResolvedValueOnce({ serverTime: 1000, campaigns: [] });
  const { result } = renderHook(() => usePromotions());
  await act(async () => { await result.current.reload(); });
  expect(result.current.status).toBe("ready");
  await act(async () => { resolveOld({ serverTime: 1000, campaigns: [{ id: "old", ends: 9999999 }] }); });
  expect(result.current.campaigns).toEqual([]);
});
test("expiry clears offers and failed refresh does not restore old data", async () => {
  jest.useFakeTimers();
  getPromotions.mockResolvedValueOnce({ serverTime: 1000, campaigns: [{ id: "offer", ends: 2000 }] })
    .mockRejectedValueOnce(new Error("offline"));
  const { result } = renderHook(() => usePromotions());
  await act(async () => {});
  expect(result.current.campaigns).toHaveLength(1);
  await act(async () => { jest.advanceTimersByTime(1001); });
  expect(result.current.status).toBe("error");
  expect(result.current.campaigns).toEqual([]);
});
test("an unavailable response does not claim there are no promotions", async () => {
  getPromotions.mockRejectedValueOnce(new Error("offline"));
  const { result } = renderHook(() => usePromotions());
  await waitFor(() => expect(result.current.status).toBe("error"));
});
