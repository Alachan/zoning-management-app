import { useState, useEffect } from "react";

/**
 * Custom hook to detect if the current screen width is mobile
 * @param {number} [breakpoint=768] - The pixel width to consider as mobile
 * @returns {boolean} Indicates if the screen is in mobile view
 */
export const useMobile = (breakpoint = 768) => {
  // Initialize state with current window width
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );

  useEffect(() => {
    // Only run on client-side
    if (typeof window === "undefined") return;

    // Handler to update mobile state
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [breakpoint]); // Add breakpoint to dependency array to allow customization

  return isMobile;
};
