import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  fullWidth = false,
  isLoading = false,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium py-3 px-6 rounded-xl transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-opacity-75';

  const variantStyles = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 hover:animate-subtle-scale-up focus:ring-indigo-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 hover:animate-subtle-scale-up focus:ring-gray-400',
    danger: 'bg-red-500 text-white hover:bg-red-600 hover:animate-subtle-scale-up focus:ring-red-400',
  };

  const widthStyles = fullWidth ? 'w-full' : '';
  const loadingStyles = isLoading ? 'opacity-70 cursor-not-allowed' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${widthStyles} ${loadingStyles} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;