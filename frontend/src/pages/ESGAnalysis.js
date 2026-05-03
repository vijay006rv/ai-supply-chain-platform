import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { getEsgScores } from "../api";
import Card from "../components/Card";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const ESGAnalysis = ({ compact = false }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEsgScores()
      .then(res => setData(res.items || res || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const top = data.slice(0, 12);

  const chartData = {
    labels: top.map(d => d.CompanyName || d.CompanyID),
    datasets: [
      {
        label: "ESG Score",
        data: top.map(d => d.ESG_Total || 0),
        backgroundColor: "#10b981",
        borderRadius: 8,
      },
    ],
  };

  if (loading)
    return <p className="text-lg font-medium">Loading ESG analysis...</p>;

  return (
    <Card title="ESG Supplier Intelligence">
      <Bar data={chartData} options={{ responsive: true }} />
    </Card>
  );
};

export default ESGAnalysis;
