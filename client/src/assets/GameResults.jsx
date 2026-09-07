import React, { useEffect, useState } from 'react';

const LANG_COLOR = {
    HTML: '#f97316', CSS: '#3b82f6', JAVASCRIPT: '#facc15',
    TYPESCRIPT: '#2563eb', PYTHON: '#00E572', 'SQL & RUST': '#ef4444',
};

const RANK_STYLES = {
    'S-TIER': { color: '#00E572',  label: 'S-TIER', glow: 'rgba(0,229,114,0.25)' },
    'A-TIER': { color: '#3b82f6',  label: 'A-TIER', glow: 'rgba(59,130,246,0.25)' },
    'B-TIER': { color: '#eab308',  label: 'B-TIER', glow: 'rgba(234,179,8,0.25)' },
    'C-TIER': { color: '#f97316',  label: 'C-TIER', glow: 'rgba(249,115,22,0.25)' },
    'D-TIER': { color: '#ef4444',  label: 'D-TIER', glow: 'rgba(239,68,68,0.25)' },
};

// Animated counter hook
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

function StatCard({ label, value, sub, accent, large }) {
    return (
        <div
            className="rounded-xl p-6 flex flex-col items-center justify-center gap-1 text-center"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
        >
            <div className="font-mono text-[10px] tracking-widest mb-2" style={{ color: 'var(--text-faint)' }}>
                {label}
            </div>
            <div
                className={`font-bold ${large ? 'text-5xl' : 'text-3xl'}`}
                style={{ color: accent || 'var(--text-primary)' }}
            >
                {value}
                {sub && <span className="text-sm ml-1" style={{ color: 'var(--text-faint)' }}>{sub}</span>}
            </div>
        </div>
    );
}

