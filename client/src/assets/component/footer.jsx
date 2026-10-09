import { useEffect, useState } from 'react';
import { onLatency } from '../../api.js';
import './footer.css';

export default function Footer({ onNavigate }) {
    const [latency, setLatency] = useState(null);
    const go = (view) => onNavigate && onNavigate(view);

    useEffect(() => onLatency(setLatency), []);

    return (
        <footer className="tc-footer">
            <div className="tc-footer-left">
                <span className="is-strong">free to play</span>
                <span className="tc-footer-dot">•</span>
                <span className="is-strong">real code</span>
                <span className="tc-footer-dot">•</span>
                <button type="button" onClick={() => go('about')}>about</button>
                <span className="tc-footer-dot">•</span>
                <button type="button" onClick={() => go('contact')}>contact</button>
            </div>

            <div className="tc-footer-right">
                <span>typec v2.3.0 — © 2026</span>
                <span className="tc-footer-latency">
                    <span className="tc-footer-latency-dot" style={latency === null ? { background: '#71717a' } : undefined} />
                    avg latency: <span className="is-green">{latency === null ? '—' : `${latency}ms`}</span>
                </span>
            </div>
        </footer>
    );
}
