import React from 'react';
import { X } from 'lucide-react';

interface VideoModalProps {
  onClose: () => void;
}

export function VideoModal({ onClose }: VideoModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
      <div className="w-full max-w-4xl p-8">
        <div className="flex justify-end mb-4">
          <button
            onClick={onClose}
            className="bg-white/10 hover:bg-white/20 p-2 rounded-full"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="aspect-video bg-black rounded-lg">
          <iframe
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            className="w-full h-full rounded-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
}