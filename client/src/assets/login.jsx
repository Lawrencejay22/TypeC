import { useEffect, useState } from "react";
import { post } from "../api.js";
import { useLiveStats, compact } from "../live.js";

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

const inputStyle = {
    backgroundColor: 'var(--bg-input)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
};
const inputClass = "w-full rounded px-4 py-3.5 focus:outline-none transition-colors placeholder:opacity-30 text-sm";

function passwordScore(value) {
    if (!value) return 0;
    let score = 0;
    if (value.length >= 8) score++;
    if (value.length >= 12) score++;
    if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
    if (/\d/.test(value) && /[^a-zA-Z0-9]/.test(value)) score++;
    if (!/[a-zA-Z]/.test(value) || !/\d/.test(value)) score = Math.min(score, 1);
    return Math.max(1, score);
}

const STRENGTH = [
    { label: '', color: 'var(--border-color)' },
    { label: 'WEAK', color: '#ef4444' },
    { label: 'FAIR', color: '#f97316' },
    { label: 'GOOD', color: '#eab308' },
    { label: 'STRONG', color: 'var(--accent)' },
];

function Field({ label, aside, children }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <label className="block tracking-widest" style={{ color: 'var(--text-muted)' }}>{'>'} {label}</label>
                {aside}
            </div>
            {children}
        </div>
    );
}

function PasswordInput({ value, onChange, placeholder, autoComplete }) {
    const [show, setShow] = useState(false);
    return (
        <div className="relative">
            <input
                type={show ? 'text' : 'password'}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                autoComplete={autoComplete}
                maxLength={72}
                className={inputClass + ' pr-12 tracking-widest'}
                style={inputStyle}
            />
            <button
                type="button"
                onClick={() => setShow(!show)}
                aria-label={show ? 'Hide password' : 'Show password'}
                className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: 'var(--text-faint)' }}
            >
                {show ? <EyeOpen /> : <EyeOff />}
            </button>
        </div>
    );
}

