import { AnimatePresence, Flame, Menu, NavLink, X, html, motion, useLocation, React } from '../lib/deps.js';
import { cn } from '../lib/cn.js';
import { createPageUrl } from '../lib/routes.js';
import { Trophy, Users } from '../lib/deps.js';

const navItems = [
  { to: createPageUrl('Home'), label: 'Matches', icon: Flame },
  { to: createPageUrl('Standings'), label: 'Standings', icon: Trophy },
  { to: createPageUrl('TopScorers'), label: 'Top Scorers', icon: Users }
];

function NavItem({ item, mobile = false }) {
  const Icon = item.icon;

  return html`
    <${NavLink}
      to=${item.to}
      className=${({ isActive }) =>
        cn(
          'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition',
          mobile ? 'w-full justify-start rounded-xl' : '',
          isActive
            ? 'bg-emerald-500/10 text-emerald-400'
            : 'text-gray-400 hover:bg-white/5 hover:text-white'
        )}
    >
      <${Icon} className="h-4 w-4" />
      <span>${item.label}</span>
    <//>
  `;
}

export function TopNav() {
  const [open, setOpen] = React.useState(false);
  const location = useLocation();

  React.useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return html`
    <header className="sticky top-0 z-50 border-b border-white/[0.04] bg-[#0a0e14]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <${NavLink} to=${createPageUrl('Home')} className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500">
            <${Flame} className="h-5 w-5 text-white" />
          </div>
          <div className="font-display text-xl font-black tracking-tight text-white">
            Score<span className="text-emerald-400">Hub</span>
          </div>
        <//>

        <nav className="hidden items-center gap-2 md:flex">
          ${navItems.map((item) => html`<${NavItem} key=${item.to} item=${item} />`)}
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03] text-gray-300 md:hidden"
          onClick=${() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
        >
          ${open ? html`<${X} className="h-5 w-5" />` : html`<${Menu} className="h-5 w-5" />`}
        </button>
      </div>

      <${AnimatePresence}>
        ${open &&
        html`
          <${motion.div}
            initial=${{ opacity: 0, height: 0 }}
            animate=${{ opacity: 1, height: 'auto' }}
            exit=${{ opacity: 0, height: 0 }}
            className="border-t border-white/[0.04] md:hidden"
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 sm:px-6">
              ${navItems.map((item) => html`<${NavItem} key=${item.to} item=${item} mobile=${true} />`)}
            </div>
          <//>
        `}
      <//>
    </header>
  `;
}
