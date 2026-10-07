import { useEffect, useState } from 'react';
import { SelectModeSkeleton } from './component/Skeleton.jsx';

export default function Welcome({ onComplete }) {
    const [progress, setProgress] = useState(0);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let timeout;
        const interval = setInterval(() => {
            setProgress(p => {
                if (p >= 100) {
                    clearInterval(interval);
                    timeout = setTimeout(() => setReady(true), 300);
                    return 100;
                }
                return p + 2;
            });
        }, 30);
        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, []);

    useEffect(() => {
        if (!ready) return;
        const onKey = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onComplete();
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [ready, onComplete]);

    if (ready) {
        return <SelectModeSkeleton onLaunch={onComplete} />;
    }

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center text-center py-24 animate-in fade-in duration-700">
            <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8"
                style={{
                    backgroundColor: 'var(--accent-dim)',
                    border: '1px solid var(--accent-border)',
                    boxShadow: '0 0 30px var(--accent-dim)',
                }}
            >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="var(--accent)">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4" style={{ color: 'var(--text-primary)' }}>
                AUTHENTICATION <span style={{ color: 'var(--accent)' }}>SUCCESSFUL</span>
            </h1>

            <p className="font-mono tracking-widest text-sm mb-12 uppercase" style={{ color: 'var(--text-muted)' }}>
                Welcome back, syntax_striker. Initializing typing arena...
            </p>

            <div className="w-full max-w-sm h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border-color)' }}>
                <div
                    className="h-full rounded-full transition-all duration-75 ease-out"
                    style={{ width: `${progress}%`, backgroundColor: 'var(--accent)', boxShadow: '0 0 10px var(--accent-dim)' }}
                />
            </div>
            <div className="mt-4 font-mono text-xs tracking-widest" style={{ color: 'var(--accent)' }}>
                [ {progress}% ]
            </div>
        </div>
    );
}
