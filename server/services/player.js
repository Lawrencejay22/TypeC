import env from "../config/env.js";
import User from "../models/User.js";
import Result from "../models/Result.js";
import { badgeList, earnedIcons } from "./badges.js";

const GRADES = [
  { label: "S-TIER", min: 80 },
  { label: "A-TIER", min: 60 },
  { label: "B-TIER", min: 40 },
  { label: "C-TIER", min: 25 },
  { label: "D-TIER", min: 0 },
];

const round1 = (n) => Math.round(n * 10) / 10;

const dayFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: env.timezone,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const hourFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: env.timezone,
  hour: "numeric",
  hourCycle: "h23",
});

export const dayKey = (date) => dayFormat.format(date);
export const hourOf = (date) => Number(hourFormat.format(date));

export function gradeFor(wpm) {
  return GRADES.find((grade) => wpm >= grade.min).label;
}

function previousDay(key) {
  const date = new Date(`${key}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
}

export function applyResult(user, result) {
  const stats = user.stats;
  const today = dayKey(result.createdAt);

  stats.races += 1;
  stats.sumWpm += result.wpm;
  stats.sumAcc += result.accuracy;
  stats.avgWpm = round1(stats.sumWpm / stats.races);
  stats.avgAcc = round1(stats.sumAcc / stats.races);
  stats.bestWpm = Math.max(stats.bestWpm, result.wpm);
  stats.chars += result.chars;
  stats.kills += result.kills;
  stats.score += result.score;
  if (result.grade === "S-TIER" || result.grade === "A-TIER") stats.wins += 1;

  if (stats.lastPlayDay !== today) {
    stats.streak = stats.lastPlayDay === previousDay(today) ? stats.streak + 1 : 1;
    stats.lastPlayDay = today;
  }
  stats.longestStreak = Math.max(stats.longestStreak, stats.streak);
  stats.lastPlayedAt = result.createdAt;

  const lang = user.languages.get(result.mode) || { races: 0, sumWpm: 0, bestWpm: 0 };
  user.languages.set(result.mode, {
    races: lang.races + 1,
    sumWpm: lang.sumWpm + result.wpm,
    bestWpm: Math.max(lang.bestWpm, result.wpm),
  });
}

export function liveStreak(user) {
  const { streak, lastPlayDay } = user.stats;
  if (!lastPlayDay) return 0;
  const today = dayKey(new Date());
  return lastPlayDay === today || lastPlayDay === previousDay(today) ? streak : 0;
}

export const rankedFilter = { verified: true, "stats.races": { $gt: 0 } };

export const rankedSort = { "stats.avgWpm": -1, "stats.avgAcc": -1, "stats.races": -1, createdAt: 1 };

export async function globalRank(user) {
  if (!user.stats.races) return 0;
  const { avgWpm, avgAcc, races } = user.stats;
  const ahead = await User.countDocuments({
    ...rankedFilter,
    _id: { $ne: user._id },
    $or: [
      { "stats.avgWpm": { $gt: avgWpm } },
      { "stats.avgWpm": avgWpm, "stats.avgAcc": { $gt: avgAcc } },
      { "stats.avgWpm": avgWpm, "stats.avgAcc": avgAcc, "stats.races": { $gt: races } },
      { "stats.avgWpm": avgWpm, "stats.avgAcc": avgAcc, "stats.races": races, createdAt: { $lt: user.createdAt } },
    ],
  });
  return ahead + 1;
}

export function leaderboardEntry(user, viewer) {
  return {
    username: user.username,
    bio: user.bio,
    wpm: user.stats.avgWpm,
    accuracy: user.stats.avgAcc,
    bestWpm: user.stats.bestWpm,
    races: user.stats.races,
    followers: user.followerCount,
    badges: earnedIcons(user),
    isFollowing: viewer ? viewer.following.some((id) => id.equals(user._id)) : false,
    isYou: viewer ? viewer._id.equals(user._id) : false,
  };
}

const shortDate = (date) =>
  new Intl.DateTimeFormat("en-US", { timeZone: env.timezone, month: "numeric", day: "numeric" }).format(date);

export async function buildProfile(user, viewer) {
  const isSelf = Boolean(viewer && viewer._id.equals(user._id));

  const [rank, results] = await Promise.all([
    globalRank(user),
    Result.find({ user: user._id }).sort({ createdAt: -1 }).limit(20).lean(),
  ]);

  const languages = [...user.languages.entries()]
    .map(([mode, lang]) => ({ mode, races: lang.races, wpm: round1(lang.sumWpm / lang.races), bestWpm: lang.bestWpm }))
    .sort((a, b) => b.races - a.races || b.wpm - a.wpm);

  return {
    user: {
      username: user.username,
      bio: user.bio,
      joined: user.createdAt,
      followers: user.followerCount,
      following: user.following.length,
      isFollowing: viewer && !isSelf ? viewer.following.some((id) => id.equals(user._id)) : false,
      isSelf,
      ...(isSelf ? { email: user.email, twoFactor: user.twoFactor } : {}),
    },
    rank,
    stats: {
      races: user.stats.races,
      wins: user.stats.wins,
      avgWpm: user.stats.avgWpm,
      avgAcc: user.stats.avgAcc,
      bestWpm: user.stats.bestWpm,
      chars: user.stats.chars,
      kills: user.stats.kills,
      score: user.stats.score,
      streak: liveStreak(user),
      longestStreak: user.stats.longestStreak,
      favorite: languages[0]?.mode || null,
    },
    trend: results.slice(0, 12).reverse().map((r) => r.wpm),
    languages,
    recent: results.slice(0, 5).map((r) => ({
      mode: r.mode,
      wpm: r.wpm,
      accuracy: r.accuracy,
      date: shortDate(r.createdAt),
    })),
    history: results.map((r) => ({
      id: r._id,
      date: dayKey(r.createdAt),
      mode: r.mode,
      playStyle: r.playStyle,
      wpm: r.wpm,
      accuracy: r.accuracy,
      score: r.score,
      grade: r.grade,
    })),
    badges: badgeList(user),
  };
}
