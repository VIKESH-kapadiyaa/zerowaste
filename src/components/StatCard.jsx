import React from 'react';

const StatCard = ({ label, value, sub, icon: Icon }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#0D2B1F]/5 flex flex-col gap-1">
    <div className="flex justify-between items-start mb-2">
      <div className="p-2 bg-[#1A9E6E]/10 rounded-lg text-[#1A9E6E]">
        <Icon size={20} />
      </div>
      {sub && <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">{sub}</span>}
    </div>
    <span className="text-3xl font-bold text-[#0D2B1F] tracking-tight">{value}</span>
    <span className="text-sm text-gray-500 font-medium">{label}</span>
  </div>
);

export default StatCard;
