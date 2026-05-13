import React, { useState } from "react";
import { runScenario } from "../api";
import Card from "../components/Card";

export default function ScenarioSimulation() {
  const [demandMultiplier, setDemandMultiplier] = useState(1.0);
  const [fuelMultiplier, setFuelMultiplier] = useState(1.0);
  const [minEsg, setMinEsg] = useState("");
  const [maxGeoRisk, setMaxGeoRisk] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleRunScenario = async () => {
    setLoading(true);

    try {
      const data = await runScenario({
        demand_multiplier: parseFloat(demandMultiplier),
        fuel_cost_multiplier: parseFloat(fuelMultiplier),
        min_esg_score: minEsg ? parseFloat(minEsg) : null,
        max_geo_risk: maxGeoRisk ? parseFloat(maxGeoRisk) : null,
      });

      setResult(data);
    } catch (error) {
      console.error("Scenario error:", error);
      alert("Scenario simulation failed");
    }

    setLoading(false);
  };

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-slate-200/80 bg-white/80 px-4 py-2.5 text-sm text-slate-900 shadow-sm outline-none ring-cyan-500/0 transition placeholder:text-slate-400 focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/15 dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-100";

  const labelClass = "text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400";

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200/70 bg-gradient-to-br from-white/80 to-slate-50/80 p-6 shadow-glass backdrop-blur-xl dark:border-white/10 dark:from-slate-900/70 dark:to-slate-950/80 sm:p-8">
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Supply Chain Scenario Simulator
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
          Adjust multipliers and guardrails, then run the scenario engine against your
          current network assumptions.
        </p>
      </section>

      <Card title="Parameters" subtitle="All fields use the same API payload as before">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="demand-mul">
              Demand Multiplier
            </label>
            <input
              id="demand-mul"
              type="number"
              step="0.1"
              value={demandMultiplier}
              onChange={(e) => setDemandMultiplier(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="fuel-mul">
              Fuel Cost Multiplier
            </label>
            <input
              id="fuel-mul"
              type="number"
              step="0.1"
              value={fuelMultiplier}
              onChange={(e) => setFuelMultiplier(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="min-esg">
              Minimum ESG Score
            </label>
            <input
              id="min-esg"
              type="number"
              value={minEsg}
              onChange={(e) => setMinEsg(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="max-geo">
              Maximum Geo Risk
            </label>
            <input
              id="max-geo"
              type="number"
              step="0.1"
              value={maxGeoRisk}
              onChange={(e) => setMaxGeoRisk(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="mt-8">
          <button
            type="button"
            onClick={handleRunScenario}
            disabled={loading}
            className="inline-flex min-w-[10rem] items-center justify-center rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-glow-sm transition enabled:hover:from-cyan-500 enabled:hover:to-indigo-500 focus:outline-none focus:ring-4 focus:ring-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Running…
              </span>
            ) : (
              "Run Scenario"
            )}
          </button>
        </div>
      </Card>

      {result && (
        <Card title="Scenario Results">
          <pre className="max-h-[480px] overflow-auto rounded-xl border border-slate-200/60 bg-slate-950/90 p-4 font-mono text-xs leading-relaxed text-cyan-100/90 dark:border-white/10">
            {JSON.stringify(result.scenario_results, null, 2)}
          </pre>
        </Card>
      )}
    </div>
  );
}
