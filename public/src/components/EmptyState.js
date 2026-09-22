import { html } from '../lib/deps.js';

export function EmptyState({ icon, title, subtitle }) {
  return html`
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-6 py-12 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-emerald-400">
        ${icon}
      </div>
      <h3 className="font-display text-xl font-black text-white">${title}</h3>
      <p className="mt-2 text-sm text-gray-500">${subtitle}</p>
    </div>
  `;
}
