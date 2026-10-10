import { Router } from "express";
import User from "../models/User.js";
import { leaderboardEntry, rankedFilter, rankedSort } from "../services/player.js";

const router = Router();

router.get("/", async (req, res) => {
  const players = await User.find(rankedFilter)
    .sort(rankedSort)
    .limit(50);

  res.json({
    players: players.map((player) => leaderboardEntry(player, req.user)),
    updatedAt: new Date(),
  });
});

export default router;
