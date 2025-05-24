import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// Types for our timer configuration
export interface Exercise {
  id: string;
  name: string;
  duration: number; // in seconds
  leftRight?: boolean; // if true, exercise runs twice (left and right side)
}

export interface Split {
  id: string;
  name: string;
  exercises: Exercise[];
  sets: number;
}

export interface TimerConfigState {
  defaultExerciseDuration: number; // in seconds
  defaultRestDuration: number; // in seconds
  splits: Split[];
}

// Load state from local storage if available
const loadState = (): TimerConfigState | undefined => {
  try {
    const serializedState = localStorage.getItem('timerConfig');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    // localStorage not available or corrupted data
    return undefined;
  }
};

// Initial state for timer configuration
const initialState: TimerConfigState = loadState() || {
  defaultExerciseDuration: 45, // default 45s
  defaultRestDuration: 30, // default 30s
  splits: [],
};

// Save state to local storage when it changes
const saveState = (state: TimerConfigState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('timerConfig', serializedState);
  } catch (err) {
    // localStorage not available or quota exceeded - fail silently
  }
};

export const saveTimerConfig = (state: TimerConfigState) => {
  saveState(state);
};

// Create the timer config slice
const timerConfigSlice = createSlice({
  name: 'timerConfig',
  initialState,
  reducers: {
    setDefaultDurations(
      state,
      action: PayloadAction<{ exerciseDuration: number; restDuration: number }>
    ) {
      const { exerciseDuration, restDuration } = action.payload;
      const oldExerciseDuration = state.defaultExerciseDuration;
      
      state.defaultExerciseDuration = exerciseDuration;
      state.defaultRestDuration = restDuration;
      
      // Update exercises that are using the old default duration
      if (oldExerciseDuration !== exerciseDuration) {
        state.splits.forEach(split => {
          split.exercises.forEach(exercise => {
            if (exercise.duration === oldExerciseDuration) {
              exercise.duration = exerciseDuration;
            }
          });
        });
      }
      
      saveState(state); // Save to local storage
    },
    
    addSplit(state, action: PayloadAction<Omit<Split, 'exercises'> & { exercises?: Exercise[] }>) {
      const { id, name, sets, exercises = [] } = action.payload;
      state.splits.push({
        id,
        name,
        sets,
        exercises,
      });
      saveState(state); // Save to local storage
    },
    
    removeSplit(state, action: PayloadAction<string>) {
      state.splits = state.splits.filter(split => split.id !== action.payload);
      saveState(state); // Save to local storage
    },
    
    updateSplit(state, action: PayloadAction<{ id: string; name?: string; sets?: number }>) {
      const { id, name, sets } = action.payload;
      const splitIndex = state.splits.findIndex(split => split.id === id);
      
      if (splitIndex !== -1) {
        if (name !== undefined) state.splits[splitIndex].name = name;
        if (sets !== undefined) state.splits[splitIndex].sets = sets;
        saveState(state); // Save to local storage
      }
    },
    
    addExercise(
      state,
      action: PayloadAction<{ splitId: string; exercise: Exercise }>
    ) {
      const { splitId, exercise } = action.payload;
      const splitIndex = state.splits.findIndex(split => split.id === splitId);
      
      if (splitIndex !== -1) {
        state.splits[splitIndex].exercises.push(exercise);
        saveState(state); // Save to local storage
      }
    },
    
    removeExercise(
      state,
      action: PayloadAction<{ splitId: string; exerciseId: string }>
    ) {
      const { splitId, exerciseId } = action.payload;
      const splitIndex = state.splits.findIndex(split => split.id === splitId);
      
      if (splitIndex !== -1) {
        state.splits[splitIndex].exercises = state.splits[splitIndex].exercises.filter(
          exercise => exercise.id !== exerciseId
        );
        saveState(state); // Save to local storage
      }
    },
    
    updateExercise(
      state,
      action: PayloadAction<{
        splitId: string;
        exerciseId: string;
        name?: string;
        duration?: number;
        leftRight?: boolean;
      }>
    ) {
      const { splitId, exerciseId, name, duration, leftRight } = action.payload;
      const splitIndex = state.splits.findIndex(split => split.id === splitId);
      
      if (splitIndex !== -1) {
        const exerciseIndex = state.splits[splitIndex].exercises.findIndex(
          exercise => exercise.id === exerciseId
        );
        
        if (exerciseIndex !== -1) {
          if (name !== undefined) {
            state.splits[splitIndex].exercises[exerciseIndex].name = name;
          }
          
          if (duration !== undefined) {
            state.splits[splitIndex].exercises[exerciseIndex].duration = duration;
          }
          
          if (leftRight !== undefined) {
            state.splits[splitIndex].exercises[exerciseIndex].leftRight = leftRight;
          }
          saveState(state); // Save to local storage
        }
      }
    },
    
    loadWorkout(state, action: PayloadAction<{
      splits: Split[];
      defaultExerciseDuration: number;
      defaultRestDuration: number;
    }>) {
      const { splits, defaultExerciseDuration, defaultRestDuration } = action.payload;
      
      // Clear existing splits
      state.splits = [];
      
      // Set new defaults
      state.defaultExerciseDuration = defaultExerciseDuration;
      state.defaultRestDuration = defaultRestDuration;
      
      // Add new splits
      state.splits = [...splits];
      
      saveState(state);
    },

    clearWorkout(state) {
      // Reset to empty workout state
      state.splits = [];
      saveState(state);
    },
  },
});

// Export actions and reducer
export const {
  setDefaultDurations,
  addSplit,
  removeSplit,
  updateSplit,
  addExercise,
  removeExercise,
  updateExercise,
  loadWorkout,
  clearWorkout,
} = timerConfigSlice.actions;

export default timerConfigSlice.reducer;
