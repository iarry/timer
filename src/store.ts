// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import timerConfigReducer from './features/timerConfig/timerConfigSlice';
import timerReducer from './features/timer/timerSlice';
import samplesReducer from './features/samples/samplesSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    timerConfig: timerConfigReducer,
    timer: timerReducer,
    samples: samplesReducer,
  },
});

// Export RootState and AppDispatch for use with TypeScript hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
