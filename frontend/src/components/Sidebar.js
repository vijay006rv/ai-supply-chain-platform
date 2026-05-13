import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  LineChart,
  Leaf,
  Globe2,
  Sparkles,
  FlaskConical,
  Orbit,
} from "lucide-react";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/forecast", label: "Demand Forecast", icon: LineChart },
  { to: "/esg", label: "ESG Analysis", icon: Leaf },
  { to: "/geo", label: "Geo Risk", icon: Globe2 },
  { to: "/optimize", label: "Optimization", icon: Sparkles },
  { to: "/scenario", label: "Scenario Simulation", icon: FlaskConical },
];

export default function Sidebar({ mobileOpen, onNavigate }) {
  const linkClass =
    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-white/5 hover:text-white";

  const activeClass =
    "bg-gradient-to-r from-cyan-500/15 to-indigo-500/10 text-cyan-300 shadow-glow-sm ring-1 ring-cyan-500/25";

  return (
    <>
      <aside
        id="app-sidebar"
        className={`
          glass-sidebar fixed inset-y-0 left-0 z-40 flex w-[min(18rem,88vw)] flex-col border-r border-white/10 px-4 py-6
          transition-transform duration-300 ease-out
          lg:static lg:z-0 lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-600 shadow-glow">
            <Orbit className="h-5 w-5 text-white opacity-90" aria-hidden />
          </div>
          <div>
            <p className="font-display text-lg font-semibold tracking-tight text-white">
              IntelChain
            </p>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-cyan-400/80">
              Geo &amp; Supply AI
            </p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1" aria-label="Primary">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeClass : ""}`
              }
            >
              <Icon
                className="h-4 w-4 shrink-0 text-cyan-500/70 transition-colors group-hover:text-cyan-300"
                strokeWidth={1.75}
                aria-hidden
              />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-slate-400">
          <p className="font-medium text-slate-300">Live intelligence layer</p>
          <p className="mt-1 leading-relaxed text-slate-500">
            Forecasting, ESG signals, and geopolitical posture — unified.
          </p>
        </div>
      </aside>
    </>
  );
}
