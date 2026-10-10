import { useEffect, useState } from 'react';

const LANG_COLOR = {
    HTML: '#f97316', CSS: '#3b82f6', JAVASCRIPT: '#facc15',
    TYPESCRIPT: '#2563eb', PYTHON: '#00E572', 'SQL & RUST': '#ef4444',
    GO: '#00ADD8', 'C++': '#b45309', REGEX: '#e879f9', RANDOM: '#a855f7',
};

function compareLine(save, wpm, signedIn) {
    if (!signedIn) return 'NOT SAVED';
    if (save.status === 'practice') return 'PRACTICE';
    if (save.status === 'saving' || save.status === 'idle') return 'SAVING...';
    if (save.status !== 'saved') return 'NOT SAVED';
    const { races, avgWpm } = save.data.stats;
    if (races <= 1) return 'FIRST RUN';
    const previous = (avgWpm * races - wpm) / (races - 1);
    const diff = Math.round(wpm - previous);
    if (diff === 0) return 'SAME AS YOUR AVERAGE';
    return `${diff > 0 ? '+' : ''}${diff} VS YOUR AVERAGE`;
}

function SaveBanner({ save, signedIn, onSignIn, color }) {
    if (!signedIn) {
        return (
            <div className="tc-save-banner">
                <span>Guest runs aren't saved.</span>
                <button type="button" onClick={onSignIn} style={{ color }}>SIGN IN TO SAVE →</button>
            </div>
        );
    }
    if (save.status === 'practice') {
        return <div className="tc-save-banner"><span>Practice run. Pick Ranked to save your score.</span></div>;
    }
    if (save.status === 'saving' || save.status === 'idle') {
        return <div className="tc-save-banner"><span>Saving your run...</span></div>;
    }
    if (save.status === 'error') {
        return <div className="tc-save-banner is-error"><span>Run not saved: {save.message}</span></div>;
    }
    const { rank, personalBest } = save.data;
    return (
        <div className="tc-save-banner is-ok">
            <span>✓ Saved</span>
            <span>Rank <strong style={{ color }}>#{rank}</strong></span>
            {personalBest && <span className="tc-pb">★ NEW BEST</span>}
        </div>
    );
}

const RANK_STYLES = {
    'S-TIER': { color: '#00E572',  label: 'S-TIER', glow: 'rgba(0,229,114,0.25)' },
    'A-TIER': { color: '#3b82f6',  label: 'A-TIER', glow: 'rgba(59,130,246,0.25)' },
    'B-TIER': { color: '#eab308',  label: 'B-TIER', glow: 'rgba(234,179,8,0.25)' },
    'C-TIER': { color: '#f97316',  label: 'C-TIER', glow: 'rgba(249,115,22,0.25)' },
    'D-TIER': { color: '#ef4444',  label: 'D-TIER', glow: 'rgba(239,68,68,0.25)' },
};

