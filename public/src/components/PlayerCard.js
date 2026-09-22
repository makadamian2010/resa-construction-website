import { html, motion } from '../lib/deps.js';
import { cn } from '../lib/cn.js';
import { getInitials } from '../lib/formatters.js';

function rankClasses(rank) {
  if (rank === 1) return 'bg-amber-500/20 text-amber-400';
  if (rank === 2) return 'bg-gray-400/20 text-gray-300';
  if (rank === 3) return 'bg-orange-500/20 text-orange-400';
  return 'bg-white/5 text-gray-500';
}

export function PlayerCard({ player, index }) {
  return html`
    <${motion.div}
      initial=${{ opacity: 0, y: 12 }}
      animate=${{ opacity: 1, y: 0 }}
      transition=${{ duration: 0.28, delay: index * 0.04 }}
      className="flex items-center gap-4 border-b border-white/[0.04] px-4 py-3 hover:bg-white/[0.03]"
    >
      <div className=${cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold', rankClasses(index + 1))}>
        ${index + 1}
      </div>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-sm font-bold text-white">
        ${getInitials(player.name).slice(0, 1)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-white">${player.name}</div>
        <div className="truncate text-xs text-gray-500">${player.team} · ${player.position}</div>
      </div>
      <div className="text-right">
        <div className="text-xl font-black text-white">${player.goals} <span className="text-xs font-medium text-gray-500">goals</span></div>
        <div className="text-xs font-bold text-emerald-400">${player.assists} ast</div>
      </div>
    <//>
  `;
}
