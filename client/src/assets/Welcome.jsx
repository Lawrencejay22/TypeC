import { useEffect, useRef } from 'react';

export default function Welcome({ user, onComplete }) {
    const doneRef = useRef(onComplete);

    useEffect(() => {
        doneRef.current = onComplete;
    }, [onComplete]);

    useEffect(() => {
        const timer = setTimeout(() => doneRef.current(), 900);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center text-center py-20">
            <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                style={{
                    backgroundColor: 'var(--accent-dim)',
                    border: '1px solid var(--accent-border)',
                    boxShadow: '0 0 30px var(--accent-dim)',
                }}
            >
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="var(--accent)">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6" style={{ color: 'var(--text-primary)' }}>
                Welcome, <span style={{ color: 'var(--accent)' }}>{user ? user.username : 'guest'}</span>
            </h1>

            <div className="w-full max-w-xs h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border-color)' }}>
                <div className="tc-welcome-bar h-full rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
            </div>
        </div>
    );
}
