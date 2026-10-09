export class ApiError extends Error {
  constructor(message, status, data = {}) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

let lastLatency = null;
const latencyListeners = new Set();

export function onLatency(listener) {
  latencyListeners.add(listener);
  if (lastLatency !== null) listener(lastLatency);
  return () => latencyListeners.delete(listener);
}

const samples = [];

function reportLatency(ms) {
  samples.push(ms);
  if (samples.length > 10) samples.shift();
  lastLatency = Math.round(samples.reduce((sum, n) => sum + n, 0) / samples.length);
  latencyListeners.forEach((listener) => listener(lastLatency));
}

export async function api(path, { method = "GET", body, signal } = {}) {
  const options = { method, credentials: "same-origin", signal, headers: { accept: "application/json" } };

  if (method !== "GET") {
    options.headers["content-type"] = "application/json";
    options.body = JSON.stringify(body ?? {});
  }

  const started = performance.now();
  let res;
  try {
    res = await fetch(`/api${path}`, options);
  } catch (err) {
    if (err.name === "AbortError") throw err;
    throw new ApiError("Can't reach the server right now. Check your connection and try again.", 0);
  }
  if (method === "GET") reportLatency(Math.round(performance.now() - started));

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(data.message || `Something went wrong (${res.status}).`, res.status, data);
  }
  return data;
}

export const get = (path, options) => api(path, options);
export const post = (path, body) => api(path, { method: "POST", body });
export const patch = (path, body) => api(path, { method: "PATCH", body });
export const del = (path, body) => api(path, { method: "DELETE", body });
