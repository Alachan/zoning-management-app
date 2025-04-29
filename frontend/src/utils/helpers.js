/**
 * Utility functions and constants for the zoning application
 */

// Color mapping for zoning types
export const ZONING_COLORS = {
  Residential: "#00BCD4", // Cyan
  Commercial: "#1616FF", // Blue
  Industrial: "#FF5722", // Orange
  Agricultural: "#4CAF50", // Green
  Planned: "#964B00", // Brown
  // Default for unknown zoning types
  default: "#9E9E9E", // Gray
  Unzoned: "#9E9E9E", // Gray
};

/**
 * Format area values to appropriate units with proper formatting
 *
 * @param {number} area - Area in acres
 * @returns {string} Formatted area string
 */
export const formatArea = (area) => {
  if (!area) return "0 acres";

  // For very small areas, show in square feet
  if (area < 0.01) {
    return `${Math.round(area * 43560)} sq ft`;
  }

  // Otherwise show in acres with 2 decimal places
  return `${area.toFixed(2)} acres`;
};

/**
 * Get the color for a zoning type, with fallback to default
 *
 * @param {string} zoningType - The zoning type to get a color for
 * @returns {string} The color hex code
 */
export const getZoningColor = (zoningType) => {
  return ZONING_COLORS[zoningType] || ZONING_COLORS.default;
};

/**
 * Calculate the percentage of a value out of a total
 *
 * @param {number} value - The value to calculate percentage for
 * @param {number} total - The total value
 * @returns {string} Formatted percentage with % sign
 */
export const calculatePercentage = (value, total) => {
  if (!total) return "0%";
  return `${Math.round((value / total) * 100)}%`;
};
