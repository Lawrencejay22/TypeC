const playedLanguages = (user) => [...user.languages.keys()].filter((mode) => mode !== "RANDOM").length;

export const BADGES = [
  {
    key: "speed-demon",
    icon: "⚡",
    name: "Speed Demon",
    description: "Hit 80 WPM in a single run.",
    earned: ({ result }) => result.wpm >= 80,
  },
  {
    key: "perfect-aim",
    icon: "🎯",
    name: "Perfect Aim",
    description: "Finish a run with 100% accuracy and at least 5 kills.",
    earned: ({ result }) => result.accuracy === 100 && result.kills >= 5,
  },
  {
    key: "streak-7",
    icon: "🔥",
    name: "7-Day Streak",
    description: "Play on 7 days in a row.",
    earned: ({ user }) => user.stats.streak >= 7,
  },
  {
    key: "top-10",
    icon: "🏆",
    name: "Top 10 Global",
    description: "Reach the global top 10 with at least 3 runs.",
    earned: ({ user, rank }) => rank > 0 && rank <= 10 && user.stats.races >= 3,
  },
  {
    key: "night-coder",
    icon: "🌙",
    name: "Night Coder",
    description: "Finish a run between midnight and 5 AM.",
    earned: ({ hour }) => hour < 5,
  },
  {
    key: "diamond-rank",
    icon: "💎",
    name: "Diamond Rank",
    description: "Average 100 WPM over at least 10 runs.",
    earned: ({ user }) => user.stats.races >= 10 && user.stats.avgWpm >= 100,
  },
  {
    key: "polyglot",
    icon: "🧠",
    name: "Polyglot",
    description: "Play 5 different languages.",
    earned: ({ user }) => playedLanguages(user) >= 5,
  },
  {
    key: "season-champion",
    icon: "👑",
    name: "Season Champion",
    description: "Hold #1 on the leaderboard with at least 10 runs.",
    earned: ({ user, rank }) => rank === 1 && user.stats.races >= 10,
  },
];

const toPublic = ({ key, icon, name, description }) => ({ key, icon, name, description });

export function awardBadges(user, context) {
  const fresh = [];
  for (const badge of BADGES) {
    if (user.hasBadge(badge.key)) continue;
    if (!badge.earned({ user, ...context })) continue;
    const earnedAt = new Date();
    user.badges.push({ key: badge.key, earnedAt });
    fresh.push({ ...toPublic(badge), earnedAt });
  }
  return fresh;
}

export function badgeList(user) {
  const earned = new Map(user.badges.map((badge) => [badge.key, badge.earnedAt]));
  return BADGES.map((badge) => ({
    ...toPublic(badge),
    earned: earned.has(badge.key),
    earnedAt: earned.get(badge.key) || null,
  }));
}

export function earnedIcons(user, limit = 3) {
  const byKey = new Map(BADGES.map((badge) => [badge.key, badge]));
  return [...user.badges]
    .sort((a, b) => b.earnedAt - a.earnedAt)
    .slice(0, limit)
    .map((badge) => byKey.get(badge.key))
    .filter(Boolean)
    .map((badge) => ({ icon: badge.icon, name: badge.name }));
}
