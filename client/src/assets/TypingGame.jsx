import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { sfx, getSoundPrefs, setSoundPrefs, onSoundPrefs } from '../sound.js';
import { toast } from '../toasts.js';
import Logo from './component/Logo.jsx';
import { roundPlan, pickSnippet } from './snippets.js';

const LANG_COLOR = {
    HTML: '#f97316', CSS: '#3b82f6', JAVASCRIPT: '#facc15',
    TYPESCRIPT: '#2563eb', PYTHON: '#00E572', 'SQL & RUST': '#ef4444',
    GO: '#00ADD8', 'C++': '#b45309', REGEX: '#e879f9',
    RANDOM: '#a855f7',
};

const GRADES = {
    ranked:   [['S-TIER', 80], ['A-TIER', 60], ['B-TIER', 40], ['C-TIER', 25]],
    practice: [['S-TIER', 60], ['A-TIER', 45], ['B-TIER', 30], ['C-TIER', 15]],
};

function getRank(wpm, playStyle) {
    const scale = GRADES[playStyle] || GRADES.ranked;
    return scale.find(([, min]) => wpm >= min)?.[0] ?? 'D-TIER';
}

const TIER = {
    HTML: 'easy', CSS: 'easy', JAVASCRIPT: 'easy',
    TYPESCRIPT: 'medium', PYTHON: 'medium', 'SQL & RUST': 'medium', RANDOM: 'medium',
    GO: 'hard', 'C++': 'hard', REGEX: 'hard',
};

const PACE = {
    easy:   { every: 3500, maxAlive: 3, fallSeconds: 40 },
    medium: { every: 2800, maxAlive: 4, fallSeconds: 32 },
    hard:   { every: 2200, maxAlive: 5, fallSeconds: 26 },
};

const SPEED_STEP = 0.08;
const SPEED_LIMIT = 1.3;
const FIRST_BREAK = 600;
const ROUND_BREAK = 2000;

const SKILLS = {
    shield: { icon: '🛡', name: 'Shield', key: 'ArrowLeft', hint: '←', seconds: 20, color: '#38bdf8', text: 'Blocks the next alien that gets through' },
    freeze: { icon: '❄', name: 'Freeze', key: 'ArrowUp', hint: '↑', seconds: 5, color: '#a5f3fc', text: 'Stops every alien for 5 seconds' },
    slowmo: { icon: '🐢', name: 'Slowmo', key: 'ArrowRight', hint: '→', seconds: 8, color: '#c084fc', text: 'Aliens move at half speed for 8 seconds' },
};
const SKILL_ORDER = ['shield', 'freeze', 'slowmo'];
const SKILL_KEYS = Object.fromEntries(SKILL_ORDER.map((k) => [SKILLS[k].key, k]));
const SKILL_MAX = 2;
const RECHARGE_EVERY = 10;
const SLOWMO_SPEED = 0.5;

const LANE_WIDTH = 300;
const EDGE = 24;

function pickLane(aliens, arenaW) {
    const usable = Math.max(arenaW - EDGE * 2, 200);
    const lanes = Math.max(1, Math.floor(usable / LANE_WIDTH));
    const width = usable / lanes;
    const busy = new Set(aliens.filter(a => a.alive && a.y < 150).map(a => a.lane));
    const free = [];
    for (let i = 0; i < lanes; i++) if (!busy.has(i)) free.push(i);
    if (!free.length) return null;
    const lane = free[Math.floor(Math.random() * free.length)];
    return { lane, x: EDGE + width * (lane + 0.5) };
}

function makeAlien(id, snippet, lang, spot, arenaH, pace, ramp) {
    const travel = Math.max(arenaH, 300) + 80;
    const seconds = (pace.fallSeconds / ramp) * (0.9 + Math.random() * 0.2);
    return {
        id, snippet, typed: '', lang,
        lane: spot.lane,
        x:  spot.x,
        y:  -80,
        vy: (travel / (seconds * 1000)) * 16,
        alive: true,
        hit:   false,
    };
}

function Laser({ from, to, color }) {
    if (!from || !to) return null;
    return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 20 }}>
            <line
                x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.95"
                style={{ filter: `drop-shadow(0 0 10px ${color})` }}
            />
        </svg>
    );
}

function Explosion({ x, y, color }) {
    return (
        <div className="tc-boom" style={{ left: x, top: y + 20, '--boom': color }}>
            <span className="tc-boom-ring" />
            <span className="tc-boom-core" />
            {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
                <span key={i} className="tc-boom-spark" style={{ '--angle': `${i * 45}deg` }} />
            ))}
        </div>
    );
}

const STREAK_START = 5;

