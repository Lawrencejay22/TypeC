import { categoriesFor } from './snippets.js';

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

const ROUND_LENGTHS = [15, 30];

function Chip({ active, onClick, children, title }) {
    return (
        <button type="button" onClick={onClick} title={title} className={`tc-chip ${active ? 'is-active' : ''}`} aria-pressed={active}>
            {children}
        </button>
    );
}

export default function ModeSelect({ mode, signedIn, category, roundSeconds, onSetup, onSelect, onBack }) {
    const categories = categoriesFor(mode);
    const picked = categories.find((c) => c.key === category);

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

            <div className="tc-setup mb-6">
                <div className="tc-setup-row">
                    <span className="tc-setup-label">Category</span>
                    <div className="tc-chips">
                        <Chip active={category === 'mixed'} onClick={() => onSetup({ category: 'mixed' })} title="A different category every round">
                            Mixed
                        </Chip>
                        {categories.map((c) => (
                            <Chip key={c.key} active={category === c.key} onClick={() => onSetup({ category: c.key })} title={c.hint}>
                                {c.label}
                            </Chip>
                        ))}
                    </div>
                </div>
                <div className="tc-setup-row">
                    <span className="tc-setup-label">Each round</span>
                    <div className="tc-chips">
                        {ROUND_LENGTHS.map((sec) => (
                            <Chip key={sec} active={roundSeconds === sec} onClick={() => onSetup({ roundSeconds: sec })}>
                                {sec}s
                            </Chip>
                        ))}
                    </div>
                </div>
                <p className="tc-setup-note">
                    {picked
                        ? `Only ${picked.label.toLowerCase()} for the whole game, with a short break every ${roundSeconds}s.`
                        : `The category changes every ${roundSeconds}s, and the screen tells you which one is next.`}
                </p>
            </div>

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
