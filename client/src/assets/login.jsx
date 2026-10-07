import { useState } from "react";

function EyeOpen() {
    return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    );
}

function EyeOff() {
    return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 015.058-5.058m1.277-1.277A10.05 10.05 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.05 10.05 0 01-1.277 3.522M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
        </svg>
    );
}

export default function Login({ onLoginSuccess }) {
    const [checkbox,            setCheckbox]            = useState(false);
    const [showPassword,        setShowPassword]        = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLogin,             setIsLogin]             = useState(true);

    const inputStyle = {
        backgroundColor: 'var(--bg-input)',
        border: '1px solid var(--border-color)',
        color: 'var(--text-primary)',
    };
    const inputClass = "w-full rounded px-4 py-3.5 focus:outline-none transition-colors placeholder:opacity-30 text-sm";

    return (
        <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-12 lg:gap-24">

            <div className="flex flex-col gap-6 max-w-xl">

                <div>
                    <div
                        className="inline-flex items-center gap-2 rounded px-3 py-1 mb-4 text-[10px] font-mono tracking-widest"
                        style={{ border: '1px solid var(--accent-border)', color: 'var(--accent)', backgroundColor: 'var(--accent-dim)' }}
                    >
                        <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                        </svg>
                        SPEED &bull; ACCURACY &bull; REAL SYNTAX
                    </div>
                    <h1 className="text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.05]" style={{ color: 'var(--text-primary)' }}>
                        MASTER <br />
                        <span style={{ color: 'var(--accent)' }}>THE</span> <br />
                        KEYBOARD<span style={{ color: 'var(--accent)' }}>.</span>
                    </h1>
                </div>

                <p className="text-sm md:text-base leading-relaxed max-w-md mt-2" style={{ color: 'var(--text-muted)' }}>
                    Benchmark real-world programming syntaxes. Build instinctive muscle memory across production-grade snippets, core system keywords, and structural indentation.
                </p>

                <ul className="space-y-3 mt-4 font-mono text-xs" style={{ color: 'var(--text-primary)' }}>
                    {[
                        'Real-world syntax engine (TypeScript, Python, Rust, Go)',
                        'Competitive ranked 1v1 matchmaking & global leaderboards',
                        'Live per-finger latency metrics & mistake heatmaps',
                        'Custom keybindings & authentic mechanical switch audio',
                    ].map(item => (
                        <li key={item} className="flex items-center gap-3">
                            <span className="font-bold text-base" style={{ color: 'var(--accent)' }}>✓</span>
                            {item}
                        </li>
                    ))}
                </ul>

                <div className="flex gap-12 mt-6 pt-8" style={{ borderTop: '1px solid var(--border-color)' }}>
                    <div>
                        <div className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>84,210</div>
                        <div className="text-[10px] font-mono tracking-widest mt-2 uppercase" style={{ color: 'var(--text-faint)' }}>TYPISTS</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold">
                            <span style={{ color: 'var(--accent)' }}>248</span>
                            <span className="text-sm ml-1" style={{ color: 'var(--text-faint)' }}>WPM</span>
                        </div>
                        <div className="text-[10px] font-mono tracking-widest mt-2 uppercase" style={{ color: 'var(--text-faint)' }}>TOP SPEED</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>4.2M+</div>
                        <div className="text-[10px] font-mono tracking-widest mt-2 uppercase" style={{ color: 'var(--text-faint)' }}>TESTS RUN</div>
                    </div>
                </div>
            </div>

            <div
                className="rounded-xl p-6 lg:p-8 w-full max-w-[420px] shadow-2xl"
                style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
            >
                <div className="flex font-mono text-xs tracking-widest mb-6">
                    {[{ label: 'SIGN IN', val: true }, { label: 'SIGN UP', val: false }].map(({ label, val }) => (
                        <div
                            key={label}
                            onClick={() => setIsLogin(val)}
                            className="w-1/2 text-center pb-4 cursor-pointer transition-colors"
                            style={
                                isLogin === val
                                    ? { color: 'var(--accent)', borderBottom: '2px solid var(--accent)', fontWeight: 700 }
                                    : { color: 'var(--text-faint)', borderBottom: '1px solid var(--border-color)' }
                            }
                        >
                            {isLogin === val ? `[ ${label} ]` : label}
                        </div>
                    ))}
                </div>

                <div className="mb-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold flex items-center gap-3 tracking-widest uppercase" style={{ color: 'var(--text-primary)' }}>
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
                            {isLogin ? 'SIGN IN' : 'SIGN UP'}
                        </h2>
                        {!isLogin && (
                            <span className="text-[10px] font-mono tracking-widest" style={{ color: 'var(--text-faint)' }}>v2.4-stable</span>
                        )}
                    </div>
                    <p className="text-[11px] mt-2 font-mono" style={{ color: 'var(--text-faint)' }}>
                        {isLogin
                            ? 'Access your stats, records, and typed leaderboard position.'
                            : 'Join the developer typing arena and claim your handle.'}
                    </p>
                </div>

                <form className="space-y-4 font-mono text-[11px]">

                    {!isLogin && (
                        <div className="space-y-2">
                            <label className="block tracking-widest" style={{ color: 'var(--text-muted)' }}>{'>'} USERNAME</label>
                            <input type="text" placeholder="syntax_striker" className={inputClass} style={inputStyle} />
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="block tracking-widest" style={{ color: 'var(--text-muted)' }}>
                            {'>'} {isLogin ? 'USERNAME_OR_EMAIL' : 'EMAIL'}
                        </label>
                        <input
                            type={isLogin ? 'text' : 'email'}
                            placeholder={isLogin ? 'typist@domain.com' : 'dev@domain.com'}
                            className={inputClass}
                            style={inputStyle}
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="block tracking-widest" style={{ color: 'var(--text-muted)' }}>{'>'} PASSWORD</label>
                            {isLogin
                                ? <a href="#" className="text-[10px]" style={{ color: 'var(--accent)' }}>Forgot password?</a>
                                : <span className="text-[10px] tracking-widest" style={{ color: 'var(--accent)' }}>STRENGTH: HIGH</span>
                            }
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder={isLogin ? '••••••••••••' : 'secure_password_99'}
                                className={inputClass + ' pr-12 tracking-widest'}
                                style={inputStyle}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                                style={{ color: 'var(--text-faint)' }}
                            >
                                {showPassword ? <EyeOpen /> : <EyeOff />}
                            </button>
                        </div>
                        {!isLogin && (
                            <div className="flex gap-2 mt-1">
                                {[0, 1, 2, 3].map(i => (
                                    <div key={i} className="h-1 flex-1 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
                                ))}
                            </div>
                        )}
                    </div>

                    {!isLogin && (
                        <div className="space-y-2">
                            <label className="block tracking-widest" style={{ color: 'var(--text-muted)' }}>{'>'} CONFIRM_PASSWORD</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="secure_password_99"
                                    className={inputClass + ' pr-12 tracking-widest'}
                                    style={inputStyle}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                                    style={{ color: 'var(--text-faint)' }}
                                >
                                    {showConfirmPassword ? <EyeOpen /> : <EyeOff />}
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between items-center text-[10px] py-1" style={{ color: 'var(--text-faint)' }}>
                        <label className="flex items-center gap-2 cursor-pointer" onClick={() => setCheckbox(!checkbox)}>
                            <div
                                className="w-3.5 h-3.5 rounded-sm flex items-center justify-center transition-colors"
                                style={checkbox
                                    ? { backgroundColor: '#2de06a', border: '1px solid #2de06a' }
                                    : { border: '1px solid var(--border-color)' }
                                }
                            >
                                {checkbox && (
                                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="#ffffff">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                            <span>
                                {isLogin ? 'REMEMBER_SESSION' : (
                                    <>I agree to the{' '}
                                        <span style={{ color: 'var(--accent)' }}>Terms</span> &amp;{' '}
                                        <span style={{ color: 'var(--accent)' }}>Privacy Policy</span>
                                    </>
                                )}
                            </span>
                        </label>
                        <span className="tracking-widest">256-BIT ENCRYPTED</span>
                    </div>

                    <button
                        type="button"
                        onClick={onLoginSuccess}
                        className="tc-arena-btn w-full font-bold text-xs py-3.5 rounded tracking-widest mt-4"
                    >
                        {isLogin ? 'ENTER ARENA →' : 'JOIN THE ARENA →'}
                    </button>

                    {isLogin && (
                        <>
                            <button
                                type="button"
                                onClick={onLoginSuccess}
                                className="w-full py-3 rounded tracking-widest flex justify-center gap-2 items-center text-xs mt-2 transition-colors"
                                style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }}
                            >
                                <span>[</span> PLAY AS GUEST / QUICK PLAY → <span>]</span>
                            </button>
                            <p className="text-center text-[10px] mt-2" style={{ color: 'var(--text-faint)' }}>
                                No account required — jump straight into typing arena
                            </p>
                        </>
                    )}

                    <div className="flex items-center gap-4 py-1 mt-4">
                        <div className="h-px flex-1" style={{ backgroundColor: 'var(--border-color)' }} />
                        <span className="text-[10px] tracking-widest" style={{ color: 'var(--text-faint)' }}>
                            {isLogin ? 'OR QUICK AUTH WITH' : 'OR QUICK REGISTER WITH'}
                        </span>
                        <div className="h-px flex-1" style={{ backgroundColor: 'var(--border-color)' }} />
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={onLoginSuccess}
                            className="flex-1 py-3 rounded transition-colors flex justify-center items-center gap-2 text-xs"
                            style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}
                        >
                            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                            GitHub
                        </button>
                        <button
                            type="button"
                            onClick={onLoginSuccess}
                            className="flex-1 py-3 rounded transition-colors flex justify-center items-center gap-2 text-xs"
                            style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}
                        >
                            <svg viewBox="0 0 24 24" className="w-4 h-4">
                                <path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
                                <path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.565 24 12.255 24z" />
                                <path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 000 11.86l3.98-3.09z" />
                                <path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0 7.565 0 3.515 2.7 1.545 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z" />
                            </svg>
                            Google
                        </button>
                    </div>

                    <div className="text-center pt-2 text-[10px]">
                        {isLogin ? (
                            <span
                                className="cursor-pointer transition-colors"
                                style={{ color: 'var(--text-faint)' }}
                                onClick={() => setIsLogin(false)}
                            >
                                Need an account?{' '}
                                <span style={{ color: 'var(--accent)' }}>Create one here</span>
                            </span>
                        ) : (
                            <span
                                className="cursor-pointer transition-colors"
                                style={{ color: 'var(--text-faint)' }}
                                onClick={() => setIsLogin(true)}
                            >
                                Already have an account?{' '}
                                <span style={{ color: 'var(--accent)' }}>Sign in here</span>
                            </span>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
