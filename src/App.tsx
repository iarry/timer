import { useState, useRef, useEffect } from 'react'
import { useAppSelector } from './hooks'
import './App.css'
import ConfigPanel from './components/config/ConfigPanel'
import Timer from './components/timer/Timer'
import UserAuth from './components/common/UserAuth'
import WorkoutSaveDialog from './components/workouts/WorkoutSaveDialog'
import WorkoutLibrary from './components/workouts/WorkoutLibrary'
import Button from './components/common/Button'
import { Save, FolderOpen } from 'lucide-react'

function App() {
  const [activeView, setActiveView] = useState<'config' | 'timer'>('config')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showWorkoutLibrary, setShowWorkoutLibrary] = useState(false)
  const timerStatus = useAppSelector(state => state.timer.status)
  const menuRef = useRef<HTMLDivElement>(null)
  
  // Add click outside handler for menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  // If timer is active (running or paused), show timer view
  // Otherwise show the view based on user selection
  const currentView = timerStatus !== 'idle' && timerStatus !== 'completed' 
    ? 'timer'
    : activeView

  const handleChangeView = (view: 'config' | 'timer') => {
    setActiveView(view)
  }
  
  // Toggle the menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleSaveWorkout = () => {
    setShowSaveDialog(true)
    setIsMenuOpen(false)
  }

  const handleLoadWorkout = () => {
    setShowWorkoutLibrary(true)
    setIsMenuOpen(false)
  }

  return (
    <div 
      className="app-container"
    >
      {/* Menu Dropdown */}
      {isMenuOpen && (
        <div className="menu-dropdown" ref={menuRef}>
          <div className="menu-header">Settings</div>
          <div className="menu-content">
            <div className="menu-section">
              <Button 
                onClick={handleSaveWorkout}
                variant="secondary"
                size="small"
                className="menu-button"
              >
                <Save size={16} />
                Save Workout
              </Button>
              <Button 
                onClick={handleLoadWorkout}
                variant="secondary"
                size="small"
                className="menu-button"
              >
                <FolderOpen size={16} />
                Load Workout
              </Button>
              <UserAuth />
            </div>
          </div>
        </div>
      )}

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
            onOpenSettings={toggleMenu}
          />
        ) : (
          <Timer 
            onExit={() => handleChangeView('config')} 
            onOpenSettings={toggleMenu}
          />
        )}
      </main>
    </div>
  )
}

export default App
