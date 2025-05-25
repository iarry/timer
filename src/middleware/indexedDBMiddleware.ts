import { Middleware } from '@reduxjs/toolkit';

// IndexedDB wrapper
class WorkoutDB {
  private db: IDBDatabase | null = null;
  private dbName = 'WorkoutTimerDB';
  private version = 1;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores
        if (!db.objectStoreNames.contains('timerConfig')) {
          db.createObjectStore('timerConfig');
        }
        if (!db.objectStoreNames.contains('savedWorkouts')) {
          db.createObjectStore('savedWorkouts');
        }
      };
    });
  }

  async setItem(storeName: string, key: string, value: any): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(value, key);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getItem(storeName: string, key: string): Promise<any> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }
}

const workoutDB = new WorkoutDB();

// Actions that should trigger persistence
const PERSIST_ACTIONS = [
  'timerConfig/setDefaultDurations',
  'timerConfig/setAudioProfile',
  'timerConfig/addSplit',
  'timerConfig/removeSplit',
  'timerConfig/updateSplit',
  'timerConfig/addExercise',
  'timerConfig/removeExercise',
  'timerConfig/updateExercise',
  'timerConfig/reorderExercises',
  'timerConfig/moveExerciseToSplit',
  'timerConfig/loadWorkout',
  'savedWorkouts/saveWorkout',
  'savedWorkouts/updateWorkout',
  'savedWorkouts/deleteWorkout',
  'savedWorkouts/setCurrentWorkout',
];

export const indexedDBMiddleware: Middleware = 
  (store) => (next) => (action: any) => {
    // Let the action go through first
    const result = next(action);
    
    // Then handle persistence asynchronously
    if (PERSIST_ACTIONS.includes(action.type)) {
      const state = store.getState();
      
      // Persist relevant state slices
      if (action.type.startsWith('timerConfig/')) {
        workoutDB.setItem('timerConfig', 'state', state.timerConfig).catch(() => {
          // Silent failure - IndexedDB not available
        });
      }
      
      if (action.type.startsWith('savedWorkouts/')) {
        workoutDB.setItem('savedWorkouts', 'workouts', state.savedWorkouts.workouts).catch(() => {
          // Silent failure - IndexedDB not available
        });
        workoutDB.setItem('savedWorkouts', 'currentWorkoutId', state.savedWorkouts.currentWorkoutId).catch(() => {
          // Silent failure - IndexedDB not available
        });
      }
    }
    
    return result;
  };

// Export the WorkoutDB instance for use in state loaders
export { workoutDB };
