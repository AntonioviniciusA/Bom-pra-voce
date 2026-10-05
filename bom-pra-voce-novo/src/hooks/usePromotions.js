import { useCallback, useEffect, useRef, useState } from "react";
import { getPromotions } from "../services/promotions";
import { apiConfig } from "../services/publicApi";
export default function usePromotions() {
  const [state, setState] = useState({ status: "loading", campaigns: [] });
  const generation = useRef(0);
  const controller = useRef(null);
  const timer = useRef(null);
  const poller = useRef(null);
  const invalidate = useCallback(() => { generation.current += 1; }, []);
  const reload = useCallback(async () => {
    const current = ++generation.current;
    controller.current?.abort();
    clearTimeout(timer.current);
    if (!apiConfig().ready) {
      setState({ status: "unavailable", campaigns: [] });
      return;
    }
    controller.current = new AbortController();
    setState(previous => previous.status === "ready" ? previous : { status: "loading", campaigns: [] });
    const start = performance.now();
    try {
      const result = await getPromotions(controller.current.signal);
      if (current !== generation.current) return;
      // Conservatively subtract all request latency from the remaining validity.
      const now = result.serverTime + performance.now() - start;
      const campaigns = result.campaigns.filter(item => item.ends > now);
      setState({ status: "ready", campaigns });
      const nextExpiry = Math.min(result.nextChangeAt ?? Infinity, ...campaigns.map(item => item.ends));
      if (Number.isFinite(nextExpiry))
        timer.current = setTimeout(reload, Math.min(2147483647, Math.max(1, nextExpiry - now)));
    } catch {
      if (current === generation.current) setState({ status: "error", campaigns: [] });
    }
  }, []);
  useEffect(() => {
    reload();
    poller.current = setInterval(reload, 60000);
    const focus = () => { if (!document.hidden) reload(); };
    const visibility = () => {
      if (!document.hidden) reload();
      else {
        generation.current++;
        controller.current?.abort();
        clearTimeout(timer.current);
        setState({ status: "loading", campaigns: [] });
      }
    };
    window.addEventListener("focus", focus);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      invalidate();
      controller.current?.abort();
      clearTimeout(timer.current);
      clearInterval(poller.current);
      window.removeEventListener("focus", focus);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [reload, invalidate]);
  return { ...state, reload };
}
