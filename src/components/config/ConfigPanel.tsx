import { useState, useEffect } from 'react';
import {
  DndContext,
  pointerWithin, // Changed from rectIntersection
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
  addExercise,
  reorderExercises,
  moveExerciseToSplit,
  reorderSplits, 
  setWarmupDuration, // Import the new action
  Split,
  Exercise
} from '../../features/timerConfig/timerConfigSlice';
import { generateId } from '../../utils';
import Button from '../common/Button';
import Select from '../common/Select';
import { AudioProfileSelector } from './AudioProfileSelector';
import { SortableSplit } from './SortableSplit'; 
import { Trash2, Save, GalleryVerticalEnd, GripVertical } from 'lucide-react'; 

import './ConfigPanel.css';

interface ConfigPanelProps {
  onStartWorkout: () => void;
  onSaveWorkout: () => void;
  onLoadWorkout: () => void;
}

const ConfigPanel = ({ onStartWorkout, onSaveWorkout, onLoadWorkout }: ConfigPanelProps) => {
  const dispatch = useAppDispatch();
  const { defaultExerciseDuration, defaultRestDuration, warmupDuration, splits } = 
    useAppSelector(state => state.timerConfig);

  const [exerciseDuration, setExerciseDuration] = useState(defaultExerciseDuration);
  const [restDuration, setRestDuration] = useState(defaultRestDuration);
  const [currentWarmupDuration, setCurrentWarmupDuration] = useState(warmupDuration);

  // Form state for new split
  const [newSplitSets, setNewSplitSets] = useState(3);

  // Track active drag item for DragOverlay
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [activeSplitState, setActiveSplitState] = useState<Split | null>(null); // Renamed to avoid conflict with a potential variable 'activeSplit'

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

  // Generate warmup duration options (0-600 seconds in intervals of 15)
  const generateWarmupOptions = () => {
    const options = [];
    for (let i = 0; i <= 600; i += 15) {
      options.push(i);
    }
    return options;
  };
  const warmupOptions = generateWarmupOptions();

  // Effect for auto-updating default durations when they change
  useEffect(() => {
    if (exerciseDuration !== defaultExerciseDuration || restDuration !== defaultRestDuration) {
      dispatch(setDefaultDurations({
        exerciseDuration,
        restDuration
      }));
    }
  }, [exerciseDuration, restDuration, dispatch, defaultExerciseDuration, defaultRestDuration]);

  // Effect for updating warmup duration in Redux store
  useEffect(() => {
    if (currentWarmupDuration !== warmupDuration) {
      dispatch(setWarmupDuration(currentWarmupDuration));
    }
  }, [currentWarmupDuration, dispatch, warmupDuration]);

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
    if (active.data.current?.type === 'split') {
      const draggedSplit = splits.find(split => split.id === active.id);
      setActiveSplitState(draggedSplit || null);
      setActiveExercise(null); 
    } else {
      // Assuming anything not a 'split' is an 'exercise' or unclassified (handled by existing logic)
      const draggedExercise = splits
        .flatMap(split => split.exercises)
        .find(exercise => exercise.id === active.id);
      setActiveExercise(draggedExercise || null);
      setActiveSplitState(null); 
    }
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveExercise(null);
    setActiveSplitState(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId !== overId) {
      // Check if we are dragging a split
      if (active.data.current?.type === 'split' && over.data.current?.type === 'split') {
        const oldIndex = splits.findIndex(split => split.id === activeId);
        const newIndex = splits.findIndex(split => split.id === overId);
        if (oldIndex !== -1 && newIndex !== -1) {
          dispatch(reorderSplits({ oldIndex, newIndex })); // Dispatch the reorderSplits action
        }
      } else if (active.data.current?.type !== 'split' && over.data.current?.type !== 'split' && (!active.data.current?.type && !over.data.current?.type) ) { 
        // This condition ensures we are not dragging an exercise onto a split drop zone or vice-versa
        // This is the existing logic for moving exercises
        const activeItemSplit = splits.find(split => 
          split.exercises.some(ex => ex.id === activeId)
        );
        const overItemSplit = splits.find(split => 
          split.exercises.some(ex => ex.id === overId) || over.data.current?.accepts === 'exercise' && over.id === split.id
        ); // over.id could be a split ID if dropping on an empty split
        
        if (activeItemSplit && overItemSplit) {
          if (activeItemSplit.id === overItemSplit.id) {
            // Reordering within the same split
            const oldIndex = activeItemSplit.exercises.findIndex(ex => ex.id === activeId);
            const newIndex = overItemSplit.exercises.findIndex(ex => ex.id === overId);
            
            if (oldIndex !== -1 && newIndex !== -1) {
              const newOrder = arrayMove(activeItemSplit.exercises, oldIndex, newIndex);
              dispatch(reorderExercises({
                splitId: activeItemSplit.id,
                exerciseIds: newOrder.map(ex => ex.id)
              }));
            }
          } else {
            // Moving between different splits
            const overIndex = overItemSplit.exercises.findIndex(ex => ex.id === overId);
            // If overId is not an exercise, it might be the split itself (e.g. dropping into an empty split)
            // In that case, add to the end of the target split's exercises.
            const targetIndex = overIndex !== -1 ? overIndex : overItemSplit.exercises.length;
            
            dispatch(moveExerciseToSplit({
              exerciseId: activeId,
              fromSplitId: activeItemSplit.id,
              toSplitId: overItemSplit.id,
              toIndex: targetIndex
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
                className="select-compact" // Replaced .duration-input-field
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
                className="select-compact" // Replaced .duration-input-field
              >
                {durationOptions.map(duration => (
                  <option key={duration} value={duration}>{duration}</option>
                ))}
              </Select>
            </div>
          </div>
          <div className="warmup-duration-row">
            <div className="duration-input">
              <label>Warmup: </label>
              <Select
                value={currentWarmupDuration}
                onChange={(e) => setCurrentWarmupDuration(parseInt(e.target.value))}
                variant="compact"
                className="select-compact" // Replaced .duration-input-field
              >
                {warmupOptions.map(duration => (
                  <option key={duration} value={duration}>{duration === 0 ? 'None' : duration}</option>
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
            collisionDetection={pointerWithin} // Changed to pointerWithin
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={splits.map(s => s.id)} strategy={verticalListSortingStrategy}>
              {splits.map(split => (
                <SortableSplit
                  key={split.id}
                  split={split}
                  durationOptions={durationOptions}
                  onAddExercise={handleAddBlankExercise} // Pass the handler
                  isOnlySplit={splits.length === 1} // Pass if it's the only split
                />
              ))}
            </SortableContext>
            
            <DragOverlay>
              {activeSplitState ? (
                // Drag overlay for a Split
                // Use the actual SortableSplit component for the overlay
                <SortableSplit
                  split={activeSplitState}
                  durationOptions={durationOptions} // Pass necessary props
                  onAddExercise={() => {}} // No-op for overlay
                  isOnlySplit={splits.length === 1} // Or determine based on context if needed
                  // Ensure no interactive elements are active in the overlay version if SortableSplit has them
                />
              ) : activeExercise ? (
                // Drag overlay for an Exercise (existing logic)
                <div className="exercise-item drag-overlay-exercise-item"> {/* Added class for specific styling */}
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
