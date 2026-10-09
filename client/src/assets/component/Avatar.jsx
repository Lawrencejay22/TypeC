import './Avatar.css';

function hueFrom(name) {
    let hash = 0;
    for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) % 360;
    return hash;
}

export default function Avatar({ name, size, className = '' }) {
    const hue = hueFrom(name);
    const letters = name.replace(/[^a-z0-9]/gi, '').slice(0, 2) || '?';

    return (
        <span
            className={`lb-avatar lb-avatar-fallback ${className}`}
            style={{
                width: size,
                height: size,
                fontSize: size * 0.36,
                background: `linear-gradient(135deg, hsl(${hue} 60% 45%), hsl(${(hue + 50) % 360} 55% 30%))`,
            }}
            aria-hidden="true"
        >
            {letters.toUpperCase()}
        </span>
    );
}
