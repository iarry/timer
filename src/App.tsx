import { useState } from 'react'
import { useAppSelector } from './hooks'
import './App.css'
import ConfigPanel from './components/config/ConfigPanel'
import Timer from './components/timer/Timer'
import WorkoutSaveDialog from './components/workouts/WorkoutSaveDialog'
import WorkoutLibrary from './components/workouts/WorkoutLibrary'
import { OfflineIndicator } from './components/common/OfflineIndicator'

function App() {
  const [activeView, setActiveView] = useState<'config' | 'timer'>('config')
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showWorkoutLibrary, setShowWorkoutLibrary] = useState(false)
  const timerStatus = useAppSelector(state => state.timer.status)
  
  // If timer is active (running or paused), show timer view
  // Otherwise show the view based on user selection
  const currentView = timerStatus !== 'idle' && timerStatus !== 'completed' 
    ? 'timer'
    : activeView

  const handleChangeView = (view: 'config' | 'timer') => {
    setActiveView(view)
  }

  const handleSaveWorkout = () => {
    setShowSaveDialog(true)
  }

  const handleLoadWorkout = () => {
    setShowWorkoutLibrary(true)
  }

  return (
    <div 
      className="app-container"
    >
      {/* Offline Indicator */}
      <OfflineIndicator />

      {/* Save Dialog */}
      <WorkoutSaveDialog 
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
      />

      {/* Workout Library */}
      <WorkoutLibrary 
        isOpen={showWorkoutLibrary}
        onClose={() => setShowWorkoutLibrary(false)}
      />

      <main className="app-content">
        {currentView === 'config' ? (
          <ConfigPanel 
            onStartWorkout={() => handleChangeView('timer')} 
            onSaveWorkout={handleSaveWorkout}
            onLoadWorkout={handleLoadWorkout}
          />
        ) : (
          <Timer 
            onExit={() => handleChangeView('config')} 
          />
        )}
      </main>
    </div>
  )
}

export default App
