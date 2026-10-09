import { useEffect, useState } from 'react';
import { onToast } from '../../toasts.js';
import { sfx } from '../../sound.js';
import './Toasts.css';

export default function Toasts() {
    const [items, setItems] = useState([]);

    useEffect(() => onToast((item) => {
        setItems((list) => [...list.slice(-3), item]);
        if (item.kind === 'badge') sfx.achievement();
        setTimeout(() => {
            setItems((list) => list.filter((x) => x.id !== item.id));
        }, item.duration);
    }), []);

    if (!items.length) return null;

    return (
        <div className="tc-toasts" role="status" aria-live="polite">
            {items.map((item) => (
                <div key={item.id} className={`tc-toast is-${item.kind}`}>
                    {item.icon && <span className="tc-toast-icon" aria-hidden="true">{item.icon}</span>}
                    <div className="tc-toast-body">
                        {item.label && <span className="tc-toast-label">{item.label}</span>}
                        <strong>{item.title}</strong>
                        {item.text && <span className="tc-toast-text">{item.text}</span>}
                    </div>
                </div>
            ))}
        </div>
    );
}
