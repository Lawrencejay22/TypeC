import { useCallback, useEffect, useState } from "react";
import PageShell from "./component/PageShell.jsx";
import Avatar from "./component/Avatar.jsx";
import { get, post, patch, del } from "../api.js";
import { getSoundPrefs, setSoundPrefs, onSoundPrefs, sfx } from "../sound.js";
import { toast } from "../toasts.js";
import "./profile.css";

const BASE_TABS = [
  { key: "overview", icon: "📊", label: "Overview" },
  { key: "history", icon: "🕹", label: "History" },
  { key: "badges", icon: "🎖", label: "Badges" },
];

const SETTINGS_TAB = { key: "settings", icon: "⚙", label: "Settings" };

const MODES = {
  HTML: { label: "HTML", color: "#e34f26" },
  CSS: { label: "CSS", color: "#2f7bf0" },
  JAVASCRIPT: { label: "JS", color: "#e6c419" },
  TYPESCRIPT: { label: "TS", color: "#3178c6" },
  PYTHON: { label: "Python", color: "#8b5cf6" },
  "SQL & RUST": { label: "SQL/Rust", color: "#dea584" },
  GO: { label: "Go", color: "#00add8" },
  "C++": { label: "C++", color: "#f34b7d" },
  REGEX: { label: "Regex", color: "#ff5f87" },
  RANDOM: { label: "Random", color: "#2de06a" },
};

const modeLabel = (mode) => MODES[mode]?.label || mode;
const modeColor = (mode) => MODES[mode]?.color;
const formatNumber = (n) => Number(n || 0).toLocaleString("en-US");
const joinedLabel = (date) =>
  date ? new Date(date).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "";
const earnedLabel = (date) =>
  date ? new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

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
  const coords = points.map((p, i) => [i * step, height - 4 - ((p - min) / span) * (height - 8)]);
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

function PlayerCard({ data, signedIn, onFollow, followBusy }) {
  const { user, rank, stats } = data;

  return (
    <div className="pf-card pf-player">
      <Avatar name={user.username} size={64} className="pf-avatar-img" />
      <div className="pf-player-info">
        <div className="pf-player-name">
          <span>{user.username}</span>
          {user.isSelf && <span className="pf-chip">YOU</span>}
          {user.twoFactor && <span className="pf-chip" title="Two-factor is on">2FA</span>}
        </div>
        <p className="pf-player-meta">
          Joined {joinedLabel(user.joined)} · {rank ? `Rank #${rank} Global` : "Unranked"} · {user.followers}{" "}
          {user.followers === 1 ? "follower" : "followers"} · {user.following} following
        </p>
        {user.bio && <p className="pf-player-bio">{user.bio}</p>}
      </div>
      <div className="pf-player-side">
        <div className="pf-streak">
          <span>STREAK</span>
          <strong>
            {stats.streak} {stats.streak === 1 ? "DAY" : "DAYS"}
          </strong>
        </div>
        {!user.isSelf && (
          <button
            type="button"
            className={`pf-follow ${user.isFollowing ? "is-following" : ""}`}
            disabled={followBusy}
            onClick={onFollow}
            title={signedIn ? "" : "Sign in to follow players"}
          >
            {user.isFollowing ? "Following" : "Follow"}
          </button>
        )}
      </div>
    </div>
  );
}

