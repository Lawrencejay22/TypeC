const STORAGE_KEY = "typec_sound";

function loadPrefs() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && typeof saved.volume === "number") {
      return { muted: Boolean(saved.muted), volume: Math.min(1, Math.max(0, saved.volume)), keys: saved.keys !== false };
    }
  } catch {
    return { muted: false, volume: 0.6, keys: true };
  }
  return { muted: false, volume: 0.6, keys: true };
}

let prefs = loadPrefs();
let ctx = null;
let master = null;
let noiseBuffer = null;
const listeners = new Set();

function savePrefs() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    return;
  }
}

export function getSoundPrefs() {
  return prefs;
}

export function setSoundPrefs(next) {
  prefs = { ...prefs, ...next };
  savePrefs();
  if (master) master.gain.value = prefs.muted ? 0 : prefs.volume;
  listeners.forEach((listener) => listener(prefs));
}

export function onSoundPrefs(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function audio() {
  if (prefs.muted || prefs.volume === 0) return null;
  if (!ctx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    ctx = new AudioCtx();
    master = ctx.createGain();
    master.gain.value = prefs.volume;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function noise() {
  if (!noiseBuffer) {
    noiseBuffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer;
  return src;
}

function envelope(gainNode, at, attack, peak, decay) {
  gainNode.gain.setValueAtTime(0.0001, at);
  gainNode.gain.exponentialRampToValueAtTime(peak, at + attack);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, at + attack + decay);
}

function tone({ type = "sine", from, to = from, at = 0, attack = 0.005, decay = 0.15, peak = 0.3, filter }) {
  const now = ctx.currentTime + at;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, now);
  if (to !== from) osc.frequency.exponentialRampToValueAtTime(to, now + attack + decay);
  envelope(gain, now, attack, peak, decay);
  let node = osc;
  if (filter) {
    const biquad = ctx.createBiquadFilter();
    biquad.type = filter.type;
    biquad.frequency.value = filter.freq;
    osc.connect(biquad);
    node = biquad;
  }
  node.connect(gain).connect(master);
  osc.start(now);
  osc.stop(now + attack + decay + 0.05);
}

function burst({ at = 0, decay = 0.4, peak = 0.5, from = 3000, to = 120, type = "lowpass" }) {
  const now = ctx.currentTime + at;
  const src = noise();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  filter.type = type;
  filter.frequency.setValueAtTime(from, now);
  filter.frequency.exponentialRampToValueAtTime(to, now + decay);
  envelope(gain, now, 0.004, peak, decay);
  src.connect(filter).connect(gain).connect(master);
  src.start(now);
  src.stop(now + decay + 0.05);
}

export const sfx = {
  key() {
    if (!prefs.keys || !audio()) return;
    tone({ type: "square", from: 1800 + Math.random() * 400, decay: 0.025, peak: 0.04, filter: { type: "highpass", freq: 1200 } });
  },

  lock() {
    if (!audio()) return;
    tone({ type: "triangle", from: 660, to: 990, decay: 0.08, peak: 0.12 });
  },

  shoot() {
    if (!audio()) return;
    tone({ type: "sawtooth", from: 1600, to: 180, decay: 0.16, peak: 0.22, filter: { type: "lowpass", freq: 3200 } });
    tone({ type: "square", from: 900, to: 120, at: 0.01, decay: 0.12, peak: 0.08 });
  },

  explode() {
    if (!audio()) return;
    burst({ at: 0.06, decay: 0.45, peak: 0.55, from: 2400, to: 90 });
    tone({ type: "sine", from: 140, to: 40, at: 0.06, decay: 0.35, peak: 0.45 });
  },

  miss() {
    if (!audio()) return;
    tone({ type: "square", from: 150, to: 110, decay: 0.09, peak: 0.12, filter: { type: "lowpass", freq: 900 } });
  },

  hit() {
    if (!audio()) return;
    burst({ decay: 0.6, peak: 0.6, from: 900, to: 60 });
    tone({ type: "sawtooth", from: 220, to: 45, decay: 0.55, peak: 0.3, filter: { type: "lowpass", freq: 700 } });
  },

  streak(level = 1) {
    if (!audio()) return;
    const base = 520 * Math.min(1 + (level - 1) * 0.08, 1.6);
    [1, 1.25, 1.5].forEach((ratio, i) => tone({ type: "triangle", from: base * ratio, at: i * 0.06, decay: 0.12, peak: 0.16 }));
  },

  streakLost() {
    if (!audio()) return;
    tone({ type: "triangle", from: 520, to: 260, decay: 0.25, peak: 0.14 });
  },

  countdown() {
    if (!audio()) return;
    tone({ type: "square", from: 440, decay: 0.12, peak: 0.14, filter: { type: "lowpass", freq: 2000 } });
  },

  launch() {
    if (!audio()) return;
    tone({ type: "square", from: 880, decay: 0.25, peak: 0.16, filter: { type: "lowpass", freq: 2600 } });
    burst({ at: 0.05, decay: 0.8, peak: 0.25, from: 400, to: 3000, type: "bandpass" });
  },

  pause() {
    if (!audio()) return;
    tone({ type: "triangle", from: 600, to: 400, decay: 0.12, peak: 0.12 });
  },

  resume() {
    if (!audio()) return;
    tone({ type: "triangle", from: 400, to: 600, decay: 0.12, peak: 0.12 });
  },

  gameOver() {
    if (!audio()) return;
    [523, 415, 330, 262].forEach((freq, i) =>
      tone({ type: "square", from: freq, at: i * 0.16, decay: 0.22, peak: 0.12, filter: { type: "lowpass", freq: 1800 } })
    );
    burst({ at: 0.6, decay: 0.9, peak: 0.3, from: 800, to: 50 });
  },

  victory() {
    if (!audio()) return;
    [523, 659, 784, 1047].forEach((freq, i) => tone({ type: "triangle", from: freq, at: i * 0.1, decay: 0.3, peak: 0.16 }));
  },

  achievement() {
    if (!audio()) return;
    [784, 988, 1175, 1568].forEach((freq, i) => tone({ type: "sine", from: freq, at: i * 0.08, decay: 0.4, peak: 0.18 }));
    tone({ type: "triangle", from: 2093, at: 0.34, decay: 0.6, peak: 0.08 });
  },

  click() {
    if (!audio()) return;
    tone({ type: "sine", from: 900, to: 700, decay: 0.05, peak: 0.08 });
  },
};
