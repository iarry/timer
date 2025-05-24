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
  
  // Close menu when clicking outside
  const handleClickOutside = (event: React.MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false)
    }
  }

  return (
    <div 
      className="app-container"
      onClick={isMenuOpen ? handleClickOutside : undefined}
    >
      {/* Hamburger Menu Button */}
      <button 
        className="menu-button"
        onClick={(e) => {
          e.stopPropagation()
          toggleMenu()
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
        </svg>
      </button>
      
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
          <ConfigPanel onStartWorkout={() => handleChangeView('timer')} />
        ) : (
          <Timer onExit={() => handleChangeView('config')} />
        )}
      </main>
    </div>
  )
}

export default App
