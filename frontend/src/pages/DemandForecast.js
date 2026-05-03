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
} from "chart.js";
import { getDemandForecast } from "../api";
import Card from "../components/Card";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const DemandForecast = ({ compact = false }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDemandForecast()
      .then(res => setData(res.items || res || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const labels = data.map(d => d.SKU || d.ProductType || "Item");
  const values = data.map(d => d.PredictedDemand || 0);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Predicted Demand",
        data: values,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.15)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  if (loading)
    return <p className="text-lg font-medium">Loading AI forecast...</p>;

  return (
    <Card title="AI Demand Forecast">
      <Line data={chartData} options={{ responsive: true }} />
    </Card>
  );
};

export default DemandForecast;
