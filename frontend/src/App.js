import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";

import Dashboard from "./pages/Dashboard";
import DemandForecast from "./pages/DemandForecast";
import ESGAnalysis from "./pages/ESGAnalysis";
import GeoRisk from "./pages/GeoRisk";
import Optimization from "./pages/Optimization";
import ScenarioSimulation from "./pages/ScenarioSimulation"; // ⭐ NEW

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout wrapper */}
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/forecast" element={<DemandForecast />} />
          <Route path="/esg" element={<ESGAnalysis />} />
          <Route path="/geo" element={<GeoRisk />} />
          <Route path="/optimize" element={<Optimization />} />

          {/* NEW ROUTE */}
          <Route path="/scenario" element={<ScenarioSimulation />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;