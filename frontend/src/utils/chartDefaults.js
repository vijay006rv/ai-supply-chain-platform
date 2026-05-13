/** Chart.js defaults aligned with app light/dark theme (no API impact). */
export function getLineChartOptions(isDark) {
  const tick = isDark ? "#94a3b8" : "#64748b";
  const grid = isDark ? "rgba(148,163,184,0.08)" : "rgba(15,23,42,0.06)";
  return {
    responsive: true,
    maintainAspectRatio: true,
    animation: { duration: 900, easing: "easeOutQuart" },
    plugins: {
      legend: {
        labels: { color: tick, font: { family: "'DM Sans', sans-serif", size: 12 } },
      },
    },
    scales: {
      x: {
        ticks: { color: tick },
        grid: { color: grid },
      },
      y: {
        ticks: { color: tick },
        grid: { color: grid },
      },
    },
  };
}

export function getBarChartOptions(isDark) {
  const tick = isDark ? "#94a3b8" : "#64748b";
  const grid = isDark ? "rgba(148,163,184,0.08)" : "rgba(15,23,42,0.06)";
  return {
    responsive: true,
    maintainAspectRatio: true,
    animation: { duration: 900, easing: "easeOutQuart" },
    plugins: {
      legend: {
        labels: { color: tick, font: { family: "'DM Sans', sans-serif", size: 12 } },
      },
    },
    scales: {
      x: {
        ticks: { color: tick, maxRotation: 45, minRotation: 0 },
        grid: { color: grid },
      },
      y: {
        ticks: { color: tick },
        grid: { color: grid },
      },
    },
  };
}
