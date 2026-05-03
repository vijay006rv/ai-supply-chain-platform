import React, { useEffect, useState } from "react";
import { getOptimization } from "../api";
import Card from "../components/Card";
import { useNavigate } from "react-router-dom"; // ⭐ NEW

const Optimization = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // ⭐ NEW

  useEffect(() => {
    getOptimization()
      .then(res => setData(res))
      .catch(() => setError("Failed to load optimization recommendation"))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <p className="text-lg font-medium">AI optimizing supply chain...</p>;

  if (error) return <p className="text-red-500">{error}</p>;
  if (!data) return null;

  const {
    best_suppliers = [],
    recommended_routes = [],
    risk_summary = [],
    message,
  } = data;

  // 🔐 SAFE formatter to prevent .toFixed crashes
  const formatNumber = (value, decimals = 2) => {
    if (value === null || value === undefined || isNaN(value)) return "0.00";
    return Number(value).toFixed(decimals);
  };

  return (
    <div className="space-y-6">

      {/* AI Message */}
      {message && (
        <Card title="AI Strategy Recommendation">
          <p className="text-gray-600 italic">{message}</p>
        </Card>
      )}

      {/* Top Suppliers */}
      <Card title={`Top Suppliers (${best_suppliers.length})`}>
        {best_suppliers.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {best_suppliers.map((supplier, idx) => (
              <div
                key={idx}
                className="border rounded-xl p-4 shadow-sm hover:shadow-md transition"
              >
                <h4 className="font-semibold mb-2 text-indigo-600">
                  #{idx + 1}: {supplier.supplier_name} ({supplier.location})
                </h4>

                <ul className="text-sm space-y-1">
                  <li>
                    <strong>Composite Score:</strong>{" "}
                    {formatNumber(supplier.composite_score, 3)}
                  </li>
                  <li>
                    <strong>Predicted Demand:</strong>{" "}
                    {formatNumber(supplier.predicted_demand, 1)}
                  </li>
                  <li>
                    <strong>Manufacturing Cost:</strong>{" "}
                    {formatNumber(supplier.avg_manufacturing_cost, 2)}
                  </li>
                  <li>
                    <strong>Logistics Cost:</strong>{" "}
                    {formatNumber(supplier.avg_logistics_cost, 2)}
                  </li>
                  <li>
                    <strong>ESG Score:</strong>{" "}
                    {formatNumber(supplier.esg_score, 3)}
                  </li>
                  <li>
                    <strong>Geo Safety Score:</strong>{" "}
                    {formatNumber(supplier.geo_safety_score, 3)}
                  </li>
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p>No supplier data available</p>
        )}
      </Card>

      {/* Routes */}
      <Card title={`Recommended Routes (${recommended_routes.length})`}>
        {recommended_routes.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {recommended_routes.map((route, idx) => (
              <div
                key={idx}
                className="border rounded-xl p-4 shadow-sm hover:shadow-md transition"
              >
                <h4 className="font-semibold mb-2 text-blue-600">
                  #{idx + 1}: {route.route}
                </h4>

                <ul className="text-sm space-y-1">
                  <li><strong>Mode:</strong> {route.mode}</li>
                  <li><strong>Carrier:</strong> {route.carrier}</li>
                  <li>
                    <strong>Average Cost:</strong>{" "}
                    {formatNumber(route.avg_cost, 2)}
                  </li>
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p>No route data available</p>
        )}
      </Card>

      {/* Risk Summary */}
      <Card title={`Risk Summary (${risk_summary.length})`}>
        {risk_summary.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {risk_summary.map((risk, idx) => (
              <div
                key={idx}
                className={`border rounded-xl p-4 shadow-sm ${
                  risk.risk_level === "High"
                    ? "bg-red-50"
                    : risk.risk_level === "Medium"
                    ? "bg-yellow-50"
                    : "bg-green-50"
                }`}
              >
                <h4 className="font-semibold mb-2">
                  {risk.type} Risk — {risk.region}
                </h4>

                <ul className="text-sm space-y-1">
                  <li><strong>Risk Level:</strong> {risk.risk_level}</li>
                  <li>
                    <strong>Risk Score:</strong>{" "}
                    {formatNumber(risk.score, 3)}
                  </li>
                  <li><strong>Details:</strong> {risk.details}</li>
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p>No risk data available</p>
        )}
      </Card>

      {/* ⭐ Scenario Simulation */}
      <Card title="Scenario Simulation">
        <p className="text-gray-600 mb-4">
          Simulate supply chain changes such as demand surge, fuel price
          increase, ESG restrictions, or geopolitical risk limits.
        </p>

        <button
          onClick={() => navigate("/scenario")}
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
        >
          Run Scenario Simulation
        </button>
      </Card>

    </div>
  );
};

export default Optimization;