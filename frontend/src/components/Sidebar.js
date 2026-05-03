import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-8">AI Supply Chain</h1>

      <nav className="space-y-4">
        <Link to="/" className="block hover:text-yellow-400">
          Dashboard
        </Link>

        <Link to="/forecast" className="block hover:text-yellow-400">
          Demand Forecast
        </Link>

        <Link to="/esg" className="block hover:text-yellow-400">
          ESG Analysis
        </Link>

        <Link to="/geo" className="block hover:text-yellow-400">
          Geo Risk
        </Link>

        <Link to="/optimize" className="block hover:text-yellow-400">
          Optimization
        </Link>

        {/* ⭐ NEW */}
        <Link to="/scenario" className="block hover:text-yellow-400">
          Scenario Simulation
        </Link>
      </nav>
    </div>
  );
}