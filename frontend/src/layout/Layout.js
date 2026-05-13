import React, { useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu, Moon, Sun, Bell, Activity } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useTheme } from "../context/ThemeContext";

const titles = {
  "/": { title: "Command Overview", subtitle: "Cross-module intelligence at a glance" },
  "/forecast": { title: "Demand Forecast", subtitle: "Predictive demand signals by SKU and lane" },
  "/esg": { title: "ESG Intelligence", subtitle: "Supplier sustainability and compliance posture" },
  "/geo": { title: "Geopolitical Risk", subtitle: "Regional exposure, conflict, trade, and climate stress" },
  "/optimize": { title: "Network Optimization", subtitle: "AI-ranked suppliers, routes, and risk tradeoffs" },
  "/scenario": { title: "Scenario Lab", subtitle: "Stress-test multipliers and policy constraints" },
};

export default function Layout() {
  const { pathname } = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const header = useMemo(() => titles[pathname] || titles["/"], [pathname]);

  return (
    <div className="relative flex min-h-screen overflow-x-hidden">
      {/* Mobile overlay */}
      <button
        type="button"
        aria-label="Close menu"
        className={`fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-sm transition-opacity lg:hidden ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      <Sidebar
        mobileOpen={mobileOpen}
        onNavigate={() => setMobileOpen(false)}
      />

      <div className="relative flex min-h-screen min-w-0 flex-1 flex-col lg:pl-0">
        <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-40 dark:opacity-25" />

        <header className="relative z-10 flex items-center justify-between gap-4 border-b border-slate-200/60 bg-white/50 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/40 sm:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white/80 text-slate-700 shadow-sm transition hover:border-cyan-500/40 hover:text-cyan-600 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-200 lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-controls="app-sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <h1 className="font-display truncate text-lg font-semibold tracking-tight text-slate-900 dark:text-white sm:text-xl">
                {header.title}
              </h1>
              <p className="hidden truncate text-xs text-slate-500 dark:text-slate-400 sm:block sm:text-sm">
                {header.subtitle}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 sm:inline-flex">
              <Activity className="h-3.5 w-3.5" aria-hidden />
              Live
            </span>
            <button
              type="button"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white/80 text-slate-600 transition hover:border-cyan-500/30 hover:text-cyan-600 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:text-cyan-300"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-glow-sm" />
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white/80 text-slate-600 transition hover:border-cyan-500/40 hover:text-cyan-600 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:text-amber-300"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </header>

        <main className="relative z-10 flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
          <div key={pathname} className="page-enter mx-auto max-w-[1600px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
