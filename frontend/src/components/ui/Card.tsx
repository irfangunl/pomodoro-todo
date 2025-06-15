import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  padding = 'md' 
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={`
      bg-white rounded-2xl shadow-card border border-gray-100 
      transition-shadow duration-200 hover:shadow-soft
      ${paddingClasses[padding]} ${className}
    `}>
      {children}
    </div>
  );
};
