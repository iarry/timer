class AudioSystem {
  private audioContext: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    this.initializeAudio();
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

  // Countdown beeps - getting higher in pitch to build anticipation
  async playCountdownBeep(count: number) {
    // Frequencies: 440Hz (A), 493Hz (B), 523Hz (C)
    const frequencies = [440, 493, 523];
    const frequency = frequencies[Math.min(count - 1, 2)];
    await this.createTone(frequency, 0.15, 'sine', 0.4);
  }

  // Upbeat "ready to work" tone - major chord progression
  async playWorkoutStart() {
    if (this.isMuted) return;

    // Play a pleasant major chord: C-E-G (523-659-784 Hz)
    const chordPromises = [
      this.createTone(523, 0.6, 'sine', 0.25), // C
      this.createTone(659, 0.6, 'sine', 0.2),  // E
      this.createTone(784, 0.6, 'sine', 0.15)  // G
    ];

    await Promise.all(chordPromises);
  }

  // Mellower "time to rest" tone - soft, calming
  async playRestStart() {
    if (this.isMuted) return;

    // Gentle, calming tone progression: F-A-C (349-440-523 Hz)
    await this.createTone(349, 0.4, 'sine', 0.2); // F
    await new Promise(resolve => setTimeout(resolve, 100));
    await this.createTone(440, 0.4, 'sine', 0.15); // A
    await new Promise(resolve => setTimeout(resolve, 100));
    await this.createTone(523, 0.6, 'sine', 0.1);  // C (soft ending)
  }

  // Final completion tone - triumphant but not overwhelming
  async playWorkoutComplete() {
    if (this.isMuted) return;

    // Ascending major scale ending on a pleasant chord
    const notes = [523, 587, 659, 698, 784]; // C-D-E-F-G
    
    // Play ascending notes
    for (const frequency of notes) {
      this.createTone(frequency, 0.2, 'sine', 0.2);
      await new Promise(resolve => setTimeout(resolve, 150));
    }

    // Final chord
    await Promise.all([
      this.createTone(523, 1.0, 'sine', 0.15), // C
      this.createTone(659, 1.0, 'sine', 0.12), // E
      this.createTone(784, 1.0, 'sine', 0.1)   // G
    ]);
  }

  // Gentle transition beep for switching between exercises
  async playTransitionBeep() {
    if (this.isMuted) return;
    await this.createTone(587, 0.25, 'sine', 0.25); // D note - neutral and pleasant
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
