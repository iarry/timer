import { useEffect, useRef, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  startTimer,
  pauseTimer,
  resetTimer,
  tickTimer,
  initializeTimer,
  resetCurrentCountdown,
  goToPreviousItem,
  goToNextItem,
} from '../../features/timer/timerSlice';
import { setMuted } from '../../features/timerConfig/timerConfigSlice';
import { formatTime } from '../../utils';
import { audioSystem } from '../../utils/audioSystem';
import { useScreenWakeLock } from '../../hooks/useScreenWakeLock';
import Button from '../common/Button';
import { Pause, Play, Undo, VolumeX, Volume2, X } from 'lucide-react';
import './Timer.css';

interface TimerProps {
  onExit: () => void;
}

const Timer = ({ onExit }: TimerProps) => {
  const dispatch = useAppDispatch();
  const timerState = useAppSelector(state => state.timer);
  const timerConfig = useAppSelector(state => state.timerConfig);
  const timerRef = useRef<number | null>(null);
  const animationRef = useRef<number | null>(null);
  const previousItemRef = useRef(timerState.currentItem);
  const [smoothTimeRemaining, setSmoothTimeRemaining] = useState(0);
  const lastTickTimeRef = useRef<number>(Date.now());
  const countdownStartTimeRef = useRef<number>(Date.now());

  // Get mute state from persisted config instead of local state
  const isMuted = timerConfig.muted;

  // Update the audio system mute state when local mute state changes
  useEffect(() => {
    audioSystem.setMuted(isMuted);
  }, [isMuted]);

  // Keep screen awake when timer is running
  const isTimerActive = timerState.status === 'running';
  useScreenWakeLock(isTimerActive);

  // Calculate total rounds for the display
  const totalRounds = timerConfig.splits.reduce((total, split) => total + split.sets, 0);

  // Effect to handle the timer ticking and countdown audio
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
        
        // Play countdown beeps for last 3 seconds
        const newTimeRemaining = timerState.currentTime - 1;
        if (newTimeRemaining <= 3 && newTimeRemaining > 0) {
          // Determine what type of segment is starting when countdown finishes
          const nextSegmentType = timerState.queue.length > 0 ? timerState.queue[0].type : undefined;
          audioSystem.playCountdownBeep(newTimeRemaining, nextSegmentType);
        }
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
  }, [timerState.status, timerState.currentTime, timerState.queue, dispatch]);
  
  // Effect to play sounds on transitions
  useEffect(() => {
    // Play different sounds based on timer events
    if (timerState.status === 'completed') {
      audioSystem.playWorkoutComplete();
    } else if (
      timerState.currentItem && 
      (!previousItemRef.current || previousItemRef.current !== timerState.currentItem)
    ) {
      // Play transition sound when moving to a new exercise
      if (previousItemRef.current) {
        // Play the appropriate sound based on the new item type
        if (timerState.currentItem.type === 'exercise') {
          audioSystem.playWorkoutStart();
        } else if (timerState.currentItem.type === 'rest') {
          audioSystem.playRestStart();
        }
      }
      // Update countdown start time when moving to a new item
      countdownStartTimeRef.current = Date.now();
    }
    
    // Update the ref
    previousItemRef.current = timerState.currentItem;
  }, [timerState.currentItem, timerState.status]);

  // Initialize the timer with the current configuration
  const handleStartWorkout = useCallback(() => {
    dispatch(initializeTimer({
      splits: timerConfig.splits,
      defaultRestDuration: timerConfig.defaultRestDuration,
      warmupDuration: timerConfig.warmupDuration, // Pass warmupDuration from timerConfig
    }));
    dispatch(startTimer());
    
    // Play initial audio cue based on first item type
    // Note: We'll let the transition effect handle the first sound
    audioSystem.initializeOnUserInteraction();
  }, [dispatch, timerConfig.splits, timerConfig.defaultRestDuration, timerConfig.warmupDuration]);

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

  // Handle reset button behavior
  const handleReset = () => {
    if (!timerState.currentItem) return;
    
    const elapsedTime = (Date.now() - countdownStartTimeRef.current) / 1000;
    
    if (elapsedTime < 1) {
      // Less than 1 second has elapsed, go to previous item
      dispatch(goToPreviousItem());
      // Update the countdown start time for the previous item
      countdownStartTimeRef.current = Date.now();
    } else {
      // Reset the current countdown to its original duration
      dispatch(resetCurrentCountdown());
      // Update the countdown start time
      countdownStartTimeRef.current = Date.now();
    }
  };

  // Handle going to the next exercise
  const handleNext = () => {
    dispatch(goToNextItem());
    // Update the countdown start time for the next item
    countdownStartTimeRef.current = Date.now();
  };

  // Get the next exercise name (for showing during rest)
  const getNextExerciseName = () => {
    if (timerState.queue.length > 0) {
      // If current item is rest and next item is exercise, show next exercise name
      if (timerState.currentItem?.type === 'rest' && timerState.queue[0].type === 'exercise') {
        return timerState.queue[0].name;
      }
    }
    return null;
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

  // Initialize audio on first user interaction
  useEffect(() => {
    const initializeAudio = () => {
      // This ensures audio context is ready for use
      audioSystem.initializeOnUserInteraction();
    };

    document.addEventListener('click', initializeAudio, { once: true });
    document.addEventListener('touchstart', initializeAudio, { once: true });

    return () => {
      document.removeEventListener('click', initializeAudio);
      document.removeEventListener('touchstart', initializeAudio);
    };
  }, []);

  // Auto-start the workout when the component is mounted
  useEffect(() => {
    const hasWorkout = timerConfig.splits.length > 0 || timerConfig.warmupDuration > 0;
    if (timerState.status === 'idle' && hasWorkout) {
      handleStartWorkout();
    }
  // Ensure re-initialization if config changes, though typically Timer is unmounted/remounted
  }, [timerConfig.splits, timerConfig.defaultRestDuration, timerConfig.warmupDuration, timerState.status, dispatch, handleStartWorkout]); 

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
              <X size={24} />
            </Button>
            <Button 
              onClick={() => dispatch(setMuted(!isMuted))}
              variant="transparent"
              size="small"
              className="timer-mute-button"
            >
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </Button>
          </div>
          
          <div className="timer-display">
            {timerState.currentItem && (
              <>
                <div className="timer-info">
                  <h2>{timerState.currentItem.name}</h2>
                  {/* Show next exercise during rest phase */}
                  {timerState.currentItem.type === 'rest' && getNextExerciseName() && (
                    <div className="next-exercise-info">
                      Next: {getNextExerciseName()}
                    </div>
                  )}
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
                      {timerState.currentItem && timerState.currentItem.splitId === 'system-warmup' 
                        ? 'Warmup' 
                        : timerState.currentItem && `Set ${timerState.currentItem.currentGlobalSetIndex}/${totalRounds}`}
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
                <h2>Nice work, stay hard.</h2>
              </div>
            )}
          </div>
          
          {timerState.status !== 'completed' && (
            <div className="timer-controls">
              <Button 
                onClick={handleReset}
                variant="transparent"
                size="small"
                className="timer-control-button"
              >
                <Undo size={24} />
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
                onClick={handleNext}
                variant="transparent"
                size="small"
                className="timer-control-button next-button"
              >
                <Undo size={24} className="flip-horizontal" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Timer;
