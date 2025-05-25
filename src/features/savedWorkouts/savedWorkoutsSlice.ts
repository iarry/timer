import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Split } from '../timerConfig/timerConfigSlice';
import { generateId } from '../../utils';

export interface SavedWorkout {
  id: string;
  name: string;
  splits: Split[];
  defaultExerciseDuration: number;
  defaultRestDuration: number;
  createdAt: string;
  updatedAt: string;
}

interface SavedWorkoutsState {
  workouts: SavedWorkout[];
  currentWorkoutId: string | null; // Track which workout is currently loaded
}

// Create the default r/calisthenics recommended routine
const createDefaultWorkout = (): SavedWorkout => {
  const now = new Date().toISOString();
  
  return {
    id: 'default-calisthenics',
    name: 'r/calisthenics recommended routine',
    defaultExerciseDuration: 45,
    defaultRestDuration: 30,
    createdAt: now,
    updatedAt: now,
    splits: [
      {
        id: generateId(),
        name: 'Split 1',
        sets: 3,
        exercises: [
          {
            id: generateId(),
            name: 'Pull-up',
            duration: 45,
            leftRight: false,
          },
          {
            id: generateId(),
            name: 'Squat',
            duration: 45,
            leftRight: false,
          }
        ]
      },
      {
        id: generateId(),
        name: 'Split 2',
        sets: 3,
        exercises: [
          {
            id: generateId(),
            name: 'Dips',
            duration: 45,
            leftRight: false,
          },
          {
            id: generateId(),
            name: 'Hinge',
            duration: 45,
            leftRight: false,
          }
        ]
      },
      {
        id: generateId(),
        name: 'Split 3',
        sets: 3,
        exercises: [
          {
            id: generateId(),
            name: 'Row',
            duration: 45,
            leftRight: false,
          },
          {
            id: generateId(),
            name: 'Push-up',
            duration: 45,
            leftRight: false,
          }
        ]
      },
      {
        id: generateId(),
        name: 'Core',
        sets: 3,
        exercises: [
          {
            id: generateId(),
            name: 'Plank',
            duration: 45,
            leftRight: false,
          },
          {
            id: generateId(),
            name: 'Copenhagen plank',
            duration: 45,
            leftRight: true,
          },
          {
            id: generateId(),
            name: 'Reverse hyperextension',
            duration: 45,
            leftRight: false,
          }
        ]
      }
    ]
  };
};

const initialState: SavedWorkoutsState = {
  workouts: [createDefaultWorkout()],
  currentWorkoutId: null,
};

const savedWorkoutsSlice = createSlice({
  name: 'savedWorkouts',
  initialState,
  reducers: {
    // Bulk load workouts from IndexedDB
    loadSavedWorkouts(state, action: PayloadAction<SavedWorkout[]>) {
      state.workouts = action.payload;
    },
    
    saveWorkout(state, action: PayloadAction<{
      name: string;
      splits: Split[];
      defaultExerciseDuration: number;
      defaultRestDuration: number;
    }>) {
      const { name, splits, defaultExerciseDuration, defaultRestDuration } = action.payload;
      const now = new Date().toISOString();
      
      const newWorkout: SavedWorkout = {
        id: generateId(),
        name,
        splits: JSON.parse(JSON.stringify(splits)), // Deep clone
        defaultExerciseDuration,
        defaultRestDuration,
        createdAt: now,
        updatedAt: now,
      };
      
      state.workouts.push(newWorkout);
      state.currentWorkoutId = newWorkout.id;
    },
    
    updateWorkout(state, action: PayloadAction<{
      id: string;
      name?: string;
      splits?: Split[];
      defaultExerciseDuration?: number;
      defaultRestDuration?: number;
    }>) {
      const { id, name, splits, defaultExerciseDuration, defaultRestDuration } = action.payload;
      const workoutIndex = state.workouts.findIndex(w => w.id === id);
      
      if (workoutIndex !== -1) {
        const workout = state.workouts[workoutIndex];
        if (name !== undefined) workout.name = name;
        if (splits !== undefined) workout.splits = JSON.parse(JSON.stringify(splits));
        if (defaultExerciseDuration !== undefined) workout.defaultExerciseDuration = defaultExerciseDuration;
        if (defaultRestDuration !== undefined) workout.defaultRestDuration = defaultRestDuration;
        workout.updatedAt = new Date().toISOString();
        
      }
    },
    
    deleteWorkout(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.workouts = state.workouts.filter(w => w.id !== id);
      if (state.currentWorkoutId === id) {
        state.currentWorkoutId = null;
      }
    },
    
    setCurrentWorkout(state, action: PayloadAction<string | null>) {
      state.currentWorkoutId = action.payload;
    },
    
    renameWorkout(state, action: PayloadAction<{ id: string; name: string }>) {
      const { id, name } = action.payload;
      const workoutIndex = state.workouts.findIndex(w => w.id === id);
      
      if (workoutIndex !== -1) {
        state.workouts[workoutIndex].name = name;
        state.workouts[workoutIndex].updatedAt = new Date().toISOString();
      }
    },
  },
});

export const {
  loadSavedWorkouts,
  saveWorkout,
  updateWorkout,
  deleteWorkout,
  setCurrentWorkout,
  renameWorkout,
} = savedWorkoutsSlice.actions;

export default savedWorkoutsSlice.reducer;
