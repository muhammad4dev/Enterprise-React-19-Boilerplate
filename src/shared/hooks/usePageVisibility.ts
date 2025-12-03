import { useState, useEffect } from "react";

/**
 * Hook to track page visibility status (tab active/inactive).
 * Returns true if the page is currently visible to the user.
 */
export const usePageVisibility = (): boolean => {
  const getIsVisible = () =>
    typeof document !== "undefined"
      ? document.visibilityState === "visible"
      : true;

  const [isVisible, setIsVisible] = useState(getIsVisible);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState === "visible");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return isVisible;
};
