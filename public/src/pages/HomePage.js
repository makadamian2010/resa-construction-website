import { Calendar, Flame, Zap, html, motion, React } from '../lib/deps.js';
import { EmptyState } from '../components/EmptyState.js';
import { LeagueSelector } from '../components/LeagueSelector.js';
import { LoadingState } from '../components/LoadingState.js';
import { MatchCard } from '../components/MatchCard.js';
import { useLeagues, useMatches } from '../hooks/useScoreHubData.js';

function SectionBlock({ icon, title, matches }) {
  if (!matches.length) return null;

  return html`
    <section className="mt-10">
      <div className="mb-4 flex items-center gap-3">
        ${icon}
        <h2 className="font-display text-xl font-black text-white">${title}</h2>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        ${matches.map((match, index) => html`<${MatchCard} key=${match.id} match=${match} index=${index} />`)}
      </div>
    </section>
  `;
}

export function HomePage() {
  const [selectedLeague, setSelectedLeague] = React.useState(null);
  const leaguesQuery = useLeagues();
  const matchesQuery = useMatches(selectedLeague);

  if (leaguesQuery.isLoading || matchesQuery.isLoading) {
    return html`<${LoadingState} />`;
  }

  const leagues = leaguesQuery.data?.leagues || [];
  const matches = matchesQuery.data?.matches || [];
  const liveMatches = matches.filter((match) => match.status === 'live' || match.status === 'halftime');
  const upcomingMatches = matches.filter((match) => match.status === 'scheduled');
  const recentMatches = matches.filter((match) => match.status === 'finished');

  return html`
    <section>
      <${motion.div}
        initial=${{ opacity: 0, y: -20 }}
        animate=${{ opacity: 1, y: 0 }}
        transition=${{ duration: 0.45 }}
        className="text-center"
      >
        <h1 className="font-display text-4xl font-black tracking-tight text-white md:text-5xl">
          Live <span className="text-emerald-400">Scores</span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-500 md:text-base">
          Real-time match scores, statistics, and league standings
        </p>
      <//>

      <div className="mt-8">
        <${LeagueSelector} leagues=${leagues} selectedLeague=${selectedLeague} onSelect=${setSelectedLeague} />
      </div>

      ${matches.length
        ? html`
            <${SectionBlock}
              title="Live Now"
              matches=${liveMatches}
              icon=${html`<div className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span></div>`}
            />
            <${SectionBlock}
              title="Upcoming"
              matches=${upcomingMatches}
              icon=${html`<${Calendar} className="h-5 w-5 text-emerald-400" />`}
            />
            <${SectionBlock}
              title="Recent Results"
              matches=${recentMatches}
              icon=${html`<${Zap} className="h-5 w-5 text-gray-400" />`}
            />
          `
        : html`
            <div className="mt-10">
              <${EmptyState}
                icon=${html`<${Flame} className="h-6 w-6" />`}
                title="No matches available"
                subtitle="Try another league filter to explore live games and recent results."
              />
            </div>
          `}
    </section>
  `;
}
