import React from "react";

export default function Card({ title, subtitle, icon, children, className = "" }) {
  return (
    <div
      className={`
        group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/75 p-6 shadow-glass
        backdrop-blur-xl transition-all duration-300
        hover:border-cyan-500/25 hover:shadow-glass-lg hover:-translate-y-0.5
        dark:border-white/10 dark:bg-slate-900/55 dark:shadow-glass-lg
        dark:hover:border-cyan-400/20 dark:hover:shadow-glow
        ${className}
      `}
    >
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br from-cyan-400/10 to-indigo-500/10 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
      />

      {(title || icon) && (
        <div className="relative mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            {title && (
              <h3 className="font-display text-base font-semibold tracking-tight text-slate-800 dark:text-slate-100">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
            )}
          </div>
          {icon && (
            <div className="shrink-0 rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-2 text-cyan-600 dark:text-cyan-300">
              {icon}
            </div>
          )}
        </div>
      )}

      <div className="relative">{children}</div>
    </div>
  );
}
