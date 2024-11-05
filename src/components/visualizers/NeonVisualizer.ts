interface NeonElement {
  points: { x: number; y: number }[];
  color: string;
  width: number;
  speed: number;
  offset: number;
}

export function drawNeon(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  dataArray: Uint8Array,
  deltaTime: number
) {
  const elements: NeonElement[] = [];
  const layerCount = 5;
  const time = Date.now() * 0.001;
  
  // Calculate audio intensity
  const intensity = Array.from(dataArray).reduce((sum, val) => sum + val, 0) / dataArray.length / 255;
  
  // Create multiple neon elements
  for (let i = 0; i < layerCount; i++) {
    const points = [];
    const pointCount = 20;
    const layerOffset = (i / layerCount) * Math.PI * 2;
    
    for (let j = 0; j < pointCount; j++) {
      const dataIndex = Math.floor((j / pointCount) * dataArray.length);
      const amplitude = dataArray[dataIndex] / 255;
      const t = time * (1 + i * 0.2) + layerOffset;
      
      // Create complex wave patterns
      const x = (width / pointCount) * j;
      const baseY = height / 2;
      const wave1 = Math.sin(t + j * 0.2) * 100;
      const wave2 = Math.cos(t * 0.5 + j * 0.3) * 50;
      const wave3 = Math.sin(t * 1.5 + j * 0.1) * 25;
      const y = baseY + (wave1 + wave2 + wave3) * amplitude;
      
      points.push({ x, y });
    }
    
    // Create dynamic colors
    const hue = (time * 30 + i * 360 / layerCount) % 360;
    elements.push({
      points,
      color: `hsl(${hue}, 100%, 60%)`,
      width: 2 + i * 2,
      speed: 1 + i * 0.5,
      offset: layerOffset
    });
  }

  // Clear with fade effect
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fillRect(0, 0, width, height);

  // Draw neon elements
  elements.forEach(element => {
    // Draw multiple layers for glow effect
    const layers = [
      { blur: 20, alpha: 0.3 },
      { blur: 15, alpha: 0.5 },
      { blur: 10, alpha: 0.7 },
      { blur: 5, alpha: 0.9 }
    ];

    layers.forEach(layer => {
      ctx.shadowBlur = layer.blur * intensity;
      ctx.shadowColor = element.color;
      ctx.strokeStyle = element.color.replace(')', `, ${layer.alpha})`);
      ctx.lineWidth = element.width * intensity;
      
      ctx.beginPath();
      ctx.moveTo(element.points[0].x, element.points[0].y);
      
      // Draw smooth curve through points
      for (let i = 1; i < element.points.length - 2; i++) {
        const xc = (element.points[i].x + element.points[i + 1].x) / 2;
        const yc = (element.points[i].y + element.points[i + 1].y) / 2;
        ctx.quadraticCurveTo(
          element.points[i].x,
          element.points[i].y,
          xc,
          yc
        );
      }
      
      ctx.stroke();
    });
  });

  // Add particle effects
  const particleCount = Math.floor(30 * intensity);
  for (let i = 0; i < particleCount; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = 1 + Math.random() * 2 * intensity;
    
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${(time * 100 + i * 20) % 360}, 100%, 70%, ${Math.random() * 0.5})`;
    ctx.fill();
  }
}