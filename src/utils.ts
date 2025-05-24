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

/**
 * Calculate total workout time
 * @param splits Array of splits
 * @param defaultRestDuration Default rest duration in seconds
 * @returns Total workout time in seconds
 */
export const calculateTotalTime = (
  splits: { 
    sets: number; 
    exercises: { 
      id: string; 
      name: string; 
      duration: number;
      leftRight?: boolean;
    }[]
  }[], 
  defaultRestDuration: number
): number => {
  let totalTime = 0;
  
  splits.forEach(split => {
    // Calculate time for all sets
    for (let set = 0; set < split.sets; set++) {
      // Add exercise durations
      split.exercises.forEach((exercise, index: number) => {
        if (exercise.leftRight) {
          // Left/right exercises: left + rest + right
          totalTime += exercise.duration; // Left side
          totalTime += defaultRestDuration; // Rest between sides
          totalTime += exercise.duration; // Right side
        } else {
          // Regular exercise
          totalTime += exercise.duration;
        }
        
        // Add rest period after each exercise except the last one in the last set
        const isLastExercise = index === split.exercises.length - 1;
        const isLastSet = set === split.sets - 1;
        
        if (!(isLastExercise && isLastSet)) {
          totalTime += defaultRestDuration;
        }
      });
    }
  });
  
  return totalTime;
};
