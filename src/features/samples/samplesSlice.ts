import { createSlice } from '@reduxjs/toolkit';
import type { Split } from '../timerConfig/timerConfigSlice';
import { generateId } from '../../utils';

// Sample exercises that a new user can load
const sampleExercises = [
  {
    id: generateId(),
    name: 'Push-ups',
    duration: 45,
  },
  {
    id: generateId(),
    name: 'Squats',
    duration: 45,
  },
  {
    id: generateId(),
    name: 'Mountain Climbers',
    duration: 30,
  },
  {
    id: generateId(),
    name: 'Jumping Jacks',
    duration: 45,
  }
];

// Sample split
const createSampleSplit = () => ({
  id: generateId(),
  name: 'Sample Circuit',
  sets: 3,
  exercises: sampleExercises
});

interface SamplesState {
  hasLoadedSample: boolean;
  sampleWorkout: Split | null;
}

const initialState: SamplesState = {
  hasLoadedSample: false,
  sampleWorkout: null
};

const samplesSlice = createSlice({
  name: 'samples',
  initialState,
  reducers: {
    loadSampleWorkout(state) {
      if (!state.hasLoadedSample) {
        state.hasLoadedSample = true;
        state.sampleWorkout = createSampleSplit();
      }
    },
    clearSampleWorkout(state) {
      state.sampleWorkout = null;
    }
  }
});

export const { loadSampleWorkout, clearSampleWorkout } = samplesSlice.actions;
export default samplesSlice.reducer;
