import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import env from "./config/env.js";
import { loadUser } from "./middleware/auth.js";
import { apiLimiter } from "./middleware/limits.js";
import { noStore, requireJson, sanitizeBody } from "./middleware/security.js";
import { errorHandler, notFoundHandler } from "./middleware/errors.js";
import authRoutes from "./routes/auth.js";
import settingsRoutes from "./routes/settings.js";
import gameRoutes from "./routes/games.js";
import leaderboardRoutes from "./routes/leaderboard.js";
import userRoutes from "./routes/users.js";
import contactRoutes from "./routes/contact.js";
import statsRoutes from "./routes/stats.js";

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", env.trustProxy);

app.use(
  helmet({
    contentSecurityPolicy: { directives: { defaultSrc: ["'none'"], frameAncestors: ["'none'"] } },
    crossOriginResourcePolicy: { policy: "same-origin" },
  })
);

app.use("/api", noStore, apiLimiter, requireJson);
app.use(express.json({ limit: "16kb" }));
app.use(cookieParser());
app.use("/api", sanitizeBody, loadUser);

app.get("/api/health", (req, res) => {
  res.json({ ok: true, database: mongoose.connection.readyState === 1 ? "up" : "down" });
});

app.use("/api/auth", authRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/stats", statsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
