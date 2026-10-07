import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import MatrixBg from "./component/MatrixBg.jsx";
import "./leaderboard.css";

const SAMPLE_PLAYERS = [
  { username: "Bruhhting", accuracy: 99.9, wpm: 417.2, bio: "Average bruh moment..." },
  { username: "IMJADEIGUESS", accuracy: 97.5, wpm: 367.4 },
  { username: "Blazegaming", accuracy: 97.6, wpm: 305.6 },
  { username: "#$&", accuracy: 97.9, wpm: 304.2 },
  { username: "BREAD NAUTILUS", accuracy: 97.8, wpm: 294.8 },
  { username: "XD JZReaper", accuracy: 95.6, wpm: 267.2 },
];

const PODIUM_ORDER = [1, 0, 2];

function hueFrom(name) {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) % 360;
  return hash;
}

function Avatar({ player, size }) {
  const [broken, setBroken] = useState(false);
  const hue = hueFrom(player.username);

  if (player.avatar && !broken) {
    return (
      <img
        className="lb-avatar"
        src={player.avatar}
        alt=""
        width={size}
        height={size}
        style={{ width: size, height: size }}
        onError={() => setBroken(true)}
      />
    );
  }

  const letters = player.username.replace(/[^a-z0-9]/gi, "").slice(0, 2) || "?";

  return (
    <span
      className="lb-avatar lb-avatar-fallback"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: `linear-gradient(135deg, hsl(${hue} 60% 45%), hsl(${(hue + 50) % 360} 55% 30%))`,
      }}
      aria-hidden="true"
    >
      {letters.toUpperCase()}
    </span>
  );
}

function PlayerPreview({ player, following, onFollow, onViewProfile, className = "" }) {
  return (
    <div className={`lb-preview ${className}`} role="dialog" aria-label={`${player.username} preview`}>
      <div className="lb-preview-banner" />
      <div className="lb-preview-avatar">
        <Avatar player={player} size={54} />
      </div>
      <p className="lb-preview-name">{player.username}</p>
      <p className="lb-preview-bio">{player.bio || "No bio yet..."}</p>

      <button type="button" className="lb-preview-link" onClick={onViewProfile}>
        View Profile <FontAwesomeIcon icon={faUser} />
      </button>

      <div className="lb-preview-badges" aria-label="Badges">
        <span title="Speed">⚡</span>
        <span title="Top 3">🏆</span>
        <span title="Accuracy">🎯</span>
      </div>

      <button
        type="button"
        className={`lb-preview-follow ${following ? "is-following" : ""}`}
        onClick={onFollow}
      >
        {following ? "Following" : "Follow"}
        <FontAwesomeIcon icon={following ? faHeartSolid : faHeart} />
      </button>
    </div>
  );
}

export default function Leaderboard({ onViewProfile }) {
  const [players, setPlayers] = useState(SAMPLE_PLAYERS);
  const [activePlayer, setActivePlayer] = useState(null);
  const [following, setFollowing] = useState({});

  useEffect(() => {
    let ignore = false;

    fetch("/api/leaderboard")
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.players;
        if (!ignore && Array.isArray(list) && list.length) {
          setPlayers([...list].sort((a, b) => b.wpm - a.wpm));
        }
      })
      .catch(() => {});

    return () => {
      ignore = true;
    };
  }, []);

  const podium = PODIUM_ORDER.map((i) => players[i] && { ...players[i], rank: i + 1 }).filter(Boolean);
  const rest = players.slice(3).map((p, i) => ({ ...p, rank: i + 4 }));

  const toggleFollow = (name) =>
    setFollowing((prev) => ({ ...prev, [name]: !prev[name] }));

  const hoverProps = (name) => ({
    onMouseEnter: () => setActivePlayer(name),
    onMouseLeave: () => setActivePlayer((cur) => (cur === name ? null : cur)),
    onFocus: () => setActivePlayer(name),
    onBlur: (e) => {
      if (!e.currentTarget.contains(e.relatedTarget)) {
        setActivePlayer((cur) => (cur === name ? null : cur));
      }
    },
    onClick: () => setActivePlayer((cur) => (cur === name ? cur : name)),
  });

  const preview = (player, placement) =>
    activePlayer === player.username && (
      <PlayerPreview
        player={player}
        className={placement}
        following={!!following[player.username]}
        onFollow={(e) => {
          e.stopPropagation();
          toggleFollow(player.username);
        }}
        onViewProfile={(e) => {
          e.stopPropagation();
          onViewProfile && onViewProfile(player);
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

      <div className="lb-board">
        <div className="lb-podium">
          {podium.map((player) => (
            <div
              key={player.username}
              className={`lb-podium-card rank-${player.rank} ${
                activePlayer === player.username ? "is-active" : ""
              }`}
              tabIndex={0}
              {...hoverProps(player.username)}
            >
              <Avatar player={player} size={90} />
              <p className="lb-podium-name">{player.username}</p>
              <p className="lb-podium-rank">#{player.rank}</p>
              <div className="lb-podium-stats">
                <span>Avg. Accuracy: {player.accuracy}%</span>
                <span>Avg. WPM: {player.wpm}</span>
              </div>
              {preview(player, "on-card")}
            </div>
          ))}
        </div>

        <div className="lb-list">
          {rest.map((player) => (
            <div
              key={player.username}
              className={`lb-row ${activePlayer === player.username ? "is-active" : ""}`}
              tabIndex={0}
              {...hoverProps(player.username)}
            >
              <span className="lb-row-rank">#{player.rank}</span>
              <Avatar player={player} size={40} />
              <span className="lb-row-name">{player.username}</span>
              <span className="lb-row-stat">Avg. Accuracy: {player.accuracy}%</span>
              <span className="lb-row-stat">Avg. WPM: {player.wpm}</span>
              {preview(player, "on-row")}
            </div>
          ))}

          {!rest.length && <p className="lb-empty">No other players yet. Go set a record!</p>}
        </div>
      </div>
    </section>
  );
}
