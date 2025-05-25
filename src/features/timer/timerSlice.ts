import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Split } from '../timerConfig/timerConfigSlice';

export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

export interface TimerItem {
  type: 'exercise' | 'rest';
  splitId: string;
  exerciseId?: string;
  name: string;
  duration: number;
  setIndex: number;
  exerciseIndex: number;
}

export interface TimerState {
  status: TimerStatus;
  currentTime: number; // Time remaining for current item (in seconds)
  totalTimeRemaining: number; // Total time remaining for entire workout
  currentItem: TimerItem | null;
  queue: TimerItem[]; // Queue of exercises and rest periods
  originalSplits?: Split[]; // Store original configuration for rebuilding
  originalDefaultRestDuration?: number;
  currentItemIndex: number; // Track position in the full workout sequence
}

const initialState: TimerState = {
  status: 'idle',
  currentTime: 0,
  totalTimeRemaining: 0,
  currentItem: null,
  queue: [],
  originalSplits: undefined,
  originalDefaultRestDuration: undefined,
  currentItemIndex: 0,
};

// Helper function to build the complete workout sequence
const buildWorkoutSequence = (splits: Split[], defaultRestDuration: number): TimerItem[] => {
  const sequence: TimerItem[] = [];
  
  splits.forEach(split => {
    for (let setIndex = 0; setIndex < split.sets; setIndex++) {
      split.exercises.forEach((exercise, exerciseIndex) => {
        if (exercise.leftRight) {
          // For left/right exercises, add separate left and right sides
          sequence.push({
            type: 'exercise',
            splitId: split.id,
            exerciseId: exercise.id,
            name: `${exercise.name} (Left)`,
            duration: exercise.duration,
            setIndex,
            exerciseIndex
          });
          
          // Add rest between left and right
          sequence.push({
            type: 'rest',
            splitId: split.id,
            name: 'Rest',
            duration: defaultRestDuration,
            setIndex,
            exerciseIndex
          });
          
          sequence.push({
            type: 'exercise',
            splitId: split.id,
            exerciseId: exercise.id,
            name: `${exercise.name} (Right)`,
            duration: exercise.duration,
            setIndex,
            exerciseIndex
          });
        } else {
          // Regular exercise
          sequence.push({
            type: 'exercise',
            splitId: split.id,
            exerciseId: exercise.id,
            name: exercise.name,
            duration: exercise.duration,
            setIndex,
            exerciseIndex
          });
        }
        
        // Add rest period after each exercise (except the last exercise in the last set)
        const isLastExercise = exerciseIndex === split.exercises.length - 1;
        const isLastSet = setIndex === split.sets - 1;
        
        if (!(isLastExercise && isLastSet)) {
          sequence.push({
            type: 'rest',
            splitId: split.id,
            name: 'Rest',
            duration: defaultRestDuration,
            setIndex,
            exerciseIndex
          });
        }
      });
    }
  });
  
  return sequence;
};

