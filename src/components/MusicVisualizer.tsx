import React, { useState, useRef } from 'react';
import { Play, Pause, Upload, RefreshCw } from 'lucide-react';
import { AudioVisualizer } from './AudioVisualizer';

type VisualStyle = 
  | 'abstract'
  | 'neon'
  | 'smoke'
  | 'nature'
  | 'retro'
  | 'minimal'
  | 'nebula'
  | 'fractal'
  | 'wave';

interface MusicVisualizerProps {
  onClose?: () => void;
}

export function MusicVisualizer({ onClose }: MusicVisualizerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [visualStyle, setVisualStyle] = useState<VisualStyle>('wave');
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = URL.createObjectURL(file);
        setIsPlaying(false);
      }
      setAudioFile(file);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleStyleChange = () => {
    const styles: VisualStyle[] = [
      'abstract', 'neon', 'smoke', 'nature', 'retro', 
      'minimal', 'nebula', 'fractal', 'wave'
    ];
    const currentIndex = styles.indexOf(visualStyle);
    const nextIndex = (currentIndex + 1) % styles.length;
    setVisualStyle(styles[nextIndex]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
      <div className="w-full max-w-4xl p-8">
        <div className="bg-indigo-900/20 backdrop-blur-xl rounded-2xl p-8 border border-indigo-800/30">
          <div className="aspect-video bg-black rounded-lg mb-6 overflow-hidden">
            {!audioFile ? (
              <div className="w-full h-full flex items-center justify-center">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-full inline-flex items-center"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Music File
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="audio/*"
                  className="hidden"
                />
              </div>
            ) : (
              <AudioVisualizer 
                audioElement={audioRef.current}
                style={visualStyle}
              />
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                disabled={!audioFile}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 p-3 rounded-full"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </button>
              <button
                onClick={handleStyleChange}
                disabled={!audioFile}
                className="bg-white/10 hover:bg-white/20 disabled:opacity-50 p-3 rounded-full"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
            <div className="text-sm text-gray-400">
              Current Style: {visualStyle.charAt(0).toUpperCase() + visualStyle.slice(1)}
            </div>
          </div>
          <audio ref={audioRef} className="hidden" />
        </div>
      </div>
    </div>
  );
}