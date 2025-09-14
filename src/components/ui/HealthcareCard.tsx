import React from 'react';

interface HealthcareCardProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

export const HealthcareCard: React.FC<HealthcareCardProps> = ({
  title,
  children,
  icon,
  className = '',
  actions
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow ${className}`}>
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {icon && <div className="text-blue-600 text-xl">{icon}</div>}
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          {actions && <div className="flex items-center space-x-2">{actions}</div>}
        </div>
      </div>
      <div className="px-6 py-4">
        {children}
      </div>
    </div>
  );
};
