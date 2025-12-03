import { useState, useEffect, useCallback } from "react";

interface NetworkStatusState {
  isOnline: boolean;
  showOffline: boolean;
  showBackOnline: boolean;
  setShowBackOnline: (show: boolean) => void;
}

/**
 * Hook to track network status and manage notification states.
 * Returns current online status and flags for showing offline/online notifications.
 */
export const useNetworkStatus = (): NetworkStatusState => {
  // Initialize state based on current network status
  const getInitialOnlineStatus = () =>
    typeof navigator !== "undefined" ? navigator.onLine : true;

  const [isOnline, setIsOnline] = useState(getInitialOnlineStatus);
  const [showOffline, setShowOffline] = useState(!getInitialOnlineStatus());
  const [showBackOnline, setShowBackOnline] = useState(false);

  const handleOnline = useCallback(() => {
    setIsOnline(true);
    setShowOffline(false);
    setShowBackOnline(true);
  }, []);

  const handleOffline = useCallback(() => {
    setIsOnline(false);
    setShowBackOnline(false);
    setShowOffline(true);
  }, []);

  useEffect(() => {
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [handleOnline, handleOffline]);

  return {
    isOnline,
    showOffline,
    showBackOnline,
    setShowBackOnline,
  };
};
