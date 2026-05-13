import React, { useEffect, useState } from "react";
import { getOptimization } from "../api";
import Card from "../components/Card";
import SkeletonPulse from "../components/SkeletonPulse";
import { useNavigate } from "react-router-dom";

const Optimization = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    getOptimization()
      .then((res) => setData(res))
      .catch(() => setError("Failed to load optimization recommendation"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Card title="AI Strategy Recommendation">
          <SkeletonPulse className="h-16 w-full" />
        </Card>
        <div className="grid gap-6 md:grid-cols-2">
          <Card title="Loading suppliers">
            <SkeletonPulse className="h-40 w-full" />
          </Card>
          <Card title="Loading routes">
            <SkeletonPulse className="h-40 w-full" />
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-6 py-4 text-rose-700 dark:text-rose-300"
        role="alert"
      >
        {error}
      </div>
    );
  }
  if (!data) return null;

  const {
    best_suppliers = [],
    recommended_routes = [],
    risk_summary = [],
    message,
  } = data;

  const formatNumber = (value, decimals = 2) => {
    if (value === null || value === undefined || isNaN(value)) return "0.00";
    return Number(value).toFixed(decimals);
  };

  return (
    <div className="space-y-8">
      {message && (
        <Card title="AI Strategy Recommendation">
          <p className="border-l-2 border-cyan-500/60 pl-4 text-sm italic leading-relaxed text-slate-600 dark:border-cyan-400/50 dark:text-slate-300">
            {message}
          </p>
        </Card>
      )}

      <Card title={`Top Suppliers (${best_suppliers.length})`}>
        {best_suppliers.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {best_suppliers.map((supplier, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200/70 bg-white/40 p-5 shadow-sm transition hover:border-cyan-500/25 hover:shadow-md dark:border-white/10 dark:bg-slate-950/40 dark:hover:border-cyan-400/20"
              >
                <h4 className="mb-3 font-display text-sm font-semibold text-indigo-600 dark:text-indigo-300">
                  #{idx + 1}: {supplier.supplier_name}{" "}
                  <span className="font-normal text-slate-500 dark:text-slate-400">
                    ({supplier.location})
                  </span>
                </h4>

                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex justify-between gap-2 border-b border-slate-100/80 py-1 dark:border-white/5">
                    <span className="text-slate-500 dark:text-slate-400">Composite Score</span>
                    <span className="font-mono font-medium">
                      {formatNumber(supplier.composite_score, 3)}
                    </span>
                  </li>
                  <li className="flex justify-between gap-2 border-b border-slate-100/80 py-1 dark:border-white/5">
                    <span className="text-slate-500 dark:text-slate-400">Predicted Demand</span>
                    <span className="font-mono font-medium">
                      {formatNumber(supplier.predicted_demand, 1)}
                    </span>
                  </li>
                  <li className="flex justify-between gap-2 border-b border-slate-100/80 py-1 dark:border-white/5">
                    <span className="text-slate-500 dark:text-slate-400">Manufacturing Cost</span>
                    <span className="font-mono font-medium">
                      {formatNumber(supplier.avg_manufacturing_cost, 2)}
                    </span>
                  </li>
                  <li className="flex justify-between gap-2 border-b border-slate-100/80 py-1 dark:border-white/5">
                    <span className="text-slate-500 dark:text-slate-400">Logistics Cost</span>
                    <span className="font-mono font-medium">
                      {formatNumber(supplier.avg_logistics_cost, 2)}
                    </span>
                  </li>
                  <li className="flex justify-between gap-2 border-b border-slate-100/80 py-1 dark:border-white/5">
                    <span className="text-slate-500 dark:text-slate-400">ESG Score</span>
                    <span className="font-mono font-medium">
                      {formatNumber(supplier.esg_score, 3)}
                    </span>
                  </li>
                  <li className="flex justify-between gap-2 py-1">
                    <span className="text-slate-500 dark:text-slate-400">Geo Safety Score</span>
                    <span className="font-mono font-medium">
                      {formatNumber(supplier.geo_safety_score, 3)}
                    </span>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 dark:text-slate-400">No supplier data available</p>
        )}
      </Card>

      <Card title={`Recommended Routes (${recommended_routes.length})`}>
        {recommended_routes.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {recommended_routes.map((route, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200/70 bg-white/40 p-5 shadow-sm transition hover:border-sky-500/25 hover:shadow-md dark:border-white/10 dark:bg-slate-950/40 dark:hover:border-sky-400/25"
              >
                <h4 className="mb-3 font-display text-sm font-semibold text-sky-600 dark:text-sky-300">
                  #{idx + 1}: {route.route}
                </h4>

                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex justify-between gap-2 border-b border-slate-100/80 py-1 dark:border-white/5">
                    <span className="text-slate-500 dark:text-slate-400">Mode</span>
                    <span className="font-medium">{route.mode}</span>
                  </li>
                  <li className="flex justify-between gap-2 border-b border-slate-100/80 py-1 dark:border-white/5">
                    <span className="text-slate-500 dark:text-slate-400">Carrier</span>
                    <span className="font-medium">{route.carrier}</span>
                  </li>
                  <li className="flex justify-between gap-2 py-1">
                    <span className="text-slate-500 dark:text-slate-400">Average Cost</span>
                    <span className="font-mono font-medium">
                      {formatNumber(route.avg_cost, 2)}
                    </span>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 dark:text-slate-400">No route data available</p>
        )}
      </Card>

      <Card title={`Risk Summary (${risk_summary.length})`}>
        {risk_summary.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {risk_summary.map((risk, idx) => (
              <div
                key={idx}
                className={`rounded-xl border p-5 shadow-sm transition hover:shadow-md ${
                  risk.risk_level === "High"
                    ? "border-rose-500/30 bg-rose-500/5 dark:bg-rose-500/10"
                    : risk.risk_level === "Medium"
                    ? "border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10"
                    : "border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10"
                }`}
              >
                <h4 className="mb-3 font-display text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {risk.type} Risk — {risk.region}
                </h4>

                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <li>
                    <span className="text-slate-500 dark:text-slate-400">Risk Level:</span>{" "}
                    <span className="font-semibold">{risk.risk_level}</span>
                  </li>
                  <li>
                    <span className="text-slate-500 dark:text-slate-400">Risk Score:</span>{" "}
                    <span className="font-mono font-medium">
                      {formatNumber(risk.score, 3)}
                    </span>
                  </li>
                  <li>
                    <span className="text-slate-500 dark:text-slate-400">Details:</span>{" "}
                    {risk.details}
                  </li>
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 dark:text-slate-400">No risk data available</p>
        )}
      </Card>

      <Card title="Scenario Simulation">
        <p className="mb-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          Simulate supply chain changes such as demand surge, fuel price increase, ESG
          restrictions, or geopolitical risk limits.
        </p>

        <button
          type="button"
          onClick={() => navigate("/scenario")}
          className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-glow-sm transition hover:from-cyan-500 hover:to-indigo-500 focus:outline-none focus:ring-4 focus:ring-cyan-500/30"
        >
          Run Scenario Simulation
        </button>
      </Card>
    </div>
  );
};

export default Optimization;
