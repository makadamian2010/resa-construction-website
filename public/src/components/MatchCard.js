import { Calendar, Link, Zap, html, motion } from '../lib/deps.js';
import { cn } from '../lib/cn.js';
import { formatMatchTime, formatShortDate, getInitials, getStatusLabel, isLiveLike } from '../lib/formatters.js';
import { createPageUrl } from '../lib/routes.js';

function StatusBadge({ match }) {
  const live = match.status === 'live';
  const halftime = match.status === 'halftime';
  const classes = live
    ? 'bg-red-500/20 text-red-400'
    : halftime
      ? 'bg-amber-500/20 text-amber-400'
      : 'bg-white/5 text-gray-500';

  return html`
    <div className=${cn('inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold', classes)}>
      ${(live || halftime) && html`<span className=${cn('h-2 w-2 rounded-full', live ? 'animate-pulse bg-red-500' : 'bg-amber-400')}></span>`}
      <span>${getStatusLabel(match)}</span>
    </div>
  `;
}

function TeamCell({ name, align = 'left' }) {
  return html`
    <div className=${cn('flex items-center gap-3', align === 'right' ? 'justify-end text-right' : 'justify-start text-left')}>
      ${align === 'right' &&
      html`<div>
        <div className="text-sm font-semibold text-white">${name}</div>
      </div>`}
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-lg font-bold text-white">
        ${getInitials(name).slice(0, 1)}
      </div>
      ${align === 'left' &&
      html`<div>
        <div className="text-sm font-semibold text-white">${name}</div>
      </div>`}
    </div>
  `;
}

export function MatchCard({ match, index }) {
  const live = isLiveLike(match.status);

  return html`
    <${motion.div}
      initial=${{ opacity: 0, y: 18 }}
      animate=${{ opacity: 1, y: 0 }}
      transition=${{ duration: 0.35, delay: index * 0.05 }}
    >
      <${Link}
        to=${`${createPageUrl('MatchDetails')}?id=${match.id}`}
        className=${cn(
          'block rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 transition hover:bg-white/[0.05]',
          live ? 'live-ring border-emerald-500/20 bg-emerald-500/[0.05]' : ''
        )}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="text-xs text-gray-500">${match.league_name}</div>
            <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
              ${match.status === 'scheduled'
                ? html`<${Calendar} className="h-3.5 w-3.5 text-emerald-400" />`
                : html`<${Zap} className="h-3.5 w-3.5 text-gray-500" />`}
              <span>${formatMatchTime(match.match_date)}</span>
            </div>
          </div>
          <${StatusBadge} match=${match} />
        </div>

        <div className="grid grid-cols-3 items-center gap-3">
          <${TeamCell} name=${match.home_team} align="right" />
          <div className="text-center">
            <div className=${cn('text-3xl font-black tracking-tight', live ? 'text-emerald-400' : 'text-white')}>
              ${match.status === 'scheduled' ? '—' : `${match.home_score}-${match.away_score}`}
            </div>
          </div>
          <${TeamCell} name=${match.away_team} />
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 text-xs text-gray-600">
          <span>${formatShortDate(match.match_date)}</span>
          <span className="truncate">${match.venue}</span>
        </div>
      <//>
    <//>
  `;
}
