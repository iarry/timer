import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { 
  setDefaultDurations,
  addSplit,
  removeSplit,
  updateSplit,
  addExercise,
  removeExercise,
  updateExercise,
  Split,
  Exercise
} from '../../features/timerConfig/timerConfigSlice';
import { loadSampleWorkout, clearSampleWorkout } from '../../features/samples/samplesSlice';
import { generateId, formatTime } from '../../utils';
import Button from '../common/Button';
import Input from '../common/Input';

import './ConfigPanel.css';

interface ConfigPanelProps {
  onStartWorkout: () => void;
}

const ConfigPanel = ({ onStartWorkout }: ConfigPanelProps) => {
  const dispatch = useAppDispatch();
  const { defaultExerciseDuration, defaultRestDuration, splits } = 
    useAppSelector(state => state.timerConfig);
  const { hasLoadedSample } = useAppSelector(state => state.samples);

  const [exerciseDuration, setExerciseDuration] = useState(defaultExerciseDuration);
  const [restDuration, setRestDuration] = useState(defaultRestDuration);

  // Form state for new split
  const [newSplitSets, setNewSplitSets] = useState(3);

  // Form state for new exercise
  const [activeSplitId, setActiveSplitId] = useState<string | null>(null);
  const [newExerciseName, setNewExerciseName] = useState('');
  const [newExerciseDuration, setNewExerciseDuration] = useState(defaultExerciseDuration);

  // Effect for auto-updating default durations when they change
  useEffect(() => {
    if (exerciseDuration !== defaultExerciseDuration || restDuration !== defaultRestDuration) {
      dispatch(setDefaultDurations({
        exerciseDuration,
        restDuration
      }));
    }
  }, [exerciseDuration, restDuration, dispatch, defaultExerciseDuration, defaultRestDuration]);

  // Handler for adding a new split
  const handleAddSplit = () => {
    // Auto-generate split number
    const splitNumber = splits.length + 1;
    
    const newSplit: Omit<Split, 'exercises'> = {
      id: generateId(),
      name: `Split ${splitNumber}`,
      sets: newSplitSets,
    };

    dispatch(addSplit(newSplit));
    setNewSplitSets(3); // Reset to default
  };

  // Handler for adding a new exercise
  const handleAddExercise = () => {
    if (!activeSplitId || newExerciseName.trim() === '') return;

    const newExercise: Exercise = {
      id: generateId(),
      name: newExerciseName,
      duration: newExerciseDuration,
    };

    dispatch(addExercise({
      splitId: activeSplitId,
      exercise: newExercise
    }));

    setNewExerciseName('');
    setNewExerciseDuration(defaultExerciseDuration);
  };
  
  // Handler to load sample workout
  const handleLoadSample = () => {
    dispatch(loadSampleWorkout());
  };
  
  // Monitor the sample workout from the store
  const { sampleWorkout } = useAppSelector(state => state.samples);
  
  // Effect to add the sample workout to the timer config when it's loaded
  useEffect(() => {
    if (sampleWorkout) {
      dispatch(addSplit(sampleWorkout));
      dispatch(clearSampleWorkout());
    }
  }, [sampleWorkout, dispatch]);

  return (
    <div className="config-panel">
      <h2>Timer Configuration</h2>
      
      {/* Start Workout Button */}
      <div className="start-workout-section">
        <Button 
          onClick={onStartWorkout} 
          variant="primary" 
          size="large"
          disabled={splits.length === 0}
        >
          Start Workout
        </Button>
        {splits.length === 0 && (
          <p className="warning-message">Configure at least one split with exercises first</p>
        )}
      </div>
      
      <section className="default-settings">
        <h3>Default Settings</h3>
        
        <div className="setting-group">
          <div className="default-durations-row">
            <div className="duration-input">
              <label>Exercise: </label>
              <input
                type="number" 
                value={exerciseDuration}
                onChange={(e) => setExerciseDuration(parseInt(e.target.value || '0'))} 
                min="5"
                className="duration-input-field"
              />
              <span>sec</span>
            </div>
            
            <div className="duration-input">
              <label>Rest: </label>
              <input
                type="number" 
                value={restDuration}
                onChange={(e) => setRestDuration(parseInt(e.target.value || '0'))}
                min="5"
                className="duration-input-field"
              />
              <span>sec</span>
            </div>
          </div>
        </div>
      </section>
      
      <section className="splits-section">
        <h3>Workout Splits</h3>
        
        {/* Load sample workout button - only show if no splits and sample not loaded */}
        {splits.length === 0 && !hasLoadedSample && (
          <div className="sample-workout-section">
            <h4>New to HIIT workouts?</h4>
            <p>Get started quickly with a pre-configured workout routine!</p>
            <Button onClick={handleLoadSample} variant="secondary">
              Load Sample Workout
            </Button>
          </div>
        )}
        
        {/* Add new split form */}
        <div className="add-split-form">
          <h4>Add New Split</h4>
          
          <div className="form-group">
            <label>
              Number of Sets:
              <input 
                type="number" 
                value={newSplitSets}
                onChange={(e) => setNewSplitSets(parseInt(e.target.value))}
                min="1"
              />
            </label>
            
            <Button onClick={handleAddSplit} variant="secondary">Add Split</Button>
          </div>
        </div>
        
        {/* List of existing splits */}
        <div className="splits-list">
          {splits.length === 0 ? (
            <p>No splits configured yet. Add your first split above.</p>
          ) : (
            splits.map(split => (
              <div key={split.id} className="split-item">
                <div className="split-header">
                  <h4>{split.name}</h4>
                  <div className="split-info">
                    <span>{split.sets} sets</span>
                    <span>{split.exercises.length} exercises</span>
                  </div>
                  <Button 
                    onClick={() => dispatch(removeSplit(split.id))}
                    variant="danger"
                    size="small"
                  >
                    Delete
                  </Button>
                </div>
                
                {/* Exercises in this split */}
                <div className="exercises-list">
                  {split.exercises.length === 0 ? (
                    <p>No exercises in this split. Add some below.</p>
                  ) : (
                    split.exercises.map(exercise => (
                      <div key={exercise.id} className="exercise-item">
                        <span className="exercise-name">{exercise.name}</span>
                        <span className="exercise-duration">
                          {formatTime(exercise.duration)}
                        </span>
                        <div className="exercise-actions">
                          <Button 
                            onClick={() => 
                              dispatch(removeExercise({
                                splitId: split.id,
                                exerciseId: exercise.id
                              }))
                            }
                            variant="danger"
                            size="small"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {/* Add exercise form */}
                {activeSplitId === split.id ? (
                  <form 
                    className="add-exercise-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAddExercise();
                    }}
                  >
                    <div className="exercise-item new-exercise-item">
                      <input 
                        type="text"
                        className="exercise-name-input"
                        value={newExerciseName}
                        onChange={(e) => setNewExerciseName(e.target.value)}
                        placeholder="Exercise name"
                        autoFocus
                      />
                      <input 
                        type="number"
                        className="exercise-duration-input"
                        value={newExerciseDuration}
                        onChange={(e) => setNewExerciseDuration(parseInt(e.target.value || '0'))}
                        min="5"
                        placeholder="Seconds"
                      />
                      <div className="exercise-actions">
                        <Button type="submit" variant="secondary" size="small">Add</Button>
                        <Button onClick={() => setActiveSplitId(null)} variant="outline" size="small">Cancel</Button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <Button 
                    onClick={() => setActiveSplitId(split.id)}
                    variant="secondary"
                  >
                    Add Exercise
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default ConfigPanel;
