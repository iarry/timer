import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { audioSystem } from '../../utils/audioSystem';
import { setAudioProfile } from '../../features/timerConfig/timerConfigSlice';
import { RootState } from '../../store';
import { Volume2 } from 'lucide-react';
import Select from '../common/Select';
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
      // Different test flow based on profile type
      if (currentProfile.useSpeech) {
        // Speech profiles: First announce the exercise name, then spaced countdown beeps
        await audioSystem.announceExerciseBeforeCountdown('Push-up');
        await new Promise(resolve => setTimeout(resolve, 300)); // Small pause after speech
        
        // Evenly spaced countdown beeps after speech
        await audioSystem.playCountdownBeep(3, 'exercise');    // "3" countdown beep
        await new Promise(resolve => setTimeout(resolve, 1000));
        await audioSystem.playCountdownBeep(2, 'exercise');    // "2" countdown beep
        await new Promise(resolve => setTimeout(resolve, 1000));
        await audioSystem.playCountdownBeep(1, 'exercise');    // "1" countdown beep
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        // Tone-only profiles: Just the evenly spaced countdown beeps
        await audioSystem.playCountdownBeep(3, 'exercise');    // "3" countdown beep
        await new Promise(resolve => setTimeout(resolve, 1000));
        await audioSystem.playCountdownBeep(2, 'exercise');    // "2" countdown beep
        await new Promise(resolve => setTimeout(resolve, 1000));
        await audioSystem.playCountdownBeep(1, 'exercise');    // "1" countdown beep
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // For tone-only profiles, play the exercise start sound
      if (!currentProfile.useSpeech) {
        await audioSystem.playWorkoutStart('Push-up');            // Exercise start (tones only)
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));     // 2s pause to simulate exercise time
      // Countdown to rest (3-2-1 descending tones, relaxing)
      await audioSystem.playCountdownBeep(3, 'rest');             // "3" countdown beep (high)
      await new Promise(resolve => setTimeout(resolve, 1000));
      await audioSystem.playCountdownBeep(2, 'rest');             // "2" countdown beep (mid)
      await new Promise(resolve => setTimeout(resolve, 1000));
      await audioSystem.playCountdownBeep(1, 'rest');             // "1" countdown beep (low)
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Rest start sound is disabled for now
      // await audioSystem.playRestStart();                       // Rest start
    } catch (error) {
      console.warn('Error testing audio profile:', error);
    }
    
    setIsTesting(false);
  };

  return (
    <div className="audio-profile-selector">
      <div className="profile-controls">
        <Select 
          value={currentProfile.name}
          onChange={(e) => handleProfileChange(e.target.value)}
          fullWidth
        >
          {profiles.map(profile => (
            <option key={profile.name} value={profile.name}>
              {profile.displayName}
            </option>
          ))}
        </Select>
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
