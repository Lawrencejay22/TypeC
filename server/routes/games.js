import { Router } from "express";
import mongoose from "mongoose";
import GameSession from "../models/GameSession.js";
import Result from "../models/Result.js";
import { requireAuth } from "../middleware/auth.js";
import { gameLimiter } from "../middleware/limits.js";
import { applyResult, globalRank, gradeFor, hourOf } from "../services/player.js";
import { awardBadges } from "../services/badges.js";
import { badRequest, conflict, notFound } from "../utils/httpError.js";
import * as check from "../utils/validate.js";

const router = Router();

const GAME_SECONDS = 90;
const SESSION_TTL_MS = 10 * 60 * 1000;
const CLOCK_SLACK_S = 3;
const MAX_WPM = 250;

router.use(requireAuth);

router.post("/start", gameLimiter, async (req, res) => {
  const mode = check.oneOf(req.body.mode, check.MODES, "language");
  const playStyle = check.oneOf(req.body.playStyle, check.PLAY_STYLES, "play style");

  const session = await GameSession.create({
    user: req.user._id,
    mode,
    playStyle,
    expiresAt: new Date(Date.now() + SESSION_TTL_MS),
  });

  res.status(201).json({ sessionId: session._id, seconds: GAME_SECONDS });
});

router.post("/:id/finish", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw notFound("That game doesn't exist.");

  const session = await GameSession.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id, finished: false },
    { $set: { finished: true } }
  );
  if (!session) throw conflict("This game was already saved or doesn't exist.");
  if (session.expiresAt < new Date()) throw badRequest("This game took too long to submit.");

  const duration = check.int(req.body.duration, { field: "Duration", min: 1, max: GAME_SECONDS });
  const chars = check.int(req.body.chars, { field: "Characters", min: 0, max: 3000 });
  const errors = check.int(req.body.errors, { field: "Errors", min: 0, max: 3000 });
  const kills = check.int(req.body.kills, { field: "Kills", min: 0, max: 500 });
  const score = check.int(req.body.score, { field: "Score", min: 0, max: 10_000_000 });
  const bestStreak = check.int(req.body.bestStreak ?? 0, { field: "Streak", min: 0, max: 500 });

  const realSeconds = (Date.now() - session.startedAt.getTime()) / 1000;
  if (duration > realSeconds + CLOCK_SLACK_S) throw badRequest("Game timing doesn't add up, so this run wasn't saved.");
  if (chars === 0) throw badRequest("Nothing was typed, so there's nothing to save.");
  if (kills > chars || bestStreak > kills) throw badRequest("That run doesn't add up, so it wasn't saved.");
  if (score > chars * 24 + kills * 2) throw badRequest("That score doesn't add up, so it wasn't saved.");

  const wpm = Math.round(chars / 5 / (duration / 60));
  if (wpm > MAX_WPM) throw badRequest("That speed isn't humanly possible, so it wasn't saved.");
  const accuracy = Math.round((chars / (chars + errors)) * 100);

  const user = req.user;
  const previousBest = user.stats.bestWpm;

  const result = await Result.create({
    user: user._id,
    mode: session.mode,
    playStyle: session.playStyle,
    wpm,
    accuracy,
    score,
    kills,
    mistakes: errors,
    chars,
    duration,
    bestStreak,
    grade: gradeFor(wpm),
  });

  applyResult(user, result);
  const rank = await globalRank(user);
  const newBadges = awardBadges(user, { result, rank, hour: hourOf(result.createdAt) });
  await user.save();

  res.status(201).json({
    result: {
      id: result._id,
      wpm,
      accuracy,
      score,
      kills,
      grade: result.grade,
    },
    rank,
    personalBest: wpm > previousBest,
    newBadges,
    stats: {
      races: user.stats.races,
      avgWpm: user.stats.avgWpm,
      avgAcc: user.stats.avgAcc,
      bestWpm: user.stats.bestWpm,
    },
  });
});

export default router;
