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
}

const initialState: TimerState = {
  status: 'idle',
  currentTime: 0,
  totalTimeRemaining: 0,
  currentItem: null,
  queue: [],
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
      state.queue = [];
      
      // For each split, create timer items for each set and exercise
      splits.forEach(split => {
        for (let setIndex = 0; setIndex < split.sets; setIndex++) {
          split.exercises.forEach((exercise, exerciseIndex) => {
            if (exercise.leftRight) {
              // For left/right exercises, add separate left and right sides
              state.queue.push({
                type: 'exercise',
                splitId: split.id,
                exerciseId: exercise.id,
                name: `${exercise.name} (Left)`,
                duration: exercise.duration,
                setIndex,
                exerciseIndex
              });
              
              // Add rest between left and right
              state.queue.push({
                type: 'rest',
                splitId: split.id,
                name: 'Rest',
                duration: defaultRestDuration,
                setIndex,
                exerciseIndex
              });
              
              state.queue.push({
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
              state.queue.push({
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
              state.queue.push({
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
    
    tickTimer(state, action: PayloadAction<number>) {
      if (state.status !== 'running') return;
      
      const timeElapsed = action.payload;
      state.currentTime = Math.max(0, state.currentTime - timeElapsed);
      state.totalTimeRemaining = Math.max(0, state.totalTimeRemaining - timeElapsed);
      
      // If current timer is done, move to next item in queue
      if (state.currentTime === 0) {
        if (state.queue.length > 0) {
          state.currentItem = state.queue[0];
          state.currentTime = state.queue[0].duration;
          state.queue = state.queue.slice(1);
        } else {
          // Workout complete
          state.currentItem = null;
          state.status = 'completed';
        }
      }
    },
  },
});

export const {
  initializeTimer,
  startTimer,
  pauseTimer,
  resetTimer,
  tickTimer,
} = timerSlice.actions;

export default timerSlice.reducer;
