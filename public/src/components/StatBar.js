import { html } from '../lib/deps.js';
import { cn } from '../lib/cn.js';

export function StatBar({ label, home, away }) {
  const total = Number(home) + Number(away);
  const homePercent = total ? (Number(home) / total) * 100 : 50;
  const awayPercent = total ? (Number(away) / total) * 100 : 50;
  const homeWinning = Number(home) > Number(away);
  const awayWinning = Number(away) > Number(home);

  return html`
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
      <div className="text-center text-[11px] uppercase tracking-[0.18em] text-gray-500">${label}</div>
      <div className="mt-3 flex items-center justify-between text-sm font-bold">
        <span className=${cn(homeWinning ? 'text-emerald-400' : 'text-white')}>${home}</span>
        <span className=${cn(awayWinning ? 'text-emerald-400' : 'text-white')}>${away}</span>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <div className="h-1.5 flex-1 rounded-full bg-white/10">
          <div className="h-1.5 rounded-full bg-emerald-500" style=${{ width: `${homePercent}%` }}></div>
        </div>
        <div className="h-1.5 flex-1 rounded-full bg-white/10">
          <div className="ml-auto h-1.5 rounded-full bg-white/20" style=${{ width: `${awayPercent}%` }}></div>
        </div>
      </div>
    </div>
  `;
}
