interface WavePoint {
  x: number;
  y: number;
  velocity: number;
  amplitude: number;
  phase: number;
}

export function drawWave(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  dataArray: Uint8Array,
  deltaTime: number
) {
  const time = Date.now() * 0.001;
  const intensity = Array.from(dataArray).reduce((sum, val) => sum + val, 0) / dataArray.length / 255;
  
  const resolution = 100;
  const points: WavePoint[] = [];
  const centerY = height / 2;

  // Initialize wave points
  for (let i = 0; i <= resolution; i++) {
    const x = (width / resolution) * i;
    const dataIndex = Math.floor((i / resolution) * dataArray.length);
    const amplitude = dataArray[dataIndex] / 255;

    points.push({
      x,
      y: centerY,
      velocity: 0,
      amplitude: amplitude * 100,
      phase: i * 0.2 + time
    });
  }

  // Physics simulation
  const springConstant = 0.03;
  const damping = 0.98;
  const spread = 0.2;

  // Update wave physics
  points.forEach((point, i) => {
    // Calculate spring force
    const targetY = centerY;
    const displacement = point.y - targetY;
    const springForce = -springConstant * displacement;

    // Add wave motion
    const waveForce = Math.sin(point.phase) * point.amplitude * intensity;

    // Update velocity and position
    point.velocity += (springForce + waveForce) * deltaTime * 0.016;
    point.velocity *= damping;
    point.y += point.velocity;

    // Spread to neighbors
    if (i > 0) {
      const prev = points[i - 1];
      const spread_force = (prev.y - point.y) * spread;
      point.velocity += spread_force;
      prev.velocity -= spread_force;
    }
  });

  // Draw waves
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fillRect(0, 0, width, height);

  // Draw multiple layers with different styles
  const layers = 3;
  for (let layer = 0; layer < layers; layer++) {
    ctx.beginPath();
    const hue = (time * 30 + layer * 120) % 360;
    
    // Draw main wave
    points.forEach((point, i) => {
      const offsetY = Math.sin(layer * Math.PI / 3) * 20 * intensity;
      if (i === 0) {
        ctx.moveTo(point.x, point.y + offsetY);
      } else {
        const xc = (point.x + points[i - 1].x) / 2;
        const yc = (point.y + points[i - 1].y + offsetY * 2) / 2;
        ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y + offsetY, xc, yc);
      }
    });

    // Style and effects
    ctx.strokeStyle = `hsla(${hue}, 80%, 50%, ${0.5 - layer * 0.1})`;
    ctx.lineWidth = 3 - layer;
    ctx.stroke();

    // Add glow
    ctx.shadowBlur = 20 * intensity;
    ctx.shadowColor = `hsla(${hue}, 80%, 50%, 0.5)`;
  }

  // Add water caustics effect
  ctx.globalCompositeOperation = 'screen';
  for (let i = 0; i < 5; i++) {
    const gradient = ctx.createLinearGradient(0, centerY - 100, 0, centerY + 100);
    gradient.addColorStop(0, `hsla(200, 80%, 50%, ${0.05 * intensity})`);
    gradient.addColorStop(0.5, `hsla(180, 80%, 50%, ${0.02 * intensity})`);
    gradient.addColorStop(1, 'transparent');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
  ctx.globalCompositeOperation = 'source-over';
}