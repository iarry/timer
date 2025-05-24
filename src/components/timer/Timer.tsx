import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  startTimer,
  pauseTimer,
  resetTimer,
  tickTimer,
  initializeTimer
} from '../../features/timer/timerSlice';
import { formatTime } from '../../utils';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import Button from '../common/Button';
import './Timer.css';

interface TimerProps {
  onExit: () => void;
}

const Timer = ({ onExit }: TimerProps) => {
  const dispatch = useAppDispatch();
  const timerState = useAppSelector(state => state.timer);
  const timerConfig = useAppSelector(state => state.timerConfig);
  const timerRef = useRef<number | null>(null);
  const previousItemRef = useRef(timerState.currentItem);
  
  // Get sound effects
  const { playStart, playComplete, playTransition } = useSoundEffects();

  // Effect to handle the timer ticking
  useEffect(() => {
    if (timerState.status === 'running') {
      // Clear any existing timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      // Set up a new timer that ticks every 1 second
      timerRef.current = window.setInterval(() => {
        dispatch(tickTimer(1));
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timerState.status, dispatch]);
  
  // Effect to play sounds on transitions
  useEffect(() => {
    // Play different sounds based on timer events
    if (timerState.status === 'completed') {
      playComplete();
    } else if (
      timerState.currentItem && 
      (!previousItemRef.current || previousItemRef.current !== timerState.currentItem)
    ) {
      // Play transition sound when moving to a new exercise
      if (previousItemRef.current) {
        playTransition();
      }
    }
    
    // Update the ref
    previousItemRef.current = timerState.currentItem;
  }, [timerState.currentItem, timerState.status, playComplete, playTransition]);

  // Initialize the timer with the current configuration
  const handleStartWorkout = () => {
    dispatch(initializeTimer({
      splits: timerConfig.splits,
      defaultRestDuration: timerConfig.defaultRestDuration,
    }));
    dispatch(startTimer());
    playStart();
  };

  // Toggle between pause and play
  const handleTogglePlay = () => {
    if (timerState.status === 'running') {
      dispatch(pauseTimer());
    } else {
      dispatch(startTimer());
    }
  };

  // Go back to configuration
  const handleBackToConfig = () => {
    dispatch(resetTimer());
    onExit(); // Call the onExit prop to return to config panel
  };

  // Calculate progress percentage for the current exercise
  const getProgressPercentage = () => {
    if (!timerState.currentItem) return 0;
    
    const { duration } = timerState.currentItem;
    const elapsed = duration - timerState.currentTime;
    return (elapsed / duration) * 100;
  };

  // Calculate the circumference for the SVG circle
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (getProgressPercentage() / 100) * circumference;

  // Auto-start the workout when the component is mounted
  useEffect(() => {
    const hasWorkout = timerConfig.splits.length > 0;
    if (timerState.status === 'idle' && hasWorkout) {
      handleStartWorkout();
    }
  }, []);

  // Check if timer has been initialized
  const isInitialized = timerState.status !== 'idle' || timerState.currentItem !== null;

  return (
    <div className="timer-container">
      {timerState.status === 'idle' && !isInitialized ? (
        <div className="timer-loading">Loading workout...</div>
      ) : (
        <>
          <div className="timer-header">
            <Button onClick={handleBackToConfig} variant="outline">
              ← Back to Configuration
            </Button>
          </div>
          
          <div className="timer-display">
            {timerState.currentItem && (
              <>
                <div className="timer-info">
                  <h2>{timerState.currentItem.name}</h2>
                  <div className="timer-type">
                    {timerState.currentItem.type === 'exercise' ? 'Exercise' : 'Rest'}
                  </div>
                </div>
                
                <div className="timer-circle">
                  <svg width="220" height="220" viewBox="0 0 220 220">
                    {/* Background circle */}
                    <circle
                      cx="110"
                      cy="110"
                      r={radius}
                      fill="none"
                      stroke="#e6e6e6"
                      strokeWidth="12"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="110"
                      cy="110"
                      r={radius}
                      fill="none"
                      stroke={timerState.currentItem.type === 'exercise' ? '#4a90e2' : '#2ecc71'}
                      strokeWidth="12"
                      strokeDasharray={circumference}
                      strokeDashoffset={progressOffset}
                      strokeLinecap="round"
                      style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                    />
                    
                    {/* Time remaining text */}
                    <text
                      x="110"
                      y="110"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#333"
                      fontSize="48px"
                      fontWeight="bold"
                    >
                      {formatTime(timerState.currentTime)}
                    </text>
                  </svg>
                </div>
                
                <div className="total-remaining">
                  Total Remaining: {formatTime(timerState.totalTimeRemaining)}
                </div>
              </>
            )}
            
            {timerState.status === 'completed' && (
              <div className="completion-message">
                <h2>Great job! You've completed your workout.</h2>
                <Button onClick={handleStartWorkout} variant="secondary">Restart Workout</Button>
              </div>
            )}
          </div>
          
          {timerState.status !== 'completed' && (
            <div className="timer-controls">
              <Button 
                onClick={handleTogglePlay}
                variant={timerState.status === 'running' ? 'accent' : 'secondary'}
                size="large"
              >
                {timerState.status === 'running' ? 'Pause' : 'Resume'}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Timer;
