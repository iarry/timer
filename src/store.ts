// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import timerConfigReducer from './features/timerConfig/timerConfigSlice';
import timerReducer from './features/timer/timerSlice';
import samplesReducer from './features/samples/samplesSlice';
import savedWorkoutsReducer from './features/savedWorkouts/savedWorkoutsSlice';
import { indexedDBMiddleware } from './middleware/indexedDBMiddleware';

export const store = configureStore({
  reducer: {
    timerConfig: timerConfigReducer,
    timer: timerReducer,
    samples: samplesReducer,
    savedWorkouts: savedWorkoutsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(indexedDBMiddleware),
});

// Export RootState and AppDispatch for use with TypeScript hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
