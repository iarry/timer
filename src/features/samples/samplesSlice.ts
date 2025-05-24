import { createSlice } from '@reduxjs/toolkit';
import type { Split } from '../timerConfig/timerConfigSlice';
import { generateId } from '../../utils';

// Updated sample exercises for r/calisthenics recommended routine
const sampleExercises = [
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
];

// Sample split - now matches the default workout
const createSampleSplit = () => ({
  id: generateId(),
  name: 'Split 1',
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
