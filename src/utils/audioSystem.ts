import { AudioProfile, ToneSpec, audioProfiles, getProfileByName } from './audioProfiles';

class AudioSystem {
  private audioContext: AudioContext | null = null;
  private isMuted: boolean = false;
  private currentProfile: AudioProfile;

  constructor() {
    this.initializeAudio();
    this.currentProfile = audioProfiles[0]; // Default to first profile
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this); // Bind the method
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  private initializeAudio() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported');
    }
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  setProfile(profileName: string) {
    this.currentProfile = getProfileByName(profileName);
  }

  getCurrentProfile(): AudioProfile {
    return this.currentProfile;
  }

  getAvailableProfiles(): AudioProfile[] {
    return audioProfiles;
  }

  private async ensureAudioContext() {
    if (!this.audioContext) return null;
    
    // Always try to resume if suspended, especially on visibility change
    if (this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
        // console.log('AudioContext resumed');
      } catch (err) {
        console.warn('Error resuming AudioContext:', err);
        return null; // Indicate failure to resume
      }
    }
    return this.audioContext;
  }

  private createTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) {
    return new Promise<void>(async (resolve) => {
      if (this.isMuted) {
        resolve();
        return;
      }

      const context = await this.ensureAudioContext();
      if (!context) {
        resolve();
        return;
      }

      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      oscillator.frequency.setValueAtTime(frequency, context.currentTime);
      oscillator.type = type;

      // Smooth volume envelope to prevent clicks
      gainNode.gain.setValueAtTime(0, context.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, context.currentTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(volume, context.currentTime + duration - 0.1);
      gainNode.gain.linearRampToValueAtTime(0, context.currentTime + duration);

      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + duration);

      oscillator.onended = () => resolve();
    });
  }

  private async playToneSequence(tones: ToneSpec[]) {
    if (this.isMuted) return;

    // Group tones by delay time to handle simultaneous tones
    const toneGroups = new Map<number, ToneSpec[]>();
    
    tones.forEach(tone => {
      const delay = tone.delay || 0;
      if (!toneGroups.has(delay)) {
        toneGroups.set(delay, []);
      }
      toneGroups.get(delay)!.push(tone);
    });

    // Sort by delay time and play each group
    const sortedDelays = Array.from(toneGroups.keys()).sort((a, b) => a - b);
    
    for (let i = 0; i < sortedDelays.length; i++) {
      const delay = sortedDelays[i];
      const tonesAtDelay = toneGroups.get(delay)!;
      
      // Wait for the appropriate delay
      if (delay > 0) {
        const previousDelay = i > 0 ? sortedDelays[i - 1] : 0;
        const waitTime = delay - previousDelay;
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
      
      // Play all tones at this delay time simultaneously
      const promises = tonesAtDelay.map(tone => 
        this.createTone(tone.frequency, tone.duration, tone.waveform, tone.volume)
      );
      
      await Promise.all(promises);
    }
  }

  async playCountdownBeep(count: number, nextSegmentType?: 'exercise' | 'rest') {
    const countdownTones = this.currentProfile.countdown;
    
    // Determine tone order based on what's coming next
    const isCountingToExercise = nextSegmentType === 'exercise';
    
    let toneIndex: number;
    if (isCountingToExercise) {
      // Counting to exercise: play tones 1-2-3 (ascending, energizing)
      toneIndex = Math.min(countdownTones.length - count, countdownTones.length - 1);
    } else {
      // Counting to rest: play tones 3-2-1 (descending, relaxing)
      toneIndex = Math.min(count - 1, countdownTones.length - 1);
    }
    
    const tone = countdownTones[toneIndex];
    
    if (tone) {
      await this.createTone(tone.frequency, tone.duration, tone.waveform, tone.volume);
    }
  }

  async playWorkoutStart() {
    await this.playToneSequence(this.currentProfile.exerciseStart);
  }

  async playRestStart() {
    await this.playToneSequence(this.currentProfile.restStart);
  }

  async playWorkoutComplete() {
    await this.playToneSequence(this.currentProfile.workoutComplete);
  }



  // Initialize audio on first user interaction
  async initializeOnUserInteraction() {
    if (this.isMuted) return;
    
    const context = await this.ensureAudioContext();
    // No need to check context.state here, ensureAudioContext handles resume
    if (context) {
      // Play a very quiet, short tone to initialize
      // This also helps "wake up" the audio system after a tab has been backgrounded
      await this.createTone(440, 0.05, 'sine', 0.001); // Reduced volume further
    }
  }

  // Method to handle visibility change
  private async handleVisibilityChange() {
    if (document.visibilityState === 'visible') {
      // console.log('Tab became visible, ensuring audio context is active.');
      // Attempt to resume and "ping" the audio context when tab returns to foreground
      await this.initializeOnUserInteraction();
    } else {
      // console.log('Tab became hidden.');
      // Optionally, you could add logic here if needed when tab is hidden,
      // but browsers usually suspend AudioContext automatically.
    }
  }

  // Cleanup method for when the audio system is no longer needed (e.g., component unmount)
  public cleanup() {
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close().catch(err => console.warn('Error closing AudioContext:', err));
      this.audioContext = null;
    }
    // console.log('AudioSystem cleaned up.');
  }
}

export const audioSystem = new AudioSystem();

// It's good practice to offer a way to clean up global event listeners
// if the app structure allows for it (e.g., when the main App component unmounts).
// For now, this global instance will persist for the app's lifetime.
