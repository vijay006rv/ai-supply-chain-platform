import React, { useState } from "react";
import { runScenario } from "../api";

export default function ScenarioSimulation() {

  const [demandMultiplier, setDemandMultiplier] = useState(1.0);
  const [fuelMultiplier, setFuelMultiplier] = useState(1.0);
  const [minEsg, setMinEsg] = useState("");
  const [maxGeoRisk, setMaxGeoRisk] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleRunScenario = async () => {

    setLoading(true);

    try {

      const data = await runScenario({
        demand_multiplier: parseFloat(demandMultiplier),
        fuel_cost_multiplier: parseFloat(fuelMultiplier),
        min_esg_score: minEsg ? parseFloat(minEsg) : null,
        max_geo_risk: maxGeoRisk ? parseFloat(maxGeoRisk) : null
      });

      setResult(data);

    } catch (error) {
      console.error("Scenario error:", error);
      alert("Scenario simulation failed");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">
        Supply Chain Scenario Simulator
      </h1>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-4">

        <div>
          <label className="text-sm">Demand Multiplier</label>
          <input
            type="number"
            step="0.1"
            value={demandMultiplier}
            onChange={(e) => setDemandMultiplier(e.target.value)}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label className="text-sm">Fuel Cost Multiplier</label>
          <input
            type="number"
            step="0.1"
            value={fuelMultiplier}
            onChange={(e) => setFuelMultiplier(e.target.value)}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label className="text-sm">Minimum ESG Score</label>
          <input
            type="number"
            value={minEsg}
            onChange={(e) => setMinEsg(e.target.value)}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label className="text-sm">Maximum Geo Risk</label>
          <input
            type="number"
            step="0.1"
            value={maxGeoRisk}
            onChange={(e) => setMaxGeoRisk(e.target.value)}
            className="border p-2 w-full"
          />
        </div>

      </div>

      {/* Run Button */}
      <button
        onClick={handleRunScenario}
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        {loading ? "Running..." : "Run Scenario"}
      </button>

      {/* Results */}
      {result && (
        <div className="mt-6">

          <h2 className="text-xl font-semibold mb-3">
            Scenario Results
          </h2>

          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(result.scenario_results, null, 2)}
          </pre>

        </div>
      )}

    </div>
  );
}