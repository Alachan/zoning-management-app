import { useState } from "react";
import { toast } from "react-toastify";
import { parcelService } from "../services/api";

/**
 * Custom hook for handling zoning updates
 * @param {Function} updateParcelsZoning - Function to update parcels in state
 * @param {Function} clearSelections - Function to clear selections after update
 * @param {Function} setIsSelectMode - Function to update select mode state
 * @returns {Object} Update state and handlers
 */
export const useZoningUpdates = (
  updateParcelsZoning,
  clearSelections,
  setIsSelectMode
) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Handle update button click
  const onClickUpdate = (selectedParcels, selectedZoningType) => {
    if (selectedParcels.length > 0 && selectedZoningType) {
      setShowConfirmModal(true);
    }
  };

  // Handle update confirmation
  const onConfirmUpdate = async (selectedParcels, selectedZoningType) => {
    setShowConfirmModal(false);
    setIsUpdating(true);

    try {
      await handleUpdateZoning(selectedParcels, selectedZoningType);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle update cancellation
  const onCancelUpdate = () => {
    setShowConfirmModal(false);
  };

  // Execute the actual zoning update
  const handleUpdateZoning = async (selectedParcels, selectedZoningType) => {
    if (selectedParcels.length === 0 || !selectedZoningType) return;

    try {
      await parcelService.updateZoning(selectedParcels, selectedZoningType);

      // Show success toast
      toast.success(
        `Successfully updated ${selectedParcels.length} parcels to ${selectedZoningType}`
      );

      // Update the parcels in state with the new zoning type
      updateParcelsZoning(selectedParcels, selectedZoningType);

      // Clear selections after successful update
      clearSelections();

      // Switch back to view mode after update
      setIsSelectMode(false);
    } catch (error) {
      console.error("Error updating zoning types:", error);
      // Show error toast
      toast.error("Failed to update zoning");
    }
  };

  return {
    isUpdating,
    showConfirmModal,
    onClickUpdate,
    onConfirmUpdate,
    onCancelUpdate,
  };
};
