import logo from '../logo/logo.png';
import './header.css';

const LINKS = [
    { key: 'home',        label: 'practice' },
    { key: 'leaderboard', label: 'leaderboard' },
    { key: 'multiplayer', label: 'multiplayer' },
    { key: 'docs',        label: 'docs' },
    { key: 'updates',     label: 'updates & logs' },
];

const PRACTICE_VIEWS = new Set(['home', 'modeselect', 'briefing', 'prelaunch', 'results']);

export default function Header({ isAuthenticated, onSignOut, isLight, onThemeToggle, currentView, onNavigate, onlineCount = 0 }) {
    const go = (view) => onNavigate && onNavigate(view);

    const isActive = (key) => key === 'home' ? PRACTICE_VIEWS.has(currentView) : currentView === key;

    return (
        <nav className="tc-header">
            <div className="tc-header-left">
                <button type="button" className="tc-brand" onClick={() => go(isAuthenticated ? 'home' : 'login')}>
                    <img src={logo} alt="" className="tc-brand-logo" />
                    <span>TYPEC</span>
                </button>

                <ul className="tc-nav">
                    {LINKS.map((link) => (
                        <li key={link.key}>
                            <button
                                type="button"
                                className={isActive(link.key) ? 'is-active' : ''}
                                onClick={() => go(link.key)}
                            >
                                {link.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="tc-header-right">
                <div className="tc-online">
                    <span className="tc-online-dot" />
                    <span>{onlineCount.toLocaleString('en-US')} ONLINE</span>
                </div>

                {isAuthenticated && (
                    <>
                        <button
                            type="button"
                            className="tc-theme"
                            onClick={onThemeToggle}
                            title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
                        >
                            <span className="tc-theme-icon">{isLight ? '☀' : '*'}</span>
                            {isLight ? 'LIGHT' : 'DARK'}
                        </button>

                        <span className="tc-divider" />

                        <button
                            type="button"
                            className={`tc-profile ${currentView === 'profile' ? 'is-active' : ''}`}
                            onClick={() => go('profile')}
                        >
                            <span className="tc-profile-avatar">P</span>
                            profile
                        </button>

                        <button type="button" className="tc-signout" onClick={onSignOut}>
                            sign out
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}
