import { useState, useRef } from 'react'
import { useAppSelector } from './hooks'
import './App.css'
import ConfigPanel from './components/config/ConfigPanel'
import Timer from './components/timer/Timer'
import UserAuth from './components/common/UserAuth'

function App() {
  const [activeView, setActiveView] = useState<'config' | 'timer'>('config')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const timerStatus = useAppSelector(state => state.timer.status)
  const menuRef = useRef<HTMLDivElement>(null)
  
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

  return (
    <div 
      className="app-container"
    >
      {/* Menu Dropdown */}
      {isMenuOpen && (
        <div className="menu-dropdown" ref={menuRef}>
          <div className="menu-header">Settings</div>
          <div className="menu-content">
            <UserAuth />
          </div>
        </div>
      )}

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
