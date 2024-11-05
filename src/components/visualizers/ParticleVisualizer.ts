interface Particle {
  x: number;
  y: number;
  radius: number;
  color: string;
  velocity: { x: number; y: number };
  life: number;
}

export function drawParticles(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  dataArray: Uint8Array
) {
  const particles: Particle[] = [];
  const particleCount = 100;
  const centerX = width / 2;
  const centerY = height / 2;

  // Create particles based on audio data
  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2;
    const dataIndex = Math.floor((i / particleCount) * dataArray.length);
    const amplitude = dataArray[dataIndex] / 255;
    
    const distance = 100 + amplitude * 100;
    const hue = (i / particleCount) * 360;
    
    particles.push({
      x: centerX + Math.cos(angle) * distance,
      y: centerY + Math.sin(angle) * distance,
      radius: 2 + amplitude * 4,
      color: `hsla(${hue}, 100%, 60%, ${0.6 + amplitude * 0.4})`,
      velocity: {
        x: Math.cos(angle) * amplitude * 2,
        y: Math.sin(angle) * amplitude * 2
      },
      life: 1
    });
  }

  // Draw particles
  particles.forEach(particle => {
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fillStyle = particle.color;
    ctx.fill();
    
    // Add glow effect
    ctx.shadowBlur = 15;
    ctx.shadowColor = particle.color;
  });

  // Reset shadow effect
  ctx.shadowBlur = 0;
}