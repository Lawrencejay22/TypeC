import { useEffect, useMemo, useState } from "react";
import PageShell from "./component/PageShell.jsx";
import "./profile.css";

const TABS = [
  { key: "overview", icon: "📊", label: "Overview" },
  { key: "history", icon: "🕹", label: "History" },
  { key: "badges", icon: "🎖", label: "Badges" },
];

const LANG_COLORS = {
  HTML: "#e34f26",
  CSS: "#264de4",
  JS: "#f0db4f",
  TS: "#3178c6",
  Python: "#3572a5",
  SQL: "#336791",
  Java: "#ff0004",
  Javascript: "#f8eb00",
};

const RECENT_COLORS = {
  HTML: "#ff6f00",
  CSS: "#0099ff",
  Python: "#9900ff",
  Javascript: "#f8eb00",
  Java: "#ff0004",
};

const DEFAULT_PROFILE = {
  username: "PLAYER_01",
  initials: "PX",
  tier: "PRO",
  joined: "August 2026",
  globalRank: 0,
  streakDays: 0,
  avgWpm: 0,
  avgAcc: 0,
  races: 0,
  wins: 0,
  winsGoal: 8,
  trend: [72, 80, 78, 85, 90, 88, 94, 97, 95, 104, 101, 112],
  languages: [
    { name: "HTML", wpm: 118 },
    { name: "CSS", wpm: 105 },
    { name: "JS", wpm: 98 },
    { name: "TS", wpm: 112 },
    { name: "Python", wpm: 87 },
    { name: "SQL", wpm: 79 },
  ],
  topRank: 1,
  codeStats: {
    lines: 1982,
    characters: 918237,
    longestStreak: 366,
    favorite: "HTML",
  },
  recent: [
    { lang: "HTML", wpm: 407, acc: 99.9, date: "9/21" },
    { lang: "CSS", wpm: 387, acc: 99.9, date: "9/21" },
    { lang: "Python", wpm: 410, acc: 99.9, date: "9/21" },
    { lang: "Javascript", wpm: 363, acc: 99.9, date: "9/21" },
    { lang: "Java", wpm: 412, acc: 99.9, date: "9/21" },
  ],
  history: [
    { date: "2026-09-02", lang: "TS", wpm: 0, acc: 0, rank: 0 },
    { date: "2026-09-02", lang: "JS", wpm: 0, acc: 0, rank: 0 },
    { date: "2026-09-01", lang: "Python", wpm: 0, acc: 0, rank: 0 },
    { date: "2026-09-01", lang: "CSS", wpm: 0, acc: 0, rank: 0 },
    { date: "2026-08-31", lang: "SQL", wpm: 0, acc: 0, rank: 0 },
    { date: "2026-08-31", lang: "HTML", wpm: 0, acc: 0, rank: 0 },
    { date: "2026-08-30", lang: "TS", wpm: 0, acc: 0, rank: 0 },
    { date: "2026-08-29", lang: "JS", wpm: 0, acc: 0, rank: 0 },
  ],
  badges: [
    { icon: "⚡", name: "Speed Demon", earned: true },
    { icon: "🎯", name: "Perfect Aim", earned: true },
    { icon: "🔥", name: "7-Day Streak", earned: true },
    { icon: "🏆", name: "Top 10 Global", earned: true },
    { icon: "🌙", name: "Night Coder", earned: false },
    { icon: "💎", name: "Diamond Rank", earned: false },
    { icon: "🧠", name: "Polyglot", earned: false },
    { icon: "👑", name: "Season Champion", earned: false },
  ],
};

const formatNumber = (n) => Number(n || 0).toLocaleString("en-US");

function TrendChart({ points }) {
  const width = 200;
  const height = 56;

  if (!points || points.length < 2) {
    return <svg className="pf-trend-svg" width={width} height={height} aria-hidden="true" />;
  }

  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const step = width / (points.length - 1);
  const coords = points.map((p, i) => [
    i * step,
    height - 4 - ((p - min) / span) * (height - 8),
  ]);
  const path = coords.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const [lastX, lastY] = coords[coords.length - 1];

  return (
    <svg className="pf-trend-svg" width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <path d={path} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      {coords.slice(0, -1).map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.6" fill="currentColor" />
      ))}
      <circle cx={lastX} cy={lastY} r="2.6" fill="currentColor" />
    </svg>
  );
}

