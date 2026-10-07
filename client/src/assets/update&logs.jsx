import { useState } from "react";
import PageShell from "./component/PageShell.jsx";
import "./updates.css";

const TABS = [
  { key: "pack", icon: "📦", label: "Pack" },
  { key: "faq", icon: "❓", label: "FAQ" },
  { key: "help", icon: "🛟", label: "Help" },
  { key: "demo", icon: "🎮", label: "Demo" },
];

const HEADINGS = {
  pack: { label: "// UPDATES & LOGS", title: "WHAT'S NEW?" },
  faq: { label: "// Most Common Questions", title: "SOMETHING ON YOUR MIND?" },
  help: { label: "// Quick Tutorial", title: "NEED HELP?" },
  demo: { label: "// WHAT TO EXPECT", title: "QUICK GAMEPLAY PREVIEW." },
};

const RELEASES = [
  {
    version: "v0.4.2",
    type: "patch",
    date: "2026-09-03",
    notes: [
      "Fixed combo streak reset on alien timeout",
      "Corrected SQL word pool — removed reserved keyword conflicts",
      "Improved alien bounce boundary at viewport edges",
    ],
  },
  {
    version: "v0.4.0",
    type: "minor",
    date: "2026-08-28",
    notes: [
      "Added single-target locking — only one alien glows per typed character",
      "Combo × streak system with 🔥 STREAK ×N at 5+ correct kills",
      "Horizontal alien drift + bounce mechanics",
      "Number badges on each alien",
    ],
  },
  {
    version: "v0.3.1",
    type: "patch",
    date: "2026-08-19",
    notes: [
      "Dark / light theme toggle wired globally",
      "Skeleton loading screen with sign-in and sign-up variants",
      "PLAY AS GUEST shortcut on auth screen",
    ],
  },
];

const FAQS = [
  {
    q: "How do I target a specific alien?",
    a: "Start typing — the first character locks onto the lowest (most dangerous) alien whose word starts with that letter. A green glow ring confirms the lock. Finish the word to destroy it.",
  },
  {
    q: "What triggers a STREAK?",
    a: "Kill 5 or more aliens in a row without a single typo. The HUD shows 🔥 STREAK ×N and your score multiplier doubles until you miss.",
  },
  {
    q: "Can I play without an account?",
    a: "Yes — hit PLAY AS GUEST on the sign-in screen. Guest sessions are not saved to the leaderboard.",
  },
  {
    q: "What languages are available?",
    a: "HTML, CSS, JS, TS, Python, and SQL. Each language has curated word pools tuned to real syntax.",
  },
  {
    q: "Why does the alien word shake red?",
    a: "That's typo feedback — the word shakes and flashes red when you press a wrong key.",
  },
];

const HELP_CARDS = [
  {
    icon: "⌨",
    title: "Typing controls",
    text: "Just type — no mouse needed during gameplay. The game reads your keystrokes directly. Backspace is disabled mid-word to keep the pressure on.",
  },
  {
    icon: "🎯",
    title: "Target locking",
    text: "Type the first letter of an alien's word to lock onto it. Once locked, only that alien accepts input. A green ring shows your active target.",
  },
  {
    icon: "🔥",
    title: "Streak system",
    text: "Chain 5+ correct kills with zero typos to enter STREAK mode. Your score multiplier doubles. One wrong key resets the chain.",
  },
  {
    icon: "💀",
    title: "Lives & game over",
    text: "Each alien that reaches the bottom costs you one life. Lose all three and the mission ends — your score is tallied and saved (if logged in).",
  },
  {
    icon: "🌐",
    title: "Language packs",
    text: "Choose from HTML, CSS, JS, TS, Python, or SQL. Each language has curated word pools tuned to real syntax — not lorem ipsum.",
  },
  {
    icon: "🏆",
    title: "Leaderboard",
    text: "High scores are recorded per-language per-difficulty. Guest sessions are local only. Sign in to compete globally.",
  },
];

const CHAPTERS = [
  { time: "0:00", title: "Intro & Language Selection", text: "Picking a language pack and difficulty before drop." },
  { time: "0:28", title: "Basic Typing Mechanics", text: "First-letter locking, green glow ring, word completion." },
  { time: "1:04", title: "Streak Combo Demo", text: "Building a 5-kill chain and seeing the STREAK multiplier kick in." },
  { time: "1:42", title: "Wrong Key Shake", text: "Demonstrating the shake + red flash feedback on a typo." },
];

function Releases() {
  return (
    <div className="up-stack up-releases">
      <p className="tc-page-note">Release history — latest first.</p>
      {RELEASES.map((release) => (
        <article key={release.version} className="up-card up-release">
          <header>
            <h2>{release.version}</h2>
            <span className={`up-chip is-${release.type}`}>{release.type}</span>
            <time dateTime={release.date}>{release.date}</time>
          </header>
          <ul>
            {release.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

function Faq() {
  const [open, setOpen] = useState(() => new Set([0, 1, 2]));

  const toggle = (i) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <div className="up-stack up-faq">
      <p className="tc-page-note">Frequently asked questions.</p>
      {FAQS.map((item, i) => {
        const isOpen = open.has(i);
        return (
          <div key={item.q} className={`up-card up-faq-item ${isOpen ? "is-open" : ""}`}>
            <button type="button" aria-expanded={isOpen} onClick={() => toggle(i)}>
              <span>{item.q}</span>
              <span className="up-faq-sign" aria-hidden="true">{isOpen ? "−" : "+"}</span>
            </button>
            {isOpen && <p>{item.a}</p>}
          </div>
        );
      })}
    </div>
  );
}

function Help() {
  return (
    <div className="up-help">
      {HELP_CARDS.map((card) => (
        <article key={card.title} className="up-card up-help-card">
          <header>
            <span aria-hidden="true">{card.icon}</span>
            <h2>{card.title}</h2>
          </header>
          <p>{card.text}</p>
        </article>
      ))}
      <div className="up-help-note">
        <span aria-hidden="true">!</span>
        <p>
          Having trouble? Open an issue on our GitHub or ping us in the community Discord. Include
          your browser, OS, and which language pack you were playing.
        </p>
      </div>
    </div>
  );
}

function Demo({ onPlay }) {
  return (
    <div className="up-stack up-demo">
      <p className="tc-page-note">Watch the game mechanics in action before you play.</p>

      <div className="up-video" title="Demo video coming soon">
        <span className="up-video-play" aria-hidden="true" />
        <span className="up-video-label">GAMEPLAY DEMO — 2:14</span>
      </div>

      <div className="up-chapters">
        {CHAPTERS.map((chapter) => (
          <div key={chapter.time} className="up-card up-chapter">
            <span className="up-chapter-time">{chapter.time}</span>
            <div>
              <h2>{chapter.title}</h2>
              <p>{chapter.text}</p>
            </div>
          </div>
        ))}
      </div>

      <button type="button" className="up-play" onClick={onPlay}>
        PLAY NOW →
      </button>
    </div>
  );
}

export default function UpdatesLogs({ initialTab = "pack", onPlay }) {
  const [tab, setTab] = useState(initialTab);

  const heading = HEADINGS[tab];

  return (
    <PageShell
      label={heading.label}
      title={heading.title}
      tabs={TABS}
      activeTab={tab}
      onTabChange={setTab}
      seed={17}
      className="up-page"
    >
      {tab === "pack" && <Releases />}
      {tab === "faq" && <Faq />}
      {tab === "help" && <Help />}
      {tab === "demo" && <Demo onPlay={onPlay} />}
    </PageShell>
  );
}
