import React from 'react';

const StatsCard = ({ icon, label, value, color = 'teal' }) => {
  const colors = {
    teal: 'bg-teal-50 text-teal-700 border-teal-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    green: 'bg-green-50 text-green-700 border-green-100',
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
  };
  return (
    <div className={`rounded-xl border p-4 flex items-center gap-3 ${colors[color]}`}>
      <div className="text-2xl">{icon}</div>
      <div>
        <p className="text-2xl font-display font-bold">{value}</p>
        <p className="text-xs font-body opacity-80">{label}</p>
      </div>
    </div>
  );
};

export default StatsCard;
