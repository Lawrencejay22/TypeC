# type_C

A typing game for people who code. Aliens fall from the top of the screen with a piece of real code on each one, and you shoot them down by typing that code exactly. Miss three and the game's over.

Play it here: **https://typec-two.vercel.app**

We made this for our class project because regular typing tests only have plain English words, and typing code feels completely different. Brackets, quotes, semicolons and `=>` slow everyone down at first, so we wanted a game where you practice those.

## How to play

1. Sign up, or just hit **Play as guest**.
2. Pick a language. Easy ones (HTML, CSS, JavaScript) drop aliens slowly. Hard ones (Go, C++, Regex) drop more of them.
3. Pick **Practice** to warm up, or **Ranked** if you want the run saved.
4. Type the code on any alien. Once you start typing, it locks on to the closest match.
5. Get 5 kills in a row without a mistake and your points double until you slip.

Each game is 90 seconds. Press `Esc` to pause.

## What's in it

- 9 languages plus a random mix
- Accounts with email verification, and optional two-factor sign-in
- Live leaderboard, ranked by average WPM
- Badges that get unlocked and saved when you hit certain goals
- Profiles with history, stats, a WPM trend and followers
- Sound effects you can turn off in settings
- Works on phones and desktops, light and dark mode

## Project layout

```
TypeC/
├── client/   the website (React + Vite + Tailwind)
└── server/   the API (Node + Express + MongoDB)
```

The website is hosted on Vercel and the API on Render. Vercel forwards anything under `/api` to Render, so the browser only ever talks to one domain.

## Running it on your own computer

You'll need Node 20 or newer and a MongoDB database. The free tier on MongoDB Atlas is enough.

**Start the API**

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

Open `.env` and fill in at least `MONGO_URI` and `JWT_SECRET`. To make a random secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

You can leave the Brevo settings empty while testing. Verification codes will show up in the terminal instead of your inbox.

**Start the website** (in a second terminal)

```bash
cd client
npm install
npm run dev
```

Then open http://localhost:5173. The dev server passes `/api` calls to `http://localhost:5000`.

## Putting it online

**MongoDB Atlas.** Create a free cluster, add a database user, and allow access from anywhere (`0.0.0.0/0`), since Render doesn't have a fixed IP on the free plan. Copy the connection string and add the database name after `.net/`, like `...mongodb.net/typec?retryWrites=true`.

**Brevo** sends the emails. Verify the address you'll send from under *Senders*, then make an API key under *SMTP & API → API Keys*. Use the key that starts with `xkeysib-`, not the SMTP one.

**Render** runs the API. Create a Web Service from this repo with:

| Setting | Value |
|---|---|
| Root directory | `server` |
| Build command | `npm ci` |
| Start command | `npm start` |
| Health check path | `/api/health` |

Then add these environment variables: `NODE_ENV=production`, `MONGO_URI`, `JWT_SECRET`, `BREVO_API_KEY`, `MAIL_FROM_EMAIL`, `MAIL_FROM_NAME`, `CONTACT_INBOX`, `TIMEZONE=Asia/Manila` and `TRUST_PROXY=2`.

The free plan goes to sleep after about 15 minutes with no visitors, and the next visit takes up to a minute to wake it. Open the site a minute before you need it.

**Vercel** hosts the website. Put your Render address in `client/vercel.json`, then run `npx vercel --prod` from the `client` folder.

## How the important parts work

**Signing in.** Passwords are hashed with bcrypt before they're stored, so we never keep the real password. After you sign in, the server gives your browser a signed token inside an `HttpOnly` cookie. JavaScript on the page can't read that cookie, which protects it from XSS. Each account has a `tokenVersion`, and bumping it signs that account out on every device. That's what *Sign out everywhere* and changing your password do.

**Email codes and 2FA.** Sign-up, password reset and two-factor sign-in all use 6-digit codes sent by email. We store a hash of the code, not the code itself. Codes expire after 10 minutes and allow 5 tries. With 2FA on, knowing someone's password isn't enough to get into their account.

**Cheating.** The browser can't just send a score. When a ranked game starts, the server opens a game session and writes down the time. When it ends, the server checks how much time really passed, recalculates WPM and accuracy itself, and rejects anything impossible: too fast, a score that doesn't match what was typed, or the same game sent twice.

**Badges.** After each saved run, the server checks every badge rule against your real totals, like "80+ WPM in one run" or "7 days in a row". New ones are saved with the date you earned them. The browser never decides what you've earned.

**Other protection.**
- Rate limits on sign-in and email codes.
- Accounts lock for 15 minutes after 5 wrong passwords.
- Every write request has to be JSON, which blocks cross-site form attacks.
- `$` keys are stripped from requests to stop NoSQL injection.
- Security headers are set on both the website and the API.

## API

| Method | Path | What it does |
|---|---|---|
| POST | `/api/auth/register` | create an account and email a code |
| POST | `/api/auth/verify` | confirm the code and sign in |
| POST | `/api/auth/login` | sign in (may ask for a 2FA code next) |
| POST | `/api/auth/login/two-factor` | finish signing in with the emailed code |
| POST | `/api/auth/forgot` · `/reset` | reset a password |
| POST | `/api/auth/logout` | sign out |
| GET | `/api/auth/me` | who's signed in |
| POST | `/api/games/start` | start a ranked game |
| POST | `/api/games/:id/finish` | send the result for checking and saving |
| GET | `/api/leaderboard` | top 50 players |
| GET | `/api/users/me` · `/:username` | profile, history and badges |
| POST · DELETE | `/api/users/:username/follow` | follow or unfollow |
| PATCH | `/api/settings/profile` · `/password` | edit your profile or password |
| POST | `/api/settings/two-factor/start` · `/enable` · `/disable` | turn 2FA on or off |
| POST | `/api/settings/sign-out-everywhere` | sign out on all devices |
| DELETE | `/api/settings/account` | delete your account |
| POST | `/api/contact` | contact form |
| GET | `/api/stats` | numbers for the home page |
| GET | `/api/health` | is the server up |

## Team

Made by the TypeC group: Lawrence, Ivan and friends, 2026.
