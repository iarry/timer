import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { audioSystem } from '../../utils/audioSystem';
import { setAudioProfile } from '../../features/timerConfig/timerConfigSlice';
import { RootState } from '../../store';
import { Volume2 } from 'lucide-react';
import './AudioProfileSelector.css';

export const AudioProfileSelector: React.FC = () => {
  const dispatch = useDispatch();
  const currentProfileName = useSelector((state: RootState) => state.timerConfig.audioProfile);
  const currentProfile = audioSystem.getAvailableProfiles().find(p => p.name === currentProfileName) || audioSystem.getAvailableProfiles()[0];
  const [isTesting, setIsTesting] = useState(false);
  const profiles = audioSystem.getAvailableProfiles();

  useEffect(() => {
    // Update audio system when Redux state changes
    audioSystem.setProfile(currentProfileName);
  }, [currentProfileName]);

  const handleProfileChange = (profileName: string) => {
    dispatch(setAudioProfile(profileName));
  };

  const testCurrentProfile = async () => {
    if (isTesting) return; // Prevent multiple simultaneous tests
    
    setIsTesting(true);
    
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
    
    setIsTesting(false);
  };

  return (
    <div className="audio-profile-selector">
      <h3>Audio Profile</h3>
      <div className="profile-controls">
        <select 
          value={currentProfile.name}
          onChange={(e) => handleProfileChange(e.target.value)}
          className="profile-select"
        >
          {profiles.map(profile => (
            <option key={profile.name} value={profile.name}>
              {profile.name}
            </option>
          ))}
        </select>
        <button 
          onClick={testCurrentProfile}
          className={`test-button ${isTesting ? 'testing' : ''}`}
          disabled={isTesting}
          type="button"
          title="Test the selected audio profile"
        >
          <Volume2 size={16} />
          {isTesting && <span className="testing-indicator">♪</span>}
        </button>
      </div>
    </div>
  );
};
