import { useState, useEffect } from "react";

/**
 * Custom hook for managing parcel selection and zoning type
 * @param {Array} parcels - All available parcels
 * @param {Array} zoningTypes - Available zoning types
 * @param {Boolean} isMobile - Whether the app is in mobile view
 * @returns {Object} Selection state and handlers
 */
export const useParcelSelection = (parcels, zoningTypes) => {
  const [selectedParcels, setSelectedParcels] = useState([]);
  const [selectedZoningType, setSelectedZoningType] = useState("");
  const [hasZoningChanged, setHasZoningChanged] = useState(false);

  // Set initial zoning type based on first selected parcel
  useEffect(() => {
    if (selectedParcels.length > 0 && zoningTypes.length > 0) {
      // Find the first selected parcel's zoning type
      const selectedParcel = parcels.find((p) => p.id === selectedParcels[0]);
      if (selectedParcel && selectedParcel.zoningType) {
        setSelectedZoningType(selectedParcel.zoningType);
      } else {
        // Fallback to first zoning type if the parcel has no zoning
        setSelectedZoningType(zoningTypes[0]);
      }
    }
  }, [parcels, selectedParcels, zoningTypes]);

  // Clear zoning type when no parcels are selected
  useEffect(() => {
    if (selectedParcels.length === 0) {
      setSelectedZoningType("");
    }
  }, [selectedParcels]);

  // Track zoning changes
  useEffect(() => {
    if (selectedParcels.length === 0 || !selectedZoningType) {
      setHasZoningChanged(false);
      return;
    }

    // Check if all selected parcels already have the same zoning type
    const allSameZoning = selectedParcels.every((parcelId) => {
      const parcel = parcels.find((p) => p.id === parcelId);
      return parcel && parcel.zoningType === selectedZoningType;
    });

    // If all have the same zoning type as what's selected, then nothing has changed
    setHasZoningChanged(!allSameZoning);
  }, [selectedParcels, selectedZoningType, parcels]);

  // Function to clear selections
  const clearSelections = () => {
    setSelectedParcels([]);
    setSelectedZoningType("");
  };

  return {
    selectedParcels,
    setSelectedParcels,
    selectedZoningType,
    setSelectedZoningType,
    hasZoningChanged,
    clearSelections,
  };
};
