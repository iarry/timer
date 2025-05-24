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

// Load saved workouts from localStorage
const loadSavedWorkouts = (): SavedWorkout[] => {
  try {
    const serializedWorkouts = localStorage.getItem('savedWorkouts');
    if (serializedWorkouts === null) {
      // Return default workout if none exist
      return [createDefaultWorkout()];
    }
    const workouts = JSON.parse(serializedWorkouts);
    // Ensure we have the default workout
    const hasDefault = workouts.some((w: SavedWorkout) => w.name === 'r/calisthenics recommended routine');
    if (!hasDefault) {
      workouts.unshift(createDefaultWorkout());
    }
    return workouts;
  } catch (err) {
    return [createDefaultWorkout()];
  }
};

// Save workouts to localStorage
const saveWorkoutsToStorage = (workouts: SavedWorkout[]) => {
  try {
    const serializedWorkouts = JSON.stringify(workouts);
    localStorage.setItem('savedWorkouts', serializedWorkouts);
  } catch (err) {
    // localStorage not available or quota exceeded - fail silently
  }
};

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
  workouts: loadSavedWorkouts(),
  currentWorkoutId: null,
};

const savedWorkoutsSlice = createSlice({
  name: 'savedWorkouts',
  initialState,
  reducers: {
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
      saveWorkoutsToStorage(state.workouts);
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
        
        saveWorkoutsToStorage(state.workouts);
      }
    },
    
    deleteWorkout(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.workouts = state.workouts.filter(w => w.id !== id);
      if (state.currentWorkoutId === id) {
        state.currentWorkoutId = null;
      }
      saveWorkoutsToStorage(state.workouts);
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
        saveWorkoutsToStorage(state.workouts);
      }
    },
  },
});

export const {
  saveWorkout,
  updateWorkout,
  deleteWorkout,
  setCurrentWorkout,
  renameWorkout,
} = savedWorkoutsSlice.actions;

export default savedWorkoutsSlice.reducer;
