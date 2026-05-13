import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { getDemandForecast } from "../api";
import Card from "../components/Card";
import SkeletonPulse from "../components/SkeletonPulse";
import { useTheme } from "../context/ThemeContext";
import { getLineChartOptions } from "../utils/chartDefaults";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

const DemandForecast = ({ compact = false }) => {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDemandForecast()
      .then((res) => setData(res.items || res || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const labels = data.map((d) => d.SKU || d.ProductType || "Item");
  const values = data.map((d) => d.PredictedDemand || 0);

  const lineRgb = isDark ? "34, 211, 238" : "8, 145, 178";
  const chartData = {
    labels,
    datasets: [
      {
        label: "Predicted Demand",
        data: values,
        borderColor: `rgb(${lineRgb})`,
        backgroundColor: `rgba(${lineRgb},0.12)`,
        tension: 0.4,
        fill: true,
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 2,
      },
    ],
  };

  if (loading) {
    return (
      <Card title="AI Demand Forecast">
        <SkeletonPulse className="h-[280px] w-full rounded-xl" />
      </Card>
    );
  }

  return (
    <Card title="AI Demand Forecast" subtitle="Model-driven demand curve by SKU / product type">
      <div className="relative min-h-[260px] w-full">
        <Line data={chartData} options={getLineChartOptions(isDark)} />
      </div>
    </Card>
  );
};

export default DemandForecast;
