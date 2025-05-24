/**
 * Custom hook to handle sound effects for the timer
 */
import { useRef, useEffect } from 'react';

interface SoundEffects {
  playStart: () => void;
  playComplete: () => void;
  playTransition: () => void;
}

export const useSoundEffects = (): SoundEffects => {
  const startSound = useRef<HTMLAudioElement | null>(null);
  const completeSound = useRef<HTMLAudioElement | null>(null);
  const transitionSound = useRef<HTMLAudioElement | null>(null);
  const initialized = useRef<boolean>(false);

  useEffect(() => {
    // Initialize sounds when component mounts
    if (!initialized.current && typeof window !== 'undefined') {
      startSound.current = new Audio('https://assets.mixkit.co/active_storage/sfx/1034/1034-preview.mp3');
      completeSound.current = new Audio('https://assets.mixkit.co/active_storage/sfx/1010/1010-preview.mp3');
      transitionSound.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
      
      // Set volume to avoid sounds being too loud
      if (startSound.current) startSound.current.volume = 0.7;
      if (completeSound.current) completeSound.current.volume = 0.7;
      if (transitionSound.current) transitionSound.current.volume = 0.5;
      
      initialized.current = true;
    }

    // Cleanup on component unmount
    return () => {
      if (startSound.current) startSound.current.pause();
      if (completeSound.current) completeSound.current.pause();
      if (transitionSound.current) transitionSound.current.pause();
    };
  }, []);

  const playStart = () => {
    if (startSound.current) {
      startSound.current.currentTime = 0;
      startSound.current.play().catch(e => console.error('Error playing sound:', e));
    }
  };

  const playComplete = () => {
    if (completeSound.current) {
      completeSound.current.currentTime = 0;
      completeSound.current.play().catch(e => console.error('Error playing sound:', e));
    }
  };

  const playTransition = () => {
    if (transitionSound.current) {
      transitionSound.current.currentTime = 0;
      transitionSound.current.play().catch(e => console.error('Error playing sound:', e));
    }
  };

  return {
    playStart,
    playComplete,
    playTransition,
  };
};
