import { useState } from 'react';

const tiers = [
    {
        id: 1,
        label: 'EASY',
        badge: 'BEGINNER FRIENDLY',
        badgeStyle: { backgroundColor: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent-border)' },
        hoverText: 'var(--accent)',
        cards: [
            { dot: '#f97316', name: 'HTML',       wpm: 60, desc: 'Tags, attributes, semantic layout hierarchy, head elements, inline vs block tags.' },
            { dot: '#3b82f6', name: 'CSS',        wpm: 65, desc: 'Selectors, Flexbox properties, Grid coordinates, keyframe animations, units.' },
            { dot: '#facc15', name: 'JAVASCRIPT', wpm: 75, desc: 'Higher-order array methods, ES6 arrow functions, async/await, destructured params.' },
        ],
    },
    {
        id: 2,
        label: 'MEDIUM',
        badge: 'INTERMEDIATE',
        badgeStyle: { backgroundColor: 'rgba(234,179,8,0.10)', color: '#eab308', border: '1px solid rgba(234,179,8,0.20)' },
        hoverText: '#eab308',
        cards: [
            { dot: '#2563eb',       name: 'TYPESCRIPT', wpm: 80, desc: 'Generics, discriminated unions, utility types, mapped types, strict null checks.' },
            { dot: 'var(--accent)', name: 'PYTHON',     wpm: 75, desc: 'List comprehensions, decorators, dataclasses, generators, strict indent timing.' },
            { dot: '#ef4444',       name: 'SQL & RUST', wpm: 90, desc: 'Recursive CTEs, indexing clauses, pattern matching, borrow checker syntax.' },
        ],
    },
    {
        id: 3,
        label: 'HARD',
        badge: 'EXPERT ONLY',
        badgeStyle: { backgroundColor: 'rgba(239,68,68,0.10)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)' },
        hoverText: '#ef4444',
        cards: [
            { dot: '#00ADD8', name: 'GO',    wpm: 95,  desc: 'Goroutines, channels, interfaces, defer/panic/recover, struct embedding, context patterns.' },
            { dot: '#b45309', name: 'C++',   wpm: 100, desc: 'Templates, RAII, smart pointers, move semantics, lambda captures, constexpr expressions.' },
            { dot: '#e879f9', name: 'REGEX', wpm: 110, desc: 'Lookaheads, backreferences, named groups, character classes, quantifiers, anchors.' },
        ],
    },
];

const filters = [
    { key: 'all', label: 'All Modes' },
    { key: 'easy', label: 'Easy // Beginner' },
    { key: 'medium', label: 'Medium // Intermediate' },
    { key: 'hard', label: 'Hard // Expert' },
];

function Card({ dot, name, wpm, desc, hoverText, onStartPractice }) {
    return (
        <div
            className="rounded-xl p-6 flex flex-col h-full transition-all cursor-pointer"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = hoverText; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; }}
        >
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dot }} />
                    {name}
                </h3>
                <span
                    className="text-[10px] font-mono rounded px-2 py-1"
                    style={{ color: 'var(--text-faint)', border: '1px solid var(--border-color)' }}
                >
                    {wpm} WPM TARGET
                </span>
            </div>
            <p className="text-xs leading-relaxed flex-grow" style={{ color: 'var(--text-muted)' }}>{desc}</p>
            <div
                onClick={() => onStartPractice(name)}
                className="mt-8 pt-4 flex justify-between items-center text-xs font-bold transition-colors cursor-pointer"
                style={{ borderTop: '1px solid var(--border-color)', color: 'var(--text-faint)' }}
                onMouseEnter={e => { e.currentTarget.style.color = hoverText; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-faint)'; }}
            >
                <span>START PRACTICE</span>
                <span>→</span>
            </div>
        </div>
    );
}

