import React from 'react';

const StatusBadge = ({ status }) => {
  let style = 'bg-gray-100 text-gray-800 border-gray-300';
  const normalized = status?.toUpperCase();

  switch (normalized) {
    case 'APPROVED':
    case 'AVAILABLE':
    case 'COMPLETED':
    case 'FULFILLED':
      style = 'bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold';
      break;
    case 'PENDING':
      style = 'bg-amber-50 text-amber-700 border border-amber-300 font-bold';
      break;
    case 'REJECTED':
    case 'EXPIRED':
    case 'CANCELLED':
      style = 'bg-red-50 text-red-700 border border-red-300 font-bold';
      break;
    case 'EMERGENCY':
      style = 'bg-red-600 text-white font-bold';
      break;
    case 'URGENT':
      style = 'bg-orange-50 text-orange-700 border border-orange-300 font-bold';
      break;
    case 'NORMAL':
      style = 'bg-blue-50 text-blue-700 border border-blue-300 font-bold';
      break;
    case 'TEMPORARILY_UNAVAILABLE':
      style = 'bg-gray-100 text-gray-600 border border-gray-300';
      break;
    default:
      break;
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${style}`}>
      {normalized?.replace('_', ' ')}
    </span>
  );
};

export default StatusBadge;
