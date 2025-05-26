import { useState } from 'react'
import { useAppSelector, useAppDispatch } from './hooks'
import './App.css'
import ConfigPanel from './components/config/ConfigPanel'
import Timer from './components/timer/Timer'
import WorkoutSaveDialog from './components/workouts/WorkoutSaveDialog'
import WorkoutLibrary from './components/workouts/WorkoutLibrary'
import { OfflineIndicator } from './components/common/OfflineIndicator'
import { loadWorkout } from './features/timerConfig/timerConfigSlice'
import { setCurrentWorkout } from './features/savedWorkouts/savedWorkoutsSlice'

function App() {
  const dispatch = useAppDispatch()
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

  const handleNewWorkout = () => {
    // Clear current workout and reset configuration
    dispatch(setCurrentWorkout(null))
    dispatch(loadWorkout({
      splits: [],
      defaultExerciseDuration: 45,
      defaultRestDuration: 30
    }))
    setShowWorkoutLibrary(false)
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
        onNewWorkout={handleNewWorkout}
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