export default function SelectMode({ onStartPractice }) {
    const [activeFilter, setActiveFilter] = useState('all');

    const visibleTiers = tiers.filter(tier => {
        if (activeFilter === 'all')    return true;
        if (activeFilter === 'easy')   return tier.id === 1;
        if (activeFilter === 'medium') return tier.id === 2;
        if (activeFilter === 'hard')   return tier.id === 3;
        return true;
    });

    return (
        <div className="w-full max-w-7xl mx-auto flex flex-col gap-10 py-8 animate-in fade-in duration-500">
            <div
                className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 pb-8"
                style={{ borderBottom: '1px solid var(--border-subtle)' }}
            >
                <div className="max-w-2xl">
                    <div className="font-mono text-xs tracking-widest mb-4" style={{ color: 'var(--accent)' }}>
                        // CHOOSE YOUR LANGUAGE &amp; DIFFICULTY
                    </div>
                    <h1 className="text-5xl lg:text-6xl font-bold tracking-tighter mb-4" style={{ color: 'var(--text-primary)' }}>
                        SELECT{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E572] to-[#00b359]">MODE</span>
                    </h1>
                    <p className="text-sm md:text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        Benchmark real-world programming syntaxes. Build muscle memory on genuine snippets, keywords, and code structures.
                    </p>
                </div>

                <div
                    className="flex gap-8 rounded-xl p-6"
                    style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                >
                    <div>
                        <div className="text-[10px] font-mono tracking-widest mb-2 uppercase" style={{ color: 'var(--text-faint)' }}>ACTIVE DEV</div>
                        <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>84K+</div>
                    </div>
                    <div>
                        <div className="text-[10px] font-mono tracking-widest mb-2 uppercase" style={{ color: 'var(--text-faint)' }}>TOP RECORD</div>
                        <div className="text-2xl font-bold">
                            <span style={{ color: 'var(--accent)' }}>248</span>{' '}
                            <span className="text-xs" style={{ color: 'var(--text-faint)' }}>WPM</span>
                        </div>
                    </div>
                    <div>
                        <div className="text-[10px] font-mono tracking-widest mb-2 uppercase" style={{ color: 'var(--text-faint)' }}>TESTS RUN</div>
                        <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>4.2M+</div>
                    </div>
                </div>
            </div>

            <div
                className="flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-xs tracking-widest"
                style={{ color: 'var(--text-muted)' }}
            >
                <div className="flex gap-3 overflow-x-auto w-full pb-2 md:pb-0">
                    {filters.map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setActiveFilter(key)}
                            className="py-1.5 px-3 rounded transition-colors whitespace-nowrap"
                            style={
                                activeFilter === key
                                    ? { color: 'var(--accent)', backgroundColor: 'var(--accent-dim)', fontWeight: 700 }
                                    : { color: 'var(--text-muted)' }
                            }
                        >
                            {label}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-4 whitespace-nowrap">
                    <span style={{ color: 'var(--text-faint)' }}>syntax style:</span>
                    <button className="font-bold" style={{ color: 'var(--text-primary)' }}>modern web</button>
                    <button className="transition-colors hover:opacity-80">backend/sys</button>
                </div>
            </div>

            <div
                className="rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 cursor-pointer transition-all"
                style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                onClick={() => onStartPractice('RANDOM')}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 0 24px var(--accent-dim)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
                <div className="flex items-center gap-5">
                    <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center font-mono font-bold text-2xl shrink-0"
                        style={{ backgroundColor: 'var(--accent-dim)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }}
                    >
                        ?
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-base font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                                RANDOM SYNTAX
                            </h2>
                            <span
                                className="font-mono text-[10px] tracking-widest px-2 py-0.5 rounded"
                                style={{ color: 'var(--accent)', backgroundColor: 'var(--accent-dim)', border: '1px solid var(--accent-border)' }}
                            >
                                ALL LANGS
                            </span>
                        </div>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            Aliens spawn with snippets from all languages at random — HTML, CSS, JS, TS, Python, SQL &amp; Rust, Go, C++ &amp; Regex mixed every wave.
                        </p>
                    </div>
                </div>
                <div
                    className="font-mono text-xs tracking-widest font-bold px-8 py-3 rounded-lg shrink-0"
                    style={{ backgroundColor: 'var(--accent)', color: '#0b0e14' }}
                >
                    RANDOMIZE →
                </div>
            </div>

            <div className="flex flex-col gap-12 mt-4">
                {visibleTiers.length === 0 ? (
                    <div className="text-center py-20 font-mono text-sm" style={{ color: 'var(--text-faint)' }}>
                       // CHOOSE YOUR LANGUAGE &amp; HARD/EXPERT  ADVANCE
                    </div>
                ) : visibleTiers.map(tier => (
                    <div key={tier.id}>
                        <div className="flex justify-between items-center mb-6">
                            <div className="font-mono text-xs tracking-widest" style={{ color: 'var(--text-muted)' }}>
                                // TIER {tier.id} //{' '}
                                <span style={{ color: 'var(--text-primary)' }}>{tier.label}</span>
                            </div>
                            <div
                                className="px-3 py-1 rounded text-[10px] font-mono tracking-widest"
                                style={tier.badgeStyle}
                            >
                                {tier.badge}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tier.cards.map(card => (
                                <Card key={card.name} {...card} hoverText={tier.hoverText} onStartPractice={onStartPractice} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
