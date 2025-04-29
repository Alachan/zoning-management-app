import React, { useState } from "react";
import {
  FiBarChart2,
  FiChevronLeft,
  FiChevronRight,
  FiLayers,
} from "react-icons/fi";
import StatsChart from "./StatsChart";
import StatItem from "./StatItem";
import { formatArea, ZONING_COLORS } from "../../utils/helpers";
import { useStatsData } from "../../hooks/useStatsData";

const StatsSidebar = ({ selectedParcels, selectedZoningType, isMobile }) => {
  const [expanded, setExpanded] = useState(!isMobile);

  // Use the stats hook to handle data fetching and state
  const { currentStats, simulatedStats, loading } = useStatsData(
    selectedParcels,
    selectedZoningType
  );

  // Don't render if no parcels are selected or if on mobile
  if (isMobile || !selectedParcels || selectedParcels.length === 0) {
    return null;
  }

  // Handle the collapse/expand
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div
      className={`absolute top-0 right-0 h-full ${
        expanded ? "w-64" : "w-12"
      } flex flex-col bg-white border-l border-gray-200 shadow-lg transition-all duration-200 ease-in-out z-[500]`}
    >
      {expanded ? (
        // Expanded header
        <div className="flex items-center justify-between p-2 border-b border-gray-200 bg-violet-100">
          <div className="flex items-center space-x-2">
            <FiBarChart2 className="text-violet-500" />
            <h3 className="font-medium text-gray-800">Statistics</h3>
          </div>
          <button
            onClick={toggleExpanded}
            className="p-1 rounded hover:bg-violet-200 transition-colors"
            title="Collapse panel"
          >
            <FiChevronRight />
          </button>
        </div>
      ) : (
        // Collapsed header with clear vertical label and icon
        <div
          className="h-full flex flex-col items-center py-3 bg-violet-100 cursor-pointer border-l border-violet-200"
          onClick={toggleExpanded}
          title="Expand statistics panel"
        >
          <FiBarChart2 className="text-violet-700 mb-2 w-6 h-6" />
          <div
            className="text-violet-700 font-medium tracking-wide"
            style={{
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              transform: "rotate(180deg)",
              letterSpacing: "1px",
            }}
          >
            STATISTICS
          </div>
          <FiChevronLeft className="mt-2 text-violet-700" />
        </div>
      )}

      {/* Content area - only shown when expanded */}
      {expanded && (
        <div className="flex-1 overflow-y-auto p-3 space-y-4 bg-white text-gray-800">
          {/* Loading state */}
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-500"></div>
            </div>
          ) : (
            <>
              {/* Basic stats */}
              <div className="grid grid-cols-1 gap-2">
                {" "}
                <StatItem
                  label="Selected Parcels"
                  value={selectedParcels.length}
                  icon={<FiLayers />}
                  className="bg-violet-50"
                />
                <StatItem
                  label="Total Area"
                  value={
                    currentStats ? formatArea(currentStats.totalArea) : "—"
                  }
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z"
                        clipRule="evenodd"
                      />
                    </svg>
                  }
                  className="bg-green-50"
                />
              </div>

              {/* Current zoning breakdown */}
              {currentStats && (
                <div className="mt-2">
                  {" "}
                  <h4 className="font-medium text-sm text-gray-700 mb-1">
                    {" "}
                    Current Zoning
                  </h4>
                  {/* Chart */}
                  <StatsChart
                    stats={currentStats}
                    title="Current Area Distribution"
                  />
                  {/* Table view */}
                  <div className="bg-white shadow-sm rounded-lg mt-2">
                    {" "}
                    <div className="px-2 py-1 border-b border-gray-100 text-xs text-gray-500 flex">
                      {" "}
                      <span className="w-4"></span>
                      <span className="flex-1">Type</span>
                      <span className="w-12 text-right">Count</span>{" "}
                      <span className="w-20 text-right">Area</span>{" "}
                    </div>
                    {Object.entries(currentStats.countByZoningType).map(
                      ([type, count]) => (
                        <div
                          key={type}
                          className="px-2 py-1 text-xs flex items-center"
                        >
                          <span className="w-4 flex items-center justify-center">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{
                                backgroundColor:
                                  ZONING_COLORS[type] || ZONING_COLORS.default,
                              }}
                            ></div>
                          </span>
                          <span className="flex-1 truncate" title={type}>
                            {type}
                          </span>
                          <span className="w-12 text-right">{count}</span>{" "}
                          <span className="w-20 text-right text-xs">
                            {" "}
                            {currentStats.areaByZoningType[type]
                              ? formatArea(currentStats.areaByZoningType[type])
                              : "—"}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Simulated zoning breakdown */}
              {simulatedStats && selectedZoningType && (
                <div className="mt-2">
                  {" "}
                  <h4 className="font-medium text-sm text-gray-700 mb-1">
                    {" "}
                    After Update to {selectedZoningType}
                  </h4>
                  {/* Chart */}
                  <StatsChart
                    stats={simulatedStats}
                    title="Simulated Area Distribution"
                  />
                  {/* Change summary */}
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-100 rounded-lg text-xs">
                    {" "}
                    <h5 className="text-xs font-medium text-yellow-800 mb-1">
                      {" "}
                      Changes Summary
                    </h5>
                    <p className="text-xs text-yellow-700">
                      {selectedParcels.length} parcels will be changed to{" "}
                      {selectedZoningType} zoning, affecting{" "}
                      {formatArea(currentStats ? currentStats.totalArea : 0)} of
                      land.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default StatsSidebar;
