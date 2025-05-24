import { InputHTMLAttributes } from 'react';
import './Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input = ({
  label,
  error,
  fullWidth = false,
  className = '',
  id,
  ...props
}: InputProps) => {
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
  
  return (
    <div className={`input-wrapper ${fullWidth ? 'input-full-width' : ''}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
        </label>
      )}
      
      <input
        id={inputId}
        className={`input-field ${error ? 'input-error' : ''} ${className}`}
        {...props}
      />
      
      {error && <div className="input-error-message">{error}</div>}
    </div>
  );
};

export default Input;
