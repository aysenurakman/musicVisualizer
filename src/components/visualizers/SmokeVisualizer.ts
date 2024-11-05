interface SmokeParticle {
  x: number;
  y: number;
  size: number;
  life: number;
  color: string;
  vx: number;
  vy: number;
  turbulence: number;
  opacity: number;
  rotation: number;
}

export function drawSmoke(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  dataArray: Uint8Array,
  deltaTime: number
) {
  const particles: SmokeParticle[] = [];
  const time = Date.now() * 0.001;
  const intensity = Array.from(dataArray).reduce((sum, val) => sum + val, 0) / dataArray.length / 255;

  // Generate particles across the entire screen
  const spawnPoints = Math.floor(15 + intensity * 25);
  for (let i = 0; i < spawnPoints; i++) {
    const dataIndex = Math.floor((i / spawnPoints) * dataArray.length);
    const amplitude = dataArray[dataIndex] / 255;

    if (Math.random() < amplitude * 0.8) {
      // Create spawn points across the entire screen
      const x = Math.random() * width;
      const y = Math.random() * height;
      const hue = (time * 20 + Math.random() * 60) % 360;
      
      particles.push({
        x,
        y,
        size: 50 + Math.random() * 100,
        life: 1,
        color: `hsla(${hue}, 70%, 50%, 0.1)`,
        vx: (Math.random() - 0.5) * 2 * amplitude,
        vy: -1 - Math.random() * 2 - intensity * 2,
        turbulence: Math.random() * Math.PI * 2,
        opacity: 0.2 + Math.random() * 0.3,
        rotation: Math.random() * Math.PI * 2
      });
    }
  }

  // Update and draw particles
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, width, height);

  // Sort particles by size for better layering
  particles.sort((a, b) => a.size - b.size);

  particles.forEach((particle, index) => {
    // Update position with turbulent motion
    particle.turbulence += 0.02;
    particle.rotation += 0.005 * intensity;
    
    const turbX = Math.sin(particle.turbulence) * 2 * intensity;
    const turbY = Math.cos(particle.turbulence) * 2 * intensity;
    
    particle.x += particle.vx + turbX;
    particle.y += particle.vy + turbY;
    particle.life -= 0.002 * deltaTime * 0.1;
    particle.size *= 1.01; // Slower growth
    
    if (particle.life <= 0) {
      particles.splice(index, 1);
      return;
    }

    // Create realistic smoke effect with multiple layers
    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.rotation);

    const gradient = ctx.createRadialGradient(
      0, 0, 0,
      0, 0, particle.size
    );
    
    const alpha = particle.opacity * particle.life;
    gradient.addColorStop(0, particle.color.replace('0.1', (alpha * 1.5).toString()));
    gradient.addColorStop(0.4, particle.color.replace('0.1', (alpha * 0.8).toString()));
    gradient.addColorStop(0.7, particle.color.replace('0.1', (alpha * 0.4).toString()));
    gradient.addColorStop(1, 'transparent');

    ctx.fillStyle = gradient;
    
    // Draw smoke with distortion
    ctx.beginPath();
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const distortion = Math.sin(angle * 3 + particle.turbulence) * 15 * intensity;
      const x = Math.cos(angle) * (particle.size + distortion);
      const y = Math.sin(angle) * (particle.size + distortion);
      
      if (i === 0) ctx.moveTo(x, y);
      else ctx.quadraticCurveTo(x * 0.9, y * 0.9, x, y);
    }
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
  });

  // Add volumetric lighting effect
  ctx.globalCompositeOperation = 'screen';
  const rays = 12;
  for (let i = 0; i < rays; i++) {
    const angle = (i / rays) * Math.PI * 2 + time * 0.1;
    const gradient = ctx.createLinearGradient(
      width / 2, height / 2,
      width / 2 + Math.cos(angle) * width,
      height / 2 + Math.sin(angle) * height
    );
    
    gradient.addColorStop(0, `hsla(${time * 30 + i * 45}, 70%, 50%, ${0.02 * intensity})`);
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
  ctx.globalCompositeOperation = 'source-over';
}