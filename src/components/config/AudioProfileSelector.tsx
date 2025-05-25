import React, { useState, useEffect } from 'react';
import { audioSystem } from '../../utils/audioSystem';
import { AudioProfile } from '../../utils/audioProfiles';
import './AudioProfileSelector.css';

export const AudioProfileSelector: React.FC = () => {
  const [currentProfile, setCurrentProfile] = useState<AudioProfile>(audioSystem.getCurrentProfile());
  const [isTestingProfile, setIsTestingProfile] = useState<string | null>(null);
  const profiles = audioSystem.getAvailableProfiles();

  useEffect(() => {
    setCurrentProfile(audioSystem.getCurrentProfile());
  }, []);

  const handleProfileChange = (profileName: string) => {
    audioSystem.setProfile(profileName);
    setCurrentProfile(audioSystem.getCurrentProfile());
  };

  const testProfile = async (profile: AudioProfile) => {
    if (isTestingProfile) return; // Prevent multiple simultaneous tests
    
    setIsTestingProfile(profile.name);
    
    // Save current profile
    const originalProfile = audioSystem.getCurrentProfile();
    
    // Temporarily switch to test profile
    audioSystem.setProfile(profile.name);
    
    try {
      // Play workout flow demo sequence with full countdown
      // Countdown to exercise (1-2-3 ascending tones, energizing)
      await audioSystem.playCountdownBeep(3, 'exercise');          // "1" countdown beep (low)
      await new Promise(resolve => setTimeout(resolve, 1000));
      await audioSystem.playCountdownBeep(2, 'exercise');          // "2" countdown beep (mid)
      await new Promise(resolve => setTimeout(resolve, 1000));
      await audioSystem.playCountdownBeep(1, 'exercise');          // "3" countdown beep (high)
      await new Promise(resolve => setTimeout(resolve, 1000));
      await audioSystem.playWorkoutStart();               // Exercise start
      await new Promise(resolve => setTimeout(resolve, 2000));  // 2s pause to simulate exercise time
      // Countdown to rest (3-2-1 descending tones, relaxing)
      await audioSystem.playCountdownBeep(3, 'rest');          // "3" countdown beep (high)
      await new Promise(resolve => setTimeout(resolve, 1000));
      await audioSystem.playCountdownBeep(2, 'rest');          // "2" countdown beep (mid)
      await new Promise(resolve => setTimeout(resolve, 1000));
      await audioSystem.playCountdownBeep(1, 'rest');          // "1" countdown beep (low)
      await new Promise(resolve => setTimeout(resolve, 1000));
      await audioSystem.playRestStart();            // Rest start
    } catch (error) {
      console.warn('Error testing audio profile:', error);
    }
    
    // Restore original profile if different
    if (originalProfile.name !== profile.name) {
      setTimeout(() => {
        audioSystem.setProfile(originalProfile.name);
        setCurrentProfile(originalProfile);
      }, 2000);
    }
    
    setIsTestingProfile(null);
  };

  return (
    <div className="audio-profile-selector">
      <h3>Audio Profile</h3>
      <div className="profile-options">
        {profiles.map(profile => (
          <div key={profile.name} className="profile-option">
            <label className="profile-label">
              <input
                type="radio"
                name="audioProfile"
                value={profile.name}
                checked={currentProfile.name === profile.name}
                onChange={() => handleProfileChange(profile.name)}
              />
              <div className="profile-info">
                <span className="profile-name">{profile.name}</span>
              </div>
            </label>
            <button 
              onClick={() => testProfile(profile)}
              className={`test-button ${isTestingProfile === profile.name ? 'testing' : ''}`}
              disabled={isTestingProfile !== null}
              type="button"
              title="Play a sample of this audio profile"
            >
              {isTestingProfile === profile.name ? '♪' : 'Test'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
