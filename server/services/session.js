import jwt from "jsonwebtoken";
import env from "../config/env.js";

export const COOKIE_NAME = "typec_session";
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function cookieOptions() {
  return {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: "strict",
    path: "/",
  };
}

export function startSession(res, user, remember = true) {
  const token = jwt.sign({ sub: user._id.toString(), v: user.tokenVersion }, env.jwtSecret, {
    expiresIn: "7d",
  });
  res.cookie(COOKIE_NAME, token, remember ? { ...cookieOptions(), maxAge: WEEK_MS } : cookieOptions());
}

export function endSession(res) {
  res.clearCookie(COOKIE_NAME, cookieOptions());
}

export function readSession(req) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return null;
  try {
    return jwt.verify(token, env.jwtSecret);
  } catch {
    return null;
  }
}
