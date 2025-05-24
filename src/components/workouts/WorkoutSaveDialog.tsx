import { useState } from 'react';
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
    if (currentWorkout) {
      dispatch(updateWorkout({
        id: currentWorkout.id,
        splits: timerConfig.splits,
        defaultExerciseDuration: timerConfig.defaultExerciseDuration,
        defaultRestDuration: timerConfig.defaultRestDuration,
      }));
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="save-dialog">
        <div className="dialog-header">
          <h3>Save Workout</h3>
        </div>
        
        <div className="dialog-content">
          {currentWorkout && (
            <div className="update-section">
              <p>Current workout: <strong>{currentWorkout.name}</strong></p>
              <Button 
                onClick={handleUpdateExisting}
                variant="primary"
                size="small"
              >
                Update "{currentWorkout.name}"
              </Button>
            </div>
          )}
          
          <div className="save-new-section">
            <h4>Save as new workout</h4>
            <input
              type="text"
              placeholder="Enter workout name"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSaveNew();
                }
              }}
              autoFocus
            />
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
                variant="secondary"
                size="small"
                disabled={!workoutName.trim()}
              >
                Save New
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutSaveDialog;