function Overview({ data, signedIn, onFollow, followBusy }) {
  const { stats, trend, languages } = data;
  const low = trend.length ? Math.min(...trend) : 0;
  const peak = trend.length ? Math.max(...trend) : 0;
  const gain = trend.length > 1 ? Math.round((trend[trend.length - 1] - trend[0]) * 10) / 10 : 0;
  const topLang = Math.max(1, ...languages.map((l) => l.wpm));

  return (
    <div className="pf-overview">
      <PlayerCard data={data} signedIn={signedIn} onFollow={onFollow} followBusy={followBusy} />

      <div className="pf-stats">
        <div className="pf-card pf-stat">
          <span>AVG WPM</span>
          <p>
            <strong className="is-green">{stats.avgWpm}</strong>
            <small>wpm</small>
          </p>
        </div>
        <div className="pf-card pf-stat">
          <span>AVG ACC</span>
          <p>
            <strong>{stats.avgAcc}</strong>
            <small>%</small>
          </p>
        </div>
        <div className="pf-card pf-stat">
          <span>RUNS</span>
          <p>
            <strong>{stats.races}</strong>
            <small>total</small>
          </p>
        </div>
        <div className="pf-card pf-stat" title="Runs graded A-tier or better">
          <span>A-TIER+ RUNS</span>
          <p>
            <strong>{stats.wins}</strong>
            <small>/{stats.races}</small>
          </p>
        </div>
      </div>

      <div className="pf-card pf-trend">
        <div className="pf-trend-head">
          <span>WPM TREND — LAST {trend.length} {trend.length === 1 ? "RUN" : "RUNS"}</span>
          {trend.length > 1 && (
            <span className={gain >= 0 ? "is-green" : "is-red"}>
              {gain >= 0 ? `↑ +${gain}` : `↓ ${gain}`} WPM
            </span>
          )}
        </div>
        {trend.length > 1 ? (
          <>
            <TrendChart points={trend} />
            <div className="pf-trend-foot">
              <span>{low} low</span>
              <span>{peak} peak</span>
            </div>
          </>
        ) : (
          <p className="pf-muted">Play at least two runs to see your trend.</p>
        )}
      </div>

      <div className="pf-card pf-langs">
        <p className="pf-langs-title">LANGUAGE BREAKDOWN</p>
        {languages.length ? (
          <div className="pf-langs-list">
            {languages.map((lang) => (
              <div key={lang.mode} className="pf-lang" title={`${lang.races} runs · best ${lang.bestWpm} WPM`}>
                <span className="pf-lang-name">{modeLabel(lang.mode)}</span>
                <span className="pf-lang-track">
                  <span style={{ width: `${(lang.wpm / topLang) * 91}%`, background: modeColor(lang.mode) }} />
                </span>
                <span className="pf-lang-wpm">{lang.wpm} wpm</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="pf-muted">No languages played yet.</p>
        )}
      </div>
    </div>
  );
}

function SidePanel({ data }) {
  const { rank, stats, recent } = data;
  const rows = [
    ["Snippets cleared", formatNumber(stats.kills)],
    ["Characters typed", formatNumber(stats.chars)],
    ["Best WPM", stats.bestWpm],
    ["Longest streak", `${stats.longestStreak} ${stats.longestStreak === 1 ? "day" : "days"}`],
    ["Most practiced", stats.favorite ? modeLabel(stats.favorite) : "—"],
  ];

  return (
    <aside className="pf-panel">
      <div className="pf-box pf-rank">
        <strong>{rank ? `#${rank}` : "—"}</strong>
        <span>{rank ? "Global rank by average WPM" : "Finish a run to get ranked"}</span>
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
        {recent.length ? (
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
              {recent.map((row, i) => (
                <tr key={`${row.mode}-${i}`}>
                  <td style={{ color: modeColor(row.mode) }}>{modeLabel(row.mode)}</td>
                  <td>{row.wpm}</td>
                  <td>{row.accuracy}%</td>
                  <td>{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="pf-muted pf-recent-empty">No runs yet.</p>
        )}
      </div>
    </aside>
  );
}

function History({ rows }) {
  return (
    <div className="pf-history">
      <p className="tc-page-note">Last {rows.length} runs — newest first.</p>
      <div className="pf-history-table" role="table">
        <div className="pf-history-row is-head" role="row">
          <span>DATE</span>
          <span>LANG</span>
          <span>WPM</span>
          <span>ACC</span>
          <span>SCORE</span>
          <span>GRADE</span>
        </div>
        {rows.map((row) => (
          <div key={row.id} className="pf-history-row" role="row">
            <span className="is-date">{row.date}</span>
            <span className="is-lang" style={{ color: modeColor(row.mode) }}>
              {modeLabel(row.mode)}
            </span>
            <span>{row.wpm}</span>
            <span className={row.accuracy >= 95 ? "is-green" : "is-dim"}>{row.accuracy}%</span>
            <span>{formatNumber(row.score)}</span>
            <span className={`is-rank ${/^[SA]/.test(row.grade) ? "is-green" : "is-dim"}`}>{row.grade}</span>
          </div>
        ))}
        {!rows.length && <p className="pf-empty">No runs yet. Go play one!</p>}
      </div>
    </div>
  );
}

function Badges({ badges }) {
  const earned = badges.filter((b) => b.earned).length;

  return (
    <div className="pf-badges">
      <p className="tc-page-note">
        {earned} / {badges.length} earned · badges are checked on the server after every saved run
      </p>
      <div className="pf-badge-grid">
        {badges.map((badge) => (
          <div
            key={badge.key}
            className={`pf-badge ${badge.earned ? "is-earned" : "is-locked"}`}
            title={badge.description}
          >
            <span className="pf-badge-icon" aria-hidden="true">
              {badge.icon}
            </span>
            <span className="pf-badge-name">{badge.name}</span>
            <span className="pf-badge-desc">{badge.description}</span>
            {badge.earned && <span className="pf-badge-state">✓ EARNED {earnedLabel(badge.earnedAt).toUpperCase()}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function useAction() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const run = async (task) => {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const result = await task();
      if (result?.message) setMessage(result.message);
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setBusy(false);
    }
  };

  return { busy, error, message, run, setError };
}

function Feedback({ action }) {
  if (action.error) return <p className="pf-form-msg is-error" role="alert">{action.error}</p>;
  if (action.message) return <p className="pf-form-msg is-ok">{action.message}</p>;
  return null;
}

function Field({ label, hint, ...props }) {
  return (
    <label className="pf-field">
      <span>{label}</span>
      <input {...props} />
      {hint && <small>{hint}</small>}
    </label>
  );
}

function ProfileSettings({ profile, onSaved }) {
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio || "");
  const action = useAction();
  const changed = username !== profile.username || bio !== (profile.bio || "");

  const save = async (e) => {
    e.preventDefault();
    const data = await action.run(() => patch("/settings/profile", { username: username.trim(), bio: bio.trim() }));
    if (data) onSaved(data.user);
  };

  return (
    <form className="pf-card pf-set" onSubmit={save}>
      <h3>Profile</h3>
      <Field
        label="USERNAME"
        value={username}
        maxLength={20}
        autoComplete="username"
        onChange={(e) => setUsername(e.target.value)}
        hint="3–20 characters: letters, numbers and underscores."
      />
      <Field
        label="BIO"
        value={bio}
        maxLength={80}
        placeholder="Say something about how you type..."
        onChange={(e) => setBio(e.target.value)}
        hint={`${bio.length}/80`}
      />
      <Feedback action={action} />
      <button type="submit" className="pf-btn" disabled={action.busy || !changed}>
        {action.busy ? "SAVING..." : "SAVE PROFILE"}
      </button>
    </form>
  );
}

function PasswordSettings() {
  const [currentPassword, setCurrent] = useState("");
  const [newPassword, setNext] = useState("");
  const action = useAction();

  const save = async (e) => {
    e.preventDefault();
    const data = await action.run(() => patch("/settings/password", { currentPassword, newPassword }));
    if (data) {
      setCurrent("");
      setNext("");
    }
  };

  return (
    <form className="pf-card pf-set" onSubmit={save}>
      <h3>Password</h3>
      <Field
        label="CURRENT PASSWORD"
        type="password"
        value={currentPassword}
        autoComplete="current-password"
        onChange={(e) => setCurrent(e.target.value)}
      />
      <Field
        label="NEW PASSWORD"
        type="password"
        value={newPassword}
        autoComplete="new-password"
        onChange={(e) => setNext(e.target.value)}
        hint="At least 8 characters with a letter and a number. Other devices get signed out."
      />
      <Feedback action={action} />
      <button type="submit" className="pf-btn" disabled={action.busy || !currentPassword || !newPassword}>
        {action.busy ? "UPDATING..." : "CHANGE PASSWORD"}
      </button>
    </form>
  );
}

function TwoFactorSettings({ profile, onSaved }) {
  const [stage, setStage] = useState("idle");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const action = useAction();

  const start = async () => {
    const data = await action.run(() => post("/settings/two-factor/start"));
    if (data) setStage("code");
  };

  const enable = async (e) => {
    e.preventDefault();
    const data = await action.run(() => post("/settings/two-factor/enable", { code }));
    if (data) {
      setStage("idle");
      setCode("");
      onSaved(data.user);
      toast({ icon: "🔐", label: "SECURITY", title: "Two-factor is on", text: "You'll need an email code when you sign in." });
    }
  };

  const disable = async (e) => {
    e.preventDefault();
    const data = await action.run(() => post("/settings/two-factor/disable", { password }));
    if (data) {
      setPassword("");
      onSaved(data.user);
    }
  };

  return (
    <div className="pf-card pf-set">
      <h3>
        Two-factor authentication
        <span className={`pf-status ${profile.twoFactor ? "is-on" : ""}`}>{profile.twoFactor ? "ON" : "OFF"}</span>
      </h3>
      <p className="pf-set-text">
        When it's on, signing in also asks for a 6-digit code we email to <strong>{profile.email}</strong>. Someone with
        your password alone can't get in.
      </p>

      {!profile.twoFactor && stage === "idle" && (
        <>
          <Feedback action={action} />
          <button type="button" className="pf-btn" onClick={start} disabled={action.busy}>
            {action.busy ? "SENDING..." : "TURN ON 2FA"}
          </button>
        </>
      )}

      {!profile.twoFactor && stage === "code" && (
        <form onSubmit={enable} className="pf-set-inline">
          <Field
            label="CODE FROM YOUR EMAIL"
            value={code}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="000000"
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          />
          <Feedback action={action} />
          <div className="pf-btn-row">
            <button type="submit" className="pf-btn" disabled={action.busy || code.length !== 6}>
              {action.busy ? "CHECKING..." : "CONFIRM"}
            </button>
            <button type="button" className="pf-btn is-ghost" onClick={() => setStage("idle")}>
              CANCEL
            </button>
          </div>
        </form>
      )}

      {profile.twoFactor && (
        <form onSubmit={disable} className="pf-set-inline">
          <Field
            label="PASSWORD TO TURN IT OFF"
            type="password"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Feedback action={action} />
          <button type="submit" className="pf-btn is-ghost" disabled={action.busy || !password}>
            {action.busy ? "WORKING..." : "TURN OFF 2FA"}
          </button>
        </form>
      )}
    </div>
  );
}

function SoundSettings() {
  const [prefs, setPrefs] = useState(getSoundPrefs);

  useEffect(() => onSoundPrefs(setPrefs), []);

  const update = (next) => {
    setSoundPrefs(next);
    if (!getSoundPrefs().muted) sfx.click();
  };

  return (
    <div className="pf-card pf-set">
      <h3>Sound</h3>
      <label className="pf-toggle">
        <input type="checkbox" checked={!prefs.muted} onChange={(e) => update({ muted: !e.target.checked })} />
        <span>Game sounds</span>
      </label>
      <label className="pf-toggle">
        <input
          type="checkbox"
          checked={prefs.keys}
          disabled={prefs.muted}
          onChange={(e) => update({ keys: e.target.checked })}
        />
        <span>Key clicks while typing</span>
      </label>
      <label className="pf-field">
        <span>VOLUME · {Math.round(prefs.volume * 100)}%</span>
        <input
          type="range"
          min="0"
          max="100"
          value={Math.round(prefs.volume * 100)}
          disabled={prefs.muted}
          onChange={(e) => setSoundPrefs({ volume: Number(e.target.value) / 100 })}
          onPointerUp={() => sfx.shoot()}
          onKeyUp={() => sfx.shoot()}
        />
      </label>
      <button type="button" className="pf-btn is-ghost" disabled={prefs.muted} onClick={() => sfx.explode()}>
        TEST SOUND
      </button>
    </div>
  );
}

function SessionSettings({ onSignedOut }) {
  const action = useAction();

  const signOutAll = async () => {
    const data = await action.run(() => post("/settings/sign-out-everywhere"));
    if (data) {
      toast({ icon: "👋", label: "SECURITY", title: data.message });
      onSignedOut();
    }
  };

  return (
    <div className="pf-card pf-set">
      <h3>Sessions</h3>
      <p className="pf-set-text">Lost a phone or used a shared computer? This signs you out everywhere, including here.</p>
      <Feedback action={action} />
      <button type="button" className="pf-btn is-ghost" onClick={signOutAll} disabled={action.busy}>
        SIGN OUT EVERYWHERE
      </button>
    </div>
  );
}

function DangerZone({ profile, onDeleted }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const action = useAction();
  const ready = password && confirm === profile.username;

  const remove = async (e) => {
    e.preventDefault();
    const data = await action.run(() => del("/settings/account", { password }));
    if (data) {
      toast({ icon: "🗑", label: "ACCOUNT", title: data.message });
      onDeleted();
    }
  };

  return (
    <form className="pf-card pf-set is-danger" onSubmit={remove}>
      <h3>Delete account</h3>
      <p className="pf-set-text">
        This removes your account, every saved run, your badges and your spot on the leaderboard. It can't be undone.
      </p>
      <Field
        label={`TYPE "${profile.username}" TO CONFIRM`}
        value={confirm}
        autoComplete="off"
        onChange={(e) => setConfirm(e.target.value)}
      />
      <Field
        label="PASSWORD"
        type="password"
        value={password}
        autoComplete="current-password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <Feedback action={action} />
      <button type="submit" className="pf-btn is-danger" disabled={action.busy || !ready}>
        {action.busy ? "DELETING..." : "DELETE MY ACCOUNT"}
      </button>
    </form>
  );
}

function Settings({ profile, onUserSaved, onSignedOut }) {
  return (
    <div className="pf-settings">
      <p className="tc-page-note">Signed in as {profile.email}</p>
      <div className="pf-settings-grid">
        <ProfileSettings profile={profile} onSaved={onUserSaved} />
        <TwoFactorSettings profile={profile} onSaved={onUserSaved} />
        <PasswordSettings />
        <SoundSettings />
        <SessionSettings onSignedOut={onSignedOut} />
        <DangerZone profile={profile} onDeleted={onSignedOut} />
      </div>
    </div>
  );
}

function GuestPrompt({ onSignIn }) {
  return (
    <div className="pf-card pf-guest">
      <p className="pf-guest-title">You're playing as a guest.</p>
      <p className="pf-muted">
        Guest runs aren't saved. Create a free account to keep your stats, earn badges and show up on the leaderboard.
      </p>
      <div className="pf-guest-actions">
        <button type="button" className="pf-btn" onClick={onSignIn}>
          SIGN IN / SIGN UP
        </button>
      </div>
      <div className="pf-guest-sound">
        <SoundSettings />
      </div>
    </div>
  );
}

const REFRESH_MS = 30 * 1000;

export default function Profile({ user, username, onBack, onSignIn, onUserChange, onAccountGone }) {
  const [tab, setTab] = useState("overview");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [followBusy, setFollowBusy] = useState(false);

  const isPublic = Boolean(username);
  const path = isPublic ? `/users/${encodeURIComponent(username)}` : user ? "/users/me" : null;

  const load = useCallback(async () => {
    if (!path) return;
    try {
      const next = await get(path);
      setData(next);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }, [path]);

  useEffect(() => {
    if (!path) return undefined;
    const first = setTimeout(load, 0);
    const refresh = () => {
      if (document.visibilityState === "visible") load();
    };
    const timer = setInterval(refresh, REFRESH_MS);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [path, load]);

  const toggleFollow = async () => {
    if (!user) {
      toast({ kind: "error", label: "FOLLOW", title: "Sign in to follow players" });
      onSignIn && onSignIn();
      return;
    }
    setFollowBusy(true);
    try {
      const followPath = `/users/${encodeURIComponent(data.user.username)}/follow`;
      const result = data.user.isFollowing ? await del(followPath) : await post(followPath);
      setData((cur) => ({ ...cur, user: { ...cur.user, isFollowing: result.isFollowing, followers: result.followers } }));
    } catch (err) {
      toast({ kind: "error", label: "FOLLOW", title: err.message });
    } finally {
      setFollowBusy(false);
    }
  };

  const handleUserSaved = (nextUser) => {
    onUserChange && onUserChange(nextUser);
    setData((cur) =>
      cur && {
        ...cur,
        user: { ...cur.user, username: nextUser.username, bio: nextUser.bio, twoFactor: nextUser.twoFactor },
      }
    );
  };

  const isSelf = Boolean(data?.user.isSelf);
  const tabs = isSelf ? [...BASE_TABS, SETTINGS_TAB] : BASE_TABS;
  const activeTab = tabs.some((t) => t.key === tab) ? tab : "overview";
  const title = isPublic && data && !isSelf ? `${data.user.username.toUpperCase()}.` : "YOUR STATS.";

  let body;
  if (!path) {
    body = <GuestPrompt onSignIn={onSignIn} />;
  } else if (!data && error) {
    body = (
      <div className="pf-card pf-guest">
        <p className="pf-guest-title">Couldn't load this profile.</p>
        <p className="pf-muted">{error}</p>
        <div className="pf-guest-actions">
          <button type="button" className="pf-btn" onClick={load}>
            TRY AGAIN
          </button>
        </div>
      </div>
    );
  } else if (!data) {
    body = <p className="tc-page-note">Loading profile...</p>;
  } else if (activeTab === "overview") {
    body = <Overview data={data} signedIn={Boolean(user)} onFollow={toggleFollow} followBusy={followBusy} />;
  } else if (activeTab === "history") {
    body = <History rows={data.history} />;
  } else if (activeTab === "badges") {
    body = <Badges badges={data.badges} />;
  } else {
    body = <Settings profile={data.user} onUserSaved={handleUserSaved} onSignedOut={onAccountGone} />;
  }

  const showPanel = data && activeTab === "overview";

  return (
    <div className={`pf-layout ${showPanel ? "with-panel" : ""}`}>
      <PageShell
        label={isPublic && !isSelf ? "// PLAYER" : "// PROFILE"}
        title={title}
        tabs={data ? tabs : []}
        activeTab={activeTab}
        onTabChange={setTab}
        onBack={onBack}
        seed={41}
        className="pf-page"
      >
        {body}
      </PageShell>

      {showPanel && (
        <div className="tc-page pf-panel-wrap">
          <SidePanel data={data} />
        </div>
      )}
    </div>
  );
}
