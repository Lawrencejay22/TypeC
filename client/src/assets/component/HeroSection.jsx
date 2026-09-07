import React from 'react';

export default function HeroSection() {
    return (
        <div className="flex flex-col justify-center h-full pr-8">
            <div className="mb-6">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#0b0e14] border border-[#00E572]/30 rounded text-[#00E572] text-xs font-mono font-medium tracking-wide">
                    <span>⚡</span> SPEED • ACCURACY • REAL SYNTAX
                </span>
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] mb-6 font-sans tracking-tight">
                MASTER<br />
                <span className="text-[#00E572]">THE</span><br />
                KEYBOARD<span className="text-[#00E572]">.</span>
            </h1>

            <p className="text-gray-400 max-w-lg text-lg leading-relaxed mb-8">
                Benchmark real-world programming syntaxes. Build instinctive muscle memory across production-grade snippets, core system keywords, and structural indentation.
            </p>

            <ul className="space-y-4 mb-12 font-mono text-sm text-gray-300">
                <li className="flex items-center gap-3">
                    <CheckIcon />
                    Real-world syntax engine (TypeScript, Python, Rust, Go)
                </li>
                <li className="flex items-center gap-3">
                    <CheckIcon />
                    Competitive ranked 1v1 matchmaking & global leaderboards
                </li>
                <li className="flex items-center gap-3">
                    <CheckIcon />
                    Live per-finger latency metrics & mistake heatmaps
                </li>
                <li className="flex items-center gap-3">
                    <CheckIcon />
                    Custom keybindings & authentic mechanical switch audio
                </li>
            </ul>

            <div className="flex gap-12 font-mono mt-auto">
                <div>
                    <div className="text-3xl font-bold text-white mb-1">0</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Typists</div>
                </div>
                <div>
                    <div className="text-3xl font-bold text-[#00E572] mb-1">0<span className="text-sm">WPM</span></div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Top Speed</div>
                </div>
                <div>
                    <div className="text-3xl font-bold text-white mb-1">0</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Tests Run</div>
                </div>
            </div>

            <div className="mt-16 text-xs text-gray-600 font-mono flex justify-between border-t border-gray-800/50 pt-8">
                <div>© 2026 TYPEC LABS. BUILT FOR CODE ATHLETES.</div>
                <div className="flex gap-4">
                    <a href="#" className="hover:text-gray-400">KEYMAPS</a>
                    <span>•</span>
                    <a href="#" className="hover:text-gray-400">API</a>
                    <span>•</span>
                    <a href="#" className="hover:text-gray-400">PRIVACY</a>
                </div>
            </div>
        </div>
    );
}

function CheckIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00E572" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    );
}
