import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { login, logout } from '../../userSlice';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, provider } from '../../firebase';
import Button from '../common/Button';
import './UserAuth.css';

const UserAuth = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = async () => {
    setIsLoading(true);
    
    try {
      const result = await signInWithPopup(auth, provider);
      
      // The signed-in user info
      const user = result.user;
      
      dispatch(login({
        uid: user.uid,
        name: user.displayName,
        email: user.email,
      }));
    } catch (error) {
      // Login failed - could be user cancelled or network issue
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogout = async () => {
    setIsLoading(true);
    
    try {
      await signOut(auth);
      dispatch(logout());
    } catch (error) {
      // Logout failed - likely network issue
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="user-auth">
      {user.uid ? (
        <div className="user-profile">
          <span className="user-name">Hello, {user.name}</span>
          <Button 
            variant="outline" 
            size="small"
            onClick={handleLogout}
            disabled={isLoading}
          >
            Sign Out
          </Button>
        </div>
      ) : (
        <Button 
          variant="outline" 
          size="small"
          onClick={handleLogin}
          disabled={isLoading}
        >
          Sign In with Google
        </Button>
      )}
    </div>
  );
};

export default UserAuth;
