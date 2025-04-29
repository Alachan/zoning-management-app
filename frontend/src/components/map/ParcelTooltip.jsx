import React from "react";
import { formatArea } from "../../utils/helpers";

const ParcelTooltip = ({ parcel }) => {
  if (!parcel) return null;

  // Format area value with 2 decimal places
  const formattedArea = parcel.area ? formatArea(parcel.area) : null;

  return (
    <div className="bg-white/80 backdrop-blur-sm shadow-md rounded px-3 py-2 max-w-xs border border-gray-200">
      <h6 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-1 mb-1.5">
        Parcel Information
      </h6>

      <div className="space-y-1 text-xs">
        {parcel.name && (
          <div className="flex items-center">
            <span className="font-medium text-gray-600 w-18">Owner:</span>
            <span className="text-gray-800">{parcel.name}</span>
          </div>
        )}

        {parcel.mailingAddress && (
          <div className="flex items-center">
            <span className="font-medium text-gray-600 w-18">Address:</span>
            <span className="text-gray-800">{parcel.mailingAddress}</span>
          </div>
        )}

        {parcel.zoningType && (
          <div className="flex items-center">
            <span className="font-medium text-gray-600 w-18">Zoning:</span>
            <span className="text-gray-800">{parcel.zoningType}</span>
          </div>
        )}

        {formattedArea && (
          <div className="flex items-center">
            <span className="font-medium text-gray-600 w-18">Area:</span>
            <span className="text-gray-800">{formattedArea}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParcelTooltip;
