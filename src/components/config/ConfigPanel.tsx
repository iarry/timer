import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { 
  setDefaultDurations,
  addSplit,
  removeSplit,
  updateSplit,
  addExercise,
  reorderExercises,
  moveExerciseToSplit,
  Split,
  Exercise
} from '../../features/timerConfig/timerConfigSlice';
import { generateId } from '../../utils';
import Button from '../common/Button';
import Select from '../common/Select';
import { AudioProfileSelector } from './AudioProfileSelector';
import { SortableExercise } from './SortableExercise';
import { Trash2, Save, GalleryVerticalEnd, Plus, GripVertical } from 'lucide-react';

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

  // Track active drag item for DragOverlay
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);

  // DnD Kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Generate duration options (5-180 seconds in intervals of 5)
  const generateDurationOptions = () => {
    const options = [];
    for (let i = 5; i <= 180; i += 5) {
      options.push(i);
    }
    return options;
  };
  const durationOptions = generateDurationOptions();

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
  };

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const draggedExercise = splits
      .flatMap(split => split.exercises)
      .find(exercise => exercise.id === active.id);
    
    setActiveExercise(draggedExercise || null);
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Clear drag state
    setActiveExercise(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId !== overId) {
      // Find the splits containing the active and target exercises
      const activeSplit = splits.find(split => 
        split.exercises.some(ex => ex.id === activeId)
      );
      const overSplit = splits.find(split => 
        split.exercises.some(ex => ex.id === overId)
      );
      
      if (activeSplit && overSplit) {
        if (activeSplit.id === overSplit.id) {
          // Reordering within the same split
          const oldIndex = activeSplit.exercises.findIndex(ex => ex.id === activeId);
          const newIndex = activeSplit.exercises.findIndex(ex => ex.id === overId);
          
          if (oldIndex !== -1 && newIndex !== -1) {
            const newOrder = arrayMove(activeSplit.exercises, oldIndex, newIndex);
            dispatch(reorderExercises({
              splitId: activeSplit.id,
              exerciseIds: newOrder.map(ex => ex.id)
            }));
          }
        } else {
          // Moving between different splits
          const overIndex = overSplit.exercises.findIndex(ex => ex.id === overId);
          
          if (overIndex !== -1) {
            dispatch(moveExerciseToSplit({
              exerciseId: activeId,
              fromSplitId: activeSplit.id,
              toSplitId: overSplit.id,
              toIndex: overIndex
            }));
          }
        }
      }
    }
  };

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
    <div className="config-panel">      <div className="default-settings">
        <div className="setting-group">
          <div className="default-durations-row">
            <div className="duration-input">
              <label>Default work: </label>
              <Select
                value={exerciseDuration}
                onChange={(e) => setExerciseDuration(parseInt(e.target.value))}
                variant="compact"
                className="duration-input-field"
              >
                {durationOptions.map(duration => (
                  <option key={duration} value={duration}>{duration}</option>
                ))}
              </Select>
            </div>
            
            <div className="duration-input">
              <label>Rest: </label>
              <Select
                value={restDuration}
                onChange={(e) => setRestDuration(parseInt(e.target.value))}
                variant="compact"
                className="duration-input-field"
              >
                {durationOptions.map(duration => (
                  <option key={duration} value={duration}>{duration}</option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="splits-section">
        {/* List of existing splits */}
        <div className="splits-list">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {splits.map(split => (
              <div key={split.id} className="split-item">
                <div className="split-header">
                  <div className="sets-info">
                    <Select
                      value={split.sets}
                      onChange={(e) => dispatch(updateSplit({ 
                        id: split.id, 
                        sets: parseInt(e.target.value) || 1 
                      }))}
                      variant="compact"
                      className="sets-select"
                    >
                      {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </Select>
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
                  <SortableContext
                    items={split.exercises.map(ex => ex.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {split.exercises.map(exercise => (
                      <SortableExercise
                        key={exercise.id}
                        exercise={exercise}
                        splitId={split.id}
                        durationOptions={durationOptions}
                        exercisesLength={split.exercises.length}
                      />
                    ))}
                  </SortableContext>
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
            
            <DragOverlay>
              {activeExercise ? (
                <div className="exercise-item" style={{ opacity: 0.8, transform: 'rotate(5deg)' }}>
                  <div className="exercise-grip">
                    <GripVertical size={24} />
                  </div>
                  <input 
                    type="text"
                    className="exercise-name-input"
                    value={activeExercise.name}
                    readOnly
                    placeholder="Exercise name"
                  />
                  <select
                    className="exercise-duration-input"
                    value={activeExercise.duration}
                    disabled
                  >
                    <option value={activeExercise.duration}>{activeExercise.duration}</option>
                  </select>
                  <div className="exercise-checkbox">
                    <label>
                      <input
                        type="checkbox"
                        checked={activeExercise.leftRight || false}
                        disabled
                        readOnly
                      />
                      L/R
                    </label>
                  </div>
                  <div className="exercise-actions">
                    <Button 
                      variant="danger"
                      size="small"
                      disabled
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
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
        
        {/* Audio Profile Selector */}
        <div className="audio-profile-section">
          <AudioProfileSelector />
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
