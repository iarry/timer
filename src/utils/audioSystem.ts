import { AudioProfile, ToneSpec, audioProfiles, getProfileByName } from './audioProfiles';

class AudioSystem {
  private audioContext: AudioContext | null = null;
  private isMuted: boolean = false;
  private currentProfile: AudioProfile;

  constructor() {
    this.initializeAudio();
    this.currentProfile = audioProfiles[0]; // Default to first profile
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
    
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
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

  async playCountdownBeep(count: number) {
    const countdownTones = this.currentProfile.countdown;
    const toneIndex = Math.min(count - 1, countdownTones.length - 1);
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

  async playTransitionBeep() {
    if (this.currentProfile.transition && this.currentProfile.transition.length > 0) {
      await this.playToneSequence(this.currentProfile.transition);
    }
  }

  // Initialize audio on first user interaction
  async initializeOnUserInteraction() {
    if (this.isMuted) return;
    
    const context = await this.ensureAudioContext();
    if (context && context.state === 'suspended') {
      await context.resume();
    }
    
    // Play a very quiet, short tone to initialize
    await this.createTone(440, 0.05, 'sine', 0.01);
  }
}

export const audioSystem = new AudioSystem();
