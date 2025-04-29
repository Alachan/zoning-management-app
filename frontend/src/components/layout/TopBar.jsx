import React from "react";
import { IoEyeOutline, IoHandLeftOutline } from "react-icons/io5";
import ZoningControls from "../zoning/ZoningControls";

const TopBar = ({
  selectedParcels,
  selectedZoningType,
  setSelectedZoningType,
  zoningTypes,
  onClickUpdate,
  isUpdating,
  isSelectMode,
  toggleSelectMode,
  hasZoningChanged,
}) => {
  return (
    <>
      <div className="bg-violet-900 text-white px-4 py-3 flex justify-between items-center shadow-md">
        <div className="text-xl font-bold">Zoning Tool</div>

        <div className="flex items-center space-x-2">
          {/* Mode Toggle Button - Only visible on mobile */}
          <button
            onClick={toggleSelectMode}
            className="md:hidden flex items-center px-3 py-1 bg-green-300 hover:bg-green-600 rounded text-black text-sm transition-colors"
          >
            {isSelectMode ? (
              <>
                <IoEyeOutline className="mr-1" /> View
              </>
            ) : (
              <>
                <IoHandLeftOutline className="mr-1" /> Select
              </>
            )}
          </button>
        </div>

        {/* Desktop Controls - Hidden on mobile */}
        <div className="hidden md:flex items-center space-x-4">
          <ZoningControls
            selectedParcels={selectedParcels}
            selectedZoningType={selectedZoningType}
            setSelectedZoningType={setSelectedZoningType}
            zoningTypes={zoningTypes}
            onClickUpdate={onClickUpdate}
            isUpdating={isUpdating}
            hasZoningChanged={hasZoningChanged}
            countClassName="text-sm text-white"
          />
        </div>
      </div>
    </>
  );
};

export default TopBar;
