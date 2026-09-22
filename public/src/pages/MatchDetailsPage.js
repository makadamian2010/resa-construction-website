import { ArrowLeft, BarChart2, html } from '../lib/deps.js';
import { Link, useSearchParams } from '../lib/deps.js';
import { LoadingState } from '../components/LoadingState.js';
import { StatBar } from '../components/StatBar.js';
import { createPageUrl } from '../lib/routes.js';
import { formatLongDateTime, getInitials, getStatusLabel, isLiveLike } from '../lib/formatters.js';
import { useMatch } from '../hooks/useScoreHubData.js';

function TeamSide({ team, scorers, align = 'left' }) {
  return html`
    <div className=${align === 'right' ? 'text-right' : 'text-left'}>
      <div className=${align === 'right' ? 'ml-auto' : ''}>
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-2xl font-black text-white">
          ${getInitials(team).slice(0, 1)}
        </div>
      </div>
      <div className="mt-4 text-xl font-bold text-white">${team}</div>
      <div className="mt-3 space-y-1 text-xs text-gray-400">
        ${scorers.length ? scorers.map((scorer) => html`<div key=${scorer}>${scorer}</div>`) : html`<div>No scorers</div>`}
      </div>
    </div>
  `;
}

export function MatchDetailsPage() {
  const [searchParams] = useSearchParams();
  const matchId = searchParams.get('id');
  const matchQuery = useMatch(matchId);

  if (matchQuery.isLoading) {
    return html`<${LoadingState} />`;
  }

  const match = matchQuery.data?.match;
  if (!match) {
    return html`<div className="py-12 text-sm text-gray-500">Match not found.</div>`;
  }

  const live = isLiveLike(match.status);
  const statItems = [
    ['Possession', match.home_possession, match.away_possession],
    ['Shots', match.home_shots, match.away_shots],
    ['Shots on Target', match.home_shots_on_target, match.away_shots_on_target],
    ['Corners', match.home_corners, match.away_corners],
    ['Fouls', match.home_fouls, match.away_fouls],
    ['Yellow Cards', match.home_yellow_cards, match.away_yellow_cards],
    ['Red Cards', match.home_red_cards, match.away_red_cards]
  ];

  return html`
    <section>
      <${Link}
        to=${createPageUrl('Home')}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 transition hover:text-white"
      >
        <${ArrowLeft} className="h-4 w-4" />
        <span>Back</span>
      <//>

      <div className="mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-gray-500">${match.league_name}</div>
          <div className=${live ? 'rounded-full bg-red-500/20 px-3 py-1 text-xs font-bold text-red-400' : 'rounded-full bg-white/5 px-3 py-1 text-xs font-bold text-gray-500'}>
            ${getStatusLabel(match)}
          </div>
        </div>

        <div className="mt-8 grid items-start gap-8 md:grid-cols-[1fr_auto_1fr]">
          <${TeamSide} team=${match.home_team} scorers=${match.home_scorers} />
          <div className="text-center">
            <div className="text-5xl font-black tracking-tight text-white">
              ${match.status === 'scheduled' ? '—' : `${match.home_score}-${match.away_score}`}
            </div>
            ${live &&
            html`<div className="mt-3 inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
              Live ${match.minute}'
            </div>`}
          </div>
          <${TeamSide} team=${match.away_team} scorers=${match.away_scorers} align="right" />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
          <span>${match.venue}</span>
          <span>${formatLongDateTime(match.match_date)}</span>
        </div>
      </div>

      ${match.status !== 'scheduled' &&
      html`
        <section className="mt-10">
          <div className="mb-4 flex items-center gap-3">
            <${BarChart2} className="h-5 w-5 text-emerald-400" />
            <h2 className="font-display text-xl font-black text-white">Match Statistics</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            ${statItems.map(
              ([label, home, away]) => html`<${StatBar} key=${label} label=${label} home=${home} away=${away} />`
            )}
          </div>
        </section>
      `}
    </section>
  `;
}
