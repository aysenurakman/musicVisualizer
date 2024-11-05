interface VortexParticle {
  x: number;
  y: number;
  angle: number;
  radius: number;
  speed: number;
  size: number;
  hue: number;
}

export function drawVortex(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  dataArray: Uint8Array
) {
  const centerX = width / 2;
  const centerY = height / 2;
  const particles: VortexParticle[] = [];
  const particleCount = 200;

  // Generate particles
  for (let i = 0; i < particleCount; i++) {
    const dataIndex = Math.floor((i / particleCount) * dataArray.length);
    const amplitude = dataArray[dataIndex] / 255;
    
    const angle = (i / particleCount) * Math.PI * 2;
    const radius = 50 + amplitude * 200;
    
    particles.push({
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      angle: angle,
      radius: radius,
      speed: 0.02 + amplitude * 0.03,
      size: 2 + amplitude * 4,
      hue: (i / particleCount) * 360
    });
  }

  // Update and draw particles
  particles.forEach(particle => {
    // Update position
    particle.angle += particle.speed;
    particle.x = centerX + Math.cos(particle.angle) * particle.radius;
    particle.y = centerY + Math.sin(particle.angle) * particle.radius;

    // Draw particle
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${particle.hue}, 100%, 60%, 0.8)`;
    ctx.fill();

    // Add glow effect
    ctx.shadowBlur = 10;
    ctx.shadowColor = `hsla(${particle.hue}, 100%, 60%, 0.5)`;
  });

  // Draw central vortex
  const gradient = ctx.createRadialGradient(
    centerX, centerY, 0,
    centerX, centerY, 200
  );
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, 200, 0, Math.PI * 2);
  ctx.fill();
}