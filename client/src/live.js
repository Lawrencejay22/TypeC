import { useEffect, useState } from "react";
import { get } from "./api.js";

const POLL_MS = 30 * 1000;

let stats = null;
let timer = null;
let inflight = null;
const listeners = new Set();

async function refresh() {
  if (inflight) return inflight;
  inflight = get("/stats")
    .then((data) => {
      stats = data;
      listeners.forEach((listener) => listener(stats));
    })
    .catch(() => {})
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

function onFocus() {
  if (document.visibilityState === "visible") refresh();
}

function start() {
  if (timer) return;
  refresh();
  timer = setInterval(() => {
    if (document.visibilityState === "visible") refresh();
  }, POLL_MS);
  document.addEventListener("visibilitychange", onFocus);
}

function stop() {
  clearInterval(timer);
  timer = null;
  document.removeEventListener("visibilitychange", onFocus);
}

export const refreshStats = refresh;

export function useLiveStats() {
  const [value, setValue] = useState(stats);

  useEffect(() => {
    listeners.add(setValue);
    start();
    return () => {
      listeners.delete(setValue);
      if (!listeners.size) stop();
    };
  }, []);

  return value;
}

export function compact(n) {
  if (n === null || n === undefined) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}M`;
  if (n >= 10_000) return `${Math.round(n / 1000)}K`;
  return n.toLocaleString("en-US");
}
