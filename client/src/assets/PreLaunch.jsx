import { useState, useEffect, useRef } from 'react';
import { sfx } from '../sound.js';

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

const TIP = 'Type the code on an alien to shoot it.';

export default function PreLaunch({ mode, onReady, onLaunch, onBack }) {
    const [countdown, setCountdown] = useState(3);
    const launchRef = useRef(onLaunch);
    const readyRef = useRef(onReady);

    const color = modeColors[mode] || '#00E572';
    const icon  = modeIcons[mode]  || '?';

    useEffect(() => {
        launchRef.current = onLaunch;
    }, [onLaunch]);

    useEffect(() => {
        if (readyRef.current) readyRef.current();
    }, []);

    useEffect(() => {
        if (countdown > 0) sfx.countdown();
        else sfx.launch();
    }, [countdown]);

    useEffect(() => {
        if (countdown <= 0) {
            const t = setTimeout(() => launchRef.current(), 450);
            return () => clearTimeout(t);
        }
        const t = setTimeout(() => setCountdown(c => c - 1), 800);
        return () => clearTimeout(t);
    }, [countdown]);

    return (
        <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center text-center py-10 sm:py-16">
            <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 font-mono font-bold text-xl"
                style={{ backgroundColor: `${color}15`, border: `2px solid ${color}50`, color, boxShadow: `0 0 40px ${color}25` }}
            >
                {icon}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8" style={{ color: 'var(--text-primary)' }}>
                {mode === 'RANDOM' ? 'Random mix' : mode}
            </h1>

            <div
                key={countdown}
                className="tc-count text-7xl sm:text-8xl font-black font-mono mb-8"
                style={{ color: countdown > 0 ? 'var(--text-primary)' : color }}
            >
                {countdown > 0 ? countdown : 'GO'}
            </div>

            <p className="text-sm mb-10" style={{ color: 'var(--text-muted)' }}>
                {TIP}
            </p>

            <button
                type="button"
                onClick={onBack}
                className="font-mono text-xs tracking-widest transition-opacity hover:opacity-70"
                style={{ color: 'var(--text-faint)' }}
            >
                ← CANCEL
            </button>
        </div>
    );
}
