import React, { useRef, useEffect, useCallback } from 'react';
import { useAudioContext } from '../hooks/useAudioContext';
import { drawAbstract } from './visualizers/AbstractVisualizer';
import { drawNeon } from './visualizers/NeonVisualizer';
import { drawSmoke } from './visualizers/SmokeVisualizer';
import { drawNature } from './visualizers/NatureVisualizer';
import { drawRetro } from './visualizers/RetroVisualizer';
import { drawMinimal } from './visualizers/MinimalVisualizer';
import { drawNebula } from './visualizers/NebulaVisualizer';
import { drawFractal } from './visualizers/FractalVisualizer';
import { drawWave } from './visualizers/WaveVisualizer';

type VisualizerStyle = 
  | 'abstract'
  | 'neon'
  | 'smoke'
  | 'nature'
  | 'retro'
  | 'minimal'
  | 'nebula'
  | 'fractal'
  | 'wave';

interface AudioVisualizerProps {
  audioElement: HTMLAudioElement | null;
  style: VisualizerStyle;
}

export function AudioVisualizer({ audioElement, style }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const { setupAudioContext, getAnalyzer, isReady } = useAudioContext(audioElement);

  const animate = useCallback((timestamp: number) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const analyzer = getAnalyzer();

    if (!ctx || !analyzer) return;

    const deltaTime = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;

    const dataArray = new Uint8Array(analyzer.frequencyBinCount);
    analyzer.getByteFrequencyData(dataArray);

    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw visualization based on style
    switch (style) {
      case 'abstract':
        drawAbstract(ctx, canvas.width, canvas.height, dataArray, deltaTime);
        break;
      case 'neon':
        drawNeon(ctx, canvas.width, canvas.height, dataArray, deltaTime);
        break;
      case 'smoke':
        drawSmoke(ctx, canvas.width, canvas.height, dataArray, deltaTime);
        break;
      case 'nature':
        drawNature(ctx, canvas.width, canvas.height, dataArray, deltaTime);
        break;
      case 'retro':
        drawRetro(ctx, canvas.width, canvas.height, dataArray, deltaTime);
        break;
      case 'minimal':
        drawMinimal(ctx, canvas.width, canvas.height, dataArray, deltaTime);
        break;
      case 'nebula':
        drawNebula(ctx, canvas.width, canvas.height, dataArray, deltaTime);
        break;
      case 'fractal':
        drawFractal(ctx, canvas.width, canvas.height, dataArray, deltaTime);
        break;
      case 'wave':
        drawWave(ctx, canvas.width, canvas.height, dataArray, deltaTime);
        break;
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [getAnalyzer, style]);

  useEffect(() => {
    if (audioElement) {
      setupAudioContext();
    }
  }, [audioElement, setupAudioContext]);

  useEffect(() => {
    if (!isReady || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Start animation
    lastTimeRef.current = performance.now();
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isReady, animate]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded-lg"
    />
  );
}