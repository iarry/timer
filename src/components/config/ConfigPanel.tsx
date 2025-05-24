import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { 
  setDefaultDurations,
  addSplit,
  removeSplit,
  updateSplit,
  addExercise,
  removeExercise,
  Split,
  Exercise
} from '../../features/timerConfig/timerConfigSlice';
import { loadSampleWorkout, clearSampleWorkout } from '../../features/samples/samplesSlice';
import { generateId, formatTime } from '../../utils';
import Button from '../common/Button';

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

  // Generate duration options (5-180 seconds in intervals of 5)
  const generateDurationOptions = () => {
    const options = [];
    for (let i = 5; i <= 180; i += 5) {
      options.push(i);
    }
    return options;
  };

  const durationOptions = generateDurationOptions();

  // Update new exercise duration when default changes
  useEffect(() => {
    setNewExerciseDuration(defaultExerciseDuration);
  }, [defaultExerciseDuration]);

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
      <div className="default-settings">
        <div className="setting-group">
          <div className="default-durations-row">
            <div className="duration-input">
              <label>Exercise: </label>
              <select
                value={exerciseDuration}
                onChange={(e) => setExerciseDuration(parseInt(e.target.value))} 
                className="duration-input-field"
              >
                {durationOptions.map(duration => (
                  <option key={duration} value={duration}>{duration}</option>
                ))}
              </select>
              <span>sec</span>
            </div>
            
            <div className="duration-input">
              <label>Rest: </label>
              <select
                value={restDuration}
                onChange={(e) => setRestDuration(parseInt(e.target.value))}
                className="duration-input-field"
              >
                {durationOptions.map(duration => (
                  <option key={duration} value={duration}>{duration}</option>
                ))}
              </select>
              <span>sec</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="splits-section">
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
        
        {/* List of existing splits */}
        <div className="splits-list">
          {splits.length === 0 ? (
            <p>No splits configured yet. Add your first split below.</p>
          ) : (
            splits.map(split => (
              <div key={split.id} className="split-item">
                <div className="split-header">
                  <h4>{split.name}</h4>
                  <div className="split-info">
                    <div className="sets-info">
                      <input 
                        type="number" 
                        value={split.sets}
                        onChange={(e) => dispatch(updateSplit({ 
                          id: split.id, 
                          sets: parseInt(e.target.value) || 1 
                        }))}
                        min="1"
                        className="sets-input"
                      />
                      <span>sets</span>
                    </div>
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
                      <select
                        className="exercise-duration-input"
                        value={newExerciseDuration}
                        onChange={(e) => setNewExerciseDuration(parseInt(e.target.value))}
                      >
                        {durationOptions.map(duration => (
                          <option key={duration} value={duration}>{duration}</option>
                        ))}
                      </select>
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
        
        {/* Add new split form - moved to bottom */}
        <div className="add-split-form">
          <div className="form-group">
            <Button onClick={handleAddSplit} variant="secondary">Add Split</Button>
          </div>
        </div>
      </div>
      
      {/* Start Workout Button - moved to bottom */}
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
    </div>
  );
};

export default ConfigPanel;
