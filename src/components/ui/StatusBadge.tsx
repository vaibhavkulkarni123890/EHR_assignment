import React from 'react';

interface StatusBadgeProps {
  status: 'active' | 'error' | 'pending' | 'success' | 'warning' | 'inactive' | 'checking';
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  children, 
  size = 'md' 
}) => {
  const baseStyles = 'inline-flex items-center font-medium border rounded-full';
  
  const statusStyles = {
    active: 'bg-green-100 text-green-800 border-green-200',
    inactive: 'bg-gray-100 text-gray-800 border-gray-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-orange-100 text-orange-800 border-orange-200',
    checking: 'bg-blue-100 text-blue-800 border-blue-200', // Added 'checking' status
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span className={`${baseStyles} ${statusStyles[status]} ${sizes[size]}`}>
      <div className={`w-2 h-2 rounded-full mr-2 ${
        status === 'active' || status === 'success' ? 'bg-green-500' :
        status === 'inactive' ? 'bg-gray-400' :
        status === 'pending' ? 'bg-yellow-500' :
        status === 'error' ? 'bg-red-500' :
        status === 'warning' ? 'bg-orange-500' :
        status === 'checking' ? 'bg-blue-500 animate-pulse' : 'bg-blue-500'
      }`}></div>
      {children}
    </span>
  );
};
