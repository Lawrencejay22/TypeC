import { useMemo } from "react";
import "./MatrixBg.css";

function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export default function MatrixBg({ count = 60, seed = 7 }) {
  const digits = useMemo(() => {
    const rand = seeded(seed);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: rand() * 100,
      top: rand() * 100,
      opacity: 0.05 + rand() * 0.05,
      value: String(Math.floor(rand() * 100)).padStart(2, "0"),
    }));
  }, [count, seed]);

  return (
    <div className="matrix-bg" aria-hidden="true">
      {digits.map((d) => (
        <span
          key={d.id}
          style={{ left: `${d.left}%`, top: `${d.top}%`, opacity: d.opacity }}
        >
          {d.value}
        </span>
      ))}
    </div>
  );
}