function AlienSVG({ lang, color, size = 40 }) {
    const c = color;
    const s = size;
    switch (lang) {
        case 'HTML':
            return (
                <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
                    <rect x="4" y="7" width="16" height="10" rx="1.5" fill={c} opacity="0.9"/>
                    <rect x="1" y="9" width="3" height="5" rx="1" fill={c} opacity="0.7"/>
                    <rect x="20" y="9" width="3" height="5" rx="1" fill={c} opacity="0.7"/>
                    <rect x="5"  y="16" width="3" height="4" rx="1" fill={c} opacity="0.6"/>
                    <rect x="10" y="17" width="3" height="4" rx="1" fill={c} opacity="0.6"/>
                    <rect x="15" y="16" width="3" height="4" rx="1" fill={c} opacity="0.6"/>
                    <rect x="7"  y="7"  width="2" height="3" rx="1" fill={c} opacity="0.5"/>
                    <rect x="15" y="7"  width="2" height="3" rx="1" fill={c} opacity="0.5"/>
                    <rect x="7"  y="10" width="3" height="3" rx="0.5" fill="#04070e"/>
                    <rect x="14" y="10" width="3" height="3" rx="0.5" fill="#04070e"/>
                    <rect x="10" y="13" width="4" height="1.5" rx="0.5" fill="#04070e"/>
                </svg>
            );
        case 'CSS':
            return (
                <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
                    <ellipse cx="12" cy="9" rx="8" ry="6" fill={c} opacity="0.9"/>
                    <rect x="5"  y="14" width="2" height="6" rx="1" fill={c} opacity="0.55"/>
                    <rect x="8"  y="15" width="2" height="6" rx="1" fill={c} opacity="0.55"/>
                    <rect x="11" y="14" width="2" height="6" rx="1" fill={c} opacity="0.55"/>
                    <rect x="14" y="15" width="2" height="6" rx="1" fill={c} opacity="0.55"/>
                    <rect x="17" y="14" width="2" height="6" rx="1" fill={c} opacity="0.55"/>
                    <circle cx="9"  cy="8" r="2" fill="#04070e"/>
                    <circle cx="15" cy="8" r="2" fill="#04070e"/>
                    <rect x="10" y="11" width="4" height="1.5" rx="0.75" fill="#04070e"/>
                </svg>
            );
        case 'JAVASCRIPT':
            return (
                <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="8" width="18" height="11" rx="2.5" fill={c} opacity="0.9"/>
                    <rect x="6"  y="18" width="3" height="5" rx="1" fill={c} opacity="0.6"/>
                    <rect x="10" y="19" width="3" height="4" rx="1" fill={c} opacity="0.6"/>
                    <rect x="14" y="18" width="3" height="5" rx="1" fill={c} opacity="0.6"/>
                    <rect x="8"  y="3"  width="2" height="5" rx="1" fill={c} opacity="0.6"/>
                    <rect x="14" y="3"  width="2" height="5" rx="1" fill={c} opacity="0.6"/>
                    <circle cx="8"  cy="3" r="1.5" fill={c}/>
                    <circle cx="16" cy="3" r="1.5" fill={c}/>
                    <rect x="7"  y="11" width="4" height="4" rx="1" fill="#04070e"/>
                    <rect x="13" y="11" width="4" height="4" rx="1" fill="#04070e"/>
                </svg>
            );
        case 'TYPESCRIPT':
            return (
                <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
                    <rect x="5" y="6" width="14" height="15" rx="2" fill={c} opacity="0.9"/>
                    <rect x="2" y="9"  width="3" height="7" rx="1" fill={c} opacity="0.6"/>
                    <rect x="19" y="9" width="3" height="7" rx="1" fill={c} opacity="0.6"/>
                    <rect x="8"  y="19" width="3" height="4" rx="1" fill={c} opacity="0.6"/>
                    <rect x="13" y="19" width="3" height="4" rx="1" fill={c} opacity="0.6"/>
                    <rect x="9"  y="3"  width="6" height="4" rx="1" fill={c} opacity="0.7"/>
                    <rect x="8"  y="10" width="3" height="3" rx="0.5" fill="#04070e"/>
                    <rect x="13" y="10" width="3" height="3" rx="0.5" fill="#04070e"/>
                    <rect x="8"  y="15" width="8" height="1.5" rx="0.5" fill="#04070e"/>
                </svg>
            );
        case 'PYTHON':
            return (
                <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
                    <ellipse cx="12" cy="10" rx="7" ry="7" fill={c} opacity="0.9"/>
                    <ellipse cx="12" cy="19" rx="4" ry="3" fill={c} opacity="0.7"/>
                    <rect x="10" y="16" width="4" height="4" fill={c} opacity="0.7"/>
                    <rect x="8"  y="21" width="3" height="3" rx="1" fill={c} opacity="0.5"/>
                    <rect x="13" y="21" width="3" height="3" rx="1" fill={c} opacity="0.5"/>
                    <circle cx="9"  cy="9" r="2" fill="#04070e"/>
                    <circle cx="15" cy="9" r="2" fill="#04070e"/>
                    <path d="M9 13 Q12 16 15 13" stroke="#04070e" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                    <rect x="11" y="3" width="2" height="4" rx="1" fill={c} opacity="0.6"/>
                </svg>
            );
        case 'SQL & RUST':
            return (
                <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
                    <polygon points="12,3 21,9 21,19 3,19 3,9" fill={c} opacity="0.9"/>
                    <rect x="0"  y="10" width="3" height="6" fill={c} opacity="0.6"/>
                    <rect x="21" y="10" width="3" height="6" fill={c} opacity="0.6"/>
                    <rect x="7"  y="19" width="3" height="4" fill={c} opacity="0.55"/>
                    <rect x="14" y="19" width="3" height="4" fill={c} opacity="0.55"/>
                    <rect x="7"  y="11" width="4" height="4" rx="0.5" fill="#04070e"/>
                    <rect x="13" y="11" width="4" height="4" rx="0.5" fill="#04070e"/>
                    <rect x="8"  y="16" width="8" height="1.5" fill="#04070e"/>
                </svg>
            );
        case 'GO':
            return (
                <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
                    <ellipse cx="12" cy="11" rx="8" ry="7" fill={c} opacity="0.9"/>
                    <rect x="2"  y="10" width="3" height="4" rx="1.5" fill={c} opacity="0.65"/>
                    <rect x="19" y="10" width="3" height="4" rx="1.5" fill={c} opacity="0.65"/>
                    <rect x="8"  y="17" width="3" height="5" rx="1"   fill={c} opacity="0.6"/>
                    <rect x="13" y="17" width="3" height="5" rx="1"   fill={c} opacity="0.6"/>
                    <circle cx="9"  cy="10" r="2.2" fill="#04070e"/>
                    <circle cx="15" cy="10" r="2.2" fill="#04070e"/>
                    <circle cx="9.6"  cy="9.4" r="0.8" fill={c} opacity="0.9"/>
                    <circle cx="15.6" cy="9.4" r="0.8" fill={c} opacity="0.9"/>
                    <rect x="9" y="13" width="6" height="1.2" rx="0.6" fill="#04070e"/>
                    <ellipse cx="12" cy="5" rx="2" ry="1.5" fill={c} opacity="0.5"/>
                </svg>
            );
        case 'C++':
            return (
                <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
                    <rect x="4"  y="5"  width="16" height="14" rx="1" fill={c} opacity="0.9"/>
                    <rect x="1"  y="8"  width="3"  height="6"  rx="1" fill={c} opacity="0.6"/>
                    <rect x="20" y="8"  width="3"  height="6"  rx="1" fill={c} opacity="0.6"/>
                    <rect x="7"  y="18" width="3"  height="5"  rx="1" fill={c} opacity="0.55"/>
                    <rect x="14" y="18" width="3"  height="5"  rx="1" fill={c} opacity="0.55"/>
                    <rect x="5"  y="2"  width="14" height="4"  rx="1" fill={c} opacity="0.7"/>
                    <rect x="7"  y="10" width="3" height="1" fill="#04070e"/>
                    <rect x="8"  y="9"  width="1" height="3" fill="#04070e"/>
                    <rect x="14" y="10" width="3" height="1" fill="#04070e"/>
                    <rect x="15" y="9"  width="1" height="3" fill="#04070e"/>
                    <rect x="9"  y="14" width="6" height="1.2" rx="0.5" fill="#04070e"/>
                </svg>
            );
        case 'REGEX':
            return (
                <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
                    <ellipse cx="12" cy="9" rx="7" ry="6" fill={c} opacity="0.9"/>
                    <rect x="5"  y="14" width="1.8" height="7" rx="0.9" fill={c} opacity="0.5"/>
                    <rect x="8"  y="15" width="1.8" height="6" rx="0.9" fill={c} opacity="0.5"/>
                    <rect x="11" y="14" width="1.8" height="7" rx="0.9" fill={c} opacity="0.5"/>
                    <rect x="14" y="15" width="1.8" height="6" rx="0.9" fill={c} opacity="0.5"/>
                    <rect x="17" y="14" width="1.8" height="7" rx="0.9" fill={c} opacity="0.5"/>
                    <circle cx="9"  cy="8.5" r="2" fill="#04070e"/>
                    <circle cx="15" cy="8.5" r="2" fill="#04070e"/>
                    <circle cx="9.7"  cy="7.8" r="0.7" fill={c} opacity="0.9"/>
                    <circle cx="15.7" cy="7.8" r="0.7" fill={c} opacity="0.9"/>
                    <path d="M9 12 Q12 14 15 12" stroke="#04070e" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
                </svg>
            );
        default:
            return (
                <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
                    <ellipse cx="12" cy="12" rx="9" ry="9" fill={c} opacity="0.15"/>
                    <ellipse cx="12" cy="12" rx="9" ry="9" stroke={c} strokeWidth="1.5" fill="none"/>
                    <text x="12" y="17" textAnchor="middle" fill={c} fontSize="11" fontWeight="bold" fontFamily="monospace">?</text>
                </svg>
            );
    }
}

