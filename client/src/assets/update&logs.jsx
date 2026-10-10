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
    version: "v0.6.0",
    type: "minor",
    date: "2026-10-10",
    notes: [
      "Works properly on phones now, with a menu button and a layout that fits the screen",
      "Pages open right away instead of waiting on the server",
      "Aliens fall straight down in their own lanes",
      "Easy languages spawn aliens slower; hard ones are normal speed",
      "Fewer steps before a game: pick a language, pick a mode, 3-2-1, go",
      "Practice runs are just for warming up and aren't saved",
      "New type_C logo",
    ],
  },
  {
    version: "v0.5.0",
    type: "minor",
    date: "2026-10-10",
    notes: [
      "Real accounts with email verification codes",
      "Optional two-factor sign-in from Profile → Settings",
      "Runs are saved and checked on the server, so impossible scores get rejected",
      "Live leaderboard ranked by average WPM, refreshed every few seconds",
      "Badges are earned on the server and stored with the date you got them",
      "Sound effects for shots, explosions, misses, streaks and the countdown",
      "Follow other players and open their public profiles",
    ],
  },
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
    a: "Yes — hit PLAY AS GUEST on the sign-in screen. Guest runs aren't saved, so they don't count for the leaderboard or badges.",
  },
  {
    q: "How is the leaderboard ranked?",
    a: "By your average WPM across every saved run. The server recalculates your WPM and accuracy from the run itself, so the numbers can't be edited from the browser.",
  },
  {
    q: "How do I turn on two-factor sign-in?",
    a: "Open Profile → Settings → Two-factor authentication. We email you a 6-digit code to confirm, and after that every sign-in asks for a fresh code.",
  },
  {
    q: "What languages are available?",
    a: "HTML, CSS, JavaScript, TypeScript, Python, SQL & Rust, Go, C++, Regex, or Random for a mix. Each pack uses snippets taken from real syntax.",
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
    text: "Just type — no mouse needed during gameplay. The game reads your keystrokes directly. Press ESC any time to pause or resume.",
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
    text: "Each alien that reaches the bottom costs you one life. Lose all three and the game ends. Ranked runs are saved when you're signed in.",
  },
  {
    icon: "🌐",
    title: "Language packs",
    text: "Choose from ten packs, from HTML and CSS to Go, C++ and Regex. Every pack uses real syntax — not lorem ipsum.",
  },
  {
    icon: "🏆",
    title: "Leaderboard",
    text: "Every signed-in run is saved and ranked by average WPM. Guest runs stay local. Sign in to compete, earn badges and build a streak.",
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
          Having trouble? Send us a message from the Contact page. Include your browser, OS, and
          which language pack you were playing.
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
