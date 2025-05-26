import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { saveWorkout, updateWorkout } from '../../features/savedWorkouts/savedWorkoutsSlice';
import Button from '../common/Button';
import './WorkoutSaveDialog.css';

interface WorkoutSaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const WorkoutSaveDialog = ({ isOpen, onClose }: WorkoutSaveDialogProps) => {
  const dispatch = useAppDispatch();
  const timerConfig = useAppSelector(state => state.timerConfig);
  const { currentWorkoutId, workouts } = useAppSelector(state => state.savedWorkouts);
  
  const [workoutName, setWorkoutName] = useState('');
  
  const currentWorkout = currentWorkoutId 
    ? workouts.find(w => w.id === currentWorkoutId)
    : null;

  // Populate name with current workout name when editing existing workout
  useEffect(() => {
    if (currentWorkout) {
      setWorkoutName(currentWorkout.name);
    } else {
      setWorkoutName('');
    }
  }, [currentWorkout, isOpen]);

  const handleSaveNew = () => {
    if (workoutName.trim()) {
      dispatch(saveWorkout({
        name: workoutName.trim(),
        splits: timerConfig.splits,
        defaultExerciseDuration: timerConfig.defaultExerciseDuration,
        defaultRestDuration: timerConfig.defaultRestDuration,
      }));
      setWorkoutName('');
      onClose();
    }
  };

  const handleUpdateExisting = () => {
    if (currentWorkout && workoutName.trim()) {
      dispatch(updateWorkout({
        id: currentWorkout.id,
        name: workoutName.trim(),
        splits: timerConfig.splits,
        defaultExerciseDuration: timerConfig.defaultExerciseDuration,
        defaultRestDuration: timerConfig.defaultRestDuration,
      }));
      setWorkoutName('');
      onClose();
    }
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay" onClick={handleClickOutside}>
      <div className="save-dialog">
        <div className="dialog-header">
          <h3>Save Workout</h3>
        </div>
        
        <div className="dialog-content">
          <div className="workout-name-section">
            <input
              type="text"
              placeholder="Workout Name"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (currentWorkout) {
                    handleUpdateExisting();
                  } else {
                    handleSaveNew();
                  }
                }
              }}
              autoFocus
            />
          </div>
          
          <div className="dialog-actions">
            <Button 
              onClick={onClose}
              variant="outline"
              size="small"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveNew}
              variant="outline"
              size="small"
              disabled={!workoutName.trim()}
              className="btn-outline-green"
            >
              Save New
            </Button>
            {currentWorkout && (
              <Button 
                onClick={handleUpdateExisting}
                variant="secondary"
                size="small"
                disabled={!workoutName.trim()}
              >
                Update
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutSaveDialog;
