import React from 'react';

const StatCard = ({ title, value, icon: Icon, subtitle }) => {
  return (
    <div className="card flex items-center justify-between border border-gray-200 bg-white">
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {Icon && (
        <div className="p-3 rounded bg-red-50 text-red-600 border border-red-100">
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};

export default StatCard;
