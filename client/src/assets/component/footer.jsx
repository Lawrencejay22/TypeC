import './footer.css';

export default function Footer({ onNavigate }) {
    const go = (view) => onNavigate && onNavigate(view);

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
                <span>typec v2.2.0 — © 2026</span>
                <span className="tc-footer-latency">
                    <span className="tc-footer-latency-dot" />
                    avg latency: <span className="is-green">12ms</span>
                </span>
            </div>
        </footer>
    );
}
