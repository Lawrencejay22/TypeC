import React from 'react';
import logo from '../logo/logo.png';

export default function Header({ isAuthenticated, onSignOut, isLight, onThemeToggle, currentView, onNavigate }) {
    const unauthLinks = [
        { key: 'home',        label: 'home' },
        { key: 'leaderboard', label: 'leaderboard' },
        { key: 'about',       label: 'about' },
        { key: 'home',        label: 'practice' },
        { key: 'contact',     label: 'contact' },
        { key: 'updates',     label: 'updates & logs' },
    ];
    const authLinks = [
        { key: 'home',        label: 'practice' },
        { key: 'leaderboard', label: 'leaderboard' },
        { key: 'multiplayer', label: 'multiplayer' },
        { key: 'docs',        label: 'docs' },
        { key: 'updates',     label: 'updates & logs' },
    ];
    const linksToRender = isAuthenticated ? authLinks : unauthLinks;

    return (
        <nav
            className="h-16 w-full px-8 flex justify-between items-center font-mono text-sm tracking-wider sticky top-0 z-50 backdrop-blur-sm shrink-0"
            style={{
                backgroundColor: 'color-mix(in srgb, var(--bg-secondary) 92%, transparent)',
                borderBottom: '1px solid var(--border-subtle)',
            }}
        >
            {/* Left: logo + links */}
            <div className="flex items-center gap-8">
                <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => onNavigate && onNavigate(isAuthenticated ? 'home' : 'login')}
                >
                    <img src={logo} alt="TYPEC logo" className="w-7 h-7 rounded object-contain" />
                    <span className="font-bold tracking-widest text-base ml-1" style={{ color: 'var(--text-primary)' }}>
                        TYPEC
                    </span>
                </div>

                <ul className="hidden md:flex gap-1 justify-center items-center text-xs" style={{ color: 'var(--text-muted)' }}>
                    {linksToRender.map((link) => {
                        const isActive = currentView === link.key || (link.key === 'home' && link.label === 'practice' && currentView === 'home');
                        return (
                            <li
                                key={link.label}
                                onClick={() => onNavigate && onNavigate(link.key)}
                                className="cursor-pointer transition-colors px-3 py-1.5 rounded"
                                style={
                                    isActive
                                        ? { color: 'var(--text-primary)', backgroundColor: 'var(--bg-card)', borderBottom: '2px solid var(--accent)' }
                                        : { color: 'var(--text-muted)' }
                                }
                            >
                                {link.label}
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
                <div
                    className="flex items-center gap-2 rounded-full px-3 py-1 text-xs"
                    style={{ border: '1px solid var(--accent-border)', backgroundColor: 'var(--accent-dim)', color: 'var(--accent)' }}
                >
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent)' }} />
                    <span>0 ONLINE</span>
                </div>

                {isAuthenticated && (
                    <>
                        <button
                            onClick={onThemeToggle}
                            className="text-xs rounded-full px-3 py-1 transition-colors flex items-center gap-1.5"
                            style={{ color: 'var(--text-muted)', border: '1px solid var(--border-color)', backgroundColor: 'transparent' }}
                            title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
                        >
                            {isLight ? (
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
                                </svg>
                            ) : (
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-9H21M3 12H2m15.36-6.36l-.71.71M6.34 17.66l-.71.71M17.66 17.66l.71.71M6.34 6.34l.71.71M12 5a7 7 0 110 14A7 7 0 0112 5z" />
                                </svg>
                            )}
                            {isLight ? 'LIGHT' : 'DARK'}
                        </button>

                        <button
                            onClick={() => onNavigate && onNavigate('profile')}
                            className="text-xs rounded-full px-3 py-1 transition-colors"
                            style={{ color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}
                        >
                            @ profile
                        </button>

                        <button
                            onClick={onSignOut}
                            className="text-xs rounded-full px-3 py-1 transition-colors"
                            style={{ color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}
                            onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = '#ef444460'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                        >
                            sign out
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}