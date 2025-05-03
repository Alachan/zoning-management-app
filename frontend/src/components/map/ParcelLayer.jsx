import { useEffect, useRef, useState, useCallback } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { createPortal } from "react-dom";
import ParcelTooltip from "./ParcelTooltip";
import { ZONING_COLORS } from "../../utils/helpers";
import { useMobile } from "../../hooks/useMobile";

// Component for portal-based tooltip
const PortalTooltip = ({ parcel, position }) => {
  if (!parcel || !position) return null;

  const style = {
    position: "absolute",
    left: `${position.x + 15}px`,
    top: `${position.y + 15}px`,
    zIndex: 1000,
  };

  return createPortal(
    <div style={style} className="leaflet-tooltip-container">
      <ParcelTooltip parcel={parcel} />
    </div>,
    document.body
  );
};

const ParcelLayer = ({
  parcels,
  selectedParcels,
  setSelectedParcels,
  isSelectMode,
  setIsSelectMode,
}) => {
  const map = useMap();
  const parcelLayerRef = useRef(null);
  const initialFitDoneRef = useRef(false);

  // Track shift key state locally
  const [isShiftKeyDown, setIsShiftKeyDown] = useState(false);
  const isMobile = useMobile();
  const [hoveredParcel, setHoveredParcel] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState(null);

  // Handle mouse movement for positioning tooltip
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (hoveredParcel) {
        setTooltipPosition({ x: e.clientX, y: e.clientY });
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [hoveredParcel]);

  // Add event listeners for shift key and window resize
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Shift") {
        setIsShiftKeyDown(true);
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === "Shift") {
        setIsShiftKeyDown(false);
      }
    };

    // Handle window blur event
    const handleBlur = () => {
      setIsShiftKeyDown(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  // Create a memoized selection handler
  const handleSelection = useCallback(
    (parcelId, isShiftPressed) => {
      // If on mobile and in view mode, automatically switch to select mode
      if (isMobile && !isSelectMode && setIsSelectMode) {
        // First select the parcel
        setSelectedParcels([parcelId]);
        // Then switch to select mode
        setIsSelectMode(true);
        return;
      }

      // On desktop or in select mode on mobile
      if (!isMobile || (isMobile && isSelectMode)) {
        // Use shift key for multi-select on desktop
        if (isShiftPressed && !isMobile) {
          setSelectedParcels((prev) => {
            // Toggle selection
            if (prev.includes(parcelId)) {
              return prev.filter((id) => id !== parcelId);
            } else {
              return [...prev, parcelId];
            }
          });
        } else if (!isMobile) {
          // Single selection on desktop
          setSelectedParcels((prev) => {
            if (prev.length === 1 && prev[0] === parcelId) {
              return [];
            } else {
              return [parcelId];
            }
          });
        } else {
          // In select mode on mobile - always toggle selection
          setSelectedParcels((prev) => {
            // Toggle selection
            if (prev.includes(parcelId)) {
              return prev.filter((id) => id !== parcelId);
            } else {
              return [...prev, parcelId];
            }
          });
        }
      }
    },
    [setSelectedParcels, isSelectMode, isMobile, setIsSelectMode]
  );

  useEffect(() => {
    if (!parcels || parcels.length === 0) return;

    // Clean up previous layer if it exists
    if (parcelLayerRef.current) {
      map.removeLayer(parcelLayerRef.current);
    }

    // Create a GeoJSON layer for the parcels
    const parcelLayer = L.geoJSON(
      // Transform data to GeoJSON format
      parcels.map((parcel) => ({
        type: "Feature",
        geometry: JSON.parse(parcel.geometry),
        properties: {
          id: parcel.id,
          // Add additional properties for tooltip
          name: parcel.name,
          mailingAddress: parcel.mailingAddress,
          zoningType: parcel.zoningType || "default",
          area: parcel.area,
          selected: selectedParcels.includes(parcel.id),
        },
      })),
      {
        // Style function for each parcel
        style: (feature) => {
          const zoningType = feature.properties.zoningType;
          const isSelected = feature.properties.selected;

          return {
            fillColor: ZONING_COLORS[zoningType] || ZONING_COLORS.default,
            fillOpacity: isSelected ? 0.7 : 0.5,
            weight: isSelected ? 3 : 1,
            color: isSelected ? "#000" : "#666",
            opacity: 1,
          };
        },
        // Handle clicking on a parcel
        onEachFeature: (feature, layer) => {
          layer.on({
            mousedown: (e) => {
              // Immediately stop propagation to prevent map movement
              L.DomEvent.stop(e);
              L.DomEvent.disableClickPropagation(layer);

              const parcelId = feature.properties.id;
              const shiftPressed = e.originalEvent.shiftKey || isShiftKeyDown;

              // Handle the selection immediately
              handleSelection(parcelId, shiftPressed);

              // Prevent further event processing
              return false;
            },

            // Keep the click handler as a backup
            click: (e) => {
              // Stop propagation
              L.DomEvent.stop(e);

              const parcelId = feature.properties.id;
              const shiftPressed = e.originalEvent.shiftKey || isShiftKeyDown;

              // Process selection again to ensure it's caught
              handleSelection(parcelId, shiftPressed);

              return false;
            },
            // Highlight parcel on mouseover
            mouseover: (e) => {
              const layer = e.target;
              const isSelected = feature.properties.selected;
              const parcelData = feature.properties.parcelObj || {
                id: feature.properties.id,
                name: feature.properties.name,
                mailingAddress: feature.properties.mailingAddress,
                zoningType: feature.properties.zoningType,
                area: feature.properties.area,
              };

              // Set the hovered parcel for tooltip
              setHoveredParcel(parcelData);
              setTooltipPosition({
                x: e.originalEvent.clientX,
                y: e.originalEvent.clientY,
              });

              // Different hover style that's distinct from selection
              layer.setStyle({
                weight: isSelected ? 3 : 2, // Slightly thicker border
                color: isSelected ? "#444" : "#FFC107", // Amber color for hover (different from selection)
                dashArray: "",
                fillOpacity: isSelected ? 0.8 : 0.6, // Slightly more opaque
              });

              if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                layer.bringToFront();
              }
            },
            // Reset highlight on mouseout
            mouseout: (e) => {
              parcelLayer.resetStyle(e.target);
              setHoveredParcel(null);
            },
          });
        },
      }
    ).addTo(map);

    // Store reference to the layer for cleanup
    parcelLayerRef.current = parcelLayer;

    // Only fit bounds once when the component first loads
    if (!initialFitDoneRef.current) {
      const bounds = parcelLayer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds);
        initialFitDoneRef.current = true;
      }
    }

    // Cleanup function for when component unmounts or parcels change
    return () => {
      if (parcelLayerRef.current) {
        map.removeLayer(parcelLayerRef.current);
        parcelLayerRef.current = null;
      }
    };
  }, [
    map,
    parcels,
    selectedParcels,
    setSelectedParcels,
    isShiftKeyDown,
    handleSelection,
    isMobile,
    isSelectMode,
  ]);

  // Update cursor style based on select mode and shift key
  useEffect(() => {
    if ((isMobile && isSelectMode) || isShiftKeyDown) {
      // In select mode on mobile or when shift is pressed on desktop, use crosshair cursor
      map.getContainer().style.cursor = "crosshair";
    } else {
      // Otherwise use default cursor
      map.getContainer().style.cursor = "";
    }
  }, [isSelectMode, isShiftKeyDown, isMobile, map]);

  // Render the tooltip with React Portal
  return <PortalTooltip parcel={hoveredParcel} position={tooltipPosition} />;
};

export default ParcelLayer;