function useCounter(target, duration = 1200) {
    const [val, setVal] = useState(0);
    useEffect(() => {
        let start = null;
        const step = (ts) => {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            setVal(Math.floor(progress * target));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [target, duration]);
    return val;
}

function StatCard({ label, value, accent }) {
    return (
        <div
            className="rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center gap-1 text-center"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
        >
            <div className="font-mono text-[10px] tracking-widest mb-1 sm:mb-2" style={{ color: 'var(--text-faint)' }}>
                {label}
            </div>
            <div className="text-2xl sm:text-3xl font-bold" style={{ color: accent || 'var(--text-primary)' }}>
                {value}
            </div>
        </div>
    );
}

export default function GameResults({ stats, save, signedIn, onRetry, onBackToSelect, onLeaderboard, onSignIn }) {
    const saved = save.status === 'saved' ? save.data : null;
    const { score, defeated, errors, timeElapsed, mode, playStyle } = stats;
    const wpm      = saved ? saved.result.wpm : stats.wpm;
    const accuracy = saved ? saved.result.accuracy : stats.accuracy;
    const rank     = saved ? saved.result.grade : stats.rank;
    const newBadges = saved ? saved.newBadges : [];
    const color      = LANG_COLOR[mode] || '#00E572';
    const rankStyle  = RANK_STYLES[rank] || RANK_STYLES['D-TIER'];

    const animWpm      = useCounter(wpm,      1000);
    const animAcc      = useCounter(accuracy, 1200);
    const animScore    = useCounter(score,    1400);
    const animDefeated = useCounter(defeated, 900);

    const minutes = Math.floor(timeElapsed / 60);
    const secs    = String(timeElapsed % 60).padStart(2, '0');

    const message = {
        'S-TIER': 'Flawless.',
        'A-TIER': 'Great run.',
        'B-TIER': 'Solid.',
        'C-TIER': 'Keep going.',
    }[rank] || 'Warm-up done.';

    return (
        <div className="w-full max-w-3xl mx-auto py-2 sm:py-6">
            <div className="text-center mb-8">
                <div className="font-mono text-[11px] tracking-widest mb-3" style={{ color: 'var(--text-faint)' }}>
                    <span style={{ color }}>{mode}</span>
                    <span> · </span>
                    <span style={{ color: playStyle === 'ranked' ? '#eab308' : 'var(--accent)' }}>
                        {playStyle === 'ranked' ? 'RANKED' : 'PRACTICE'}
                    </span>
                </div>
                <h1 className="text-4xl sm:text-6xl font-black tracking-tighter mb-2" style={{ color: 'var(--text-primary)' }}>
                    RESULTS<span style={{ color }}>.</span>
                </h1>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{message}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div
                    className="rounded-xl p-5 sm:p-8 flex flex-col items-center justify-center text-center"
                    style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                >
                    <div className="font-mono text-[10px] tracking-widest mb-2 sm:mb-3" style={{ color: 'var(--text-faint)' }}>WPM</div>
                    <div className="text-5xl sm:text-6xl font-black" style={{ color: 'var(--text-primary)' }}>{animWpm}</div>
                    <div className="font-mono text-[10px] tracking-widest mt-2" style={{ color: 'var(--text-faint)' }}>
                        {compareLine(save, wpm, signedIn)}
                    </div>
                </div>

                <div
                    className="rounded-xl p-5 sm:p-8 flex flex-col items-center justify-center text-center"
                    style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                >
                    <div className="font-mono text-[10px] tracking-widest mb-2 sm:mb-3" style={{ color: 'var(--text-faint)' }}>ACCURACY</div>
                    <div className="text-5xl sm:text-6xl font-black" style={{ color: 'var(--text-primary)' }}>
                        {animAcc}<span className="text-2xl sm:text-3xl" style={{ color: 'var(--text-faint)' }}>%</span>
                    </div>
                    <div className="font-mono text-[10px] tracking-widest mt-2" style={{ color: 'var(--text-faint)' }}>
                        {errors} {errors === 1 ? 'MISTAKE' : 'MISTAKES'}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <StatCard label="SCORE" value={animScore.toLocaleString()} />
                <StatCard label="KILLS" value={animDefeated} accent={color} />
                <StatCard label="TIME" value={`${minutes}:${secs}`} />
                <div
                    className="rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center gap-1 text-center"
                    style={{
                        backgroundColor: 'var(--bg-card)',
                        border: `1px solid ${rankStyle.color}50`,
                        boxShadow: `0 0 20px ${rankStyle.glow}`,
                    }}
                >
                    <div className="font-mono text-[10px] tracking-widest mb-1 sm:mb-2" style={{ color: 'var(--text-faint)' }}>GRADE</div>
                    <div className="text-xl sm:text-2xl font-bold" style={{ color: rankStyle.color }}>{rankStyle.label}</div>
                </div>
            </div>

            <SaveBanner save={save} signedIn={signedIn} onSignIn={onSignIn} color={color} />

            {newBadges.length > 0 && (
                <div className="tc-new-badges">
                    <div className="tc-new-badges-label">NEW BADGES</div>
                    <div className="tc-new-badges-list">
                        {newBadges.map((badge, i) => (
                            <div key={badge.key} className="tc-new-badge" style={{ animationDelay: `${0.9 + i * 0.25}s` }}>
                                <span className="tc-new-badge-icon">{badge.icon}</span>
                                <span className="tc-new-badge-name">{badge.name}</span>
                                <span className="tc-new-badge-desc">{badge.description}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 mb-6">
                <button
                    onClick={onRetry}
                    className="font-mono font-bold text-xs tracking-widest px-10 py-3.5 rounded-lg transition-transform hover:scale-105"
                    style={{ backgroundColor: color, color: '#0b0e14', boxShadow: `0 0 20px ${color}40` }}
                >
                    PLAY AGAIN ↺
                </button>
                <button
                    onClick={onLeaderboard}
                    className="font-mono text-xs tracking-widest px-8 py-3.5 rounded-lg transition-colors"
                    style={{ color: 'var(--text-primary)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}
                >
                    LEADERBOARD
                </button>
            </div>

            <div className="text-center">
                <button
                    onClick={onBackToSelect}
                    className="font-mono text-[11px] tracking-widest transition-opacity hover:opacity-70"
                    style={{ color: 'var(--text-faint)' }}
                >
                    ← CHANGE LANGUAGE
                </button>
            </div>
        </div>
    );
}
