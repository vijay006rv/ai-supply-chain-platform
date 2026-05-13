import React from "react";

const RiskInsightsPanel = ({ riskData }) => {
  if (!riskData || riskData.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200/60 bg-slate-900/90 p-6 text-slate-200 shadow-glass-lg backdrop-blur-xl dark:border-white/10">
        <h2 className="font-display text-lg font-semibold tracking-tight text-white">
          AI Risk Insights
        </h2>
        <p className="mt-3 text-sm text-slate-400">No data available.</p>
      </div>
    );
  }

  const topRisk = [...riskData]
    .sort((a, b) => b.risk_score - a.risk_score)
    .slice(0, 5);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 text-white shadow-glass-lg">
      <div className="pointer-events-none absolute -right-16 top-0 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />
      <h2 className="relative font-display text-lg font-semibold tracking-tight">
        AI Risk Intelligence
      </h2>
      <p className="relative mt-1 text-xs text-slate-400">
        Highest exposure entities by composite risk score
      </p>

      <div className="relative mt-5 space-y-3">
        {topRisk.map((country, index) => (
          <div
            key={index}
            className="rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-cyan-500/25 hover:bg-white/[0.07]"
          >
            <p className="font-semibold text-slate-100">{country.country}</p>
            <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-slate-400">
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-slate-500">
                  Risk
                </span>
                <span className="font-mono text-cyan-300">{country.risk_score}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-slate-500">
                  Sentiment
                </span>
                <span className="text-slate-200">{country.sentiment}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-slate-500">
                  Articles
                </span>
                <span className="font-mono text-slate-200">{country.article_count}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiskInsightsPanel;
