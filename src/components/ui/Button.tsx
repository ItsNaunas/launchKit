import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

// Export buttonVariants helper function for use with cn()
export const buttonVariants = ({ 
  variant = 'primary', 
  size = 'md' 
}: { variant?: 'primary' | 'secondary' | 'outline'; size?: 'sm' | 'md' | 'lg' } = {}) => {
  return cn(
    'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
    {
      'bg-gradient-to-r from-mint-500 to-mint-600 text-white hover:from-mint-600 hover:to-mint-700 focus:ring-mint-500 shadow-lg shadow-mint-500/25': variant === 'primary',
      'bg-dark text-gray-100 hover:bg-dark/80 focus:ring-mint-500 border border-mint-600/20': variant === 'secondary',
      'border border-mint-600/30 bg-transparent text-gray-300 hover:bg-mint-600/10 focus:ring-mint-500': variant === 'outline',
    },
    {
      'px-3 py-1.5 text-sm': size === 'sm',
      'px-4 py-2 text-sm': size === 'md',
      'px-6 py-3 text-base': size === 'lg',
    }
  );
};

export function Button({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  children, 
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </button>
  );
}
