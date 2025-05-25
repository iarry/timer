/**
 * Utility functions for the Timer app
 */

/**
 * Generate a random ID
 * @returns A random string ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * Format time in seconds to a readable format (mm:ss)
 * @param seconds Time in seconds
 * @returns Formatted time string
 */
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${
    remainingSeconds.toString().padStart(2, '0')
  }`;
};
