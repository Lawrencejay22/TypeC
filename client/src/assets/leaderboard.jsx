import { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import MatrixBg from "./component/MatrixBg.jsx";
import Avatar from "./component/Avatar.jsx";
import { get, post, del } from "../api.js";
import { toast } from "../toasts.js";
import { useSlow, WAKE_NOTE } from "../live.js";
import "./leaderboard.css";

const PODIUM_ORDER = [1, 0, 2];
const REFRESH_MS = 10 * 1000;

function PlayerPreview({ player, signedIn, busy, onFollow, onViewProfile, className = "" }) {
  return (
    <div className={`lb-preview ${className}`} role="dialog" aria-label={`${player.username} preview`}>
      <div className="lb-preview-banner" />
      <div className="lb-preview-avatar">
        <Avatar name={player.username} size={54} />
      </div>
      <p className="lb-preview-name">{player.username}</p>
      <p className="lb-preview-bio">{player.bio || "No bio yet..."}</p>

      <button type="button" className="lb-preview-link" onClick={onViewProfile}>
        View Profile <FontAwesomeIcon icon={faUser} />
      </button>

      <div className="lb-preview-badges" aria-label="Latest badges">
        {player.badges.length ? (
          player.badges.map((badge) => (
            <span key={badge.name} title={badge.name}>{badge.icon}</span>
          ))
        ) : (
          <span className="lb-preview-nobadge">no badges yet</span>
        )}
      </div>

      {player.isYou ? (
        <span className="lb-preview-you">THIS IS YOU · {player.followers} followers</span>
      ) : (
        <button
          type="button"
          disabled={busy}
          className={`lb-preview-follow ${player.isFollowing ? "is-following" : ""}`}
          onClick={onFollow}
          title={signedIn ? "" : "Sign in to follow players"}
        >
          {player.isFollowing ? "Following" : "Follow"} · {player.followers}
          <FontAwesomeIcon icon={player.isFollowing ? faHeartSolid : faHeart} />
        </button>
      )}
    </div>
  );
}

function timeAgo(date) {
  if (!date) return "";
  const seconds = Math.max(0, Math.round((Date.now() - date) / 1000));
  return seconds < 5 ? "just now" : `${seconds}s ago`;
}

export default function Leaderboard({ user, onViewProfile, onSignIn }) {
  const [players, setPlayers] = useState(null);
  const [error, setError] = useState("");
  const [updatedAt, setUpdatedAt] = useState(null);
  const [activePlayer, setActivePlayer] = useState(null);
  const [busy, setBusy] = useState(null);
  const [, setTick] = useState(0);
  const slow = useSlow(players === null && !error);

  const load = useCallback(async () => {
    try {
      const data = await get("/leaderboard");
      setPlayers(data.players);
      setUpdatedAt(Date.now());
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    let timer = null;
    const refresh = () => {
      if (document.visibilityState === "visible") load();
    };
    const first = setTimeout(load, 0);
    timer = setInterval(refresh, REFRESH_MS);
    const clock = setInterval(() => setTick((t) => t + 1), 1000);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
      clearInterval(clock);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [load]);

  const toggleFollow = async (player) => {
    if (!user) {
      toast({ kind: "error", label: "FOLLOW", title: "Sign in to follow players" });
      onSignIn && onSignIn();
      return;
    }
    setBusy(player.username);
    try {
      const path = `/users/${encodeURIComponent(player.username)}/follow`;
      const data = player.isFollowing ? await del(path) : await post(path);
      setPlayers((list) =>
        list.map((p) => (p.username === player.username ? { ...p, isFollowing: data.isFollowing, followers: data.followers } : p))
      );
    } catch (err) {
      toast({ kind: "error", label: "FOLLOW", title: err.message });
    } finally {
      setBusy(null);
    }
  };

  const list = players || [];
  const podium = PODIUM_ORDER.map((i) => (list[i] ? { ...list[i], rank: i + 1 } : { empty: true, rank: i + 1 }));
  const rest = list.slice(3).map((p, i) => ({ ...p, rank: i + 4 }));

  const hoverProps = (name) => ({
    onMouseEnter: () => setActivePlayer(name),
    onMouseLeave: () => setActivePlayer((cur) => (cur === name ? null : cur)),
    onFocus: () => setActivePlayer(name),
    onBlur: (e) => {
      if (!e.currentTarget.contains(e.relatedTarget)) {
        setActivePlayer((cur) => (cur === name ? null : cur));
      }
    },
    onClick: () => setActivePlayer(name),
  });

  const preview = (player, placement) =>
    activePlayer === player.username && (
      <PlayerPreview
        player={player}
        className={placement}
        signedIn={Boolean(user)}
        busy={busy === player.username}
        onFollow={(e) => {
          e.stopPropagation();
          toggleFollow(player);
        }}
        onViewProfile={(e) => {
          e.stopPropagation();
          onViewProfile && onViewProfile(player.username);
        }}
      />
    );

  return (
    <section className="lb-page">
      <MatrixBg seed={37} />

      <h1 className="lb-title">
        Leaderboard
        <span className="lb-title-bars" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </h1>

      <p className="lb-live">
        <span className={`lb-live-dot ${error ? "is-down" : ""}`} />
        {error ? `Offline · ${error}` : players ? `Live · ranked by average WPM · updated ${timeAgo(updatedAt)}` : slow ? WAKE_NOTE : "Loading the rankings..."}
      </p>

      <div className="lb-board">
        {players === null && !error && (
          <div className="lb-podium">
            {[2, 1, 3].map((rank) => (
              <div key={rank} className={`lb-podium-card rank-${rank} is-loading`}>
                <span className="lb-avatar lb-skeleton" style={{ width: 90, height: 90 }} />
                <span className="lb-skeleton" style={{ width: 140, height: 18, marginTop: 18 }} />
                <span className="lb-skeleton" style={{ width: 60, height: 30, marginTop: 18 }} />
              </div>
            ))}
          </div>
        )}

        {players && players.length === 0 && (
          <div className="lb-empty-state">
            <p className="lb-empty-title">No ranked players yet.</p>
            <p>Finish a game while signed in and you'll be the first name on the board.</p>
          </div>
        )}

        {list.length > 0 && (
          <div className="lb-podium">
            {podium.map((player) => player.empty ? (
              <div key={`empty-${player.rank}`} className={`lb-podium-card rank-${player.rank} is-empty`}>
                <p className="lb-podium-rank">#{player.rank}</p>
                <p className="lb-empty-spot">Open spot. Play a ranked run to take it.</p>
              </div>
            ) : (
              <div
                key={player.username}
                className={`lb-podium-card rank-${player.rank} ${activePlayer === player.username ? "is-active" : ""} ${player.isYou ? "is-you" : ""}`}
                tabIndex={0}
                {...hoverProps(player.username)}
              >
                <Avatar name={player.username} size={90} />
                <p className="lb-podium-name">{player.username}</p>
                <p className="lb-podium-rank">#{player.rank}</p>
                <div className="lb-podium-stats">
                  <span>Avg. Accuracy: {player.accuracy}%</span>
                  <span>Avg. WPM: {player.wpm}</span>
                </div>
                <p className="lb-podium-races">{player.races} {player.races === 1 ? "run" : "runs"} · best {player.bestWpm} WPM</p>
                {preview(player, "on-card")}
              </div>
            ))}
          </div>
        )}

        {rest.length > 0 && (
          <div className="lb-list">
            {rest.map((player) => (
              <div
                key={player.username}
                className={`lb-row ${activePlayer === player.username ? "is-active" : ""} ${player.isYou ? "is-you" : ""}`}
                tabIndex={0}
                {...hoverProps(player.username)}
              >
                <span className="lb-row-rank">#{player.rank}</span>
                <Avatar name={player.username} size={40} />
                <span className="lb-row-name">{player.username}{player.isYou && <em> (you)</em>}</span>
                <span className="lb-row-stat">Avg. Accuracy: {player.accuracy}%</span>
                <span className="lb-row-stat">Avg. WPM: {player.wpm}</span>
                {preview(player, "on-row")}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
