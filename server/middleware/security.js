import HttpError from "../utils/httpError.js";

const WRITE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function stripOperators(value, depth = 0) {
  if (depth > 6) return undefined;
  if (Array.isArray(value)) return value.map((item) => stripOperators(item, depth + 1));
  if (value && typeof value === "object") {
    const clean = {};
    for (const [key, inner] of Object.entries(value)) {
      if (key.startsWith("$") || key.includes(".") || key === "__proto__" || key === "constructor") continue;
      clean[key] = stripOperators(inner, depth + 1);
    }
    return clean;
  }
  return value;
}

export function sanitizeBody(req, res, next) {
  if (req.body && typeof req.body === "object") req.body = stripOperators(req.body);
  next();
}

export function requireJson(req, res, next) {
  if (!WRITE_METHODS.has(req.method)) return next();
  if (!req.is("application/json")) {
    return next(new HttpError(415, "Requests must be sent as JSON."));
  }
  next();
}

export function noStore(req, res, next) {
  res.set("Cache-Control", "no-store");
  next();
}
