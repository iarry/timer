import { store } from '../store';
import { loadWorkout } from '../features/timerConfig/timerConfigSlice';
import { loadSavedWorkouts, setCurrentWorkout } from '../features/savedWorkouts/savedWorkoutsSlice';
import { workoutDB } from '../middleware/indexedDBMiddleware';
import { audioSystem } from './audioSystem';

export const initializeAppState = async () => {
  try {
    // Load timer config
    const timerConfig = await workoutDB.getItem('timerConfig', 'state');
    if (timerConfig) {
      store.dispatch(loadWorkout({
        splits: timerConfig.splits,
        defaultExerciseDuration: timerConfig.defaultExerciseDuration,
        defaultRestDuration: timerConfig.defaultRestDuration,
        audioProfile: timerConfig.audioProfile,
      }));
    }
    
    // Load saved workouts
    const savedWorkouts = await workoutDB.getItem('savedWorkouts', 'workouts');
    if (savedWorkouts && Array.isArray(savedWorkouts)) {
      store.dispatch(loadSavedWorkouts(savedWorkouts));
    }
    
    // Load current workout ID
    const currentWorkoutId = await workoutDB.getItem('savedWorkouts', 'currentWorkoutId');
    if (currentWorkoutId) {
      store.dispatch(setCurrentWorkout(currentWorkoutId));
    }

    // Initialize audio system with current profile from state
    const currentState = store.getState();
    audioSystem.setProfile(currentState.timerConfig.audioProfile);
    
  } catch (error) {
    // Fall back to default state - IndexedDB not available
  }
};
