import { rateLimit } from "express-rate-limit";

const limiter = (windowMinutes, limit, message, extra = {}) =>
  rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    limit,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { message },
    ...extra,
  });

export const apiLimiter = limiter(15, 5000, "Too many requests. Slow down a little.");
export const authLimiter = limiter(15, 50, "Too many sign-in attempts. Try again in 15 minutes.", {
  skipSuccessfulRequests: true,
});
export const codeLimiter = limiter(15, 20, "Too many code requests. Try again in 15 minutes.");
export const contactLimiter = limiter(60, 10, "You've sent a few messages already. Try again later.");
export const gameLimiter = limiter(15, 60, "Too many games started. Take a short break.", {
  keyGenerator: (req) => `user:${req.user._id}`,
});
