import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { 
  deleteWorkout, 
  setCurrentWorkout, 
  updateWorkout 
} from '../../features/savedWorkouts/savedWorkoutsSlice';
import { 
  loadWorkout
} from '../../features/timerConfig/timerConfigSlice';
import Button from '../common/Button';
import { Trash2, Edit3, Check, X } from 'lucide-react';
import './WorkoutLibrary.css';

interface WorkoutLibraryProps {
  isOpen: boolean;
  onClose: () => void;
}

const WorkoutLibrary = ({ isOpen, onClose }: WorkoutLibraryProps) => {
  const dispatch = useAppDispatch();
  const { workouts, currentWorkoutId } = useAppSelector(state => state.savedWorkouts);
  const [editingWorkoutId, setEditingWorkoutId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleLoadWorkout = (workoutId: string) => {
    const workout = workouts.find(w => w.id === workoutId);
    if (!workout) return;

    // Load the workout into the timer config
    dispatch(loadWorkout({
      splits: workout.splits,
      defaultExerciseDuration: workout.defaultExerciseDuration,
      defaultRestDuration: workout.defaultRestDuration,
    }));

    // Set as current workout
    dispatch(setCurrentWorkout(workoutId));
    onClose();
  };

  const handleDeleteWorkout = (workoutId: string) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      dispatch(deleteWorkout(workoutId));
    }
  };

  const handleStartEdit = (workoutId: string, currentName: string) => {
    setEditingWorkoutId(workoutId);
    setEditingName(currentName);
  };

  const handleSaveEdit = () => {
    if (editingWorkoutId && editingName.trim()) {
      dispatch(updateWorkout({
        id: editingWorkoutId,
        name: editingName.trim(),
      }));
      setEditingWorkoutId(null);
      setEditingName('');
    }
  };

  const handleCancelEdit = () => {
    setEditingWorkoutId(null);
    setEditingName('');
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay" onClick={handleClickOutside}>
      <div className="workout-library">
        <div className="dialog-header">
          <h3>Workouts</h3>
          <Button 
            onClick={onClose}
            variant="transparent"
            size="small"
            className="close-button"
          >
            <X size={20} />
          </Button>
        </div>
        
        <div className="workout-list">
          {workouts.map(workout => (
            <div 
              key={workout.id} 
              className={`workout-item ${currentWorkoutId === workout.id ? 'current' : ''}`}
            >
              {currentWorkoutId === workout.id && (
                <span className="current-badge">Current</span>
              )}
              
              <div className="workout-info">
                {editingWorkoutId === workout.id ? (
                  <div className="workout-edit">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit();
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                      autoFocus
                    />
                    <div className="edit-actions">
                      <Button 
                        onClick={handleSaveEdit}
                        variant="secondary"
                        size="small"
                      >
                        <Check size={14} />
                      </Button>
                      <Button 
                        onClick={handleCancelEdit}
                        variant="outline"
                        size="small"
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="workout-name-section">
                      <h4>{workout.name}</h4>
                    </div>
                    <div className="workout-meta">
                      <span>{workout.splits.length} splits</span>
                      <span>•</span>
                      <span>{workout.splits.reduce((total, split) => total + split.exercises.length, 0)} exercises</span>
                    </div>
                  </>
                )}
              </div>
              
              {editingWorkoutId !== workout.id && (
                <div className="workout-actions">
                  <Button 
                    onClick={() => handleLoadWorkout(workout.id)}
                    variant="secondary"
                    size="small"
                  >
                    Load
                  </Button>
                  <Button 
                    onClick={() => handleStartEdit(workout.id, workout.name)}
                    variant="transparent"
                    size="small"
                  >
                    <Edit3 size={16} />
                  </Button>
                  <Button 
                    onClick={() => handleDeleteWorkout(workout.id)}
                    variant="danger"
                    size="small"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkoutLibrary;
