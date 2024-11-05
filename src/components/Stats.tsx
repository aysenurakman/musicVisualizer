import React from 'react';

export function Stats() {
  const stats = [
    { value: '100K+', label: 'Active Users' },
    { value: '1M+', label: 'Visualizations' },
    { value: '50+', label: 'Visual Styles' },
    { value: '4.9', label: 'User Rating' },
  ];

  return (
    <div className="border-t border-indigo-900/50">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-indigo-400 mb-2">{stat.value}</div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}