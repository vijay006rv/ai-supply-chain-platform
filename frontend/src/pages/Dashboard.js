import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card";
import SkeletonPulse from "../components/SkeletonPulse";
import { TrendingUp, Shield, Globe, Brain, ArrowUpRight } from "lucide-react";

export default function Dashboard() {
  const [forecast, setForecast] = useState([]);
  const [esg, setEsg] = useState([]);
  const [geo, setGeo] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const done = () => {
      if (!cancelled) setLoading(false);
    };

    Promise.all([
      axios
        .get("http://127.0.0.1:8000/forecast-demand")
        .then((res) => {
          if (!cancelled) {
            setForecast(
              Array.isArray(res.data.items) ? res.data.items : res.data || []
            );
          }
        })
        .catch(() => {
          if (!cancelled) setForecast([]);
        }),
      axios
        .get("http://127.0.0.1:8000/esg-score")
        .then((res) => {
          if (!cancelled) {
            setEsg(Array.isArray(res.data.items) ? res.data.items : res.data || []);
          }
        })
        .catch(() => {
          if (!cancelled) setEsg([]);
        }),
      axios
        .get("http://127.0.0.1:8000/geo-risk")
        .then((res) => {
          if (!cancelled) {
            setGeo(Array.isArray(res.data) ? res.data : res.data.items || []);
          }
        })
        .catch(() => {
          if (!cancelled) setGeo([]);
        }),
    ]).finally(done);

    return () => {
      cancelled = true;
    };
  }, []);

  const avgESG =
    esg.length > 0
      ? (
          esg.reduce((a, b) => a + (b.esg_score || b.ESG_Total || 0), 0) /
          esg.length
        ).toFixed(1)
      : 0;

  const highRiskCountries =
    geo.length > 0 ? geo.filter((g) => (g.risk_score || 0) > 0.6).length : 0;

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="rounded-3xl border border-slate-200/60 bg-white/60 p-8 dark:border-white/10 dark:bg-slate-900/50">
          <SkeletonPulse className="mb-4 h-8 max-w-md" />
          <SkeletonPulse className="h-4 max-w-xl" />
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200/50 p-6 dark:border-white/10"
              >
                <SkeletonPulse className="mb-4 h-4 w-24" />
                <SkeletonPulse className="h-10 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-white/90 via-white/70 to-slate-50/90 p-8 shadow-glass-lg backdrop-blur-xl dark:border-white/10 dark:from-slate-900/80 dark:via-slate-900/60 dark:to-slate-950/90">
        <div className="pointer-events-none absolute -right-24 top-0 h-64 w-64 rounded-full bg-cyan-400/15 blur-3xl dark:bg-cyan-500/10" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-cyan-700 dark:text-cyan-300">
              <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-cyan-400" />
              Unified intelligence
            </p>
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Geopolitical &amp; supply{" "}
              <span className="text-gradient">decision surface</span>
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-400">
              Demand signals, ESG posture, and geo risk — orchestrated for
              operators who need clarity, not noise.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/60 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-200">
              <ArrowUpRight className="h-4 w-4 text-cyan-500" aria-hidden />
              Enterprise-grade analytics
            </span>
          </div>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Total Forecast Items" className="animate-fade-up [animation-delay:40ms]">
          <div className="flex items-center justify-between">
            <p className="font-mono text-3xl font-bold tabular-nums text-slate-900 dark:text-white">
              {forecast.length}
            </p>
            <TrendingUp
              className="text-cyan-500 transition-transform duration-300 group-hover:scale-110"
              size={32}
              strokeWidth={1.5}
            />
          </div>
        </Card>

        <Card title="Average ESG Score" className="animate-fade-up [animation-delay:80ms]">
          <div className="flex items-center justify-between">
            <p className="font-mono text-3xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
              {avgESG}
            </p>
            <Shield
              className="text-emerald-500 transition-transform duration-300 group-hover:scale-110"
              size={32}
              strokeWidth={1.5}
            />
          </div>
        </Card>

        <Card title="High Risk Countries" className="animate-fade-up [animation-delay:120ms]">
          <div className="flex items-center justify-between">
            <p className="font-mono text-3xl font-bold tabular-nums text-rose-600 dark:text-rose-400">
              {highRiskCountries}
            </p>
            <Globe
              className="text-rose-500 transition-transform duration-300 group-hover:scale-110"
              size={32}
              strokeWidth={1.5}
            />
          </div>
        </Card>

        <Card title="AI Insights" className="animate-fade-up [animation-delay:160ms]">
          <div className="flex items-start gap-4">
            <Brain
              className="shrink-0 text-indigo-500 dark:text-indigo-400"
              size={32}
              strokeWidth={1.5}
            />
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              AI-powered supply chain optimization using demand forecasting, ESG
              scoring, and geopolitical analysis.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
