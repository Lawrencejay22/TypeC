const listeners = new Set();
let nextId = 1;

export function toast(item) {
  const entry = { id: nextId++, kind: "info", duration: 3200, ...item };
  listeners.forEach((listener) => listener(entry));
  return entry.id;
}

export function onToast(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
