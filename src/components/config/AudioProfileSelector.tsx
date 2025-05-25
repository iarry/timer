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
      // Full countdown: 3-2-1
      await audioSystem.playCountdownBeep(3);          // "1" countdown beep
      await new Promise(resolve => setTimeout(resolve, 1000));
      await audioSystem.playCountdownBeep(2);          // "2" countdown beep
      await new Promise(resolve => setTimeout(resolve, 1000));
      await audioSystem.playCountdownBeep(1);          // "3" countdown beep
      await new Promise(resolve => setTimeout(resolve, 1000));
      await audioSystem.playRestStart();               // Rest start
      await new Promise(resolve => setTimeout(resolve, 3000));  // 3s pause to simulate exercise time
      // Full countdown again: 3-2-1
      await audioSystem.playCountdownBeep(1);          // "3" countdown beep
      await new Promise(resolve => setTimeout(resolve, 1000));
      await audioSystem.playCountdownBeep(2);          // "2" countdown beep
      await new Promise(resolve => setTimeout(resolve, 1000));
      await audioSystem.playCountdownBeep(3);          // "1" countdown beep
      await new Promise(resolve => setTimeout(resolve, 1000));
      await audioSystem.playWorkoutStart();            // Exercise start
      await new Promise(resolve => setTimeout(resolve, 3000));  // 3s pause to simulate exercise time
      await audioSystem.playWorkoutComplete();          // Workout complete
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
