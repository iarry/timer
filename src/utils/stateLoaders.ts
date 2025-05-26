import { store } from '../store';
import { loadWorkout, type Split } from '../features/timerConfig/timerConfigSlice';
import { loadSavedWorkouts, setCurrentWorkout } from '../features/savedWorkouts/savedWorkoutsSlice';
import { workoutDB } from '../middleware/indexedDBMiddleware';
import { audioSystem } from './audioSystem';

interface StoredTimerConfig {
  splits?: Split[];
  defaultExerciseDuration?: number;
  defaultRestDuration?: number;
  audioProfile?: string;
  warmupDuration?: number;
  muted?: boolean;
}

export const initializeAppState = async () => {
  try {
    // Load timer config
    const timerConfig = await workoutDB.getItem('timerConfig', 'state') as StoredTimerConfig | null;
    if (timerConfig && typeof timerConfig === 'object' && Object.keys(timerConfig).length > 0) {
      store.dispatch(loadWorkout({
        splits: timerConfig.splits || [],
        defaultExerciseDuration: timerConfig.defaultExerciseDuration || 30,
        defaultRestDuration: timerConfig.defaultRestDuration || 10,
        audioProfile: timerConfig.audioProfile || 'standard',
        warmupDuration: timerConfig.warmupDuration || 180,
        muted: timerConfig.muted || false,
      }));
    }
    
    // Load saved workouts
    const savedWorkouts = await workoutDB.getItem('savedWorkouts', 'workouts');
    if (savedWorkouts && Array.isArray(savedWorkouts)) {
      store.dispatch(loadSavedWorkouts(savedWorkouts));
    }
    
    // Load current workout ID
    const currentWorkoutId = await workoutDB.getItem('savedWorkouts', 'currentWorkoutId') as string;
    if (currentWorkoutId && typeof currentWorkoutId === 'string') {
      store.dispatch(setCurrentWorkout(currentWorkoutId));
    }

    // Initialize audio system with current profile from state
    const currentState = store.getState();
    audioSystem.setProfile(currentState.timerConfig.audioProfile);
    audioSystem.setMuted(currentState.timerConfig.muted);
    
  } catch {
    // Fall back to default state - IndexedDB not available
  }
};