function Checkbox({ checked, onChange, children }) {
    return (
        <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
            <span
                className="w-3.5 h-3.5 rounded-sm flex items-center justify-center transition-colors shrink-0"
                style={checked
                    ? { backgroundColor: '#2de06a', border: '1px solid #2de06a' }
                    : { border: '1px solid var(--border-color)' }
                }
            >
                {checked && (
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="#ffffff">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </span>
            <span>{children}</span>
        </label>
    );
}

function Notice({ kind, children }) {
    if (!children) return null;
    const isError = kind === 'error';
    return (
        <div
            role={isError ? 'alert' : 'status'}
            className="rounded px-3 py-2.5 text-[11px] leading-relaxed"
            style={isError
                ? { color: '#f87171', backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)' }
                : { color: 'var(--accent)', backgroundColor: 'var(--accent-dim)', border: '1px solid var(--accent-border)' }
            }
        >
            {children}
        </div>
    );
}

function useCooldown(initial = 0) {
    const [left, setLeft] = useState(initial);
    useEffect(() => {
        if (left <= 0) return;
        const t = setTimeout(() => setLeft(left - 1), 1000);
        return () => clearTimeout(t);
    }, [left]);
    return [left, () => setLeft(60)];
}

function CodeStep({ title, subtitle, email, purpose, busy, error, info, onSubmit, onResend, onBack, extra }) {
    const [code, setCode] = useState('');
    const [left, restart] = useCooldown(60);

    const submit = (e) => {
        e.preventDefault();
        onSubmit(code);
    };

    const resend = async () => {
        if (left > 0) return;
        const ok = await onResend(purpose);
        if (ok) restart();
    };

    return (
        <form className="space-y-4 font-mono text-[11px]" onSubmit={submit} noValidate>
            <div className="mb-2">
                <h2 className="text-lg font-bold flex items-center gap-3 tracking-widest uppercase" style={{ color: 'var(--text-primary)' }}>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
                    {title}
                </h2>
                <p className="text-[11px] mt-2" style={{ color: 'var(--text-faint)' }}>
                    {subtitle} <span style={{ color: 'var(--text-primary)' }}>{email}</span>
                </p>
            </div>

            <Notice kind="error">{error}</Notice>
            <Notice kind="info">{info}</Notice>

            <Field label="6-DIGIT CODE">
                <input
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    autoFocus
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className={inputClass + ' text-center text-2xl tracking-[0.6em] font-bold'}
                    style={inputStyle}
                />
            </Field>

            {extra}

            <button
                type="submit"
                disabled={busy || code.length !== 6}
                className="tc-arena-btn w-full font-bold text-xs py-3.5 rounded tracking-widest mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {busy ? 'CHECKING...' : 'CONFIRM CODE →'}
            </button>

            <div className="flex justify-between items-center text-[10px] pt-1" style={{ color: 'var(--text-faint)' }}>
                <button type="button" onClick={onBack} className="hover:opacity-80">← back</button>
                {onResend && (
                    <button
                        type="button"
                        onClick={resend}
                        disabled={left > 0}
                        style={{ color: left > 0 ? 'var(--text-faint)' : 'var(--accent)' }}
                    >
                        {left > 0 ? `resend code in ${left}s` : 'resend code'}
                    </button>
                )}
            </div>
        </form>
    );
}

export default function Login({ onAuthed, onGuest }) {
    const stats = useLiveStats();

    const [step,     setStep]     = useState('signin');
    const [busy,     setBusy]     = useState(false);
    const [error,    setError]    = useState('');
    const [info,     setInfo]     = useState('');
    const [pending,  setPending]  = useState({ email: '', remember: false });

    const [identifier, setIdentifier] = useState('');
    const [username,   setUsername]   = useState('');
    const [email,      setEmail]      = useState('');
    const [password,   setPassword]   = useState('');
    const [confirm,    setConfirm]    = useState('');
    const [remember,   setRemember]   = useState(true);
    const [terms,      setTerms]      = useState(false);
    const [newPass,    setNewPass]    = useState('');

    const isLogin = step === 'signin';
    const isSignup = step === 'signup';
    const strength = STRENGTH[passwordScore(password)];

    const go = (next) => {
        setError('');
        setInfo('');
        setStep(next);
    };

    async function run(task) {
        setBusy(true);
        setError('');
        try {
            await task();
        } catch (err) {
            setError(err.message);
            if (err.data?.step === 'verify') {
                setPending({ email: err.data.email, remember });
                setInfo(err.data.message);
                setError('');
                setStep('verify');
            }
        } finally {
            setBusy(false);
        }
    }

    const finish = (data) => {
        if (data.step === 'done') onAuthed(data.user);
    };

    const handleSignIn = (e) => {
        e.preventDefault();
        run(async () => {
            const data = await post('/auth/login', { identifier: identifier.trim(), password, remember });
            if (data.step === 'two-factor') {
                setPending({ email: data.email, remember });
                setInfo(data.message);
                setStep('two-factor');
                return;
            }
            finish(data);
        });
    };

    const handleSignUp = (e) => {
        e.preventDefault();
        if (password !== confirm) {
            setError("Passwords don't match.");
            return;
        }
        if (!terms) {
            setError('Please accept the Terms and Privacy Policy.');
            return;
        }
        run(async () => {
            const data = await post('/auth/register', { username: username.trim(), email: email.trim(), password, acceptTerms: true });
            setPending({ email: data.email, remember: true });
            setInfo(data.message);
            setStep('verify');
        });
    };

    const handleVerify = (code) => run(async () => {
        finish(await post('/auth/verify', { email: pending.email, code }));
    });

    const handleTwoFactor = (code) => run(async () => {
        finish(await post('/auth/login/two-factor', { email: pending.email, code, remember: pending.remember }));
    });

    const handleForgot = (e) => {
        e.preventDefault();
        run(async () => {
            const data = await post('/auth/forgot', { email: email.trim() });
            setPending({ email: email.trim().toLowerCase(), remember: false });
            setInfo(data.message);
            setStep('reset');
        });
    };

    const handleReset = (code) => run(async () => {
        const data = await post('/auth/reset', { email: pending.email, code, password: newPass });
        setPassword('');
        setNewPass('');
        setIdentifier(pending.email);
        setStep('signin');
        setInfo(data.message);
    });

    const resend = async (purpose) => {
        try {
            const data = await post(purpose === 'reset' ? '/auth/forgot' : '/auth/resend', { email: pending.email, purpose });
            setError('');
            setInfo(data.message);
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        }
    };

    const backToSignIn = () => go('signin');

    let card;

    if (step === 'verify') {
        card = (
            <CodeStep
                key="verify"
                title="VERIFY EMAIL"
                subtitle="Enter the code we sent to"
                email={pending.email}
                purpose="verify"
                busy={busy}
                error={error}
                info={info}
                onSubmit={handleVerify}
                onResend={resend}
                onBack={backToSignIn}
            />
        );
    } else if (step === 'two-factor') {
        card = (
            <CodeStep
                key="two-factor"
                title="TWO-FACTOR"
                subtitle="Enter the sign-in code we sent to"
                email={pending.email}
                purpose="login"
                busy={busy}
                error={error}
                info={info}
                onSubmit={handleTwoFactor}
                onResend={resend}
                onBack={backToSignIn}
            />
        );
    } else if (step === 'reset') {
        card = (
            <CodeStep
                key="reset"
                title="NEW PASSWORD"
                subtitle="Enter the reset code we sent to"
                email={pending.email}
                purpose="reset"
                busy={busy}
                error={error}
                info={info}
                onSubmit={handleReset}
                onResend={resend}
                onBack={backToSignIn}
                extra={(
                    <Field label="NEW PASSWORD">
                        <PasswordInput value={newPass} onChange={setNewPass} placeholder="at least 8 characters" autoComplete="new-password" />
                    </Field>
                )}
            />
        );
    } else if (step === 'forgot') {
        card = (
            <form className="space-y-4 font-mono text-[11px]" onSubmit={handleForgot} noValidate>
                <div className="mb-2">
                    <h2 className="text-lg font-bold flex items-center gap-3 tracking-widest uppercase" style={{ color: 'var(--text-primary)' }}>
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
                        RESET PASSWORD
                    </h2>
                    <p className="text-[11px] mt-2" style={{ color: 'var(--text-faint)' }}>
                        We'll email you a code to choose a new password.
                    </p>
                </div>
                <Notice kind="error">{error}</Notice>
                <Field label="EMAIL">
                    <input
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className={inputClass}
                        style={inputStyle}
                    />
                </Field>
                <button
                    type="submit"
                    disabled={busy || !email.trim()}
                    className="tc-arena-btn w-full font-bold text-xs py-3.5 rounded tracking-widest mt-2 disabled:opacity-50"
                >
                    {busy ? 'SENDING...' : 'SEND RESET CODE →'}
                </button>
                <div className="text-[10px] pt-1" style={{ color: 'var(--text-faint)' }}>
                    <button type="button" onClick={backToSignIn} className="hover:opacity-80">← back to sign in</button>
                </div>
            </form>
        );
    } else {
        card = (
            <>
                <div className="flex font-mono text-xs tracking-widest mb-6">
                    {[{ label: 'SIGN IN', val: 'signin' }, { label: 'SIGN UP', val: 'signup' }].map(({ label, val }) => (
                        <button
                            type="button"
                            key={label}
                            onClick={() => go(val)}
                            className="w-1/2 text-center pb-4 cursor-pointer transition-colors"
                            style={
                                step === val
                                    ? { color: 'var(--accent)', borderBottom: '2px solid var(--accent)', fontWeight: 700 }
                                    : { color: 'var(--text-faint)', borderBottom: '1px solid var(--border-color)' }
                            }
                        >
                            {step === val ? `[ ${label} ]` : label}
                        </button>
                    ))}
                </div>

                <div className="mb-6">
                    <h2 className="text-lg font-bold flex items-center gap-3 tracking-widest uppercase" style={{ color: 'var(--text-primary)' }}>
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
                        {isLogin ? 'SIGN IN' : 'SIGN UP'}
                    </h2>
                    <p className="text-[11px] mt-2 font-mono" style={{ color: 'var(--text-faint)' }}>
                        {isLogin
                            ? 'Welcome back.'
                            : 'Free account. Your scores get saved.'}
                    </p>
                </div>

                <form className="space-y-4 font-mono text-[11px]" onSubmit={isLogin ? handleSignIn : handleSignUp} noValidate>
                    <Notice kind="error">{error}</Notice>
                    <Notice kind="info">{info}</Notice>

                    {isSignup && (
                        <Field label="USERNAME">
                            <input
                                type="text"
                                autoComplete="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 20))}
                                placeholder="syntax_striker"
                                className={inputClass}
                                style={inputStyle}
                            />
                        </Field>
                    )}

                    <Field label={isLogin ? 'USERNAME OR EMAIL' : 'EMAIL'}>
                        <input
                            type={isLogin ? 'text' : 'email'}
                            autoComplete={isLogin ? 'username' : 'email'}
                            value={isLogin ? identifier : email}
                            onChange={(e) => (isLogin ? setIdentifier(e.target.value) : setEmail(e.target.value))}
                            placeholder={isLogin ? 'typist@domain.com' : 'dev@domain.com'}
                            maxLength={254}
                            className={inputClass}
                            style={inputStyle}
                        />
                    </Field>

                    <Field
                        label="PASSWORD"
                        aside={isLogin
                            ? <button type="button" onClick={() => go('forgot')} className="text-[10px]" style={{ color: 'var(--accent)' }}>Forgot password?</button>
                            : password && <span className="text-[10px] tracking-widest" style={{ color: strength.color }}>STRENGTH: {strength.label}</span>
                        }
                    >
                        <PasswordInput
                            value={password}
                            onChange={setPassword}
                            placeholder={isLogin ? '••••••••••••' : 'at least 8 characters'}
                            autoComplete={isLogin ? 'current-password' : 'new-password'}
                        />
                        {isSignup && (
                            <div className="flex gap-2 mt-1">
                                {[1, 2, 3, 4].map(i => (
                                    <div
                                        key={i}
                                        className="h-1 flex-1 rounded-full transition-colors"
                                        style={{ backgroundColor: passwordScore(password) >= i ? strength.color : 'var(--border-color)' }}
                                    />
                                ))}
                            </div>
                        )}
                    </Field>

                    {isSignup && (
                        <Field label="CONFIRM PASSWORD">
                            <PasswordInput value={confirm} onChange={setConfirm} placeholder="type it again" autoComplete="new-password" />
                        </Field>
                    )}

                    <div className="flex justify-between items-center text-[10px] py-1" style={{ color: 'var(--text-faint)' }}>
                        {isLogin ? (
                            <Checkbox checked={remember} onChange={setRemember}>REMEMBER ME</Checkbox>
                        ) : (
                            <Checkbox checked={terms} onChange={setTerms}>
                                I agree to the <span style={{ color: 'var(--accent)' }}>Terms</span> &amp; <span style={{ color: 'var(--accent)' }}>Privacy Policy</span>
                            </Checkbox>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={busy}
                        className="tc-arena-btn w-full font-bold text-xs py-3.5 rounded tracking-widest mt-4 disabled:opacity-60 disabled:cursor-wait"
                    >
                        {busy ? 'PLEASE WAIT...' : isLogin ? 'ENTER ARENA →' : 'JOIN THE ARENA →'}
                    </button>

                    {isLogin && (
                        <>
                            <button
                                type="button"
                                onClick={onGuest}
                                className="w-full py-3 rounded tracking-widest flex justify-center gap-2 items-center text-xs mt-2 transition-colors"
                                style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }}
                            >
                                PLAY AS GUEST →
                            </button>
                            <p className="text-center text-[10px] mt-2" style={{ color: 'var(--text-faint)' }}>
                                Guest runs aren't saved.
                            </p>
                        </>
                    )}

                    <div className="text-center pt-4 text-[10px]">
                        <button
                            type="button"
                            className="cursor-pointer transition-colors"
                            style={{ color: 'var(--text-faint)' }}
                            onClick={() => go(isLogin ? 'signup' : 'signin')}
                        >
                            {isLogin ? 'Need an account? ' : 'Already have an account? '}
                            <span style={{ color: 'var(--accent)' }}>{isLogin ? 'Create one here' : 'Sign in here'}</span>
                        </button>
                    </div>
                </form>
            </>
        );
    }

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
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.05]" style={{ color: 'var(--text-primary)' }}>
                        MASTER <br />
                        <span style={{ color: 'var(--accent)' }}>THE</span> <br />
                        KEYBOARD<span style={{ color: 'var(--accent)' }}>.</span>
                    </h1>
                </div>

                <p className="text-sm md:text-base leading-relaxed max-w-md" style={{ color: 'var(--text-muted)' }}>
                    Aliens fall with real code on them. Type the code to shoot them down.
                </p>

                <div className="flex gap-8 sm:gap-12 pt-6" style={{ borderTop: '1px solid var(--border-color)' }}>
                    <div>
                        <div className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{compact(stats?.typists)}</div>
                        <div className="text-[10px] font-mono tracking-widest mt-2 uppercase" style={{ color: 'var(--text-faint)' }}>PLAYERS</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold">
                            <span style={{ color: 'var(--accent)' }}>{stats ? stats.topWpm : '—'}</span>
                            <span className="text-sm ml-1" style={{ color: 'var(--text-faint)' }}>WPM</span>
                        </div>
                        <div className="text-[10px] font-mono tracking-widest mt-2 uppercase" style={{ color: 'var(--text-faint)' }}>TOP SPEED</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{compact(stats?.testsRun)}</div>
                        <div className="text-[10px] font-mono tracking-widest mt-2 uppercase" style={{ color: 'var(--text-faint)' }}>GAMES</div>
                    </div>
                </div>
            </div>

            <div
                className="rounded-xl p-6 lg:p-8 w-full max-w-[420px] shadow-2xl"
                style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
            >
                {card}
            </div>
        </div>
    );
}
