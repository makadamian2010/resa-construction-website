import { html, Loader2 } from '../lib/deps.js';

export function LoadingState() {
  return html`
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="flex items-center gap-3 text-emerald-400">
        <${Loader2} className="h-6 w-6 animate-spin" />
        <span className="text-sm font-medium text-gray-400">Loading ScoreHub data</span>
      </div>
    </div>
  `;
}
