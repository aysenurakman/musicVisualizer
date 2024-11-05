import React from 'react';
import { Sparkles, Music } from 'lucide-react';

interface HeroProps {
  onDemo: () => void;
  onVideo: () => void;
}

export function Hero({ onDemo, onVideo }: HeroProps) {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <div className="inline-flex items-center bg-indigo-900/30 rounded-full px-4 py-2 mb-6">
        <Sparkles className="h-4 w-4 text-indigo-400 mr-2" />
        <span className="text-sm">AI-Powered Music Visualization</span>
      </div>
      <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
        Transform Your Music into Visual Art
      </h1>
      <p className="text-xl text-gray-300 mb-12 leading-relaxed">
        Experience your music in a whole new dimension. Our AI transforms your songs into stunning, 
        real-time visual experiences that move and evolve with every beat.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button 
          onClick={onDemo}
          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 px-8 py-4 rounded-full font-medium transition-colors flex items-center justify-center"
        >
          <Music className="h-5 w-5 mr-2" />
          Try Demo Now
        </button>
        <button 
          onClick={onVideo}
          className="w-full sm:w-auto bg-white/10 hover:bg-white/20 px-8 py-4 rounded-full font-medium transition-colors"
        >
          Watch How It Works
        </button>
      </div>
    </div>
  );
}