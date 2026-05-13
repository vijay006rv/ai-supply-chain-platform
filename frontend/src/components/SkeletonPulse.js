import React from "react";

export default function SkeletonPulse({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-300/70 dark:bg-slate-600/40 ${className}`}
      aria-hidden
    />
  );
}
