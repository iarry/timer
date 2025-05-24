import { useEffect, useRef, useState } from 'react';
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
import { ArrowLeft, Pause, Play, Settings, VolumeX, Volume2 } from 'lucide-react';
import './Timer.css';

interface TimerProps {
  onExit: () => void;
  onOpenSettings: () => void;
}

const Timer = ({ onExit, onOpenSettings }: TimerProps) => {
  const dispatch = useAppDispatch();
  const timerState = useAppSelector(state => state.timer);
  const timerConfig = useAppSelector(state => state.timerConfig);
  const timerRef = useRef<number | null>(null);
  const animationRef = useRef<number | null>(null);
  const previousItemRef = useRef(timerState.currentItem);
  const [smoothTimeRemaining, setSmoothTimeRemaining] = useState(0);
  const lastTickTimeRef = useRef<number>(Date.now());
  const [isMuted, setIsMuted] = useState(false);
  
  // Get sound effects
  const { playStart, playComplete, playTransition } = useSoundEffects(isMuted);

  // Calculate total rounds for the display
  const totalRounds = timerConfig.splits.reduce((total, split) => total + split.sets, 0);

  // Effect to handle the timer ticking
  useEffect(() => {
    if (timerState.status === 'running') {
      // Clear any existing timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      // Initialize smooth time remaining
      setSmoothTimeRemaining(timerState.currentTime);
      lastTickTimeRef.current = Date.now();

      // Set up a new timer that ticks every 1 second
      timerRef.current = window.setInterval(() => {
        dispatch(tickTimer(1));
        lastTickTimeRef.current = Date.now();
      }, 1000);

      // Set up smooth animation
      const animate = () => {
        const now = Date.now();
        const timeSinceLastTick = (now - lastTickTimeRef.current) / 1000;
        const smoothTime = Math.max(0, timerState.currentTime - timeSinceLastTick);
        setSmoothTimeRemaining(smoothTime);
        
        if (timerState.status === 'running') {
          animationRef.current = requestAnimationFrame(animate);
        }
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      // When paused or stopped, show exact time
      setSmoothTimeRemaining(timerState.currentTime);
    }

    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [timerState.status, timerState.currentTime, dispatch]);
  
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
    const elapsed = duration - smoothTimeRemaining;
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
            <Button onClick={handleBackToConfig} variant="transparent" className="back-button">
              <ArrowLeft size={24} />
            </Button>
          </div>
          
          <div className="timer-display">
            {timerState.currentItem && (
              <>
                <div className="timer-info">
                  <h2>{timerState.currentItem.name}</h2>
                </div>
                
                <div className="timer-circle">
                  <svg width="220" height="220" viewBox="0 0 220 220">
                    {/* Background circle */}
                    <circle
                      cx="110"
                      cy="110"
                      r={radius}
                      fill="none"
                      stroke="#444444"
                      strokeWidth="12"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="110"
                      cy="110"
                      r={radius}
                      fill="none"
                      stroke={timerState.currentItem.type === 'exercise' ? '#4caf50' : '#f5f5f5'}
                      strokeWidth="12"
                      strokeDasharray={circumference}
                      strokeDashoffset={progressOffset}
                      strokeLinecap="round"
                      style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                    />
                    
                    {/* Rounds remaining text */}
                    <text
                      x="110"
                      y="70"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#999"
                      fontSize="16px"
                      fontWeight="500"
                    >
                      {timerState.currentItem && `Round ${timerState.currentItem.setIndex + 1}/${totalRounds}`}
                    </text>
                    
                    {/* Time remaining text - centered */}
                    <text
                      x="110"
                      y="110"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#ffffff"
                      fontSize="48px"
                      fontWeight="bold"
                    >
                      {formatTime(Math.ceil(smoothTimeRemaining))}
                    </text>
                    
                    {/* Total remaining text inside ring */}
                    <text
                      x="110"
                      y="144"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#999"
                      fontSize="14px"
                      fontWeight="500"
                    >
                      {formatTime(timerState.totalTimeRemaining)}
                    </text>
                  </svg>
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
                onClick={() => setIsMuted(!isMuted)}
                variant="transparent"
                size="small"
                className="timer-mute-button"
              >
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </Button>
              <Button 
                onClick={handleTogglePlay}
                variant="transparent"
                size="large"
                className="play-pause-button"
              >
                {timerState.status === 'running' ? <Pause size={60} fill="currentColor" /> : <Play size={60} fill="currentColor" />}
              </Button>
              <Button 
                onClick={onOpenSettings}
                variant="transparent"
                size="small"
                className="timer-settings-button"
              >
                <Settings size={24} />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Timer;
