import { html, motion } from '../lib/deps.js';
import { cn } from '../lib/cn.js';
import { getInitials } from '../lib/formatters.js';

function getZoneClass(leagueId, rank, totalTeams) {
  if (leagueId === 'champions-league') {
    if (rank <= 8) return 'border-blue-500 text-blue-400';
    if (rank <= 16) return 'border-amber-500 text-amber-400';
    return 'border-transparent text-gray-500';
  }

  if (rank <= 4) return 'border-blue-500 text-blue-400';
  if (rank === 5) return 'border-amber-500 text-amber-400';
  if (rank > totalTeams - 3) return 'border-red-500 text-red-400';
  return 'border-transparent text-gray-500';
}

export function StandingsTable({ league }) {
  const totalTeams = league.standings.length;

  return html`
    <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
      <div className="grid grid-cols-[40px_minmax(0,1fr)_48px_48px_48px_48px] bg-white/[0.03] px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-gray-500 sm:grid-cols-[40px_minmax(0,1fr)_48px_48px_48px_48px_48px_48px_48px]">
        <span>#</span>
        <span>Team</span>
        <span className="hidden sm:block">P</span>
        <span>W</span>
        <span>D</span>
        <span>L</span>
        <span className="hidden sm:block">GF</span>
        <span className="hidden sm:block">GA</span>
        <span className="text-emerald-400">Pts</span>
      </div>

      ${league.standings.map((team, index) => {
        const zone = getZoneClass(league.id, team.rank, totalTeams);
        return html`
          <${motion.div}
            key=${team.id}
            initial=${{ opacity: 0, y: 10 }}
            animate=${{ opacity: 1, y: 0 }}
            transition=${{ duration: 0.25, delay: index * 0.03 }}
            className=${cn(
              'grid grid-cols-[40px_minmax(0,1fr)_48px_48px_48px_48px] items-center border-b border-white/[0.04] px-4 py-3 hover:bg-white/[0.03] sm:grid-cols-[40px_minmax(0,1fr)_48px_48px_48px_48px_48px_48px_48px]',
              'border-l-2'
            )}
            style=${{ borderLeftColor: zone.includes('border-blue') ? '#3b82f6' : zone.includes('border-amber') ? '#f59e0b' : zone.includes('border-red') ? '#ef4444' : 'transparent' }}
          >
            <span className=${cn('text-sm font-bold', zone.split(' ')[1])}>${team.rank}</span>
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-xs font-bold text-white">
                ${getInitials(team.name).slice(0, 1)}
              </div>
              <span className="truncate text-sm font-medium text-white">${team.name}</span>
            </div>
            <span className="hidden text-sm text-gray-400 sm:block">${team.played}</span>
            <span className="text-sm text-gray-400">${team.wins}</span>
            <span className="text-sm text-gray-400">${team.draws}</span>
            <span className="text-sm text-gray-400">${team.losses}</span>
            <span className="hidden text-sm text-gray-400 sm:block">${team.goals_for}</span>
            <span className="hidden text-sm text-gray-400 sm:block">${team.goals_against}</span>
            <span className="text-sm font-bold text-white">${team.points}</span>
          <//>
        `;
      })}
    </div>
  `;
}
