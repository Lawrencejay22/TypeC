import { Router } from "express";
import User from "../models/User.js";
import Result from "../models/Result.js";

const router = Router();

const CACHE_MS = 10 * 1000;
const ONLINE_WINDOW_MS = 2 * 60 * 1000;
let cache = { at: 0, data: null };

async function collect() {
  const [online, typists, testsRun, top] = await Promise.all([
    User.countDocuments({ verified: true, lastSeen: { $gte: new Date(Date.now() - ONLINE_WINDOW_MS) } }),
    User.countDocuments({ verified: true }),
    Result.countDocuments({}),
    User.findOne({ verified: true }).sort({ "stats.bestWpm": -1 }).select("username stats.bestWpm"),
  ]);

  return {
    online,
    typists,
    testsRun,
    topWpm: top?.stats.bestWpm || 0,
    topPlayer: top?.stats.bestWpm ? top.username : null,
  };
}

router.get("/", async (req, res) => {
  if (!cache.data || Date.now() - cache.at > CACHE_MS) {
    cache = { at: Date.now(), data: await collect() };
  }
  res.json(cache.data);
});

export default router;
