# TYPEC — Typing Practice App

A space-themed typing practice game built with React and Vite. Players sharpen their coding skills by typing real code snippets across multiple languages and difficulty modes.

---

## Features

- **Multiple language modes** — Practice HTML, CSS, and JavaScript snippets
- **Game flow** — Mode select → Mission briefing → Pre-launch countdown → Live typing game → Results
- **Light / Dark theme** — Toggle between themes, persisted across the session
- **Leaderboard** — Track and compare scores
- **Auth flow** — Login page with a welcome screen on first entry
- **Responsive layout** — Header and footer adapt to the current view (hidden during active gameplay)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Build tool | Vite 8 |
| Styling | Tailwind CSS 4 |
| Icons | Font Awesome (React) |
| Linting | ESLint 10 |

---

## Project Structure

```
client/
├── public/
├── src/
│   ├── assets/
│   │   ├── component/
│   │   │   ├── header.jsx        # Top nav bar with theme toggle & sign out
│   │   │   ├── footer.jsx        # Site footer
│   │   │   └── HeroSection.jsx   # Landing hero block
│   │   ├── js/
│   │   │   └── index.js          # Shared JS utilities
│   │   ├── logo/
│   │   │   └── logo.png
│   │   ├── login.jsx             # Login / auth screen
│   │   ├── Welcome.jsx           # Post-login welcome animation
│   │   ├── home.jsx              # Home screen (wraps SelectMode)
│   │   ├── SelectMode.jsx        # Mode selection cards
│   │   ├── ModeSelect.jsx        # Play-style picker (after mode is chosen)
│   │   ├── MissionBriefing.jsx   # Mission details before launch
│   │   ├── PreLaunch.jsx         # Countdown screen
│   │   ├── TypingGame.jsx        # Core typing game engine
│   │   ├── GameResults.jsx       # End-of-game stats & actions
│   │   ├── leaderboard.jsx       # Leaderboard view
│   │   ├── profile.jsx           # User profile
│   │   ├── about.jsx             # About page
│   │   ├── contact.jsx           # Contact page
│   │   └── update&logs.jsx       # Changelog / update logs
│   ├── App.jsx                   # Root component & view router
│   ├── index.css                 # Global styles
│   └── main.jsx                  # React entry point
├── index.html
├── package.json
└── vite.config.js
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install dependencies

```bash
npm install
```

### Start the dev server

```bash
npm run dev
```

The app runs at `http://localhost:5173` by default.

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

---

## Game Flow

```mermaid
flowchart TD
    START([🚀 App Start]) --> SESSION{Session\nstorage\nview?}

    SESSION -- "login / empty" --> LOGIN
    SESSION -- "transient view\ne.g. game/results" --> HOME

    %% ── Auth ──────────────────────────────────────────────
    LOGIN["🔐 Login\n─────────────────\n• Sign In\n• Sign Up\n• Play as Guest\n• OAuth: GitHub / Google"]

    LOGIN -- "Auth Success /" --> WELCOME["✅ Welcome\n─────────────────\nAuthentication animation\n+ loading bar (auto-advance)"]
    WELCOME -- "onComplete" --> HOME

    %% ── Home ──────────────────────────────────────────────
    HOME["🏠 Home / SelectMode\n─────────────────\nFilter: All / Easy / Medium / Hard\nLanguages per tier:\n• EASY   → HTML · CSS · JS\n• MEDIUM → TS · Python · SQL & Rust\n• HARD   → Go · C++ · Regex\n+ RANDOM (all langs mixed)"]

    HOME -- "Pick language\nor RANDOM" --> MODESELECT

    %% ── Mode Select ───────────────────────────────────────
    MODESELECT["🎮 ModeSelect\n─────────────────\n• Practice Mode (FREE)\n  Unlimited retries, no rank impact\n• Serious Mode (RANKED)\n  Score submitted to leaderboard"]

    MODESELECT -- "onSelect(style)" --> BRIEFING
    MODESELECT -- "onBack" --> HOME

    %% ── Mission Briefing ──────────────────────────────────
    BRIEFING["📋 Mission Briefing\n─────────────────\nPer-language details:\n• Objective  • Notes\n• Difficulty  • WPM target\n• Duration   • Accuracy req"]

    BRIEFING -- "START SESSION →" --> PRELAUNCH
    BRIEFING -- "← BACK" --> MODESELECT

    %% ── Pre-Launch ────────────────────────────────────────
    PRELAUNCH["🛸 Pre-Launch\n─────────────────\nLanguage tagline + description\n↑ LAUNCH button →\n3 … 2 … 1 … GO!"]

    PRELAUNCH -- "onLaunch (after countdown)" --> GAME
    PRELAUNCH -- "← BACK" --> BRIEFING

    %% ── Typing Game ───────────────────────────────────────
    GAME["🎯 Typing Game\n─────────────────\nAliens fall with code snippets\nType to target → laser fires\nLive HUD: WPM · Accuracy · Score\nHealth: ❤❤❤\nTimer: 90 sec\nPause / Resume / Exit"]

    GAME -- "Timer hits 0\nor Health = 0" --> RESULTS
    GAME -- "EXIT button" --> HOME

    %% ── Results ───────────────────────────────────────────
    RESULTS["🏆 Game Results\n─────────────────\nAnimated stats:\n• WPM  • Accuracy\n• Score  • Time Elapsed\n• Enemies Defeated  • Rank (S–D)"]

    RESULTS -- "RETRY ↺" --> PRELAUNCH
    RESULTS -- "← BACK TO MISSION SELECT" --> HOME
    RESULTS -- "[ LEADERBOARD ]\n(Ranked mode only)" --> HOME

    %% ── Header Nav (any non-game view) ────────────────────
    HEADER["🔧 Header\n─────────────────\nTheme toggle · Sign Out\nNav: Home · Leaderboard\nProfile · About · Contact\nUpdate & Logs"]

    HOME -. "always visible\nexcept in game" .-> HEADER
    HEADER -. "onSignOut" .-> LOGIN

    %% ── Styles ────────────────────────────────────────────
    style START    fill:#00E572,color:#04070e,stroke:none
    style LOGIN    fill:#1a1f2e,color:#e2e8f0,stroke:#334155
    style WELCOME  fill:#1a1f2e,color:#e2e8f0,stroke:#334155
    style HOME     fill:#1a1f2e,color:#e2e8f0,stroke:#334155
    style MODESELECT fill:#1a1f2e,color:#e2e8f0,stroke:#334155
    style BRIEFING fill:#1a1f2e,color:#e2e8f0,stroke:#334155
    style PRELAUNCH fill:#1a1f2e,color:#e2e8f0,stroke:#334155
    style GAME     fill:#04070e,color:#e2e8f0,stroke:#00E572
    style RESULTS  fill:#1a1f2e,color:#e2e8f0,stroke:#334155
    style HEADER   fill:#0f1420,color:#94a3b8,stroke:#1e293b,stroke-dasharray:5 5
    style SESSION  fill:#0f1420,color:#94a3b8,stroke:#334155
```

