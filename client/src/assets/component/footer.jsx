export default function Footer() {
    return (
        <footer
            className="w-full px-10 py-8 flex justify-between items-center font-mono text-[10px] tracking-widest uppercase"
            style={{ color: 'var(--text-faint)' }}
        >
            <div>© 2025 TYPEC LABS. BUILT FOR CODE ATHLETES.</div>
            <div className="flex gap-4">
                <a href="#" className="transition-colors hover:opacity-80">KEYMAPS</a>
                <span>•</span>
                <a href="#" className="transition-colors hover:opacity-80">API</a>
                <span>•</span>
                <a href="#" className="transition-colors hover:opacity-80">PRIVACY</a>
            </div>
        </footer>
    );
}
