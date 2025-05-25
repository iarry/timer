export interface ToneSpec {
  frequency: number;
  duration: number; // Duration in seconds
  waveform: OscillatorType;
  volume: number;
  delay?: number; // Optional delay before playing this tone
}

export interface AudioProfile {
  name: string;
  countdown: ToneSpec[];        // Array of 3 tones for 3-2-1 countdown
  exerciseStart: ToneSpec[];    // Tones for starting exercise
  restStart: ToneSpec[];        // Tones for starting rest
  workoutComplete: ToneSpec[];  // Tones for workout completion
  transition?: ToneSpec[];      // Optional transition beep
}

const cleanProfile: AudioProfile = {
    name: "Clean",
    countdown: [
      { frequency: 660, duration: 0.2, waveform: "sine", volume: 0.4 },   // 3
      { frequency: 740, duration: 0.2, waveform: "sine", volume: 0.45 }, // 2
      { frequency: 830, duration: 0.25, waveform: "sine", volume: 0.5 },  // 1
    ],
    exerciseStart: [
      { frequency: 880, duration: 0.3, waveform: "triangle", volume: 0.6 },
      { frequency: 1046, duration: 0.2, waveform: "triangle", volume: 0.6, delay: 0.1 },
    ],
    restStart: [
      { frequency: 660, duration: 0.2, waveform: "sine", volume: 0.4 },
      { frequency: 528, duration: 0.3, waveform: "sine", volume: 0.35, delay: 0.1 },
    ],
    workoutComplete: [
      { frequency: 784, duration: 0.25, waveform: "triangle", volume: 0.5 },
      { frequency: 880, duration: 0.25, waveform: "triangle", volume: 0.5, delay: 0.1 },
      { frequency: 988, duration: 0.4, waveform: "triangle", volume: 0.6, delay: 0.3 },
    ],
    transition: [
      { frequency: 700, duration: 0.15, waveform: "sine", volume: 0.4 }
    ]
  };
  
  const pixelProfile: AudioProfile = {
    name: "Pixel",
    countdown: [
      { frequency: 392, duration: 0.25, waveform: "square", volume: 0.4 },
      { frequency: 523.25, duration: 0.25, waveform: "square", volume: 0.5 },
      { frequency: 659.25, duration: 0.35, waveform: "square", volume: 0.6 }
    ],
    exerciseStart: [
      { frequency: 784, duration: 0.25, waveform: "square", volume: 0.7 },
      { frequency: 988, duration: 0.3, waveform: "square", volume: 0.8, delay: 0.1 },
    ],
    restStart: [
      { frequency: 523.25, duration: 0.25, waveform: "square", volume: 0.4 },
      { frequency: 440, duration: 0.25, waveform: "square", volume: 0.4, delay: 0.2 }
    ],
    workoutComplete: [
      { frequency: 659.25, duration: 0.2, waveform: "square", volume: 0.6 },
      { frequency: 784, duration: 0.2, waveform: "square", volume: 0.7, delay: 0.2 },
      { frequency: 987.77, duration: 0.3, waveform: "square", volume: 0.8, delay: 0.3 },
      { frequency: 1318.5, duration: 0.4, waveform: "square", volume: 0.9, delay: 0.4 }
    ],
    transition: [
      { frequency: 600, duration: 0.15, waveform: "square", volume: 0.5 }
    ]
  };

  const serenityProfile: AudioProfile = {
    name: "Serenity",
    countdown: [
        { frequency: 400, duration: 0.4, waveform: "sine", volume: 0.5 },
        { frequency: 500, duration: 0.3, waveform: "sine", volume: 0.5 },
        { frequency: 600, duration: 0.3, waveform: "sine", volume: 0.5 },
    ],
    exerciseStart: [
      { frequency: 750, duration: 0.4, waveform: "sine", volume: 0.6 },
      { frequency: 780, duration: 0.4, waveform: "sine", volume: 0.7, delay: 0.1 },
    ],
    restStart: [
      { frequency: 250, duration: 0.4, waveform: "sine", volume: 0.4 },
      { frequency: 220, duration: 0.4, waveform: "sine", volume: 0.3, delay: 0.1 },
    ],
    workoutComplete: [
        { frequency: 600, duration: 0.4, waveform: "sine", volume: 0.5 },
        { frequency: 700, duration: 0.4, waveform: "sine", volume: 0.6, delay: 0.1 },
        { frequency: 800, duration: 0.6, waveform: "sine", volume: 0.4, delay: 0.4 },
      ],
    transition: [
      { frequency: 300, duration: 0.4, waveform: "sine", volume: 0.5 }
    ]
  };

  
export const audioProfiles: AudioProfile[] = [
    cleanProfile,
    pixelProfile,
    serenityProfile,
];

export const getProfileByName = (name: string): AudioProfile => {
  return audioProfiles.find(profile => profile.name === name) || cleanProfile;
};
