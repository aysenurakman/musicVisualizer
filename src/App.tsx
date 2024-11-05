import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { FeaturePreview } from './components/FeaturePreview';
import { Stats } from './components/Stats';
import { MusicVisualizer } from './components/MusicVisualizer';
import { VideoModal } from './components/VideoModal';

function App() {
  const [showDemo, setShowDemo] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 to-black text-white">
      <Navigation />
      <main className="container mx-auto px-6 pt-20 pb-32">
        <Hero onDemo={() => setShowDemo(true)} onVideo={() => setShowVideo(true)} />
        <FeaturePreview />
      </main>
      <Stats />
      {showDemo && <MusicVisualizer />}
      {showVideo && <VideoModal onClose={() => setShowVideo(false)} />}
    </div>
  );
}

export default App;