---

## Roadmap

### v1.0 — Core Game ✅ Done
The full single-player game loop is implemented and working.

| Feature | Status |
|---------|--------|
| Login / Sign Up / Guest / OAuth UI | ✅ |
| Welcome animation screen | ✅ |
| Mode select (9 languages + Random, 3 tiers) | ✅ |
| Play style picker (Practice / Ranked) | ✅ |
| Mission briefing per language | ✅ |
| Pre-launch countdown | ✅ |
| Typing game engine (aliens, laser, HUD) | ✅ |
| Game results with animated stats + rank | ✅ |
| Dark / Light theme toggle | ✅ |
| Header navigation (auth / unauth) | ✅ |

---

### v1.1 — Content Pages 🚧 In Progress
These views are linked from the header but are currently empty files.

| Feature | Status |
|---------|--------|
| Profile page — player stats, match history, badges (`profile.jsx`) | 🚧 Empty |
| Leaderboard page (`leaderboard.jsx`) | 🚧 Empty |
| About page (`about.jsx`) | 🚧 Empty |
| Contact page (`contact.jsx`) | 🚧 Empty |
| Updates & Logs page (`update&logs.jsx`) | 🚧 Empty |

---

### v1.2 — Backend & Auth 🔲 Planned
The server folder exists but is empty. All auth and data is currently frontend-only.

| Feature | Status |
|---------|--------|
| Express / Fastify server setup | 🔲 |
| Real user authentication (JWT / sessions) | 🔲 |
| User registration & login API | 🔲 |
| Persist game stats to database | 🔲 |
| Leaderboard API (global rankings) | 🔲 |
| User profile API (stats history) | 🔲 |
| OAuth integration (GitHub / Google) | 🔲 |

---

### v1.3 — Multiplayer 🔲 Planned
The header already links to a `multiplayer` route — the feature is planned but not started.

| Feature | Status |
|---------|--------|
| Competitive 1v1 matchmaking | 🔲 |
| Real-time race (WebSockets) | 🔲 |
| Ranked match scoring system | 🔲 |
| Match history & replays | 🔲 |

---

### v1.4 — Advanced Stats & UX 🔲 Planned

| Feature | Status |
|---------|--------|
| Per-finger latency metrics | 🔲 |
| Mistake heatmap (keyboard layout) | 🔲 |
| WPM progress graph over time | 🔲 |
| Custom keybindings | 🔲 |
| Mechanical switch audio themes | 🔲 |
| Mobile / touch support | 🔲 |
| Docs page | 🔲 |

---

## Backend (Server)

The server lives in the `server/` directory at the repo root (sibling to `client/`).

> Server is currently under development. This section will be updated as the backend is built out.

Planned responsibilities:

- User authentication (login / register)
- Persisting game stats and scores
- Leaderboard data API
- User profile management

### Running the server

```bash
# from the repo root
cd server
npm install
npm run dev
```

> Update this section with the actual stack (Express, Fastify, etc.), port, and environment variables once the server is set up.

---

## Session Behavior

View state is stored in `sessionStorage` under the key `typec_view`. Transient views (`welcome`, `modeselect`, `briefing`, `prelaunch`, `game`, `results`) are never restored on page refresh — the user is redirected to `home` instead.
