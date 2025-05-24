import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// Types for our timer configuration
export interface Exercise {
  id: string;
  name: string;
  duration: number; // in seconds
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

// Initial state for timer configuration
const initialState: TimerConfigState = {
  defaultExerciseDuration: 45, // default 45s
  defaultRestDuration: 30, // default 30s
  splits: [],
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
      state.defaultExerciseDuration = action.payload.exerciseDuration;
      state.defaultRestDuration = action.payload.restDuration;
    },
    
    addSplit(state, action: PayloadAction<Omit<Split, 'exercises'> & { exercises?: Exercise[] }>) {
      const { id, name, sets, exercises = [] } = action.payload;
      state.splits.push({
        id,
        name,
        sets,
        exercises,
      });
    },
    
    removeSplit(state, action: PayloadAction<string>) {
      state.splits = state.splits.filter(split => split.id !== action.payload);
    },
    
    updateSplit(state, action: PayloadAction<{ id: string; name?: string; sets?: number }>) {
      const { id, name, sets } = action.payload;
      const splitIndex = state.splits.findIndex(split => split.id === id);
      
      if (splitIndex !== -1) {
        if (name !== undefined) state.splits[splitIndex].name = name;
        if (sets !== undefined) state.splits[splitIndex].sets = sets;
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
      }
    },
    
    updateExercise(
      state,
      action: PayloadAction<{
        splitId: string;
        exerciseId: string;
        name?: string;
        duration?: number;
      }>
    ) {
      const { splitId, exerciseId, name, duration } = action.payload;
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
        }
      }
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
} = timerConfigSlice.actions;

export default timerConfigSlice.reducer;
