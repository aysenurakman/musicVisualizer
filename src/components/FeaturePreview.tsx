import React from 'react';

export function FeaturePreview() {
  return (
    <div className="mt-20 relative">
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent h-40 -bottom-1"></div>
      <div className="bg-indigo-900/20 backdrop-blur-xl rounded-2xl p-8 border border-indigo-800/30">
        <img 
          src="https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?auto=format&fit=crop&q=80"
          alt="Music Visualization Preview"
          className="w-full h-[400px] object-cover rounded-lg"
        />
      </div>
    </div>
  );
}