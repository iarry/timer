import { useAppSelector } from '../../hooks';
import UserAuth from '../common/UserAuth';
import Button from '../common/Button';
import './Header.css';

interface HeaderProps {
  activeView: 'config' | 'timer';
  onChangeView: (view: 'config' | 'timer') => void;
}

const Header = ({ activeView, onChangeView }: HeaderProps) => {
  const timerStatus = useAppSelector(state => state.timer.status);
  
  return (
    <header className="header">
      <div className="header-logo">
        <h1>HIIT Timer</h1>
      </div>
      
      <div className="header-content">
        <nav className="header-nav">
          <Button 
            variant={activeView === 'config' ? 'primary' : 'transparent'} 
            onClick={() => onChangeView('config')}
            disabled={timerStatus === 'running' || timerStatus === 'paused'}
          >
            Configure
          </Button>
          <Button 
            variant={activeView === 'timer' ? 'primary' : 'transparent'}
            onClick={() => onChangeView('timer')}
          >
            Timer
          </Button>
        </nav>
        
        <UserAuth />
      </div>
    </header>
  );
};

export default Header;