function Alien({ alien, color, isTarget }) {
    const done      = alien.typed;
    const remaining = alien.snippet.slice(done.length);
    return (
        <div
            className="absolute flex flex-col items-center pointer-events-none"
            style={{ left: alien.x, top: alien.y, transform: 'translate(-50%, 0)', zIndex: 10 }}
        >
            <div
                className="w-16 h-16 rounded-xl flex items-center justify-center mb-2"
                style={{
                    backgroundColor: isTarget ? `${color}22` : 'rgba(255,255,255,0.05)',
                    border: `2px solid ${isTarget ? color : 'rgba(255,255,255,0.15)'}`,
                    boxShadow: isTarget ? `0 0 22px ${color}80` : 'none',
                    transition: 'border-color 0.1s, box-shadow 0.1s',
                }}
            >
                <AlienSVG lang={alien.lang} color={color} size={40} />
            </div>
            <div
                className="font-mono text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 rounded-lg whitespace-nowrap"
                style={{
                    backgroundColor: isTarget ? `${color}22` : 'rgba(0,0,0,0.7)',
                    border: `1px solid ${isTarget ? color + '80' : 'rgba(255,255,255,0.12)'}`,
                    boxShadow: isTarget ? `0 0 12px ${color}35` : 'none',
                    letterSpacing: '0.04em',
                    transition: 'all 0.1s',
                }}
            >
                <span style={{ color }}>{done}</span>
                <span style={{ color: 'rgba(255,255,255,0.88)' }}>{remaining}</span>
            </div>
        </div>
    );
}

