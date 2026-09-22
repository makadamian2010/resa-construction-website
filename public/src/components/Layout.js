import { html } from '../lib/deps.js';
import { TopNav } from './TopNav.js';

export function Layout({ children }) {
  return html`
    <div className="min-h-screen bg-[#0a0e14] text-white">
      <${TopNav} />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">${children}</main>
      <footer className="mt-16 border-t border-white/[0.04] py-6 text-center text-xs text-gray-600">
        © 2026 ScoreHub · Soccer scores and statistics
      </footer>
    </div>
  `;
}
