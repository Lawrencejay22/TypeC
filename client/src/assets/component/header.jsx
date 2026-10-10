import { useEffect, useState } from 'react';
import Logo from './Logo.jsx';
import { useLiveStats } from '../../live.js';
import './header.css';

const LINKS = [
    { key: 'home',        label: 'practice' },
    { key: 'leaderboard', label: 'leaderboard' },
    { key: 'multiplayer', label: 'multiplayer' },
    { key: 'docs',        label: 'docs' },
    { key: 'updates',     label: 'updates & logs' },
];

const PRACTICE_VIEWS = new Set(['home', 'modeselect', 'briefing', 'prelaunch', 'results']);

export default function Header({ user, guest, onSignOut, isLight, onThemeToggle, currentView, onNavigate }) {
    const stats = useLiveStats();
    const [menuOpen, setMenuOpen] = useState(false);
    const go = (view) => {
        setMenuOpen(false);
        if (onNavigate) onNavigate(view);
    };
    const canPlay = Boolean(user) || guest;

    const isActive = (key) => key === 'home' ? PRACTICE_VIEWS.has(currentView) : currentView === key;

    useEffect(() => {
        if (!menuOpen) return undefined;
        const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [menuOpen]);

    const signOut = () => {
        setMenuOpen(false);
        onSignOut();
    };

    return (
        <nav className={`tc-header ${menuOpen ? 'is-menu-open' : ''}`}>
            <div className="tc-header-left">
                <button type="button" className="tc-brand" onClick={() => go(canPlay ? 'home' : 'login')}>
                    <Logo size={18} />
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
                <div className="tc-online" title="Signed-in players active in the last 2 minutes">
                    <span className="tc-online-dot" />
                    <span>{stats ? stats.online.toLocaleString('en-US') : '—'} ONLINE</span>
                </div>

                <button
                    type="button"
                    className="tc-theme"
                    onClick={onThemeToggle}
                    title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
                    aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
                >
                    <span className="tc-theme-icon">{isLight ? '☀' : '*'}</span>
                    <span className="tc-theme-label">{isLight ? 'LIGHT' : 'DARK'}</span>
                </button>

                <span className="tc-divider" />

                {user ? (
                    <>
                        <button
                            type="button"
                            className={`tc-profile ${currentView === 'profile' ? 'is-active' : ''}`}
                            onClick={() => go('profile')}
                        >
                            <span className="tc-profile-avatar">{user.username.charAt(0).toUpperCase()}</span>
                            {user.username}
                        </button>

                        <button type="button" className="tc-signout" onClick={signOut}>
                            sign out
                        </button>
                    </>
                ) : (
                    <button
                        type="button"
                        className={`tc-profile ${currentView === 'login' ? 'is-active' : ''}`}
                        onClick={guest ? signOut : () => go('login')}
                    >
                        <span className="tc-profile-avatar">{guest ? 'G' : '→'}</span>
                        {guest ? 'guest · sign in' : 'sign in'}
                    </button>
                )}

                <button
                    type="button"
                    className="tc-menu-btn"
                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((open) => !open)}
                >
                    <span />
                    <span />
                    <span />
                </button>
            </div>

            {menuOpen && (
                <>
                    <div className="tc-menu-backdrop" onClick={() => setMenuOpen(false)} />
                    <div className="tc-menu">
                        {LINKS.map((link) => (
                            <button
                                key={link.key}
                                type="button"
                                className={isActive(link.key) ? 'is-active' : ''}
                                onClick={() => go(link.key)}
                            >
                                {link.label}
                            </button>
                        ))}

                        <div className="tc-menu-rule" />

                        {user ? (
                            <>
                                <button
                                    type="button"
                                    className={currentView === 'profile' ? 'is-active' : ''}
                                    onClick={() => go('profile')}
                                >
                                    profile · {user.username}
                                </button>
                                <button type="button" className="is-muted" onClick={signOut}>sign out</button>
                            </>
                        ) : (
                            <button type="button" onClick={guest ? signOut : () => go('login')}>
                                {guest ? 'sign in (leave guest mode)' : 'sign in'}
                            </button>
                        )}

                        <p className="tc-menu-online">
                            <span className="tc-online-dot" />
                            {stats ? stats.online.toLocaleString('en-US') : '—'} online now
                        </p>
                    </div>
                </>
            )}
        </nav>
    );
}
