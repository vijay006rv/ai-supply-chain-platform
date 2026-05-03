import React, { useEffect, useState } from "react";
import { getGeoRisk } from "../api";
import Card from "../components/Card";
import GeoRiskMap from "../components/GeoRiskMap";
import GeoRiskHeatMap from "../components/GeoRiskHeatMap";
import RiskInsightsPanel from "../components/RiskInsightsPanel";

const GeoRisk = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // NEW
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

  if (loading)
    return (
      <p className="text-lg font-medium text-gray-600">
        Loading geopolitical intelligence...
      </p>
    );

  if (error) return <p className="text-red-500">{error}</p>;

  const getColor = (score) => {
    if (score < 0.3) return "text-green-600 font-semibold";
    if (score < 0.6) return "text-yellow-500 font-semibold";
    return "text-red-600 font-semibold";
  };

  // REGION FILTER LOGIC
  const filteredData =
    region === "All"
      ? data
      : data.filter((row) => row.region === region);

  // TOP RISK COUNTRIES
  const topRiskCountries = [...data]
    .sort((a, b) => b.final_risk - a.final_risk)
    .slice(0, 5);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <Card title="Global Geo-Political Intelligence Dashboard">
        <div className="flex justify-between items-center mb-4">

          {/* Region Filter */}
          <div>
            <label className="text-sm font-medium text-gray-600 mr-2">
              Filter by Region:
            </label>
            <select
              className="border rounded-lg p-2"
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

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-600">
                <th className="p-3">Country</th>
                <th className="p-3">Supply</th>
                <th className="p-3">War</th>
                <th className="p-3">Trade</th>
                <th className="p-3">Climate</th>
                <th className="p-3">Energy</th>
                <th className="p-3">Final Risk</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b hover:bg-gray-50 transition duration-200"
                >
                  <td className="p-3 font-semibold text-gray-800">
                    {row.country}
                  </td>

                  <td className={`p-3 ${getColor(row.supply_risk)}`}>
                    {row.supply_risk}
                  </td>

                  <td className={`p-3 ${getColor(row.war_risk)}`}>
                    {row.war_risk}
                  </td>

                  <td className={`p-3 ${getColor(row.trade_risk)}`}>
                    {row.trade_risk}
                  </td>

                  <td className={`p-3 ${getColor(row.climate_risk)}`}>
                    {row.climate_risk}
                  </td>

                  <td className={`p-3 ${getColor(row.energy_risk)}`}>
                    {row.energy_risk}
                  </td>

                  <td className={`p-3 text-lg ${getColor(row.final_risk)}`}>
                    {row.final_risk}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* HEAT MAP + INSIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        

        {/* AI INSIGHTS PANEL */}
        <RiskInsightsPanel riskData={data} />
      </div>

      {/* TOP RISK COUNTRIES */}
      <Card title="Top High-Risk Countries">
        <div className="grid md:grid-cols-5 gap-4">
          {topRiskCountries.map((country, index) => (
            <div
              key={index}
              className="bg-red-50 border border-red-200 rounded-xl p-4"
            >
              <p className="font-semibold text-gray-800">
                {country.country}
              </p>
              <p className="text-red-600 text-lg font-bold">
                {country.final_risk}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* ORIGINAL MAP (kept intact) */}
      <Card title="Geo Risk Table Map View">
        <GeoRiskMap />
      </Card>
    </div>
  );
};

export default GeoRisk;