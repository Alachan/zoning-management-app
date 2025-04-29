import { useState, useEffect } from "react";
import { parcelService } from "../services/api";

/**
 * Custom hook for fetching and managing statistics data
 * @param {Array} selectedParcels - Array of selected parcel IDs
 * @param {String} selectedZoningType - Currently selected zoning type
 * @returns {Object} Statistics data and loading state
 */
export const useStatsData = (selectedParcels, selectedZoningType) => {
  const [currentStats, setCurrentStats] = useState(null);
  const [simulatedStats, setSimulatedStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only fetch stats if we have selected parcels
    if (!selectedParcels || selectedParcels.length === 0) {
      setCurrentStats(null);
      setSimulatedStats(null);
      return;
    }

    const fetchStats = async () => {
      setLoading(true);
      try {
        // Get current statistics
        const stats = await parcelService.getParcelStats(selectedParcels);
        setCurrentStats(stats);

        // If we have a selected zoning type, simulate the update
        if (selectedZoningType) {
          const simulated = await parcelService.simulateZoningUpdate(
            selectedParcels,
            selectedZoningType
          );
          setSimulatedStats(simulated);
        } else {
          setSimulatedStats(null);
        }
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [selectedParcels, selectedZoningType]);

  return {
    currentStats,
    simulatedStats,
    loading,
  };
};
