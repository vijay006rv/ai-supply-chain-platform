import React, { useEffect, useState } from "react";
import { getGeoRisk } from "../api";
import Card from "../components/Card";
import GeoRiskMap from "../components/GeoRiskMap";
import RiskInsightsPanel from "../components/RiskInsightsPanel";
import SkeletonPulse from "../components/SkeletonPulse";

const GeoRisk = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [region, setRegion] = useState("All");

  useEffect(() => {
    const fetchGeoRisk = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getGeoRisk();

        if (Array.isArray(res)) setData(res);
        else if (res.items) setData(res.items);
        else setData([]);
      } catch (err) {
        setError("Failed to load geopolitical risk intelligence");
      } finally {
        setLoading(false);
      }
    };

    fetchGeoRisk();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200/60 bg-white/50 p-6 dark:border-white/10 dark:bg-slate-900/40">
          <SkeletonPulse className="mb-6 h-7 w-64" />
          <SkeletonPulse className="mb-4 h-10 w-full max-w-xs" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonPulse key={i} className="h-10 w-full" />
            ))}
          </div>
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

  const getColor = (score) => {
    if (score < 0.3) return "text-emerald-600 font-semibold dark:text-emerald-400";
    if (score < 0.6) return "text-amber-500 font-semibold dark:text-amber-400";
    return "text-rose-600 font-semibold dark:text-rose-400";
  };

  const filteredData =
    region === "All" ? data : data.filter((row) => row.region === region);

  const topRiskCountries = [...data]
    .sort((a, b) => b.final_risk - a.final_risk)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <Card title="Global Geo-Political Intelligence Dashboard">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <label
              htmlFor="region-filter"
              className="text-sm font-medium text-slate-600 dark:text-slate-400"
            >
              Filter by region
            </label>
            <select
              id="region-filter"
              className="min-w-[12rem] rounded-xl border border-slate-200/80 bg-white/80 px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm outline-none ring-cyan-500/0 transition focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/15 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-100"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              <option>All</option>
              <option>Asia</option>
              <option>Europe</option>
              <option>North America</option>
              <option>South America</option>
              <option>Africa</option>
              <option>Middle East</option>
            </select>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200/60 dark:border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/90 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-400">
                  <th className="px-4 py-3">Country</th>
                  <th className="px-4 py-3">Supply</th>
                  <th className="px-4 py-3">War</th>
                  <th className="px-4 py-3">Trade</th>
                  <th className="px-4 py-3">Climate</th>
                  <th className="px-4 py-3">Energy</th>
                  <th className="px-4 py-3">Final Risk</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-slate-100/90 transition-colors hover:bg-cyan-500/[0.04] dark:border-white/5 dark:hover:bg-white/[0.03]"
                  >
                    <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-100">
                      {row.country}
                    </td>

                    <td className={`px-4 py-3 font-mono text-xs sm:text-sm ${getColor(row.supply_risk)}`}>
                      {row.supply_risk}
                    </td>

                    <td className={`px-4 py-3 font-mono text-xs sm:text-sm ${getColor(row.war_risk)}`}>
                      {row.war_risk}
                    </td>

                    <td className={`px-4 py-3 font-mono text-xs sm:text-sm ${getColor(row.trade_risk)}`}>
                      {row.trade_risk}
                    </td>

                    <td className={`px-4 py-3 font-mono text-xs sm:text-sm ${getColor(row.climate_risk)}`}>
                      {row.climate_risk}
                    </td>

                    <td className={`px-4 py-3 font-mono text-xs sm:text-sm ${getColor(row.energy_risk)}`}>
                      {row.energy_risk}
                    </td>

                    <td className={`px-4 py-3 font-mono text-sm font-bold sm:text-base ${getColor(row.final_risk)}`}>
                      {row.final_risk}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-3">
          <RiskInsightsPanel riskData={data} />
        </div>
      </div>

      <Card title="Top High-Risk Countries">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {topRiskCountries.map((country, index) => (
            <div
              key={index}
              className="rounded-xl border border-rose-500/25 bg-gradient-to-br from-rose-500/10 to-transparent p-4 transition hover:border-rose-400/40 hover:shadow-glow-sm dark:from-rose-500/15"
            >
              <p className="font-semibold text-slate-800 dark:text-slate-100">
                {country.country}
              </p>
              <p className="font-mono text-lg font-bold text-rose-600 dark:text-rose-400">
                {country.final_risk}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Geo Risk Table Map View">
        <GeoRiskMap />
      </Card>
    </div>
  );
};

export default GeoRisk;
