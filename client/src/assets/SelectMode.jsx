import { useState } from 'react';
import { useLiveStats, compact } from '../live.js';

const tiers = [
    {
        id: 'easy',
        label: 'Easy',
        note: 'slow aliens',
        color: 'var(--accent)',
        cards: [
            { dot: '#f97316', name: 'HTML', desc: 'Tags and attributes' },
            { dot: '#3b82f6', name: 'CSS', desc: 'Selectors and layout' },
            { dot: '#facc15', name: 'JAVASCRIPT', desc: 'Functions and arrays' },
        ],
    },
    {
        id: 'medium',
        label: 'Medium',
        note: 'normal speed',
        color: '#eab308',
        cards: [
            { dot: '#2563eb', name: 'TYPESCRIPT', desc: 'Types and generics' },
            { dot: '#00E572', name: 'PYTHON', desc: 'Loops and comprehensions' },
            { dot: '#ef4444', name: 'SQL & RUST', desc: 'Queries and borrowing' },
        ],
    },
    {
        id: 'hard',
        label: 'Hard',
        note: 'more aliens',
        color: '#ef4444',
        cards: [
            { dot: '#00ADD8', name: 'GO', desc: 'Goroutines and channels' },
            { dot: '#b45309', name: 'C++', desc: 'Pointers and templates' },
            { dot: '#e879f9', name: 'REGEX', desc: 'Patterns and groups' },
        ],
    },
];

const filters = [
    { key: 'all', label: 'All' },
    { key: 'easy', label: 'Easy' },
    { key: 'medium', label: 'Medium' },
    { key: 'hard', label: 'Hard' },
];

function Card({ dot, name, desc, color, onPick }) {
    return (
        <button
            type="button"
            onClick={() => onPick(name)}
            className="tc-pick rounded-xl px-5 py-4 flex items-center justify-between gap-4 text-left"
            style={{ '--pick': color }}
        >
            <span className="flex flex-col gap-1 min-w-0">
                <span className="flex items-center gap-2 font-bold" style={{ color: 'var(--text-primary)' }}>
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: dot }} />
                    {name}
                </span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{desc}</span>
            </span>
            <span className="font-mono text-sm shrink-0" style={{ color }}>→</span>
        </button>
    );
}

function Stat({ label, value, accent }) {
    return (
        <div>
            <div className="text-[10px] font-mono tracking-widest mb-1 uppercase" style={{ color: 'var(--text-faint)' }}>{label}</div>
            <div className="text-xl sm:text-2xl font-bold" style={{ color: accent ? 'var(--accent)' : 'var(--text-primary)' }}>{value}</div>
        </div>
    );
}

export default function SelectMode({ onStartPractice }) {
    const [activeFilter, setActiveFilter] = useState('all');
    const stats = useLiveStats();

    const visibleTiers = tiers.filter((tier) => activeFilter === 'all' || tier.id === activeFilter);

    return (
        <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 py-2 sm:py-6">
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
                <div>
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>
                        Pick a <span style={{ color: 'var(--accent)' }}>language</span>
                    </h1>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        Aliens fall with real code on them. Type it to shoot them down.
                    </p>
                </div>

                <div
                    className="flex gap-6 sm:gap-8 rounded-xl px-5 py-4 self-start md:self-auto"
                    style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                >
                    <Stat label="Players" value={compact(stats?.typists)} accent />
                    <Stat label="Top WPM" value={stats ? stats.topWpm : '—'} accent />
                    <Stat label="Games" value={compact(stats?.testsRun)} />
                </div>
            </div>

            <div className="flex gap-2 font-mono text-xs tracking-widest">
                {filters.map(({ key, label }) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => setActiveFilter(key)}
                        className="py-1.5 px-3 rounded transition-colors"
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

            <button
                type="button"
                className="tc-pick rounded-xl px-5 py-4 flex items-center justify-between gap-4 text-left"
                style={{ '--pick': 'var(--accent)' }}
                onClick={() => onStartPractice('RANDOM')}
            >
                <span className="flex items-center gap-4 min-w-0">
                    <span
                        className="w-10 h-10 rounded-lg flex items-center justify-center font-mono font-bold text-lg shrink-0"
                        style={{ backgroundColor: 'var(--accent-dim)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }}
                    >
                        ?
                    </span>
                    <span className="flex flex-col gap-1">
                        <span className="font-bold" style={{ color: 'var(--text-primary)' }}>Random mix</span>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Every language at once</span>
                    </span>
                </span>
                <span
                    className="font-mono text-xs tracking-widest font-bold px-4 sm:px-6 py-2.5 rounded-lg shrink-0"
                    style={{ backgroundColor: 'var(--accent)', color: '#0b0e14' }}
                >
                    PLAY →
                </span>
            </button>

            <div className="flex flex-col gap-8">
                {visibleTiers.map((tier) => (
                    <section key={tier.id}>
                        <div className="flex items-baseline gap-3 mb-3">
                            <h2 className="text-lg font-bold" style={{ color: tier.color }}>{tier.label}</h2>
                            <span className="font-mono text-[11px] tracking-wide" style={{ color: 'var(--text-faint)' }}>{tier.note}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {tier.cards.map((card) => (
                                <Card key={card.name} {...card} color={tier.color} onPick={onStartPractice} />
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}
