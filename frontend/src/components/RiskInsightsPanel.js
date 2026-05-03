import React from "react";

const RiskInsightsPanel = ({ riskData }) => {
  if (!riskData || riskData.length === 0) {
    return (
      <div className="bg-gray-900 p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">AI Risk Insights</h2>
        <p>No data available.</p>
      </div>
    );
  }

  const topRisk = [...riskData]
    .sort((a, b) => b.risk_score - a.risk_score)
    .slice(0, 5);

  return (
    <div className="bg-gray-900 p-6 rounded-2xl shadow-lg text-white">
      <h2 className="text-xl font-bold mb-4">AI Risk Intelligence</h2>

      <div className="space-y-4">
        {topRisk.map((country, index) => (
          <div
            key={index}
            className="bg-gray-800 p-4 rounded-xl border border-gray-700"
          >
            <p className="font-semibold">{country.country}</p>
            <p>Risk Score: {country.risk_score}</p>
            <p>Sentiment: {country.sentiment}</p>
            <p>Articles: {country.article_count}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiskInsightsPanel;