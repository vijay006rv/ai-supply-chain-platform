import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-8 text-blue-400">
          AI Supply Chain
        </h2>

        <nav className="flex flex-col gap-5 text-sm">
          <Link to="/" className="hover:text-blue-400 transition">Dashboard</Link>
          <Link to="/forecast" className="hover:text-blue-400 transition">Demand Forecast</Link>
          <Link to="/esg" className="hover:text-blue-400 transition">ESG Analysis</Link>
          <Link to="/geo" className="hover:text-blue-400 transition">Geo Risk</Link>
          <Link to="/optimize" className="hover:text-blue-400 transition">Optimization</Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">

        {/* Top header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            AI-Driven Supply Chain Dashboard
          </h1>
          <p className="text-gray-500">
            Demand Forecast • ESG Intelligence • Geo-Political Risk • Optimization
          </p>
        </div>

        <Outlet />
      </div>
    </div>
  );
}