const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    // Initialize the timer with configuration
    initializeTimer(state, action: PayloadAction<{
      splits: Split[];
      defaultRestDuration: number;
    }>) {
      const { splits, defaultRestDuration } = action.payload;
      
      // Store the original configuration for rebuilding if needed
      state.originalSplits = splits;
      state.originalDefaultRestDuration = defaultRestDuration;
      state.currentItemIndex = 0;
      
      // Use the helper function to build the workout sequence
      state.queue = buildWorkoutSequence(splits, defaultRestDuration);
      
      // Calculate total time
      state.totalTimeRemaining = state.queue.reduce(
        (total, item) => total + item.duration, 
        0
      );
      
      // Set first item as current
      if (state.queue.length > 0) {
        state.currentItem = state.queue[0];
        state.currentTime = state.queue[0].duration;
        state.queue = state.queue.slice(1);
      }
      
      state.status = 'idle';
    },
    
    startTimer(state) {
      state.status = 'running';
    },
    
    pauseTimer(state) {
      state.status = 'paused';
    },
    
    resetTimer() {
      return initialState;
    },
    
    resetCurrentCountdown(state) {
      if (state.currentItem) {
        // Calculate the difference between the current time and the original duration
        const timeToAdd = state.currentItem.duration - state.currentTime;
        
        // Reset current timer to its original duration
        state.currentTime = state.currentItem.duration;
        
        // Update the total time remaining by adding the time that was reset
        state.totalTimeRemaining += timeToAdd;
      }
    },
    
    goToPreviousItem(state) {
      // If there's no current item, there's nothing to go back from
      if (!state.currentItem) return;
      
      // We need to ensure we've stored the original splits configuration
      if (!state.originalSplits || !state.originalDefaultRestDuration) {
        console.error("Cannot go to previous item: original workout configuration not stored");
        return;
      }
      
      // Rebuild the complete workout sequence
      const sequence = buildWorkoutSequence(state.originalSplits, state.originalDefaultRestDuration);
      
      // Determine current position in sequence
      let currentIndex = 0;
      // Find the position by comparing properties of current item
      for (let i = 0; i < sequence.length; i++) {
        const item = sequence[i];
        const current = state.currentItem;
        if (
          item.type === current.type &&
          item.splitId === current.splitId &&
          item.name === current.name &&
          item.setIndex === current.setIndex &&
          item.exerciseIndex === current.exerciseIndex
        ) {
          currentIndex = i;
          break;
        }
      }
      
      // If we're not at the first item, go back one item
      if (currentIndex > 0) {
        // Go to previous item
        const previousIndex = currentIndex - 1;
        const previousItem = sequence[previousIndex];
        
        // Update the current item to the previous one
        state.currentItem = previousItem;
        state.currentTime = previousItem.duration;
        state.currentItemIndex = previousIndex;
        
        // Rebuild the queue with the remaining items after the previous item
        state.queue = sequence.slice(previousIndex + 1);
        
        // Recalculate total time remaining properly
        // The total time is the sum of the current item's time plus all remaining items
        state.totalTimeRemaining = previousItem.duration + 
          state.queue.reduce((total, item) => total + item.duration, 0);
      }
    },
    
    goToNextItem(state) {
      // If there's no current item, there's nothing to advance from
      if (!state.currentItem) return;
      
      // If there are no items in the queue, we're at the end
      if (state.queue.length === 0) {
        state.status = 'completed';
        state.currentItem = null;
        return;
      }
      
      // Subtract current time from total time remaining
      state.totalTimeRemaining -= state.currentTime;
      
      // Move to next item
      timerSlice.caseReducers.advanceToNextItem(state);
    },
    
    tickTimer(state, action: PayloadAction<number>) {
      if (state.status !== 'running') return;
      
      const timeElapsed = action.payload;
      state.currentTime = Math.max(0, state.currentTime - timeElapsed);
      state.totalTimeRemaining = Math.max(0, state.totalTimeRemaining - timeElapsed);
      
      // If current timer is done, move to next item in queue
      if (state.currentTime === 0) {
        timerSlice.caseReducers.advanceToNextItem(state);
      }
    },
    
    // Helper reducer to advance to the next item in the sequence
    advanceToNextItem(state) {
      if (state.queue.length === 0) {
        // No more items - workout is complete
        state.status = 'completed';
        state.currentItem = null;
        state.currentTime = 0;
        return;
      }
      
      // Move to next item
      state.currentItem = state.queue[0];
      state.currentTime = state.queue[0].duration;
      state.queue = state.queue.slice(1);
      state.currentItemIndex += 1;
    },
  },
});

export const {
  initializeTimer,
  startTimer,
  pauseTimer,
  resetTimer,
  tickTimer,
  resetCurrentCountdown,
  goToPreviousItem,
  goToNextItem,
} = timerSlice.actions;

export default timerSlice.reducer;
