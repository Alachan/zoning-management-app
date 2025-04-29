import React from "react";
import ZoningControls from "./ZoningControls";
import { formatArea } from "../../utils/helpers";
import { useMobile } from "../../hooks/useMobile";

const FloatingUpdatePanel = ({
  selectedParcels,
  selectedZoningType,
  setSelectedZoningType,
  zoningTypes,
  onClickUpdate,
  isUpdating,
  isSelectMode,
  hasZoningChanged,
  currentStats,
}) => {
  const isMobile = useMobile();

  // Always show the floating panel on mobile when:
  // 1. In select mode, OR
  // 2. When parcels are selected
  if (!isMobile) {
    return null;
  }

  // Show panel if either condition is met
  const shouldShow = isSelectMode || selectedParcels.length > 0;

  return (
    <div
      className={`md:hidden fixed bottom-4 left-0 right-0 mx-auto max-w-xs bg-white rounded-lg shadow-lg p-3 z-[800] transition-opacity duration-300 ${
        shouldShow ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex flex-col space-y-2">
        {/* Stats Info */}
        {selectedParcels.length > 0 && (
          <div className="flex justify-between items-center px-1">
            <div className="flex items-center space-x-2">
              <div className="bg-violet-100 rounded-full w-5 h-5 flex items-center justify-center">
                <span className="text-xs font-medium text-violet-800">
                  {selectedParcels.length}
                </span>
              </div>
              <span className="text-xs text-gray-600">parcels selected</span>
            </div>
            {currentStats && (
              <div className="text-xs font-medium text-gray-700">
                {formatArea(currentStats.totalArea)}
              </div>
            )}
          </div>
        )}

        {/* Divider Line - only shown when we have stats above */}
        {selectedParcels.length > 0 && (
          <div className="border-t border-gray-100 my-1"></div>
        )}

        <ZoningControls
          selectedParcels={selectedParcels}
          selectedZoningType={selectedZoningType}
          setSelectedZoningType={setSelectedZoningType}
          zoningTypes={zoningTypes}
          onClickUpdate={onClickUpdate}
          isUpdating={isUpdating}
          hasZoningChanged={hasZoningChanged}
          buttonClassName="w-full px-4 py-2"
          selectClassName="w-full bg-white border border-gray-300 text-gray-800 px-3 py-2 rounded text-sm my-1"
          countClassName="text-center font-medium text-sm"
          showCount={false} // Hide the count since we're showing it above
        />
      </div>
    </div>
  );
};

export default FloatingUpdatePanel;
