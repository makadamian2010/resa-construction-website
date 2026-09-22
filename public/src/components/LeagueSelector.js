import { html } from '../lib/deps.js';
import { cn } from '../lib/cn.js';

export function LeagueSelector({ leagues, selectedLeague, onSelect }) {
  const items = [{ id: 'all', name: 'All Leagues' }, ...leagues];

  return html`
    <div className="flex gap-2 overflow-x-auto pb-2">
      ${items.map((league) => {
        const isActive = selectedLeague === league.id || (!selectedLeague && league.id === 'all');
        return html`
          <button
            key=${league.id}
            type="button"
            onClick=${() => onSelect(league.id === 'all' ? null : league.id)}
            className=${cn(
              'whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition',
              isActive
                ? 'border-emerald-500 bg-emerald-500 text-white shadow-glow'
                : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            )}
          >
            ${league.name}
          </button>
        `;
      })}
    </div>
  `;
}
