import { useState, useEffect } from 'react';

const modeIcons = {
    HTML:         '< />',
    CSS:          '{ }',
    JAVASCRIPT:   'JS',
    TYPESCRIPT:   'TS',
    PYTHON:       'PY',
    'SQL & RUST': 'RS',
    GO:           'GO',
    'C++':        'C++',
    REGEX:        '/.*/',
    RANDOM:       '?',
};

const modeColors = {
    HTML:         '#f97316',
    CSS:          '#3b82f6',
    JAVASCRIPT:   '#facc15',
    TYPESCRIPT:   '#2563eb',
    PYTHON:       '#00E572',
    'SQL & RUST': '#ef4444',
    GO:           '#00ADD8',
    'C++':        '#b45309',
    REGEX:        '#e879f9',
    RANDOM:       '#a855f7',
};

const modeTaglines = {
    HTML:         'DEFEND THE DOM.',
    CSS:          'STYLE THE WORLD.',
    JAVASCRIPT:   'EXECUTE THE SCRIPT.',
    TYPESCRIPT:   'TYPE THE FUTURE.',
    PYTHON:       'DEFEND EARTH.',
    'SQL & RUST': 'QUERY THE VOID.',
    GO:           'SHIP THE GOROUTINE.',
    'C++':        'OWN THE MEMORY.',
    REGEX:        'PARSE THE UNIVERSE.',
    RANDOM:       'EMBRACE THE CHAOS.',
};

const modeDesc = {
    HTML:         'Type falling HTML tags from real markup — semantic structure, attributes, and layout.',
    CSS:          'Type real CSS rules — selectors, Flexbox, Grid, animations, and variables.',
    JAVASCRIPT:   'Type ES6+ JavaScript — arrow functions, async/await, destructuring, and more.',
    TYPESCRIPT:   'Type TypeScript generics, utility types, interfaces, and strict syntax.',
    PYTHON:       'Type Python decorators, comprehensions, dataclasses, and async patterns.',
    'SQL & RUST': 'Type SQL CTEs and Rust borrow checker syntax back to back.',
    GO:           'Type Go goroutines, channels, interfaces, and context patterns from real codebases.',
    'C++':        'Type templates, smart pointers, move semantics, and modern C++20 — every symbol matters.',
    REGEX:        'Type real-world regular expressions — one wrong character breaks the entire pattern.',
    RANDOM:       'Aliens spawn snippets from all languages — stay sharp and adapt every wave.',
};

export default function PreLaunch({ mode, onLaunch, onBack }) {
    const [countdown, setCountdown] = useState(3);
    const [launched,  setLaunched]  = useState(false);
    const [autoStart, setAutoStart] = useState(false);

    const color = modeColors[mode] || '#00E572';
    const icon  = modeIcons[mode]  || '?';
    const tag   = modeTaglines[mode] || 'DEFEND EARTH.';
    const desc  = modeDesc[mode]   || modeDesc['RANDOM'];

    useEffect(() => {
        if (!autoStart) return;
        if (countdown <= 0) {
            setLaunched(true);
            const t = setTimeout(onLaunch, 600);
            return () => clearTimeout(t);
        }
        const t = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(t);
    }, [autoStart, countdown, onLaunch]);

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center py-12 animate-in fade-in duration-500">

            <div
                className="inline-flex items-center gap-2 font-mono text-[10px] tracking-widest px-4 py-1.5 rounded-full mb-10"
                style={{ color, backgroundColor: `${color}18`, border: `1px solid ${color}44` }}
            >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }} />
                {mode} // SESSION READY
            </div>

            <div
                className="w-24 h-24 rounded-2xl flex items-center justify-center mb-8 font-mono font-bold text-2xl"
                style={{
                    backgroundColor: `${color}15`,
                    border: `2px solid ${color}50`,
                    color,
                    boxShadow: `0 0 40px ${color}25`,
                }}
            >
                {icon}
            </div>

            <div className="font-mono text-xs tracking-widest mb-4" style={{ color: 'var(--text-faint)' }}>
                // MISSION READY — STAND BY
            </div>

            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter mb-6" style={{ color: 'var(--text-primary)' }}>
                {tag}
            </h1>

            <p className="font-mono text-sm tracking-wide mb-12 max-w-md" style={{ color: 'var(--text-muted)' }}>
                {desc}
            </p>

            <div className="flex gap-12 mb-14">
                {[
                    { label: 'DURATION', value: '90 SEC' },
                    { label: 'MISTAKES',  value: '0'      },
                    { label: 'RECORD',    value: '—'      },
                ].map(({ label, value }) => (
                    <div key={label} className="text-center">
                        <div className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{value}</div>
                        <div className="font-mono text-[10px] tracking-widest" style={{ color: 'var(--text-faint)' }}>{label}</div>
                    </div>
                ))}
            </div>

            {!autoStart ? (
                <button
                    onClick={() => setAutoStart(true)}
                    className="font-mono font-bold text-sm tracking-widest px-16 py-4 rounded-lg transition-all hover:scale-105"
                    style={{ backgroundColor: color, color: '#0b0e14', boxShadow: `0 0 30px ${color}40` }}
                >
                    ↑ LAUNCH →
                </button>
            ) : (
                <div className="flex flex-col items-center gap-3">
                    <div
                        className="text-6xl font-black font-mono transition-all duration-500"
                        style={{ color: countdown > 0 ? 'var(--text-primary)' : color, opacity: launched ? 0 : 1 }}
                    >
                        {countdown > 0 ? countdown : 'GO!'}
                    </div>
                    <div className="font-mono text-xs tracking-widest" style={{ color: 'var(--text-faint)' }}>
                        {countdown > 0 ? 'LAUNCHING IN...' : 'INITIATING SESSION...'}
                    </div>
                </div>
            )}

            <div className="flex items-center gap-6 mt-12 font-mono text-[10px] tracking-widest" style={{ color: 'var(--text-faint)' }}>
                <button onClick={onBack} className="transition-colors hover:opacity-80">← BACK</button>
                <span>•</span>
                <span>TYPEC v2.2.0</span>
                <span>•</span>
                <span>© 2026</span>
            </div>
        </div>
    );
}
