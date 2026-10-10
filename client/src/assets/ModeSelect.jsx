const STYLES = [
    {
        key: 'practice',
        icon: '∞',
        title: 'Practice',
        text: 'Warm up. Nothing is saved.',
        color: 'var(--accent)',
        tint: 'var(--accent-dim)',
        border: 'var(--accent-border)',
    },
    {
        key: 'ranked',
        icon: '⚔',
        title: 'Ranked',
        text: 'Saved to your profile, leaderboard and badges.',
        color: '#eab308',
        tint: 'rgba(234,179,8,0.10)',
        border: 'rgba(234,179,8,0.35)',
    },
];

export default function ModeSelect({ mode, signedIn, onSelect, onBack }) {
    return (
        <div className="w-full max-w-3xl mx-auto py-4 sm:py-8">
            <button
                type="button"
                onClick={onBack}
                className="font-mono text-xs tracking-widest mb-6 transition-opacity hover:opacity-70"
                style={{ color: 'var(--text-muted)' }}
            >
                ← {mode}
            </button>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-8" style={{ color: 'var(--text-primary)' }}>
                How do you want to play?
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {STYLES.map((style) => (
                    <button
                        key={style.key}
                        type="button"
                        onClick={() => onSelect(style.key)}
                        className="tc-pick rounded-xl p-6 flex items-center sm:items-start sm:flex-col gap-4 text-left"
                        style={{ '--pick': style.color }}
                    >
                        <span
                            className="w-12 h-12 shrink-0 rounded-lg flex items-center justify-center font-mono font-bold text-xl"
                            style={{ backgroundColor: style.tint, border: `1px solid ${style.border}`, color: style.color }}
                        >
                            {style.icon}
                        </span>
                        <span className="flex flex-col gap-1">
                            <span className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{style.title}</span>
                            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                {style.key === 'ranked' && !signedIn ? 'Sign in to save ranked runs.' : style.text}
                            </span>
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
