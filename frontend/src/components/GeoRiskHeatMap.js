import React, { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import axios from "axios";

const geoUrl =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

const GeoRiskHeatMap = ({ selectedRegion }) => {
  const [geoData, setGeoData] = useState([]);
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    fetchRiskData();
  }, []);

  const fetchRiskData = async () => {
    try {
      const res = await axios.get("http://localhost:8000/geo-risk");
      setGeoData(res.data);
    } catch (error) {
      console.error("Error fetching geo risk:", error);
    }
  };

  // 🔥 FIXED SCALE (0 → 1)
  const colorScale = scaleLinear()
    .domain([0, 1])
    .range(["#22c55e", "#ef4444"]);

  // 🔥 COUNTRY NAME NORMALIZER
  const normalizeCountry = (name) => {
    if (!name) return "";

    return name
      .toUpperCase()
      .replace("UNITED STATES", "UNITED STATES OF AMERICA")
      .replace("RUSSIAN FEDERATION", "RUSSIA")
      .replace("UK", "UNITED KINGDOM")
      .replace("KOREA, REP.", "SOUTH KOREA")
      .trim();
  };

  const getCountryRisk = (countryName) => {
    const normalized = normalizeCountry(countryName);

    return geoData.find(
      (c) => normalizeCountry(c.country) === normalized
    );
  };

  return (
    <div className="bg-gray-900 p-4 rounded-2xl shadow-lg">
      <ComposableMap projectionConfig={{ scale: 160 }}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const countryName = geo.properties.NAME;
              const country = getCountryRisk(countryName);
              const risk = country ? country.final_risk : 0;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={colorScale(risk)}
                  stroke="#111827"
                  onMouseEnter={() => {
                    if (country) {
                      setTooltip({
                        name: country.country,
                        risk: country.final_risk,
                        supply: country.supply_risk,
                        war: country.war_risk,
                        trade: country.trade_risk,
                        climate: country.climate_risk,
                        energy: country.energy_risk,
                      });
                    }
                  }}
                  onMouseLeave={() => setTooltip(null)}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#facc15", outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {/* TOOLTIP PANEL */}
      {tooltip && (
        <div className="mt-4 bg-gray-800 p-4 rounded-xl text-sm text-white">
          <p className="font-bold mb-2">{tooltip.name}</p>
          <p>Final Risk: {tooltip.risk}</p>
          <p>Supply: {tooltip.supply}</p>
          <p>War: {tooltip.war}</p>
          <p>Trade: {tooltip.trade}</p>
          <p>Climate: {tooltip.climate}</p>
          <p>Energy: {tooltip.energy}</p>
        </div>
      )}
    </div>
  );
};

export default GeoRiskHeatMap;