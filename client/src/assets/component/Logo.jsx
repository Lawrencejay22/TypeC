import './Logo.css';

export default function Logo({ size = 20, className = '' }) {
    return (
        <span className={`tc-logo ${className}`} style={{ fontSize: size }} aria-label="TypeC" role="img">
            <span className="tc-logo-word" aria-hidden="true">type_</span>
            <span className="tc-logo-mark" aria-hidden="true">C</span>
        </span>
    );
}