export default function GameResults({ stats, onRetry, onBackToSelect, onLeaderboard }) {
    const { score, wpm, accuracy, defeated, errors, timeElapsed, rank, mode, playStyle } = stats;
    const color      = LANG_COLOR[mode] || '#00E572';
    const rankStyle  = RANK_STYLES[rank] || RANK_STYLES['D-TIER'];

    // Animated values
    const animWpm      = useCounter(wpm,      1000);
    const animAcc      = useCounter(accuracy, 1200);
    const animScore    = useCounter(score,    1400);
    const animDefeated = useCounter(defeated, 900);

    const minutes = Math.floor(timeElapsed / 60);
    const secs    = String(timeElapsed % 60).padStart(2, '0');

    // Performance message
    const message = wpm >= 90 ? 'FLAWLESS EXECUTION.' :
                    wpm >= 70 ? 'MISSION ACCOMPLISHED.' :
                    wpm >= 50 ? 'SOLID PERFORMANCE.' :
                    wpm >= 30 ? 'KEEP TRAINING.' :
                                'BACK TO THE BUNKER.';

    return (
        <div className="w-full max-w-3xl mx-auto animate-in fade-in duration-700">

            {/* Breadcrumb */}
            <div className="font-mono text-[10px] tracking-widest mb-6 flex items-center gap-2" style={{ color: 'var(--text-faint)' }}>
                <span>// MISSION COMPLETE</span>
                <span>—</span>
                <span style={{ color }}>{mode}</span>
                <span>—</span>
                <span style={playStyle === 'ranked'
                    ? { color: '#eab308' }
                    : { color: 'var(--accent)' }
                }>
                    {playStyle === 'ranked' ? '⚔ RANKED' : '∞ PRACTICE'}
                </span>
            </div>

            {/* Title */}
            <div className="text-center mb-10">
                <div className="font-mono text-xs tracking-widest mb-3" style={{ color: 'var(--text-faint)' }}>
                    // MISSION COMPLETED — {mode}
                </div>
                <h1 className="text-6xl font-black tracking-tighter mb-2" style={{ color: 'var(--text-primary)' }}>
                    RESULTS<span style={{ color }}>.</span>
                </h1>
                <p className="font-mono text-sm tracking-widest" style={{ color: 'var(--text-muted)' }}>
                    {message}
                </p>
            </div>

            {/* Top two big stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div
                    className="rounded-xl p-8 flex flex-col items-center justify-center text-center"
                    style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                >
                    <div className="font-mono text-[10px] tracking-widest mb-3" style={{ color: 'var(--text-faint)' }}>
                        SPEED PER MINUTE
                    </div>
                    <div className="text-6xl font-black" style={{ color: 'var(--text-primary)' }}>
                        {animWpm}
                    </div>
                    <div className="font-mono text-[10px] tracking-widest mt-2" style={{ color: 'var(--text-faint)' }}>
                        +42 FROM AVERAGE
                    </div>
                </div>

                <div
                    className="rounded-xl p-8 flex flex-col items-center justify-center text-center"
                    style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                >
                    <div className="font-mono text-[10px] tracking-widest mb-3" style={{ color: 'var(--text-faint)' }}>
                        ACCURACY
                    </div>
                    <div className="text-6xl font-black" style={{ color: 'var(--text-primary)' }}>
                        {animAcc}<span className="text-3xl" style={{ color: 'var(--text-faint)' }}>%</span>
                    </div>
                    <div className="font-mono text-[10px] tracking-widest mt-2" style={{ color: 'var(--text-faint)' }}>
                        {errors} TOTAL MISTAKES
                    </div>
                </div>
            </div>

            {/* Bottom stats row */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                <StatCard label="TOTAL SCORE"     value={animScore.toLocaleString()} />
                <StatCard label="TIME ELAPSED"    value={`${minutes}:${secs}`} />
                <StatCard label="ENEMIES DEFEATED" value={animDefeated} accent={color} />
                <div
                    className="rounded-xl p-6 flex flex-col items-center justify-center gap-1 text-center"
                    style={{
                        backgroundColor: 'var(--bg-card)',
                        border: `1px solid ${rankStyle.color}50`,
                        boxShadow: `0 0 20px ${rankStyle.glow}`,
                    }}
                >
                    <div className="font-mono text-[10px] tracking-widest mb-2" style={{ color: 'var(--text-faint)' }}>
                        CURRENT RANK
                    </div>
                    <div className="text-2xl font-bold" style={{ color: rankStyle.color }}>
                        {rankStyle.label}
                    </div>
                </div>
            </div>

            {/* CTA buttons */}
            <div className="flex items-center justify-center gap-4 mb-6">
                <button
                    onClick={onRetry}
                    className="font-mono font-bold text-xs tracking-widest px-10 py-3.5 rounded-lg transition-all hover:scale-105"
                    style={{ backgroundColor: color, color: '#0b0e14', boxShadow: `0 0 20px ${color}40` }}
                >
                    RETRY ↺
                </button>
                {playStyle === 'ranked' && (
                    <button
                        onClick={onLeaderboard}
                        className="font-mono text-xs tracking-widest px-8 py-3.5 rounded-lg transition-colors"
                        style={{ color: 'var(--text-primary)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}
                    >
                        [ LEADERBOARD ]
                    </button>
                )}
            </div>

            {/* Back link */}
            <div className="text-center">
                <button
                    onClick={onBackToSelect}
                    className="font-mono text-[11px] tracking-widest transition-colors hover:opacity-80"
                    style={{ color: 'var(--text-faint)' }}
                >
                    ← BACK TO MISSION SELECT
                </button>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center mt-10 font-mono text-[10px] tracking-widest" style={{ color: 'var(--text-faint)' }}>
                <span>GLOBAL_GL_2061 • {mode} • {playStyle?.toUpperCase()}</span>
                <div className="flex items-center gap-3">
                    <span style={{ color }}>● ONLINE</span>
                    <span>TYPEC v2.2.0-STABLE</span>
                </div>
            </div>
        </div>
    );
}
