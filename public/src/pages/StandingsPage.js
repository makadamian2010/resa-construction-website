import { Trophy, html, React } from '../lib/deps.js';
import { LeagueSelector } from '../components/LeagueSelector.js';
import { LegendRow } from '../components/LegendRow.js';
import { LoadingState } from '../components/LoadingState.js';
import { StandingsTable } from '../components/StandingsTable.js';
import { useLeagues } from '../hooks/useScoreHubData.js';

export function StandingsPage() {
  const [selectedLeague, setSelectedLeague] = React.useState(null);
  const leaguesQuery = useLeagues();

  if (leaguesQuery.isLoading) {
    return html`<${LoadingState} />`;
  }

  const leagues = leaguesQuery.data?.leagues || [];
  const visibleLeagues = selectedLeague ? leagues.filter((league) => league.id === selectedLeague) : leagues;

  return html`
    <section>
      <div>
        <h1 className="font-display text-3xl font-black tracking-tight text-white">
          League <span className="text-emerald-400">Standings</span>
        </h1>
      </div>

      <div className="mt-8">
        <${LeagueSelector} leagues=${leagues} selectedLeague=${selectedLeague} onSelect=${setSelectedLeague} />
      </div>

      <div className="mt-8 space-y-10">
        ${visibleLeagues.map(
          (league) => html`
            <section key=${league.id}>
              <div className="mb-4 flex items-center gap-3">
                <${Trophy} className="h-5 w-5 text-emerald-400" />
                <h2 className="font-display text-xl font-black text-white">${league.name}</h2>
              </div>
              <${StandingsTable} league=${league} />
              <${LegendRow} leagueId=${league.id} />
            </section>
          `
        )}
      </div>
    </section>
  `;
}
