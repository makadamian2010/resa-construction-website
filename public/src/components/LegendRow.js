import { html } from '../lib/deps.js';

function LegendItem({ color, label }) {
  return html`
    <div className="flex items-center gap-2 text-xs text-gray-500">
      <span className="h-2.5 w-2.5 rounded-sm" style=${{ backgroundColor: color }}></span>
      <span>${label}</span>
    </div>
  `;
}

export function LegendRow({ leagueId }) {
  const items =
    leagueId === 'champions-league'
      ? [
          { color: '#3b82f6', label: 'Knockout Round (Top 8)' },
          { color: '#f59e0b', label: 'Knockout Playoff (9-16)' }
        ]
      : [
          { color: '#3b82f6', label: 'Champions League' },
          { color: '#f59e0b', label: 'Europa League' },
          { color: '#ef4444', label: 'Relegation' }
        ];

  return html`<div className="mt-4 flex flex-wrap gap-4">
    ${items.map((item) => html`<${LegendItem} key=${item.label} color=${item.color} label=${item.label} />`)}
  </div>`;
}
