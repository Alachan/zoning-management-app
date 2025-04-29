import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { parcelService } from "../services/api";

/**
 * Custom hook for fetching and managing parcel and zoning type data
 * @returns {Object} Parcel data, zoning types, and loading state
 */
export const useParcelData = () => {
  const [parcels, setParcels] = useState([]);
  const [zoningTypes, setZoningTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch parcels and zoning types on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch parcels
        const parcelData = await parcelService.getAllParcels();
        setParcels(parcelData);

        // Fetch zoning types
        const zoningTypeData = await parcelService.getZoningTypes();
        setZoningTypes(zoningTypeData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load parcel data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to update parcels after a zoning update
  const updateParcelsZoning = (parcelIds, zoningType) => {
    setParcels((prevParcels) =>
      prevParcels.map((parcel) =>
        parcelIds.includes(parcel.id)
          ? { ...parcel, zoningType: zoningType }
          : parcel
      )
    );
  };

  return {
    parcels,
    setParcels,
    zoningTypes,
    loading,
    updateParcelsZoning,
  };
};
