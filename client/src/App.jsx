import { useState, useEffect } from 'react'
import './index.css'
import Header from './assets/component/header.jsx'
import Footer from './assets/component/footer.jsx'
import Login from './assets/login.jsx'
import Welcome from './assets/Welcome.jsx'
import Home from './assets/home.jsx'
import ModeSelect from './assets/ModeSelect.jsx'
import MissionBriefing from './assets/MissionBriefing.jsx'
import PreLaunch from './assets/PreLaunch.jsx'
import TypingGame from './assets/TypingGame.jsx'
import GameResults from './assets/GameResults.jsx'

const TRANSIENT_VIEWS = new Set(['welcome', 'modeselect', 'briefing', 'prelaunch', 'game', 'results']);

export default function App() {
  const [currentView, setCurrentView] = useState(() => {
    const saved = sessionStorage.getItem('typec_view');
    return TRANSIENT_VIEWS.has(saved) ? 'home' : (saved || 'login');
  });

  const [selectedMode,      setSelectedMode]      = useState(null);
  const [selectedPlayStyle, setSelectedPlayStyle] = useState(null);
  const [gameStats,         setGameStats]         = useState(null);

  const [isLight, setIsLight] = useState(() => {
    return sessionStorage.getItem('typec_theme') === 'light';
  });

  useEffect(() => {
    if (isLight) document.documentElement.classList.add('light');
  }, []);

  const navigate = (view) => {
    sessionStorage.setItem('typec_view', view);
    setCurrentView(view);
  };
  
  const handleLoginSuccess    = () => navigate('welcome');
  const handleWelcomeComplete = () => navigate('home');
  const handleSignOut = () => {
    sessionStorage.removeItem('typec_view');
    setCurrentView('login');
  };

  const handleStartPractice = (mode) => {
    setSelectedMode(mode);
    navigate('modeselect');
  };
  
  const handlePlayStyleSelect = (style) => {
    setSelectedPlayStyle(style);
    navigate('briefing');
  };

  const handleBriefingStart = () => navigate('prelaunch');

  const handleLaunch = () => navigate('game');

  const handleGameOver = (stats) => {
    setGameStats(stats);
    navigate('results');
  };

  const handleRetry = () => navigate('prelaunch');

  const handleBackToSelect = () => navigate('home');

  const handleLeaderboard = () => navigate('home');

  const handleThemeToggle = () => {
    const next = !isLight;
    setIsLight(next);
    document.documentElement.classList.toggle('light', next);
    sessionStorage.setItem('typec_theme', next ? 'light' : 'dark');
  };

  const isAuthenticated = currentView !== 'login';
  const isGame = currentView === 'game';

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {!isGame && (
        <Header
          isAuthenticated={isAuthenticated}
          onSignOut={handleSignOut}
          isLight={isLight}
          onThemeToggle={handleThemeToggle}
          currentView={currentView}
          onNavigate={navigate}
        />
      )}
      <main className={isGame ? 'flex-grow' : 'flex-grow flex items-center justify-center px-6 py-8 min-h-0'}>
        {currentView === 'login'      && <Login onLoginSuccess={handleLoginSuccess} />}
        {currentView === 'welcome'    && <Welcome onComplete={handleWelcomeComplete} />}
        {currentView === 'home'       && <Home onStartPractice={handleStartPractice} />}

        {currentView === 'modeselect' && (
          <ModeSelect
            mode={selectedMode}
            onSelect={handlePlayStyleSelect}
            onBack={() => navigate('home')}
          />
        )}

        {currentView === 'briefing' && (
          <MissionBriefing
            mode={selectedMode}
            playStyle={selectedPlayStyle}
            onBack={() => navigate('modeselect')}
            onStart={handleBriefingStart}
          />
        )}

        {currentView === 'prelaunch' && (
          <PreLaunch
            mode={selectedMode}
            onBack={() => navigate('briefing')}
            onLaunch={handleLaunch}
          />
        )}

        {currentView === 'game' && (
          <TypingGame
            mode={selectedMode}
            playStyle={selectedPlayStyle}
            onGameOver={handleGameOver}
            onExit={() => navigate('home')}
          />
        )}

        {currentView === 'results' && gameStats && (
          <GameResults
            stats={gameStats}
            onRetry={handleRetry}
            onBackToSelect={handleBackToSelect}
            onLeaderboard={handleLeaderboard}
          />
        )}
      </main>
      {!isGame && <Footer />}
    </div>
  );
}
