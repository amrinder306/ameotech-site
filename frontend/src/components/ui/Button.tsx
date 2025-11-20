import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

const base =
  'inline-flex items-center justify-center rounded-lg font-medium text-sm px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500';

  const variants: Record<Variant, string> = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'border border-gray-300 text-gray-900 hover:bg-gray-50',
    ghost: 'border-2 border-white text-white hover:bg-blue-800',
  };

export const Button: React.FC<Props> = ({ variant = 'primary', className = '', ...props }) => {
  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    />
  );
};
