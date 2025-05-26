import { SelectHTMLAttributes } from 'react';
import './Select.css';

type SelectVariant = 'default' | 'compact';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  variant?: SelectVariant;
  fullWidth?: boolean;
}

const Select = ({
  variant = 'default',
  fullWidth = false,
  className = '',
  children,
  ...props
}: SelectProps) => {
  const selectClasses = [
    'select',
    `select-${variant}`,
    fullWidth ? 'select-full-width' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <select className={selectClasses} {...props}>
      {children}
    </select>
  );
};

export default Select;
