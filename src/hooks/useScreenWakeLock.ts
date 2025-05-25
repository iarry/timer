import { useEffect, useRef } from 'react';

// Type definitions for Screen Wake Lock API
interface WakeLockSentinel {
  readonly type: 'screen';
  release(): Promise<void>;
  addEventListener(type: 'release', listener: () => void): void;
  removeEventListener(type: 'release', listener: () => void): void;
}

interface Navigator {
  wakeLock?: {
    request(type: 'screen'): Promise<WakeLockSentinel>;
  };
}

/**
 * Custom hook to manage screen wake lock
 * Keeps the screen awake when active, releases when inactive
 */
export const useScreenWakeLock = (isActive: boolean = false) => {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const isSupported = 'wakeLock' in navigator;

  const requestWakeLock = async () => {
    if (!isSupported) {
      console.log('Screen Wake Lock API not supported');
      return false;
    }

    try {
      // Release existing wake lock if any
      if (wakeLockRef.current) {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
      }

      // Request new wake lock
      wakeLockRef.current = await (navigator as Navigator).wakeLock!.request('screen');
      console.log('Screen wake lock acquired');
      
      // Listen for wake lock release (e.g., when tab becomes invisible)
      wakeLockRef.current.addEventListener('release', () => {
        console.log('Screen wake lock was released');
        wakeLockRef.current = null;
      });

      return true;
    } catch (error) {
      console.log('Failed to acquire screen wake lock:', error);
      wakeLockRef.current = null;
      return false;
    }
  };

  const releaseWakeLock = async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
        console.log('Screen wake lock released');
      } catch (error) {
        console.log('Failed to release screen wake lock:', error);
      }
      wakeLockRef.current = null;
    }
  };

  // Effect to manage wake lock based on isActive state
  useEffect(() => {
    if (isActive) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }

    // Cleanup on unmount
    return () => {
      releaseWakeLock();
    };
  }, [isActive]);

  // Handle visibility change - re-acquire wake lock when page becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (isActive && !document.hidden && !wakeLockRef.current) {
        // Re-acquire wake lock when page becomes visible and timer is active
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isActive]);

  return {
    isSupported,
    isActive: !!wakeLockRef.current,
    requestWakeLock,
    releaseWakeLock
  };
};
