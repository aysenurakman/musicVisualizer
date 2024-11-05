import React from 'react';
import { Waves, Sparkles } from 'lucide-react';

export function Navigation() {
  return (
    <nav className="container mx-auto px-6 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Waves className="h-8 w-8 text-indigo-400" />
          <span className="text-xl font-bold">VisuAIze</span>
        </div>
        <div className="hidden md:flex space-x-8">
          <a href="#features" className="hover:text-indigo-400 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-indigo-400 transition-colors">How it Works</a>
          <a href="#pricing" className="hover:text-indigo-400 transition-colors">Pricing</a>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-full font-medium transition-colors">
          Get Started
        </button>
      </div>
    </nav>
  );
}