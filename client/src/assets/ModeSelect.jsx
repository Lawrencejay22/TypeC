import React from 'react';

export default function ModeSelect({ mode, onSelect, onBack }) {
    return (
        <div className="w-full max-w-4xl mx-auto animate-in fade-in duration-500">

            {/* Top label */}
            <div className="font-mono text-xs tracking-widest mb-3" style={{ color: 'var(--accent)' }}>
                // SELECT PLAY STYLE
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold tracking-tighter mb-2" style={{ color: 'var(--text-primary)' }}>
                HOW DO YOU WANT TO PLAY?
            </h1>
            <p className="text-sm mb-12" style={{ color: 'var(--text-muted)' }}>
                Choose your session type for <span style={{ color: 'var(--accent)' }}>{mode}</span>. You can always switch later.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

                {/* Practice Card */}
                <button
                    onClick={() => onSelect('practice')}
                    className="rounded-xl p-8 flex flex-col text-left gap-5 transition-all group"
                    style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 0 24px var(--accent-dim)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                    {/* Icon */}
                    <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center font-mono font-bold text-lg"
                        style={{ backgroundColor: 'var(--accent-dim)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }}
                    >
                        ∞
                    </div>

                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                                PRACTICE MODE
                            </h2>
                            <span
                                className="font-mono text-[10px] tracking-widest px-2 py-0.5 rounded"
                                style={{ color: 'var(--accent)', backgroundColor: 'var(--accent-dim)', border: '1px solid var(--accent-border)' }}
                            >
                                FREE
                            </span>
                        </div>
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                            Train at your own pace. No score, no ranking impact, no pressure.
                            Perfect for warming up, learning new syntax, or just grinding reps.
                        </p>
                    </div>

                    <ul className="space-y-2 font-mono text-[11px]" style={{ color: 'var(--text-muted)' }}>
                        {[
                            'Unlimited retries — restart anytime',
                            'No leaderboard impact',
                            'Full error breakdown after session',
                            'Adjustable snippet difficulty',
                        ].map(f => (
                            <li key={f} className="flex items-center gap-2">
                                <span style={{ color: 'var(--accent)' }}>✓</span> {f}
                            </li>
                        ))}
                    </ul>

                    <div
                        className="flex items-center justify-between text-xs font-bold font-mono tracking-widest mt-auto pt-4 transition-colors"
                        style={{ borderTop: '1px solid var(--border-color)', color: 'var(--text-faint)' }}
                    >
                        <span>START PRACTICE →</span>
                        <span style={{ color: 'var(--accent)' }}>∞ sessions</span>
                    </div>
                </button>

                {/* Serious / Ranked Card */}
                <button
                    onClick={() => onSelect('ranked')}
                    className="rounded-xl p-8 flex flex-col text-left gap-5 transition-all group"
                    style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#eab308'; e.currentTarget.style.boxShadow = '0 0 24px rgba(234,179,8,0.12)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                    {/* Icon */}
                    <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center font-mono font-bold text-lg"
                        style={{ backgroundColor: 'rgba(234,179,8,0.10)', border: '1px solid rgba(234,179,8,0.30)', color: '#eab308' }}
                    >
                        ⚔
                    </div>

                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                                SERIOUS MODE
                            </h2>
                            <span
                                className="font-mono text-[10px] tracking-widest px-2 py-0.5 rounded"
                                style={{ color: '#eab308', backgroundColor: 'rgba(234,179,8,0.10)', border: '1px solid rgba(234,179,8,0.30)' }}
                            >
                                RANKED
                            </span>
                        </div>
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                            Enter the ranked arena. Your WPM, accuracy, and errors are scored
                            and pushed to the global leaderboard. One shot — make it count.
                        </p>
                    </div>

                    <ul className="space-y-2 font-mono text-[11px]" style={{ color: 'var(--text-muted)' }}>
                        {[
                            'Score submitted to leaderboard',
                            'Live WPM & accuracy tracking',
                            'Timed session — no restarts',
                            'Rank points won or lost',
                        ].map(f => (
                            <li key={f} className="flex items-center gap-2">
                                <span style={{ color: '#eab308' }}>⚡</span> {f}
                            </li>
                        ))}
                    </ul>

                    <div
                        className="flex items-center justify-between text-xs font-bold font-mono tracking-widest mt-auto pt-4 transition-colors"
                        style={{ borderTop: '1px solid var(--border-color)', color: 'var(--text-faint)' }}
                    >
                        <span>ENTER ARENA →</span>
                        <span style={{ color: '#eab308' }}>affects rank</span>
                    </div>
                </button>
            </div>

            {/* Back */}
            <button
                onClick={onBack}
                className="font-mono text-xs tracking-widest px-6 py-3 rounded transition-colors"
                style={{ color: 'var(--text-muted)', border: '1px solid var(--border-color)', backgroundColor: 'transparent' }}
            >
                ← BACK
            </button>
        </div>
    );
}
