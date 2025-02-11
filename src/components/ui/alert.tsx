// components/ui/alert.tsx
import React from 'react';

interface AlertProps {
  className?: string;
  variant?: 'default' | 'destructive';
  children: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({ 
  children, 
  className = '',
  variant = 'default'
}) => {
  const baseStyles = "relative w-full rounded-lg border p-4";
  const variantStyles = {
    default: "bg-white border-gray-200 text-gray-950",
    destructive: "border-red-500/50 text-red-500"
  };

  const classes = `${baseStyles} ${variantStyles[variant]} ${className}`;

  return (
    <div role="alert" className={classes}>
      {children}
    </div>
  );
};

export const AlertTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children,
  className = ''
}) => (
  <h5 className={`mb-1 font-medium leading-none tracking-tight ${className}`}>
    {children}
  </h5>
);

export const AlertDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children,
  className = ''
}) => (
  <div className={`text-sm [&_p]:leading-relaxed ${className}`}>
    {children}
  </div>
);