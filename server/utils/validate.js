import { badRequest } from "./httpError.js";

const USERNAME_RE = /^[a-zA-Z0-9_]{3,20}$/;
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/;
const CODE_RE = /^\d{6}$/;

export const MODES = [
  "HTML",
  "CSS",
  "JAVASCRIPT",
  "TYPESCRIPT",
  "PYTHON",
  "SQL & RUST",
  "GO",
  "C++",
  "REGEX",
  "RANDOM",
];

export const PLAY_STYLES = ["practice", "ranked"];

export function text(value, { field, min = 0, max = 200, required = true } = {}) {
  const str = typeof value === "string" ? value.trim() : "";
  if (!str && required) throw badRequest(`${field} is required.`);
  if (str && str.length < min) throw badRequest(`${field} must be at least ${min} characters.`);
  if (str.length > max) throw badRequest(`${field} must be ${max} characters or less.`);
  return str;
}

export function username(value) {
  const str = text(value, { field: "Username", max: 20 });
  if (!USERNAME_RE.test(str)) {
    throw badRequest("Username must be 3–20 characters: letters, numbers or underscore.");
  }
  return str;
}

export function email(value) {
  const str = text(value, { field: "Email", max: 254 }).toLowerCase();
  if (!EMAIL_RE.test(str)) throw badRequest("Enter a valid email address.");
  return str;
}

export function password(value, field = "Password") {
  if (typeof value !== "string" || !value) throw badRequest(`${field} is required.`);
  if (value.length < 8) throw badRequest(`${field} must be at least 8 characters.`);
  if (value.length > 72) throw badRequest(`${field} must be 72 characters or less.`);
  if (!/[a-zA-Z]/.test(value) || !/\d/.test(value)) {
    throw badRequest(`${field} needs at least one letter and one number.`);
  }
  return value;
}

export function code(value) {
  const str = typeof value === "string" ? value.trim() : String(value ?? "");
  if (!CODE_RE.test(str)) throw badRequest("Enter the 6-digit code from your email.");
  return str;
}

export function int(value, { field, min = 0, max = Number.MAX_SAFE_INTEGER }) {
  const num = Number(value);
  if (!Number.isInteger(num) || num < min || num > max) {
    throw badRequest(`${field} is out of range.`);
  }
  return num;
}

export function oneOf(value, options, field) {
  if (!options.includes(value)) throw badRequest(`Unknown ${field}.`);
  return value;
}
