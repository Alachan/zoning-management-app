import React from "react";

// Shared component for zoning type dropdown and update button
const ZoningControls = ({
  selectedParcels,
  selectedZoningType,
  setSelectedZoningType,
  zoningTypes,
  onClickUpdate,
  isUpdating,
  hasZoningChanged,
  buttonClassName = "",
  selectClassName = "",
  countClassName = "",
  showCount = true,
}) => {
  const disabled =
    selectedParcels.length === 0 || isUpdating || !hasZoningChanged;

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
      {showCount && (
        <div className={countClassName || "text-sm"}>
          {selectedParcels.length > 0
            ? `${selectedParcels.length} parcels selected`
            : "No parcels selected"}
        </div>
      )}

      <select
        className={
          selectClassName || "bg-white text-gray-800 px-3 py-1 rounded text-sm"
        }
        value={selectedZoningType}
        onChange={(e) => setSelectedZoningType(e.target.value)}
        disabled={selectedParcels.length === 0}
      >
        <option value="" disabled>
          Select zoning type
        </option>
        {zoningTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <button
        className={`flex items-center justify-center rounded text-sm font-medium ${
          !disabled
            ? "bg-fuchsia-500 hover:bg-fuchsia-600"
            : "bg-gray-400 cursor-not-allowed"
        } ${buttonClassName || "px-4 py-1"}`}
        onClick={onClickUpdate}
        disabled={disabled}
      >
        {isUpdating ? (
          <svg
            className="animate-spin h-5 w-5 text-white mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        ) : null}
        {isUpdating ? "Updating..." : "Update Zoning"}
      </button>
    </div>
  );
};

export default ZoningControls;
