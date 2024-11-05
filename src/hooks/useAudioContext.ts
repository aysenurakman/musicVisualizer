import { useState, useCallback } from 'react';
import { AudioContextManager } from './audioContextManager';

export function useAudioContext(audioElement: HTMLAudioElement | null) {
  const [isReady, setIsReady] = useState(false);
  const manager = AudioContextManager.getInstance();

  const setupAudioContext = useCallback(() => {
    if (!audioElement) return;

    try {
      const analyzer = manager.setup(audioElement);
      setIsReady(!!analyzer);
    } catch (error) {
      console.error('Failed to setup audio context:', error);
      setIsReady(false);
    }
  }, [audioElement]);

  const getAnalyzer = useCallback(() => {
    return manager.getAnalyzer();
  }, []);

  return {
    setupAudioContext,
    getAnalyzer,
    isReady
  };
}