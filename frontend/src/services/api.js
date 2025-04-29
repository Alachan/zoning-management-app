import axios from "axios";

// Get the API base URL from environment variables
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Parcel service functions
export const parcelService = {
  // Get all parcels
  getAllParcels: async () => {
    try {
      const response = await apiClient.get("/api/parcels");
      return response.data;
    } catch (error) {
      console.error("Error fetching parcels:", error);
      throw error;
    }
  },

  // Get all zoning types
  getZoningTypes: async () => {
    try {
      const response = await apiClient.get("/api/zoning-types");
      return response.data;
    } catch (error) {
      console.error("Error fetching zoning types:", error);
      throw error;
    }
  },

  // Update zoning for parcels
  updateZoning: async (parcelIds, zoningType) => {
    try {
      const response = await apiClient.put("/api/parcels/zoning", {
        parcelIds,
        zoningType,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating zoning:", error);
      throw error;
    }
  },

  // Get statistics for selected parcels
  getParcelStats: async (parcelIds) => {
    try {
      if (!parcelIds || parcelIds.length === 0) {
        return {
          totalCount: 0,
          totalArea: 0,
          countByZoningType: {},
          areaByZoningType: {},
        };
      }

      const response = await apiClient.post("/api/stats", parcelIds);
      return response.data;
    } catch (error) {
      console.error("Error fetching parcel statistics:", error);
      throw error;
    }
  },

  // Simulate statistics after zoning update
  simulateZoningUpdate: async (parcelIds, zoningType) => {
    try {
      if (!parcelIds || parcelIds.length === 0 || !zoningType) {
        return {
          totalCount: 0,
          totalArea: 0,
          countByZoningType: {},
          areaByZoningType: {},
        };
      }

      const response = await apiClient.post("/api/stats/simulate", {
        parcelIds,
        zoningType,
      });
      return response.data;
    } catch (error) {
      console.error("Error simulating zoning update:", error);
      throw error;
    }
  },
};
