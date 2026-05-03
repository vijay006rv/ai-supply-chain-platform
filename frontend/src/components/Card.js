import React from "react";

export default function Card({ title, subtitle, icon, children }) {
  return (
    <div
      className="
      bg-white/60 backdrop-blur-lg
      shadow-xl rounded-2xl p-6
      hover:shadow-2xl hover:-translate-y-1
      transition duration-300
      border border-white/40
    "
    >
      {/* Header */}
      {(title || icon) && (
        <div className="flex items-center justify-between mb-4">

          <div>
            {title && (
              <h3 className="text-lg font-semibold text-gray-700">
                {title}
              </h3>
            )}

            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">
                {subtitle}
              </p>
            )}
          </div>

          {icon && (
            <div className="text-xl text-indigo-600">
              {icon}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div>{children}</div>
    </div>
  );
}