function Overview({ data }) {
  const low = data.trend.length ? Math.min(...data.trend) : 0;
  const peak = data.trend.length ? Math.max(...data.trend) : 0;
  const gain = data.trend.length > 1 ? data.trend[data.trend.length - 1] - data.trend[0] : 0;
  const topLang = Math.max(1, ...data.languages.map((l) => l.wpm));

  return (
    <div className="pf-overview">
      <div className="pf-card pf-player">
        <div className="pf-avatar">{data.initials}</div>
        <div className="pf-player-info">
          <div className="pf-player-name">
            <span>{data.username}</span>
            {data.tier && <span className="pf-chip">{data.tier}</span>}
          </div>
          <p className="pf-player-meta">
            Joined {data.joined} · Rank #{data.globalRank} Global
          </p>
        </div>
        <div className="pf-streak">
          <span>STREAK</span>
          <strong>{data.streakDays} DAYS</strong>
        </div>
      </div>

      <div className="pf-stats">
        <div className="pf-card pf-stat">
          <span>AVG WPM</span>
          <p><strong className="is-green">{data.avgWpm}</strong><small>wpm</small></p>
        </div>
        <div className="pf-card pf-stat">
          <span>AVG ACC</span>
          <p><strong>{data.avgAcc}</strong><small>%</small></p>
        </div>
        <div className="pf-card pf-stat">
          <span>RACES</span>
          <p><strong>{data.races}</strong><small>total</small></p>
        </div>
        <div className="pf-card pf-stat">
          <span>WINS</span>
          <p><strong>{data.wins}</strong><small>/{data.winsGoal}</small></p>
        </div>
      </div>

      <div className="pf-card pf-trend">
        <div className="pf-trend-head">
          <span>WPM TREND — LAST {data.trend.length} RACES</span>
          <span className="is-green">
            {gain >= 0 ? "↑ +" : "↓ "}
            {gain} WPM
          </span>
        </div>
        <TrendChart points={data.trend} />
        <div className="pf-trend-foot">
          <span>{low} low</span>
          <span>{peak} peak</span>
        </div>
      </div>

      <div className="pf-card pf-langs">
        <p className="pf-langs-title">LANGUAGE BREAKDOWN</p>
        <div className="pf-langs-list">
          {data.languages.map((lang) => (
            <div key={lang.name} className="pf-lang">
              <span className="pf-lang-name">{lang.name}</span>
              <span className="pf-lang-track">
                <span style={{ width: `${(lang.wpm / topLang) * 91}%` }} />
              </span>
              <span className="pf-lang-wpm">{lang.wpm} wpm</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SidePanel({ data }) {
  const rows = [
    ["Total lines types", formatNumber(data.codeStats.lines)],
    ["Total characters types", formatNumber(data.codeStats.characters)],
    ["Longest Streak", `${data.codeStats.longestStreak} days`],
    ["Most Practiced Language", data.codeStats.favorite],
  ];

  return (
    <aside className="pf-panel">
      <div className="pf-box pf-rank">
        <strong>#{data.topRank}</strong>
        <span>Top {data.topRank}</span>
      </div>

      <div className="pf-box pf-codestats">
        <h2>Code Stats</h2>
        <dl>
          {rows.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="pf-box pf-recent">
        <h2>Recent</h2>
        <table>
          <thead>
            <tr>
              <th>Language</th>
              <th>WPM</th>
              <th>Accuracy</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {data.recent.map((row, i) => (
              <tr key={`${row.lang}-${i}`}>
                <td style={{ color: RECENT_COLORS[row.lang] || LANG_COLORS[row.lang] }}>{row.lang}</td>
                <td>{row.wpm}</td>
                <td>{row.acc}%</td>
                <td>{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </aside>
  );
}

function History({ rows }) {
  return (
    <div className="pf-history">
      <p className="tc-page-note">Recent races — newest first.</p>
      <div className="pf-history-table" role="table">
        <div className="pf-history-row is-head" role="row">
          <span>DATE</span>
          <span>LANG</span>
          <span>WPM</span>
          <span>ACC</span>
          <span>RANK</span>
        </div>
        {rows.map((row, i) => (
          <div key={`${row.date}-${i}`} className="pf-history-row" role="row">
            <span className="is-date">{row.date}</span>
            <span className="is-lang" style={{ color: LANG_COLORS[row.lang] }}>{row.lang}</span>
            <span>{row.wpm}</span>
            <span className={row.acc >= 95 ? "is-green" : "is-dim"}>{row.acc}%</span>
            <span className={`is-rank ${row.rank > 0 && row.rank <= 10 ? "is-green" : "is-dim"}`}>
              #{row.rank}
            </span>
          </div>
        ))}
        {!rows.length && <p className="pf-empty">No races yet. Go play one!</p>}
      </div>
    </div>
  );
}

function Badges({ badges }) {
  const earned = badges.filter((b) => b.earned).length;

  return (
    <div className="pf-badges">
      <p className="tc-page-note">
        {earned} / {badges.length} earned
      </p>
      <div className="pf-badge-grid">
        {badges.map((badge) => (
          <div key={badge.name} className={`pf-badge ${badge.earned ? "is-earned" : "is-locked"}`}>
            <span className="pf-badge-icon" aria-hidden="true">{badge.icon}</span>
            <span className="pf-badge-name">{badge.name}</span>
            {badge.earned && <span className="pf-badge-state">✓ EARNED</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Profile({ onBack }) {
  const [tab, setTab] = useState("overview");
  const [remote, setRemote] = useState(null);

  useEffect(() => {
    let ignore = false;
    fetch("/api/profile")
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((json) => {
        if (!ignore && json && typeof json === "object") setRemote(json);
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, []);

  const data = useMemo(() => ({ ...DEFAULT_PROFILE, ...(remote || {}) }), [remote]);

  return (
    <div className={`pf-layout ${tab === "overview" ? "with-panel" : ""}`}>
      <PageShell
        label="// PROFILE"
        title="YOUR STATS."
        tabs={TABS}
        activeTab={tab}
        onTabChange={setTab}
        onBack={onBack}
        seed={41}
        className="pf-page"
      >
        {tab === "overview" && <Overview data={data} />}
        {tab === "history" && <History rows={data.history} />}
        {tab === "badges" && <Badges badges={data.badges} />}
      </PageShell>

      {tab === "overview" && (
        <div className="tc-page pf-panel-wrap">
          <SidePanel data={data} />
        </div>
      )}
    </div>
  );
}
