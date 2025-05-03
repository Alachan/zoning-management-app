import React, { useState, useCallback } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import all hooks from the index file
import {
  useMobile,
  useStatsData,
  useParcelData,
  useParcelSelection,
  useZoningUpdates,
} from "./hooks";

// Import components
import TopBar from "./components/layout/TopBar";
import ConfirmModal from "./components/zoning/ConfirmModal";
import ParcelLayer from "./components/map/ParcelLayer";
import FloatingUpdatePanel from "./components/zoning/FloatingUpdatePanel";
import StatsSidebar from "./components/stats/StatsSidebar";

const App = () => {
  const [isSelectMode, setIsSelectMode] = useState(false);
  const isMobile = useMobile();

  // Fetch and manage parcel data
  const { parcels, zoningTypes, loading, updateParcelsZoning } =
    useParcelData();

  // Manage parcel selection state
  const {
    selectedParcels,
    setSelectedParcels,
    selectedZoningType,
    setSelectedZoningType,
    hasZoningChanged,
    clearSelections,
  } = useParcelSelection(parcels, zoningTypes);

  // Handle zoning updates
  const {
    isUpdating,
    showConfirmModal,
    onClickUpdate: handleUpdateClick,
    onConfirmUpdate: handleConfirmUpdate,
    onCancelUpdate,
  } = useZoningUpdates(updateParcelsZoning, clearSelections, setIsSelectMode);

  const { currentStats } = useStatsData(selectedParcels, selectedZoningType);

  // Toggle between view and select modes (only for mobile)
  const toggleSelectMode = useCallback(() => {
    // Only toggle mode if we're on mobile
    if (isMobile) {
      const newMode = !isSelectMode;
      setIsSelectMode(newMode);

      // Clear selections when switching to view mode
      if (!newMode) {
        // If switching to view mode
        setSelectedParcels([]);
      }
    }
  }, [isMobile, isSelectMode, setSelectedParcels]);

  // Wrapper functions to pass needed params
  const onClickUpdate = () => {
    handleUpdateClick(selectedParcels, selectedZoningType);
  };

  const onConfirmUpdate = () => {
    handleConfirmUpdate(selectedParcels, selectedZoningType);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Top Bar */}
      <TopBar
        selectedParcels={selectedParcels}
        selectedZoningType={selectedZoningType}
        setSelectedZoningType={setSelectedZoningType}
        zoningTypes={zoningTypes}
        onClickUpdate={onClickUpdate}
        isUpdating={isUpdating}
        isSelectMode={isSelectMode}
        toggleSelectMode={toggleSelectMode}
        hasZoningChanged={hasZoningChanged}
      />

      {/* Map Container */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center bg-gray-100">
          <div className="text-gray-600">Loading map data...</div>
        </div>
      ) : (
        <div className="flex-1 relative">
          {/* Add a bottom padding spacer that appears when the panel is visible */}
          {isMobile && (isSelectMode || selectedParcels.length > 0) && (
            <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none" />
          )}

          <MapContainer
            center={[32.78, -96.8]} // Dallas area
            zoom={12}
            // Make zooming require more scrolling
            zoomSnap={0.5}
            zoomDelta={0.5}
            // Disable zoom when holding shift (for multiple selections)
            keyboardPanDelta={0}
            className="h-full w-full"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <ParcelLayer
              parcels={parcels}
              selectedParcels={selectedParcels}
              setSelectedParcels={setSelectedParcels}
              isSelectMode={isSelectMode}
              setIsSelectMode={setIsSelectMode}
            />
          </MapContainer>

          {/* Floating Update Panel for Mobile */}
          <FloatingUpdatePanel
            selectedParcels={selectedParcels}
            selectedZoningType={selectedZoningType}
            setSelectedZoningType={setSelectedZoningType}
            zoningTypes={zoningTypes}
            onClickUpdate={onClickUpdate}
            isUpdating={isUpdating}
            isSelectMode={isSelectMode}
            hasZoningChanged={hasZoningChanged}
            currentStats={currentStats}
          />

          {/* Stats Sidebar - Desktop Only */}
          <StatsSidebar
            selectedParcels={selectedParcels}
            selectedZoningType={selectedZoningType}
            isMobile={isMobile}
          />
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onConfirm={onConfirmUpdate}
        onCancel={onCancelUpdate}
        selectedCount={selectedParcels.length}
        zoningType={selectedZoningType}
      />

      {/* Notification Toast */}
      <ToastContainer position="bottom-center" autoClose={3000} pauseOnHover />
    </div>
  );
};

export default App;
