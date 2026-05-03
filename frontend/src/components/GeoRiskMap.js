import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import axios from "axios";

export default function GeoRiskMap() {
  const [geo, setGeo] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/geo-risk")
      .then(res => {
        setGeo(res.data.items || res.data || []);
      })
      .catch(() => {});
  }, []);

  const getColor = (risk) => {
    if (risk > 0.6) return "red";
    if (risk > 0.4) return "orange";
    return "green";
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4">
      <h3 className="text-lg font-semibold mb-4">
        Global Geopolitical Risk Map
      </h3>

      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: "450px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {geo.map((g, index) => (
          <CircleMarker
            key={index}
            center={[Math.random() * 140 - 70, Math.random() * 360 - 180]}
            radius={10}
            color={getColor(g.risk_score)}
          >
            <Tooltip>
              <strong>{g.country}</strong> <br />
              Risk: {g.risk_score} <br />
              Articles: {g.articles}
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}