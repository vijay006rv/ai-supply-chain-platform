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
import SkeletonPulse from "../components/SkeletonPulse";
import { useTheme } from "../context/ThemeContext";
import { getBarChartOptions } from "../utils/chartDefaults";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const ESGAnalysis = ({ compact = false }) => {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEsgScores()
      .then((res) => setData(res.items || res || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const top = data.slice(0, 12);

  const barPrimary = isDark ? "16, 185, 129" : "5, 150, 105";
  const chartData = {
    labels: top.map((d) => d.CompanyName || d.CompanyID),
    datasets: [
      {
        label: "ESG Score",
        data: top.map((d) => d.ESG_Total || 0),
        backgroundColor: `rgba(${barPrimary},0.55)`,
        borderColor: `rgb(${barPrimary})`,
        borderWidth: 1,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  if (loading) {
    return (
      <Card title="ESG Supplier Intelligence">
        <SkeletonPulse className="h-[280px] w-full rounded-xl" />
      </Card>
    );
  }

  return (
    <Card
      title="ESG Supplier Intelligence"
      subtitle="Top suppliers by composite ESG score"
    >
      <div className="relative min-h-[260px] w-full">
        <Bar data={chartData} options={getBarChartOptions(isDark)} />
      </div>
    </Card>
  );
};

export default ESGAnalysis;
