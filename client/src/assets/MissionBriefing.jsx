const missionData = {
    HTML: {
        color: '#f97316',
        tier: 'TIER 1 // EASY',
        wpm: 60,
        duration: '3 MIN',
        difficulty: 'EASY',
        objective: 'Enter the HTML battlefield. Type real HTML code as fast and accurately as possible. Every correct keystroke advances the mission, every error triggers a penalty.',
        notes: [
            'Tags that miss closing brackets will trigger extra penalty keystrokes.',
            'Avoid dead errors which will trigger consecutive more delay keystrokes.',
        ],
        details: [
            { label: 'FOCUS',        value: 'Tags, attributes, semantic layout' },
            { label: 'SNIPPET LEN',  value: '~120 chars avg' },
            { label: 'ACCURACY REQ', value: '90%' },
        ],
    },
    CSS: {
        color: '#3b82f6',
        tier: 'TIER 1 // EASY',
        wpm: 65,
        duration: '3 MIN',
        difficulty: 'EASY',
        objective: 'Navigate the CSS arena. Type selectors, properties, and values from real stylesheets. Precision on colons, semicolons, and braces is critical.',
        notes: [
            'Missing semicolons count as full errors and add penalty time.',
            'Property names must be typed exactly — no auto-correction applies.',
        ],
        details: [
            { label: 'FOCUS',        value: 'Selectors, Flexbox, animations' },
            { label: 'SNIPPET LEN',  value: '~110 chars avg' },
            { label: 'ACCURACY REQ', value: '90%' },
        ],
    },
    JAVASCRIPT: {
        color: '#facc15',
        tier: 'TIER 1 // EASY',
        wpm: 75,
        duration: '3 MIN',
        difficulty: 'EASY',
        objective: 'Execute the JavaScript mission. Arrow functions, destructuring, and async patterns await. Keep up with modern ES6+ syntax at speed.',
        notes: [
            'Arrow functions and template literals will be tested frequently.',
            'Bracket and parenthesis pairing errors compound quickly.',
        ],
        details: [
            { label: 'FOCUS',        value: 'ES6+, async/await, array methods' },
            { label: 'SNIPPET LEN',  value: '~130 chars avg' },
            { label: 'ACCURACY REQ', value: '88%' },
        ],
    },
    TYPESCRIPT: {
        color: '#2563eb',
        tier: 'TIER 2 // MEDIUM',
        wpm: 80,
        duration: '4 MIN',
        difficulty: 'MEDIUM',
        objective: 'TypeScript missions demand precision on generics, union types, and utility types. Every angle bracket counts.',
        notes: [
            'Generic syntax must be typed exactly — no partial credit.',
            'Interface and type declarations are timed separately per block.',
        ],
        details: [
            { label: 'FOCUS',        value: 'Generics, unions, utility types' },
            { label: 'SNIPPET LEN',  value: '~140 chars avg' },
            { label: 'ACCURACY REQ', value: '92%' },
        ],
    },
    PYTHON: {
        color: '#00E572',
        tier: 'TIER 2 // MEDIUM',
        wpm: 75,
        duration: '4 MIN',
        difficulty: 'MEDIUM',
        objective: 'Python missions test your indentation timing and decorator syntax. One wrong indent is a full error — Python is unforgiving.',
        notes: [
            'Indentation is measured — tabs vs spaces will be enforced.',
            'Decorator syntax @ must precede the function definition exactly.',
        ],
        details: [
            { label: 'FOCUS',        value: 'Decorators, comprehensions, dataclasses' },
            { label: 'SNIPPET LEN',  value: '~120 chars avg' },
            { label: 'ACCURACY REQ', value: '90%' },
        ],
    },
    'SQL & RUST': {
        color: '#ef4444',
        tier: 'TIER 2 // MEDIUM',
        wpm: 90,
        duration: '5 MIN',
        difficulty: 'HARD',
        objective: 'The hardest Tier 2 mission. SQL recursive CTEs and Rust borrow checker syntax back to back. This will test everything.',
        notes: [
            'SQL keywords are case-sensitive — type them in UPPERCASE.',
            'Rust lifetime annotations must be typed with exact apostrophe placement.',
        ],
        details: [
            { label: 'FOCUS',        value: 'CTEs, pattern matching, borrows' },
            { label: 'SNIPPET LEN',  value: '~150 chars avg' },
            { label: 'ACCURACY REQ', value: '93%' },
        ],
    },
    GO: {
        color: '#00ADD8',
        tier: 'TIER 3 // HARD',
        wpm: 95,
        duration: '5 MIN',
        difficulty: 'HARD',
        objective: 'Enter the Go concurrency arena. Type goroutines, channels, interfaces, and context patterns from real production Go codebases. Speed and precision both matter.',
        notes: [
            'Channel syntax and goroutine declarations must be typed symbol-perfect.',
            'Go is whitespace-sensitive in some contexts — every space counts.',
        ],
        details: [
            { label: 'FOCUS',        value: 'Goroutines, channels, interfaces' },
            { label: 'SNIPPET LEN',  value: '~130 chars avg' },
            { label: 'ACCURACY REQ', value: '92%' },
        ],
    },
    'C++': {
        color: '#b45309',
        tier: 'TIER 3 // HARD',
        wpm: 100,
        duration: '5 MIN',
        difficulty: 'HARD',
        objective: 'The C++ gauntlet. Templates, smart pointers, move semantics, and modern C++20 features. Every angle bracket, const, and & placement is tested.',
        notes: [
            'Template syntax and angle brackets must be typed exactly — no shortcuts.',
            'Pointer and reference notation errors are counted as hard failures.',
        ],
        details: [
            { label: 'FOCUS',        value: 'Templates, RAII, move semantics' },
            { label: 'SNIPPET LEN',  value: '~140 chars avg' },
            { label: 'ACCURACY REQ', value: '93%' },
        ],
    },
    REGEX: {
        color: '#e879f9',
        tier: 'TIER 3 // HARD',
        wpm: 110,
        duration: '5 MIN',
        difficulty: 'HARD',
        objective: 'The regex gauntlet. Type real-world regular expressions — lookaheads, backreferences, named groups, character classes, and anchors. One wrong character breaks the entire pattern.',
        notes: [
            'Every backslash, bracket, and quantifier must be typed exactly.',
            'Regex patterns are unforgiving — partial matches score zero.',
        ],
        details: [
            { label: 'FOCUS',        value: 'Lookaheads, groups, anchors' },
            { label: 'SNIPPET LEN',  value: '~100 chars avg' },
            { label: 'ACCURACY REQ', value: '95%' },
        ],
    },
    RANDOM: {
        color: '#a855f7',
        tier: 'ALL TIERS',
        wpm: 80,
        duration: '90 SEC',
        difficulty: 'MIXED',
        objective: 'The wildcard mission. Aliens drop snippets from every language — HTML, CSS, JS, TS, Python, SQL and Rust. Adapt fast or get overwhelmed.',
        notes: [
            'Syntax switches every alien — stay sharp and read before you type.',
            'Errors compound across languages — precision matters more than speed.',
        ],
        details: [
            { label: 'FOCUS',        value: 'All languages mixed' },
            { label: 'SNIPPET LEN',  value: 'varies per lang' },
            { label: 'ACCURACY REQ', value: '88%' },
        ],
    },
};

