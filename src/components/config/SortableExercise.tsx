import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAppDispatch } from '../../hooks';
import { updateExercise, removeExercise, Exercise } from '../../features/timerConfig/timerConfigSlice';
import Button from '../common/Button';
import Select from '../common/Select';
import { Trash2, GripVertical } from 'lucide-react';

interface SortableExerciseProps {
  exercise: Exercise;
  splitId: string;
  durationOptions: number[];
  exercisesLength: number;
}

export const SortableExercise = ({
  exercise,
  splitId,
  durationOptions,
  exercisesLength
}: SortableExerciseProps) => {
  const dispatch = useAppDispatch();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: exercise.id, 
    data: { 
      type: 'exercise', 
      parentId: splitId 
    } 
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="exercise-item">
      <div className="exercise-grip" {...attributes} {...listeners}>
        <GripVertical size={24} />
      </div>
      
      <input 
        type="text"
        className="exercise-name-input"
        value={exercise.name}
        onChange={(e) => 
          dispatch(updateExercise({
            splitId,
            exerciseId: exercise.id,
            name: e.target.value
          }))
        }
        onBlur={(e) => {
          const relatedTarget = e.relatedTarget as HTMLElement;
          const exerciseContainer = e.currentTarget.closest('.exercise-item');
          const isClickingWithinSameExercise = relatedTarget && exerciseContainer && exerciseContainer.contains(relatedTarget);
          
          if (exercise.name.trim() === '' && !isClickingWithinSameExercise) {
            dispatch(removeExercise({ splitId, exerciseId: exercise.id }));
          }
        }}
        placeholder="Exercise name"
      />
      
      <Select
        className="exercise-duration-input"
        variant="compact"
        value={exercise.duration}
        onChange={(e) => 
          dispatch(updateExercise({
            splitId,
            exerciseId: exercise.id,
            duration: parseInt(e.target.value)
          }))
        }
      >
        {durationOptions.map(duration => (
          <option key={duration} value={duration}>{duration}</option>
        ))}
      </Select>
      
      <div className="exercise-checkbox">
        <label>
          <input
            type="checkbox"
            checked={exercise.leftRight || false}
            onChange={(e) => 
              dispatch(updateExercise({
                splitId,
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
          onClick={() => dispatch(removeExercise({ splitId, exerciseId: exercise.id }))}
          variant="danger"
          size="small"
          disabled={exercisesLength === 1}
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </div>
  );
};
