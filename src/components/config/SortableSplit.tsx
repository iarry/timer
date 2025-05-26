import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAppDispatch } from '../../hooks';
import { updateSplit, removeSplit, Split, Exercise } from '../../features/timerConfig/timerConfigSlice';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableExercise } from './SortableExercise';
import Button from '../common/Button';
import Select from '../common/Select';
import { Trash2, GripVertical, Plus } from 'lucide-react';
import './SortableSplit.css'; // Import the CSS file

interface SortableSplitProps {
  split: Split;
  durationOptions: number[];
  onAddExercise: (splitId: string) => void;
  isOnlySplit: boolean;
}

export const SortableSplit = ({ split, durationOptions, onAddExercise, isOnlySplit }: SortableSplitProps) => {
  const dispatch = useAppDispatch();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: split.id, data: { type: 'split' } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // Opacity is handled by the .is-dragging-placeholder class for the original item
    // and by the DragOverlay for the item being dragged.
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      // Apply 'is-dragging-placeholder' only when it's the original item being dragged over,
      // not when it's the active drag overlay itself.
      className={`split-item ${isDragging && !transform ? 'is-dragging-placeholder' : ''}`}
    >
      <div className="split-header">
        <div className="split-header-left">
          <div {...attributes} {...listeners} className="split-drag-handle">
            <GripVertical size={24} />
          </div>
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
          </div>
          <Button
            onClick={() => {
              if (confirm('Are you sure you want to delete this split?')) {
                dispatch(removeSplit(split.id));
              }
            }}
            variant="danger"
            size="small"
            disabled={isOnlySplit}
            className="split-delete-button"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

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
            onClick={() => onAddExercise(split.id)}
            variant="secondary"
            size="small"
          >
            <Plus size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};