const difficultyColor = {
    EASY:   { color: 'var(--accent)', bg: 'var(--accent-dim)',        border: 'var(--accent-border)' },
    MEDIUM: { color: '#eab308',       bg: 'rgba(234,179,8,0.10)',     border: 'rgba(234,179,8,0.25)' },
    HARD:   { color: '#ef4444',       bg: 'rgba(239,68,68,0.10)',     border: 'rgba(239,68,68,0.25)' },
    MIXED:  { color: '#a855f7',       bg: 'rgba(168,85,247,0.10)',    border: 'rgba(168,85,247,0.25)' },
};

export default function MissionBriefing({ mode, playStyle, onBack, onStart }) {
    const data = missionData[mode] || missionData['HTML'];
    const diff = difficultyColor[data.difficulty] || difficultyColor['EASY'];

    return (
        <div className="w-full max-w-5xl mx-auto animate-in fade-in duration-500">

            <div className="font-mono text-xs tracking-widest mb-6" style={{ color: 'var(--accent)' }}>
                // MISSION BRIEFING
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <h1 className="text-5xl lg:text-6xl font-bold tracking-tighter" style={{ color: 'var(--text-primary)' }}>
                    READY TO{' '}
                    <span style={{ color: data.color }}>{mode}?</span>
                </h1>
                <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
                    <span
                        className="px-3 py-1 rounded tracking-widest"
                        style={{ color: diff.color, backgroundColor: diff.bg, border: '1px solid ' + diff.border }}
                    >
                        {data.difficulty}
                    </span>
                    <span
                        className="px-3 py-1 rounded tracking-widest"
                        style={{ color: 'var(--text-faint)', border: '1px solid var(--border-color)' }}
                    >
                        {data.tier}
                    </span>
                    <span
                        className="px-3 py-1 rounded tracking-widest"
                        style={{ color: 'var(--text-faint)', border: '1px solid var(--border-color)' }}
                    >
                        {data.wpm} WPM TARGET
                    </span>
                    {playStyle === 'ranked' && (
                        <span
                            className="px-3 py-1 rounded tracking-widest font-bold"
                            style={{ color: '#eab308', backgroundColor: 'rgba(234,179,8,0.10)', border: '1px solid rgba(234,179,8,0.30)' }}
                        >
                            ⚔ RANKED
                        </span>
                    )}
                    {playStyle === 'practice' && (
                        <span
                            className="px-3 py-1 rounded tracking-widest font-bold"
                            style={{ color: 'var(--accent)', backgroundColor: 'var(--accent-dim)', border: '1px solid var(--accent-border)' }}
                        >
                            ∞ PRACTICE
                        </span>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                <div
                    className="rounded-xl p-6 flex flex-col gap-3"
                    style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                >
                    <div className="font-mono text-[10px] tracking-widest" style={{ color: 'var(--text-faint)' }}>
                        01. OBJECTIVE
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        {data.objective}
                    </p>
                </div>

                <div
                    className="rounded-xl p-6 flex flex-col gap-3"
                    style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                >
                    <div className="font-mono text-[10px] tracking-widest" style={{ color: 'var(--text-faint)' }}>
                        02. NOTES
                    </div>
                    <ul className="space-y-3">
                        {data.notes.map((note, i) => (
                            <li key={i} className="flex gap-2 text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                                <span style={{ color: data.color }} className="mt-0.5 shrink-0">▸</span>
                                {note}
                            </li>
                        ))}
                    </ul>
                </div>

                <div
                    className="rounded-xl p-6 flex flex-col gap-4"
                    style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                >
                    <div className="font-mono text-[10px] tracking-widest" style={{ color: 'var(--text-faint)' }}>
                        03. DIFFICULTY
                    </div>
                    <div className="space-y-3">
                        {data.details.map(function(item) {
                            return (
                                <div key={item.label} className="flex justify-between items-center">
                                    <span className="font-mono text-[10px] tracking-widest" style={{ color: 'var(--text-faint)' }}>
                                        {item.label}
                                    </span>
                                    <span className="font-mono text-[10px] font-bold" style={{ color: 'var(--text-primary)' }}>
                                        {item.value}
                                    </span>
                                </div>
                            );
                        })}
                        <div
                            className="flex justify-between items-center pt-2"
                            style={{ borderTop: '1px solid var(--border-color)' }}
                        >
                            <span className="font-mono text-[10px] tracking-widest" style={{ color: 'var(--text-faint)' }}>
                                DURATION
                            </span>
                            <span className="font-mono text-[10px] font-bold" style={{ color: data.color }}>
                                {data.duration}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className="rounded-xl p-5 mb-8 space-y-2"
                style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
            >
                <div className="font-mono text-[10px] tracking-widest mb-3" style={{ color: 'var(--text-faint)' }}>
                    // PRE-MISSION NOTES
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    · Type the snippets exactly as shown — every character, space, and symbol counts.
                </p>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    · Avoid chaining errors — each mistake adds delay to your next keystroke window.
                </p>
            </div>

            <div className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="font-mono text-xs tracking-widest px-6 py-3 rounded transition-colors"
                    style={{ color: 'var(--text-muted)', border: '1px solid var(--border-color)', backgroundColor: 'transparent' }}
                >
                    ← BACK
                </button>
                <button
                    onClick={onStart}
                    className="font-mono text-xs tracking-widest px-10 py-3.5 rounded font-bold transition-colors"
                    style={{ backgroundColor: data.color, color: '#0b0e14' }}
                >
                    START SESSION →
                </button>
            </div>
        </div>
    );
}
