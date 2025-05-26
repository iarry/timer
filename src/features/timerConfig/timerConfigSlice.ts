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
  warmupDuration: number; // in seconds, 0 means no warmup
  splits: Split[];
  audioProfile: string; // audio profile name
  muted: boolean; // audio mute state
}

// Initial state for timer configuration
const initialState: TimerConfigState = {
  defaultExerciseDuration: 45, // default 45s
  defaultRestDuration: 30, // default 30s
  warmupDuration: 180, // default 3 minutes (180s)
  splits: [],
  audioProfile: 'Clean', // default audio profile
  muted: false, // default unmuted
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
      action: PayloadAction<{ splitId: string; exercise: Exercise; index?: number }>
    ) {
      const { splitId, exercise, index } = action.payload;
      const splitIndex = state.splits.findIndex(split => split.id === splitId);
      
      if (splitIndex !== -1) {
        if (index !== undefined && index >= 0) {
          state.splits[splitIndex].exercises.splice(index, 0, exercise);
        } else {
          state.splits[splitIndex].exercises.push(exercise);
        }
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
        }
      }
    },
    
    loadWorkout(state, action: PayloadAction<{
      splits: Split[];
      defaultExerciseDuration: number;
      defaultRestDuration: number;
      audioProfile?: string;
      warmupDuration?: number;
      muted?: boolean;
    }>) {
      const { 
        splits, 
        defaultExerciseDuration, 
        defaultRestDuration, 
        audioProfile,
        warmupDuration,
        muted 
      } = action.payload;
      
      // Clear existing splits
      state.splits = [];
      
      // Set new defaults
      state.defaultExerciseDuration = defaultExerciseDuration;
      state.defaultRestDuration = defaultRestDuration;
      
      if (audioProfile) {
        state.audioProfile = audioProfile;
      }

      if (warmupDuration !== undefined) {
        state.warmupDuration = warmupDuration;
      }

      if (muted !== undefined) {
        state.muted = muted;
      }
      
      // Add new splits
      state.splits = [...splits];
      
    },

    reorderExercises(
      state,
      action: PayloadAction<{
        splitId: string;
        exerciseIds: string[];
      }>
    ) {
      const { splitId, exerciseIds } = action.payload;
      const splitIndex = state.splits.findIndex(split => split.id === splitId);
      
      if (splitIndex !== -1) {
        const exercises = state.splits[splitIndex].exercises;
        const reorderedExercises = exerciseIds.map(id => 
          exercises.find(exercise => exercise.id === id)!
        ).filter(Boolean);
        
        state.splits[splitIndex].exercises = reorderedExercises;
      }
    },

    reorderSplits(
      state,
      action: PayloadAction<{ oldIndex: number; newIndex: number }>
    ) {
      const { oldIndex, newIndex } = action.payload;
      const [movedSplit] = state.splits.splice(oldIndex, 1);
      state.splits.splice(newIndex, 0, movedSplit);
    },

    moveExerciseToSplit(
      state,
      action: PayloadAction<{
        exerciseId: string;
        fromSplitId: string;
        toSplitId: string;
        toIndex: number;
      }>
    ) {
      const { exerciseId, fromSplitId, toSplitId, toIndex } = action.payload;
      const fromSplitIndex = state.splits.findIndex(split => split.id === fromSplitId);
      const toSplitIndex = state.splits.findIndex(split => split.id === toSplitId);
      
      if (fromSplitIndex !== -1 && toSplitIndex !== -1) {
        const fromExercises = state.splits[fromSplitIndex].exercises;
        const exerciseIndex = fromExercises.findIndex(ex => ex.id === exerciseId);
        
        if (exerciseIndex !== -1) {
          const [movedExercise] = fromExercises.splice(exerciseIndex, 1);
          state.splits[toSplitIndex].exercises.splice(toIndex, 0, movedExercise);
        }
      }
    },

    setAudioProfile(state, action: PayloadAction<string>) {
      state.audioProfile = action.payload;
    },

    setWarmupDuration(state, action: PayloadAction<number>) {
      state.warmupDuration = action.payload;
    },

    setMuted(state, action: PayloadAction<boolean>) {
      state.muted = action.payload;
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
  reorderExercises,
  reorderSplits,
  moveExerciseToSplit,
  loadWorkout,
  setAudioProfile,
  setWarmupDuration,
  setMuted,
} = timerConfigSlice.actions;

export default timerConfigSlice.reducer;
