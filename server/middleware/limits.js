import { rateLimit } from "express-rate-limit";

const limiter = (windowMinutes, limit, message) =>
  rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    limit,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { message },
  });

export const apiLimiter = limiter(15, 600, "Too many requests. Slow down a little.");
export const authLimiter = limiter(15, 40, "Too many sign-in attempts. Try again in 15 minutes.");
export const codeLimiter = limiter(15, 8, "Too many code requests. Try again in 15 minutes.");
export const contactLimiter = limiter(60, 5, "You've sent a few messages already. Try again later.");
export const gameLimiter = limiter(15, 120, "Too many games started. Take a short break.");