const Stars = React.memo(function Stars() {
    const stars = useMemo(() => Array.from({ length: 70 }, (_, i) => ({
        size: i % 6 === 0 ? 2 : 1,
        left: ((i * 137.508) % 100).toFixed(3),
        top:  ((i * 97.314)  % 96).toFixed(3),
        op:   (0.12 + (i % 8) * 0.07).toFixed(2),
    })), []);
    return (
        <>
            {stars.map((s, i) => (
                <div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                        width:  s.size,
                        height: s.size,
                        left:   `${s.left}%`,
                        top:    `${s.top}%`,
                        backgroundColor: `rgba(255,255,255,${s.op})`,
                    }}
                />
            ))}
        </>
    );
});

const DURATION   = 90;
const SHIP_FLOOR = 68;

export default function TypingGame({ mode, playStyle, category = 'mixed', roundSeconds = 30, onGameOver, onExit }) {
    const color    = LANG_COLOR[mode] || '#00E572';

    const arenaRef       = useRef(null);
    const inputRef       = useRef(null);
    const frameRef       = useRef(null);
    const alienIdRef     = useRef(0);
    const pausedRef      = useRef(false);
    const alienRef       = useRef([]);
    const arenaWRef      = useRef(window.innerWidth);
    const arenaHRef      = useRef(window.innerHeight);
    const healthRef      = useRef(3);
    const scoreRef       = useRef(0);
    const defeatedRef    = useRef(0);
    const errorsRef      = useRef(0);
    const totalRef       = useRef(0);
    const timeRef        = useRef(DURATION);
    const gameOverCalled = useRef(false);
    const streakRef      = useRef(0);
    const bestStreakRef  = useRef(0);
    const lockedRef      = useRef(null);
    const boomIdRef      = useRef(0);
    const gameOverRef    = useRef(null);
    const effectsRef     = useRef({ shield: 0, freeze: 0, slowmo: 0 });
    const chargesRef     = useRef({ shield: 1, freeze: 1, slowmo: 1 });
    const planRef        = useRef(roundPlan(mode, category));

    const [arenaW,     setArenaW]     = useState(window.innerWidth);
    const [,           setArenaH]     = useState(window.innerHeight);
    const [aliens,     setAliens]     = useState([]);
    const [inputVal,   setInputVal]   = useState('');
    const [score,      setScore]      = useState(0);
    const [health,     setHealth]     = useState(3);
    const [defeated,   setDefeated]   = useState(0);
    const [errors,     setErrors]     = useState(0);
    const [totalTyped, setTotalTyped] = useState(0);
    const [timeLeft,   setTimeLeft]   = useState(DURATION);
    const [paused,     setPaused]     = useState(false);
    const [laser,      setLaser]      = useState(null);
    const [shipX,      setShipX]      = useState(0);
    const [streak,     setStreak]     = useState(0);
    const [booms,      setBooms]      = useState([]);
    const [hitFlash,   setHitFlash]   = useState(0);
    const [muted,      setMuted]      = useState(() => getSoundPrefs().muted);
    const [effects,    setEffects]    = useState({ shield: 0, freeze: 0, slowmo: 0 });
    const [charges,    setCharges]    = useState(chargesRef.current);
    const [round,      setRound]      = useState(null);
    const [shieldHit,  setShieldHit]  = useState(0);

    useEffect(() => onSoundPrefs((prefs) => setMuted(prefs.muted)), []);

    useEffect(() => {
        const obs = new ResizeObserver(entries => {
            const { width, height } = entries[0].contentRect;
            arenaWRef.current = width;
            arenaHRef.current = height;
            setArenaW(width);
            setArenaH(height);
        });
        if (arenaRef.current) obs.observe(arenaRef.current);
        return () => obs.disconnect();
    }, []);

    useEffect(() => {
        const pace = PACE[TIER[mode] || 'medium'];
        const plan = roundPlan(mode, category);
        const roundMs = roundSeconds * 1000;
        const total = Math.ceil(DURATION / roundSeconds);
        planRef.current = plan;
        let sinceSpawn = 0;
        let elapsed = 0;
        let current = -1;

        const rampFor = (index) => Math.min(1 + index * SPEED_STEP, SPEED_LIMIT);

        function startRound(index) {
            current = index;
            sinceSpawn = 0;
            setRound({ index, total, info: plan[index % plan.length] });
            if (index > 0) sfx.round();
        }

        function spawnOne() {
            const alive = alienRef.current.filter(a => a.alive && !a.hit);
            if (alive.length >= pace.maxAlive) return;
            const spot = pickLane(alive, arenaWRef.current);
            if (!spot) return;
            const { snippet, lang } = pickSnippet(mode, plan[current % plan.length].key);
            const alien = makeAlien(alienIdRef.current++, snippet, lang, spot, arenaHRef.current - SHIP_FLOOR, pace, rampFor(current));
            alienRef.current = [...alienRef.current, alien];
            setAliens([...alienRef.current]);
            sinceSpawn = 0;
        }

        startRound(0);
        const iv = setInterval(() => {
            if (pausedRef.current || timeRef.current <= 0) return;
            elapsed += 250;
            const index = Math.min(Math.floor(elapsed / roundMs), total - 1);
            if (index !== current) startRound(index);
            const breakMs = current === 0 ? FIRST_BREAK : ROUND_BREAK;
            if (elapsed - current * roundMs < breakMs) return;
            if (effectsRef.current.freeze > 0) return;
            sinceSpawn += effectsRef.current.slowmo > 0 ? 250 * SLOWMO_SPEED : 250;
            const empty = !alienRef.current.some(a => a.alive && !a.hit);
            if (sinceSpawn >= pace.every / rampFor(current) || (empty && sinceSpawn >= 700)) spawnOne();
        }, 250);
        return () => clearInterval(iv);
    }, [mode, category, roundSeconds]);

    useEffect(() => {
        let last = performance.now();
        function tick(now) {
            frameRef.current = requestAnimationFrame(tick);
            if (pausedRef.current || timeRef.current <= 0) return;
            const dt      = Math.min(now - last, 50);
            last = now;
            const shipY   = arenaHRef.current - SHIP_FLOOR;
            const fx      = effectsRef.current;
            const speed   = fx.freeze > 0 ? 0 : fx.slowmo > 0 ? SLOWMO_SPEED : 1;
            fx.freeze = Math.max(0, fx.freeze - dt);
            fx.slowmo = Math.max(0, fx.slowmo - dt);
            fx.shield = Math.max(0, fx.shield - dt);
            let crossed = 0;

            alienRef.current = alienRef.current.map(a => {
                if (!a.alive || a.hit) return a;
                const ny = a.y + a.vy * speed * (dt / 16);
                if (ny > shipY) { crossed += 1; return { ...a, alive: false }; }
                return { ...a, y: ny };
            });

            if (crossed > 0 && fx.shield > 0) {
                fx.shield = 0;
                crossed -= 1;
                sfx.shieldBreak();
                setShieldHit(n => n + 1);
            }

            if (crossed > 0) {
                const h = Math.max(0, healthRef.current - crossed);
                healthRef.current = h;
                setHealth(h);
                sfx.hit();
                setHitFlash(f => f + 1);
                breakStreak();
                if (h <= 0 && !gameOverCalled.current) {
                    gameOverCalled.current = true;
                    gameOverRef.current();
                }
            }

            setEffects({ ...fx });
            setAliens([...alienRef.current]);
        }
        frameRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frameRef.current);
    }, []);

    useEffect(() => {
        const iv = setInterval(() => {
            if (pausedRef.current) return;
            timeRef.current -= 1;
            setTimeLeft(timeRef.current);
            if (timeRef.current <= 0 && !gameOverCalled.current) {
                gameOverCalled.current = true;
                gameOverRef.current();
            }
        }, 1000);
        return () => clearInterval(iv);
    }, []);

    useEffect(() => { inputRef.current?.focus(); }, []);

    const doGameOver = useCallback(() => {
        if (healthRef.current <= 0) sfx.gameOver();
        else sfx.victory();
        const elapsed = DURATION - timeRef.current;
        const wpm     = elapsed > 0 ? Math.round((totalRef.current / 5) / (elapsed / 60)) : 0;
        const acc     = totalRef.current + errorsRef.current > 0
            ? Math.round((totalRef.current / (totalRef.current + errorsRef.current)) * 100)
            : 100;
        onGameOver({
            score:       scoreRef.current,
            wpm:         Math.max(0, wpm),
            accuracy:    acc,
            defeated:    defeatedRef.current,
            errors:      errorsRef.current,
            chars:       totalRef.current,
            bestStreak:  bestStreakRef.current,
            timeElapsed: elapsed,
            rank:        getRank(Math.max(0, wpm), playStyle),
            mode,
            playStyle,
            category:    planRef.current.length === 1 ? planRef.current[0].label : 'Mixed',
        });
    }, [mode, playStyle, onGameOver]);

    useEffect(() => {
        gameOverRef.current = doGameOver;
    }, [doGameOver]);

    function breakStreak() {
        if (streakRef.current >= STREAK_START) sfx.streakLost();
        streakRef.current = 0;
        setStreak(0);
    }

    function rechargeSkill() {
        const owned = chargesRef.current;
        const key = [...SKILL_ORDER].sort((a, b) => owned[a] - owned[b])[0];
        if (owned[key] >= SKILL_MAX) return;
        chargesRef.current = { ...owned, [key]: owned[key] + 1 };
        setCharges(chargesRef.current);
        toast({
            kind: 'streak',
            icon: SKILLS[key].icon,
            label: 'SKILL CHARGED',
            title: `+1 ${SKILLS[key].name}`,
            text: `Press ${SKILLS[key].hint} or tap it to use.`,
            duration: 2400,
        });
    }

    function activateSkill(key) {
        if (pausedRef.current || timeRef.current <= 0 || gameOverCalled.current) return;
        const fx = effectsRef.current;
        if (chargesRef.current[key] <= 0 || fx[key] > 0) {
            sfx.miss();
            return;
        }
        chargesRef.current = { ...chargesRef.current, [key]: chargesRef.current[key] - 1 };
        setCharges(chargesRef.current);
        fx[key] = SKILLS[key].seconds * 1000;
        setEffects({ ...fx });
        sfx.skill(key);
        inputRef.current?.focus();
    }

    const skillRef = useRef(activateSkill);
    useEffect(() => {
        skillRef.current = activateSkill;
    });

    function addKill() {
        streakRef.current += 1;
        bestStreakRef.current = Math.max(bestStreakRef.current, streakRef.current);
        setStreak(streakRef.current);
        const s = streakRef.current;
        if (s % RECHARGE_EVERY === 0) rechargeSkill();
        if (s >= STREAK_START && s % 5 === 0) {
            sfx.streak(s / 5);
            toast({
                kind: 'streak',
                icon: '🔥',
                label: s === STREAK_START ? 'STREAK MODE' : 'COMBO',
                title: `STREAK ×${s}`,
                text: s === STREAK_START ? 'Score doubled until you miss a key.' : `${s} clean kills in a row.`,
                duration: 2200,
            });
        }
    }

    function handleInput(e) {
        const val = e.target.value;
        const typedMore = val.length > inputVal.length;
        setInputVal(val);

        const live   = alienRef.current.filter(a => a.alive && !a.hit);
        const target = live
            .filter(a => a.snippet.startsWith(val))
            .sort((a, b) => b.y - a.y)[0];

        if (!target) {
            if (typedMore) {
                errorsRef.current++;
                setErrors(errorsRef.current);
                sfx.miss();
                breakStreak();
            }
            return;
        }

        if (target.id !== lockedRef.current) {
            lockedRef.current = target.id;
            sfx.lock();
        } else if (typedMore) {
            sfx.key();
        }

        alienRef.current = alienRef.current.map(a =>
            a.id === target.id ? { ...a, typed: val } : a
        );
        setAliens([...alienRef.current]);
        if (typedMore) {
            totalRef.current++;
            setTotalTyped(totalRef.current);
        }
        setShipX(target.x);

        if (val === target.snippet) {
            const shipY     = arenaHRef.current - SHIP_FLOOR;
            const shotColor = LANG_COLOR[target.lang] || color;
            setLaser({
                from:  { x: target.x, y: shipY },
                to:    { x: target.x, y: target.y + 20 },
                color: shotColor,
            });
            setTimeout(() => setLaser(null), 200);
            sfx.shoot();
            sfx.explode();
            lockedRef.current = null;

            const boom = { id: boomIdRef.current++, x: target.x, y: target.y, color: shotColor };
            setBooms(list => [...list, boom]);
            setTimeout(() => setBooms(list => list.filter(b => b.id !== boom.id)), 520);

            alienRef.current = alienRef.current.map(a =>
                a.id === target.id ? { ...a, hit: true, alive: false } : a
            );
            setTimeout(() => {
                alienRef.current = alienRef.current.filter(a => a.id !== target.id);
                setAliens([...alienRef.current]);
            }, 300);

            addKill();
            const multiplier = streakRef.current >= STREAK_START ? 2 : 1;
            scoreRef.current += Math.ceil(target.snippet.length * 12) * multiplier;
            defeatedRef.current++;
            setScore(scoreRef.current);
            setDefeated(defeatedRef.current);
            setInputVal('');
        }
    }

    function togglePause() {
        if (timeRef.current <= 0 || gameOverCalled.current) return;
        pausedRef.current = !pausedRef.current;
        setPaused(pausedRef.current);
        if (pausedRef.current) sfx.pause();
        else {
            sfx.resume();
            inputRef.current?.focus();
        }
    }

    const toggleRef = useRef(togglePause);
    toggleRef.current = togglePause;

    useEffect(() => {
        const onKey = (e) => {
            if (SKILL_KEYS[e.key]) {
                e.preventDefault();
                skillRef.current(SKILL_KEYS[e.key]);
                return;
            }
            if (e.key !== 'Escape') return;
            e.preventDefault();
            toggleRef.current();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    const toggleMute = () => setSoundPrefs({ muted: !muted });

    const elapsed     = DURATION - timeLeft;
    const liveWpm     = elapsed > 5 ? Math.round((totalTyped / 5) / (elapsed / 60)) : 0;
    const accuracy    = totalTyped + errors > 0
        ? Math.round((totalTyped / (totalTyped + errors)) * 100) : 100;
    const minutes     = Math.floor(timeLeft / 60);
    const secs        = String(timeLeft % 60).padStart(2, '0');
    const shipCenterX = shipX || arenaW / 2;

    const activeTargetId = (() => {
        if (!inputVal) return null;
        const live = alienRef.current.filter(x => x.alive && !x.hit);
        return live
            .filter(x => x.snippet.startsWith(inputVal))
            .sort((a, b) => b.y - a.y)[0]?.id ?? null;
    })();

    return (
        <div
            className="fixed inset-0 flex flex-col font-mono select-none"
            style={{ backgroundColor: '#04070e', color: '#e2e8f0' }}
        >
            <div
                className="flex items-center justify-between gap-3 px-3 sm:px-6 py-2 text-[10px] sm:text-[11px] tracking-widest shrink-0"
                style={{ backgroundColor: '#070b12', borderBottom: `1px solid ${color}35` }}
            >
                <div className="flex items-center gap-3 sm:gap-5 min-w-0 overflow-hidden">
                    <span className="hidden md:inline-flex"><Logo size={13} className="is-on-dark" /></span>
                    <span className="flex items-baseline gap-1.5">
                        <span className="hidden sm:inline opacity-50">SCORE</span>
                        <span className="font-bold text-sm sm:text-base tabular-nums" style={{ color }}>{score.toLocaleString()}</span>
                    </span>
                    <span className="flex items-baseline gap-1.5">
                        <span className="opacity-50">WPM</span>
                        <span className="font-bold tabular-nums">{liveWpm}</span>
                    </span>
                    <span className="hidden sm:flex items-baseline gap-1.5">
                        <span className="opacity-50">ACC</span>
                        <span className="font-bold tabular-nums">{accuracy}%</span>
                    </span>
                    <span className="hidden sm:flex items-baseline gap-1.5">
                        <span className="opacity-50">KILLS</span>
                        <span className="font-bold tabular-nums" style={{ color }}>{defeated}</span>
                    </span>
                    {round && (
                        <span className="hidden lg:flex items-baseline gap-1.5">
                            <span className="opacity-50">ROUND</span>
                            <span className="font-bold tabular-nums">{round.index + 1}/{round.total}</span>
                            <span style={{ color }}>{round.info.label}</span>
                        </span>
                    )}
                    {streak >= STREAK_START && (
                        <span className="tc-streak-pill shrink-0" key={streak}>
                            🔥 ×{streak}<span className="hidden sm:inline opacity-70"> · 2× PTS</span>
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                    <div className="flex gap-1" title="Lives">
                        {[0, 1, 2].map(i => (
                            <div
                                key={i}
                                className="w-3.5 h-3 sm:w-5 sm:h-4 rounded-sm transition-all duration-300"
                                style={{
                                    backgroundColor: i < health ? color : 'rgba(255,255,255,0.08)',
                                    boxShadow:       i < health ? `0 0 8px ${color}` : 'none',
                                }}
                            />
                        ))}
                    </div>
                    <span
                        className="px-2 sm:px-3 py-1 rounded font-bold tabular-nums text-xs"
                        style={{
                            color:  timeLeft <= 15 ? '#ef4444' : color,
                            border: `1px solid ${(timeLeft <= 15 ? '#ef4444' : color)}55`,
                            minWidth: 48,
                            textAlign: 'center',
                        }}
                    >
                        {minutes}:{secs}
                    </span>
                    <button
                        onClick={toggleMute}
                        title={muted ? 'Turn sound on' : 'Mute sound'}
                        aria-label={muted ? 'Turn sound on' : 'Mute sound'}
                        className="hidden sm:inline-block px-2 sm:px-3 py-1 rounded text-[10px] tracking-widest transition-colors"
                        style={{ color: muted ? '#ef4444' : 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.12)' }}
                    >
                        {muted ? '🔇' : '🔊'}
                    </button>
                    <button
                        onClick={togglePause}
                        aria-label={paused ? 'Resume' : 'Pause'}
                        className="px-2 sm:px-3 py-1 rounded text-[10px] tracking-widest transition-colors"
                        style={{ color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.12)' }}
                    >
                        {paused ? '▶' : '⏸'}<span className="hidden sm:inline">{paused ? ' RESUME' : ' PAUSE'}</span>
                    </button>
                </div>
            </div>
            <div
                ref={arenaRef}
                className="relative flex-grow overflow-hidden cursor-text"
                style={{
                    backgroundImage: `radial-gradient(${color}06 1px, transparent 1px)`,
                    backgroundSize: '32px 32px',
                }}
                onClick={() => inputRef.current?.focus()}
            >
                <Stars />
                <div
                    className="absolute left-0 right-0 h-px"
                    style={{ bottom: SHIP_FLOOR - 10, backgroundColor: `${color}28` }}
                />

                {aliens.map(a => {
                    if (a.hit) return null;
                    const alienColor = LANG_COLOR[a.lang] || color;
                    return (
                        <Alien
                            key={a.id}
                            alien={a}
                            color={alienColor}
                            isTarget={a.id === activeTargetId}
                        />
                    );
                })}
                {laser && (
                    <Laser from={laser.from} to={laser.to} color={laser.color} />
                )}

                {booms.map(b => (
                    <Explosion key={b.id} x={b.x} y={b.y} color={b.color} />
                ))}

                {hitFlash > 0 && <div key={hitFlash} className="tc-hit-flash" />}

                {effects.freeze > 0 && <div className="tc-fx tc-fx-freeze" />}
                {effects.slowmo > 0 && effects.freeze <= 0 && <div className="tc-fx tc-fx-slowmo" />}

                {round && (
                    <div key={round.index} className="tc-round-banner">
                        <span className="tc-round-num">ROUND {round.index + 1} OF {round.total}</span>
                        <strong style={{ color }}>{round.info.label}</strong>
                        <span className="tc-round-hint">{round.info.hint}</span>
                    </div>
                )}

                <div
                    className="absolute"
                    style={{
                        left:       shipCenterX,
                        bottom:     14,
                        transform:  'translateX(-50%)',
                        transition: 'left 0.12s ease-out',
                        zIndex:     15,
                    }}
                >
                    {effects.shield > 0 && <span className="tc-shield" />}
                    {shieldHit > 0 && <span key={shieldHit} className="tc-shield-pop" />}
                    <svg width="42" height="48" viewBox="0 0 42 48" fill="none">
                        <ellipse cx="21" cy="45" rx="7" ry="3.5" fill={color} opacity="0.28"/>
                        <path d="M21 2 L37 36 L21 30 L5 36 Z" fill={color} opacity="0.92"/>
                        <ellipse cx="21" cy="18" rx="6" ry="7" fill="#04070e" stroke={color} strokeWidth="1.5"/>
                        <path d="M5 36 L0 46 L14 40 Z"  fill={color} opacity="0.55"/>
                        <path d="M37 36 L42 46 L28 40 Z" fill={color} opacity="0.55"/>
                        <ellipse cx="21" cy="45" rx="4" ry="2" fill={color} opacity="0.65"/>
                    </svg>
                </div>

                {paused && (
                    <div
                        className="absolute inset-0 flex flex-col items-center justify-center gap-6"
                        style={{
                            backgroundColor: 'rgba(4,7,14,0.88)',
                            zIndex: 30,
                            backdropFilter: 'blur(6px)',
                        }}
                    >
                        <div className="text-4xl sm:text-5xl font-black tracking-widest" style={{ color }}>
                            ⏸ PAUSED
                        </div>
                        <button
                            onClick={togglePause}
                            className="font-mono text-sm tracking-widest px-10 py-3 rounded-lg font-bold mt-2"
                            style={{ backgroundColor: color, color: '#04070e' }}
                        >
                            ▶ RESUME
                        </button>
                        <div className="tc-skill-legend">
                            {SKILL_ORDER.map((key) => (
                                <span key={key}>
                                    <kbd>{SKILLS[key].hint}</kbd> {SKILLS[key].icon} {SKILLS[key].name}: {SKILLS[key].text.toLowerCase()}
                                </span>
                            ))}
                        </div>
                        <button
                            onClick={toggleMute}
                            className="font-mono text-xs tracking-widest px-8 py-2.5 rounded"
                            style={{ color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)' }}
                        >
                            {muted ? '🔇 SOUND OFF' : '🔊 SOUND ON'}
                        </button>
                        <button
                            onClick={onExit}
                            className="font-mono text-xs tracking-widest px-8 py-2.5 rounded"
                            style={{ color: '#ef4444', border: '1px solid #ef444460' }}
                        >
                            QUIT
                        </button>
                    </div>
                )}
            </div>

            <div
                className="flex items-center gap-3 px-3 sm:px-6 py-3 shrink-0"
                style={{ backgroundColor: '#070b12', borderTop: `1px solid ${color}35` }}
            >
                <span className="text-base opacity-40">{'>'}</span>
                <input
                    ref={inputRef}
                    value={inputVal}
                    onChange={handleInput}
                    disabled={paused || timeLeft <= 0}
                    placeholder="type an alien's code..."
                    className="flex-grow min-w-0 bg-transparent outline-none text-base sm:text-sm tracking-wide"
                    style={{
                        color: '#e2e8f0',
                        caretColor: color,
                        fontFamily: "'JetBrains Mono', monospace",
                    }}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck={false}
                />
                <div className="flex items-center gap-1.5 shrink-0">
                    {SKILL_ORDER.map((key) => {
                        const skill = SKILLS[key];
                        const active = effects[key] > 0;
                        const left = charges[key];
                        return (
                            <button
                                key={key}
                                type="button"
                                onPointerDown={(e) => e.preventDefault()}
                                onClick={() => activateSkill(key)}
                                disabled={paused}
                                title={`${skill.name} (${skill.hint}): ${skill.text}`}
                                aria-label={`${skill.name}, ${left} left`}
                                className={`tc-skill ${active ? 'is-active' : ''} ${!active && left <= 0 ? 'is-empty' : ''}`}
                                style={{ '--skill': skill.color }}
                            >
                                <span aria-hidden="true">{skill.icon}</span>
                                <span className="tc-skill-count">{active ? `${Math.ceil(effects[key] / 1000)}s` : left}</span>
                                <kbd className="hidden lg:inline">{skill.hint}</kbd>
                            </button>
                        );
                    })}
                </div>
                <div
                    className="hidden xl:flex items-center gap-3 text-[10px] tracking-widest shrink-0"
                    style={{ color: 'rgba(255,255,255,0.3)' }}
                >
                    <span style={{ color }}>{mode}</span>
                    <span>•</span>
                    <span>{playStyle === 'ranked' ? 'RANKED' : 'PRACTICE'}</span>
                    <span>•</span>
                    <span>ESC to pause</span>
                </div>
                <button
                    onClick={onExit}
                    className="px-3 py-1.5 rounded text-[10px] tracking-widest shrink-0 transition-colors hover:text-red-400"
                    style={{ color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.12)' }}
                >
                    EXIT
                </button>
            </div>
        </div>
    );
}
