import { clearPromotionsCache, getPromotions, parsePromotions } from "./promotions";
import { publicMediaUrl } from "./publicApi";
import { callPublicFunction } from "./publicApi";
jest.mock("./publicApi", () => ({
  ...jest.requireActual("./publicApi"),
  callPublicFunction: jest.fn(),
}));
const valid = {
  id: "campaign-1", title: "Panfleto de teste", summary: "Resumo para teste",
  conditions: "Condições de teste", starts_at: "2026-10-01T00:00:00Z", ends_at: "2026-10-02T00:00:00Z",
  file_url: "https://example.supabase.co/storage/v1/object/public/promotion-public/version-1.pdf",
  mime_type: "application/pdf", size_bytes: 1000,
};
beforeEach(() => { process.env.REACT_APP_SUPABASE_URL = "https://example.supabase.co"; localStorage.clear(); jest.clearAllMocks(); });
test("uses server time and excludes expired or future campaigns", () => {
  const response = parsePromotions({ server_time: "2026-10-01T12:00:00Z", campaigns: [
    valid, { ...valid, id: "expired", ends_at: "2026-10-01T12:00:00Z" },
    { ...valid, id: "future", starts_at: "2026-10-01T18:00:00Z" },
  ] });
  expect(response.campaigns.map(item => item.id)).toEqual(["campaign-1"]);
});
test.each(["javascript:alert(1)", "https://other.test/a.pdf", "https://example.supabase.co/storage/v1/object/public/resumes/file.pdf"])("rejects unsafe or unrelated media: %s", file_url => {
  expect(publicMediaUrl(file_url)).toBeNull();
  expect(() => parsePromotions({ server_time: "2026-10-01T12:00:00Z", campaigns: [{ ...valid, file_url }] })).toThrow();
});
test("malformed response is an error rather than empty offers", () => {
  expect(() => parsePromotions({ campaigns: [] })).toThrow();
  expect(() => parsePromotions({ server_time: "2026-10-01T12:00:00Z", campaigns: [{ ...valid, ends_at: "bad" }] })).toThrow();
});
test("reuses campaigns while the public version is unchanged", async () => {
  const meta = { server_time: "2026-10-01T12:00:00Z", version: "a".repeat(32), next_change_at: "2026-10-02T00:00:00Z" };
  callPublicFunction.mockResolvedValueOnce(meta).mockResolvedValueOnce({ ...meta, campaigns: [valid] }).mockResolvedValueOnce(meta);
  expect((await getPromotions()).fromCache).toBe(false);
  expect((await getPromotions()).fromCache).toBe(true);
  expect(callPublicFunction).toHaveBeenCalledTimes(3);
});
test("drops the cached campaigns when publication version changes", async () => {
  const first = { server_time: "2026-10-01T12:00:00Z", version: "a".repeat(32), next_change_at: null };
  const second = { ...first, version: "b".repeat(32) };
  callPublicFunction.mockResolvedValueOnce(first).mockResolvedValueOnce({ ...first, campaigns: [valid] })
    .mockResolvedValueOnce(second).mockResolvedValueOnce({ ...second, campaigns: [] });
  await getPromotions();
  expect((await getPromotions()).campaigns).toEqual([]);
  expect(callPublicFunction).toHaveBeenCalledTimes(4);
  clearPromotionsCache();
});
