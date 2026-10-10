import { useState, useEffect, useRef, useCallback } from 'react'
import './index.css'
import Header from './assets/component/header.jsx'
import Footer from './assets/component/footer.jsx'
import Toasts from './assets/component/Toasts.jsx'
import Login from './assets/login.jsx'
import Welcome from './assets/Welcome.jsx'
import Home from './assets/home.jsx'
import ModeSelect from './assets/ModeSelect.jsx'
import PreLaunch from './assets/PreLaunch.jsx'
import TypingGame from './assets/TypingGame.jsx'
import GameResults from './assets/GameResults.jsx'
import Contact from './assets/contact.jsx'
import About from './assets/about.jsx'
import Leaderboard from './assets/leaderboard.jsx'
import Profile from './assets/profile.jsx'
import UpdatesLogs from './assets/update&logs.jsx'
import Multiplayer from './assets/multiplayer.jsx'
import { get, post } from './api.js'
import { refreshStats } from './live.js'
import { toast } from './toasts.js'

const TRANSIENT_VIEWS = new Set(['welcome', 'modeselect', 'prelaunch', 'game', 'results']);
const PUBLIC_VIEWS = new Set(['login', 'about', 'contact', 'leaderboard', 'updates', 'docs', 'player']);

function readSession(key) {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function readCachedUser() {
  try {
    const saved = JSON.parse(localStorage.getItem('typec_user'));
    return saved && typeof saved.username === 'string' ? saved : null;
  } catch {
    return null;
  }
}

function cacheUser(user) {
  try {
    if (user) localStorage.setItem('typec_user', JSON.stringify(user));
    else localStorage.removeItem('typec_user');
  } catch {
    return;
  }
}

function writeSession(key, value) {
  try {
    if (value === null) sessionStorage.removeItem(key);
    else sessionStorage.setItem(key, value);
  } catch {
    return;
  }
}

export default function App() {
  const [currentView, setCurrentView] = useState(() => {
    const saved = readSession('typec_view');
    return TRANSIENT_VIEWS.has(saved) ? 'home' : (saved || 'login');
  });

  const [user,      setUserState] = useState(readCachedUser);
  const [guest,     setGuest]     = useState(() => readSession('typec_guest') === '1');

  const [selectedMode,      setSelectedMode]      = useState(null);
  const [selectedPlayStyle, setSelectedPlayStyle] = useState(null);
  const [gameStats,         setGameStats]         = useState(null);
  const [saveState,         setSaveState]         = useState({ status: 'idle' });
  const [viewedPlayer,      setViewedPlayer]      = useState(() => readSession('typec_player'));

  const sessionRef = useRef(null);

  const setUser = useCallback((next) => {
    cacheUser(next);
    setUserState(next);
  }, []);

  const [isLight, setIsLight] = useState(() => readSession('typec_theme') === 'light');

  useEffect(() => {
    document.documentElement.classList.toggle('light', isLight);
  }, [isLight]);

  useEffect(() => {
    let alive = true;
    get('/auth/me')
      .then((data) => alive && setUser(data.user))
      .catch(() => {});
    return () => { alive = false; };
  }, [setUser]);

  const navigate = useCallback((view) => {
    writeSession('typec_view', view);
    setCurrentView(view);
    window.scrollTo(0, 0);
  }, []);

  const signedIn = Boolean(user);
  const canPlay = signedIn || guest;

  let view = currentView;
  if (!canPlay && !PUBLIC_VIEWS.has(view)) view = 'login';
  if (signedIn && view === 'login') view = 'home';

  const handleAuthed = (nextUser) => {
    setUser(nextUser);
    setGuest(false);
    writeSession('typec_guest', null);
    navigate('welcome');
  };

  const handleGuest = () => {
    setGuest(true);
    writeSession('typec_guest', '1');
    navigate('welcome');
  };

  const handleSignOut = async () => {
    try {
      await post('/auth/logout');
    } catch {
      toast({ kind: 'error', label: 'SIGN OUT', title: 'Could not reach the server', text: 'You were signed out on this device.' });
    }
    setUser(null);
    setGuest(false);
    writeSession('typec_guest', null);
    navigate('login');
  };

  const goToLogin = () => {
    setUser(null);
    setGuest(false);
    writeSession('typec_guest', null);
    navigate('login');
  };

  const openPlayer = (username) => {
    if (user && username.toLowerCase() === user.username.toLowerCase()) {
      navigate('profile');
      return;
    }
    setViewedPlayer(username);
    writeSession('typec_player', username);
    navigate('player');
  };

  const handleStartPractice = (mode) => {
    setSelectedMode(mode);
    navigate('modeselect');
  };

  const handlePlayStyleSelect = (style) => {
    setSelectedPlayStyle(style);
    navigate('prelaunch');
  };

  const openSession = () => {
    setSaveState({ status: 'idle' });
    if (!signedIn || selectedPlayStyle !== 'ranked') {
      sessionRef.current = Promise.resolve(null);
      return;
    }
    sessionRef.current = post('/games/start', { mode: selectedMode, playStyle: selectedPlayStyle })
      .then((data) => data.sessionId)
      .catch((err) => {
        setSaveState({ status: 'error', message: err.message });
        return null;
      });
  };

  const handleLaunch = () => navigate('game');

  const handleGameOver = async (stats) => {
    setGameStats(stats);
    navigate('results');

    if (!signedIn) {
      setSaveState({ status: 'guest' });
      return;
    }
    if (selectedPlayStyle !== 'ranked') {
      setSaveState({ status: 'practice' });
      return;
    }

    const sessionId = await sessionRef.current;
    sessionRef.current = null;
    if (!sessionId) {
      setSaveState((prev) => (prev.status === 'error' ? prev : { status: 'error', message: 'This run could not be linked to your account.' }));
      return;
    }

    setSaveState({ status: 'saving', previousAvg: null });
    try {
      const data = await post(`/games/${sessionId}/finish`, {
        duration: stats.timeElapsed,
        chars: stats.chars,
        errors: stats.errors,
        kills: stats.defeated,
        score: stats.score,
        bestStreak: stats.bestStreak,
      });
      setSaveState({ status: 'saved', data });
      data.newBadges.forEach((badge, i) => {
        setTimeout(() => {
          toast({ kind: 'badge', icon: badge.icon, label: 'ACHIEVEMENT UNLOCKED', title: badge.name, text: badge.description, duration: 5200 });
        }, 900 + i * 1400);
      });
      refreshStats();
    } catch (err) {
      setSaveState({ status: 'error', message: err.message });
    }
  };

  const handleRetry = () => navigate('prelaunch');
  const handleBackToSelect = () => navigate('home');
  const handleLeaderboard = () => navigate('leaderboard');

  const handleThemeToggle = () => {
    const next = !isLight;
    setIsLight(next);
    writeSession('typec_theme', next ? 'light' : 'dark');
  };

  const isGame = view === 'game';

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {!isGame && (
        <Header
          user={user}
          guest={guest}
          onSignOut={handleSignOut}
          isLight={isLight}
          onThemeToggle={handleThemeToggle}
          currentView={view}
          onNavigate={navigate}
        />
      )}
      <main className={isGame ? 'flex-grow' : 'flex-grow flex items-center justify-center px-4 sm:px-6 py-6 sm:py-8 min-h-0'}>
        {view === 'login' && <Login onAuthed={handleAuthed} onGuest={handleGuest} />}
        {view === 'welcome' && <Welcome user={user} onComplete={() => navigate('home')} />}
        {view === 'home' && <Home onStartPractice={handleStartPractice} />}
        {view === 'contact' && <Contact key={user?.username || 'guest'} user={user} />}
        {view === 'about' && <About />}
        {view === 'leaderboard' && <Leaderboard user={user} onViewProfile={openPlayer} onSignIn={() => navigate('login')} />}
        {view === 'profile' && (
          <Profile
            key={user ? 'me' : 'guest'}
            user={user}
            onBack={() => navigate('home')}
            onSignIn={goToLogin}
            onUserChange={setUser}
            onAccountGone={goToLogin}
            onOpenPlayer={openPlayer}
          />
        )}
        {view === 'player' && viewedPlayer && (
          <Profile
            key={viewedPlayer}
            user={user}
            username={viewedPlayer}
            onBack={() => navigate('leaderboard')}
            onSignIn={() => navigate('login')}
          />
        )}
        {view === 'updates' && <UpdatesLogs key="updates" initialTab="pack" onPlay={() => navigate('home')} />}
        {view === 'docs' && <UpdatesLogs key="docs" initialTab="help" onPlay={() => navigate('home')} />}
        {view === 'multiplayer' && <Multiplayer onPractice={() => navigate('home')} />}

        {view === 'modeselect' && (
          <ModeSelect
            mode={selectedMode}
            signedIn={signedIn}
            onSelect={handlePlayStyleSelect}
            onBack={() => navigate('home')}
          />
        )}

        {view === 'prelaunch' && (
          <PreLaunch
            mode={selectedMode}
            onReady={openSession}
            onBack={() => navigate('modeselect')}
            onLaunch={handleLaunch}
          />
        )}

        {view === 'game' && (
          <TypingGame
            mode={selectedMode}
            playStyle={selectedPlayStyle}
            onGameOver={handleGameOver}
            onExit={() => navigate('home')}
          />
        )}

        {view === 'results' && gameStats && (
          <GameResults
            stats={gameStats}
            save={saveState}
            signedIn={signedIn}
            onRetry={handleRetry}
            onBackToSelect={handleBackToSelect}
            onLeaderboard={handleLeaderboard}
            onSignIn={goToLogin}
          />
        )}
      </main>
      {!isGame && <Footer onNavigate={navigate} />}
      <Toasts />
    </div>
  );
}
