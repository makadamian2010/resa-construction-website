import { Flame, html, React } from '../lib/deps.js';
import { EmptyState } from '../components/EmptyState.js';
import { LeagueSelector } from '../components/LeagueSelector.js';
import { LoadingState } from '../components/LoadingState.js';
import { PlayerCard } from '../components/PlayerCard.js';
import { useLeagues, usePlayers } from '../hooks/useScoreHubData.js';

export function TopScorersPage() {
  const [selectedLeague, setSelectedLeague] = React.useState(null);
  const leaguesQuery = useLeagues();
  const playersQuery = usePlayers(selectedLeague);

  if (leaguesQuery.isLoading || playersQuery.isLoading) {
    return html`<${LoadingState} />`;
  }

  const leagues = leaguesQuery.data?.leagues || [];
  const players = playersQuery.data?.players || [];

  return html`
    <section>
      <h1 className="font-display text-3xl font-black tracking-tight text-white">
        Top <span className="text-emerald-400">Scorers</span>
      </h1>

      <div className="mt-8">
        <${LeagueSelector} leagues=${leagues} selectedLeague=${selectedLeague} onSelect=${setSelectedLeague} />
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
        ${players.length
          ? players.map((player, index) => html`<${PlayerCard} key=${player.id} player=${player} index=${index} />`)
          : html`
              <div className="p-6">
                <${EmptyState}
                  icon=${html`<${Flame} className="h-6 w-6" />`}
                  title="No top scorers found"
                  subtitle="The selected league does not have player scoring data yet."
                />
              </div>
            `}
      </div>
    </section>
  `;
}
