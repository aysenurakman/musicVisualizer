interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  angle: number;
  color: string;
  pulse: number;
}

export function drawNebula(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  dataArray: Uint8Array,
  deltaTime: number
) {
  const time = Date.now() * 0.001;
  const intensity = Array.from(dataArray).reduce((sum, val) => sum + val, 0) / dataArray.length / 255;

  // Initialize stars if not exists
  const stars: Star[] = Array.from({ length: 100 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: 1 + Math.random() * 3,
    speed: 0.5 + Math.random() * 2,
    angle: Math.random() * Math.PI * 2,
    color: `hsl(${Math.random() * 360}, 100%, 70%)`,
    pulse: Math.random() * Math.PI * 2
  }));

  // Clear with fade effect
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fillRect(0, 0, width, height);

  // Draw nebula background
  const gradient = ctx.createRadialGradient(
    width / 2, height / 2, 0,
    width / 2, height / 2, Math.max(width, height) / 2
  );
  gradient.addColorStop(0, `hsla(${time * 20}, 70%, 20%, 0.2)`);
  gradient.addColorStop(0.5, `hsla(${time * 20 + 30}, 60%, 30%, 0.1)`);
  gradient.addColorStop(1, 'transparent');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Update star movement with smoother transitions
  stars.forEach(star => {
    // Slower movement
    star.x += Math.cos(star.angle) * star.speed * intensity * 0.5;
    star.y += Math.sin(star.angle) * star.speed * intensity * 0.5;
    star.pulse += 0.05;
    
    // Color transition
    const hue = (time * 20 + star.angle * 180 / Math.PI) % 360;
    star.color = `hsl(${hue}, 100%, ${70 + Math.sin(star.pulse) * 20}%)`;
    
    // Wrap around screen with fade effect
    if (star.x < 0) star.x = width;
    if (star.x > width) star.x = 0;
    if (star.y < 0) star.y = height;
    if (star.y > height) star.y = 0;

    // Draw star with enhanced glow
    const size = star.size * (1 + Math.sin(star.pulse) * 0.3);
    
    ctx.beginPath();
    ctx.arc(star.x, star.y, size, 0, Math.PI * 2);
    ctx.fillStyle = star.color;
    ctx.fill();
    
    // Multiple glow layers
    for (let i = 0; i < 3; i++) {
      ctx.shadowBlur = size * (3 + i);
      ctx.shadowColor = star.color;
      ctx.fill();
    }
  });

  // Add nebula clouds
  ctx.globalCompositeOperation = 'screen';
  const cloudCount = 5;
  for (let i = 0; i < cloudCount; i++) {
    const x = width * (i / cloudCount);
    const y = height / 2 + Math.sin(time + i) * 50;
    
    const cloudGradient = ctx.createRadialGradient(
      x, y, 0,
      x, y, 200
    );
    
    const hue = (time * 30 + i * 60) % 360;
    cloudGradient.addColorStop(0, `hsla(${hue}, 70%, 50%, ${0.1 * intensity})`);
    cloudGradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = cloudGradient;
    ctx.fillRect(0, 0, width, height);
  }
  
  ctx.globalCompositeOperation = 'source-over';
}