import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'danger' | 'confirm' | 'cancel';
  state?: 'active' | 'loading';
  onClick?: () => void;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
}

function Button({
  children,
  variant = 'primary',
  state,
  onClick,
  disabled = false,
  autoFocus = false,
  className = '',
}: ButtonProps) {
  const buttonClasses = [
    styles.button,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClasses}
      data-variant={variant}
      data-state={state}
      onClick={onClick}
      disabled={disabled}
      autoFocus={autoFocus}
    >
      {children}
    </button>
  );
}

export default Button;
