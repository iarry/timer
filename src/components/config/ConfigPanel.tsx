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
import { clearSampleWorkout } from '../../features/samples/samplesSlice';
import { generateId } from '../../utils';
import Button from '../common/Button';
import { Trash2, Save, GalleryVerticalEnd, Plus } from 'lucide-react';

import './ConfigPanel.css';

interface ConfigPanelProps {
  onStartWorkout: () => void;
  onSaveWorkout: () => void;
  onLoadWorkout: () => void;
}

const ConfigPanel = ({ onStartWorkout, onSaveWorkout, onLoadWorkout }: ConfigPanelProps) => {
  const dispatch = useAppDispatch();
  const { defaultExerciseDuration, defaultRestDuration, splits } = 
    useAppSelector(state => state.timerConfig);

  const [exerciseDuration, setExerciseDuration] = useState(defaultExerciseDuration);
  const [restDuration, setRestDuration] = useState(defaultRestDuration);

  // Form state for new split
  const [newSplitSets, setNewSplitSets] = useState(3);

  // Track which exercise is being edited (for auto-focus)
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);

  // Generate duration options (5-180 seconds in intervals of 5)
  const generateDurationOptions = () => {
    const options = [];
    for (let i = 5; i <= 180; i += 5) {
      options.push(i);
    }
    return options;
  };

  const durationOptions = generateDurationOptions();

  // Check if an exercise is using the default duration
  const isUsingDefaultDuration = (exerciseDuration: number) => {
    return exerciseDuration === defaultExerciseDuration;
  };



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
    
    // Automatically create a blank exercise for the new split
    const newExercise: Exercise = {
      id: generateId(),
      name: '',
      duration: defaultExerciseDuration,
      leftRight: false,
    };

    dispatch(addExercise({
      splitId: newSplit.id,
      exercise: newExercise
    }));

    // Set this exercise as being edited
    setEditingExerciseId(newExercise.id);
  };

  // Handler for adding a blank exercise (replaces handleAddExercise)
  const handleAddBlankExercise = (splitId: string) => {
    const newExercise: Exercise = {
      id: generateId(),
      name: '',
      duration: defaultExerciseDuration,
      leftRight: false,
    };

    dispatch(addExercise({
      splitId: splitId,
      exercise: newExercise
    }));

    // Set this exercise as being edited
    setEditingExerciseId(newExercise.id);
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

  // Effect to automatically create Split 1 and set it as active when starting fresh
  useEffect(() => {
    if (splits.length === 0) {
      // Create initial split
      const initialSplit: Omit<Split, 'exercises'> = {
        id: generateId(),
        name: 'Split 1',
        sets: 3,
      };
      
      dispatch(addSplit(initialSplit));
      
      // Create an empty exercise for the initial split
      const newExercise: Exercise = {
        id: generateId(),
        name: '',
        duration: defaultExerciseDuration,
        leftRight: false,
      };

      dispatch(addExercise({
        splitId: initialSplit.id,
        exercise: newExercise
      }));
    }
  }, [splits.length, dispatch, defaultExerciseDuration]);

  return (
    <div className="config-panel">
      <div className="default-settings">
        <div className="setting-group">
          <div className="default-durations-row">
            <div className="duration-input">
              <label>Default work: </label>
              <select
                value={exerciseDuration}
                onChange={(e) => setExerciseDuration(parseInt(e.target.value))} 
                className="duration-input-field"
              >
                {durationOptions.map(duration => (
                  <option key={duration} value={duration}>{duration}</option>
                ))}
              </select>
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
            </div>
          </div>
        </div>
      </div>
      
      <div className="splits-section">
        {/* List of existing splits */}
        <div className="splits-list">
          {splits.map(split => (
            <div key={split.id} className="split-item">
              <div className="split-header">
                <div className="sets-info">
                  <select
                    value={split.sets}
                    onChange={(e) => dispatch(updateSplit({ 
                      id: split.id, 
                      sets: parseInt(e.target.value) || 1 
                    }))}
                    className="sets-select"
                  >
                    {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                  <span className="sets-label">sets</span>
                  <Button 
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this split?')) {
                        dispatch(removeSplit(split.id));
                      }
                    }}
                    variant="danger"
                    size="small"
                    disabled={splits.length === 1}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>

              </div>
              
              {/* Exercises in this split */}
              <div className="exercises-list">
                {split.exercises.map(exercise => (
                  <div key={exercise.id} className="exercise-item">
                    <input 
                      type="text"
                      className="exercise-name-input"
                      value={exercise.name}
                      onChange={(e) => 
                        dispatch(updateExercise({
                          splitId: split.id,
                          exerciseId: exercise.id,
                          name: e.target.value
                        }))
                      }
                      onBlur={(e) => {
                        // Only delete if exercise name is empty and the user isn't clicking on other form elements within the same exercise
                        const relatedTarget = e.relatedTarget as HTMLElement;
                        const exerciseContainer = e.currentTarget.closest('.exercise-item');
                        const isClickingWithinSameExercise = relatedTarget && exerciseContainer && exerciseContainer.contains(relatedTarget);
                        
                        if (exercise.name.trim() === '' && !isClickingWithinSameExercise) {
                          dispatch(removeExercise({
                            splitId: split.id,
                            exerciseId: exercise.id
                          }));
                        }
                        setEditingExerciseId(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.currentTarget.blur();
                        } else if (e.key === 'Escape') {
                          // Reset to empty and blur (which will delete it)
                          dispatch(updateExercise({
                            splitId: split.id,
                            exerciseId: exercise.id,
                            name: ''
                          }));
                          e.currentTarget.blur();
                        }
                      }}
                      placeholder="Exercise name"
                      autoFocus={editingExerciseId === exercise.id}
                    />
                    <select
                      className={`exercise-duration-input ${isUsingDefaultDuration(exercise.duration) ? 'default-duration' : ''}`}
                      value={exercise.duration}
                      onChange={(e) => 
                        dispatch(updateExercise({
                          splitId: split.id,
                          exerciseId: exercise.id,
                          duration: parseInt(e.target.value)
                        }))
                      }
                    >
                      {durationOptions.map(duration => (
                        <option key={duration} value={duration}>{duration}</option>
                      ))}
                    </select>
                    <div className="exercise-checkbox">
                      <label>
                        <input
                          type="checkbox"
                          checked={exercise.leftRight || false}
                          onChange={(e) =>
                            dispatch(updateExercise({
                              splitId: split.id,
                              exerciseId: exercise.id,
                              leftRight: e.target.checked
                            }))
                          }
                        />
                        L/R
                      </label>
                    </div>
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
                        disabled={split.exercises.length === 1}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="add-exercise-section">
                  <Button 
                    className="add-exercise-button"
                    onClick={() => handleAddBlankExercise(split.id)}
                    variant="secondary"
                    size="small"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Add Split button moved to bottom */}
        <div className="add-split-section">
          <Button 
            className="add-split-button"
            onClick={handleAddSplit} 
            variant="secondary"
            size="small"
          >
            Add Split
          </Button>
        </div>
      </div>
      
      {/* Start Workout Button - moved to bottom */}
      <div className="start-workout-section">
        <Button 
          onClick={onLoadWorkout}
          variant="transparent" 
          size="small"
          className="load-button"
        >
          <GalleryVerticalEnd size={20} style={{ transform: 'rotate(180deg)' }} />
        </Button>
        <Button 
          onClick={onStartWorkout} 
          variant="primary" 
          size="large"
          disabled={splits.length === 0 || splits.every(split => split.exercises.length === 0)}
        >
          Start
        </Button>
        <Button 
          onClick={onSaveWorkout}
          variant="transparent" 
          size="small"
          className="save-button"
        >
          <Save size={20} />
        </Button>
      </div>
    </div>
  );
};

export default ConfigPanel;
