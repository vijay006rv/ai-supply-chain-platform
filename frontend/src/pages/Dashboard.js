import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card";
import { TrendingUp, Shield, Globe, Brain } from "lucide-react";

export default function Dashboard() {
  const [forecast, setForecast] = useState([]);
  const [esg, setEsg] = useState([]);
  const [geo, setGeo] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/forecast-demand")
      .then((res) => setForecast(Array.isArray(res.data.items) ? res.data.items : res.data || []))
      .catch(() => setForecast([]));

    axios
      .get("http://127.0.0.1:8000/esg-score")
      .then((res) => setEsg(Array.isArray(res.data.items) ? res.data.items : res.data || []))
      .catch(() => setEsg([]));

    axios
      .get("http://127.0.0.1:8000/geo-risk")
      .then((res) => setGeo(Array.isArray(res.data) ? res.data : res.data.items || []))
      .catch(() => setGeo([]));
  }, []);

  const avgESG =
    esg.length > 0
      ? (
          esg.reduce((a, b) => a + (b.esg_score || b.ESG_Total || 0), 0) /
          esg.length
        ).toFixed(1)
      : 0;

  const highRiskCountries =
    geo.length > 0
      ? geo.filter((g) => (g.risk_score || 0) > 0.6).length
      : 0;

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">


      <Card title="Total Forecast Items">
        <div className="flex items-center justify-between">
          <p className="text-3xl font-bold">{forecast.length}</p>
          <TrendingUp className="text-blue-500" size={32} />
        </div>
      </Card>

      <Card title="Average ESG Score">
        <div className="flex items-center justify-between">
          <p className="text-3xl font-bold text-green-600">{avgESG}</p>
          <Shield className="text-green-500" size={32} />
        </div>
      </Card>

      <Card title="High Risk Countries">
        <div className="flex items-center justify-between">
          <p className="text-3xl font-bold text-red-600">{highRiskCountries}</p>
          <Globe className="text-red-500" size={32} />
        </div>
      </Card>

      <Card title="AI Insights">
        <div className="flex items-center gap-4">
          <Brain className="text-purple-500" size={32} />
          <p className="text-gray-600">
            AI-powered supply chain optimization using demand forecasting,
            ESG scoring and geopolitical analysis.
          </p>
        </div>
      </Card>

    </div>
  );
}
