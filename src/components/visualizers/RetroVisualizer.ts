interface RetroBar {
  height: number;
  targetHeight: number;
  hue: number;
}

export function drawRetro(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  dataArray: Uint8Array,
  deltaTime: number
) {
  const barCount = 32;
  const barWidth = width / barCount;
  const bars: RetroBar[] = [];

  // Create or update bars
  for (let i = 0; i < barCount; i++) {
    const dataIndex = Math.floor((i / barCount) * dataArray.length);
    const amplitude = dataArray[dataIndex] / 255;
    
    bars.push({
      height: height * amplitude * 0.8,
      targetHeight: height * amplitude * 0.8,
      hue: (i / barCount) * 360
    });
  }

  // Draw background grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  
  for (let i = 0; i < height; i += 20) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(width, i);
    ctx.stroke();
  }

  // Draw bars with 3D effect
  bars.forEach((bar, i) => {
    const x = i * barWidth;
    const y = height - bar.height;
    
    // 3D effect - side
    ctx.fillStyle = `hsla(${bar.hue}, 100%, 40%, 0.8)`;
    ctx.fillRect(x, height, barWidth * 0.8, -bar.height);
    
    // Top face with gradient
    const gradient = ctx.createLinearGradient(x, y, x, y - 10);
    gradient.addColorStop(0, `hsla(${bar.hue}, 100%, 60%, 0.9)`);
    gradient.addColorStop(1, `hsla(${bar.hue}, 100%, 80%, 0.9)`);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, barWidth * 0.8, 10);
  });

  // Add scanline effect
  const scanLineY = (Date.now() % 2000) / 2000 * height;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.fillRect(0, scanLineY, width, 2);
}