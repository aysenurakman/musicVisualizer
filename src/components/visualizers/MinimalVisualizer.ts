export function drawMinimal(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  dataArray: Uint8Array,
  deltaTime: number
) {
  const centerY = height / 2;
  const lineWidth = 2;
  
  // Draw multiple lines with different phases
  const lineCount = 3;
  for (let line = 0; line < lineCount; line++) {
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.8 - line * 0.2})`;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    
    const points = 100;
    const phaseOffset = (line / lineCount) * Math.PI * 2;
    
    for (let i = 0; i < points; i++) {
      const x = (width / points) * i;
      const dataIndex = Math.floor((i / points) * dataArray.length);
      const amplitude = dataArray[dataIndex] / 255;
      
      const y = centerY + Math.sin(i * 0.1 + Date.now() * 0.001 + phaseOffset) * amplitude * 100;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.stroke();
  }

  // Add subtle dots at peaks with trails
  dataArray.forEach((value, i) => {
    const amplitude = value / 255;
    if (amplitude > 0.7) {
      const x = (width / dataArray.length) * i;
      const y = centerY + Math.sin(i * 0.1 + Date.now() * 0.001) * amplitude * 100;
      
      // Draw dot with trail
      const trailLength = 5;
      for (let t = 0; t < trailLength; t++) {
        const trailX = x - t * 2;
        const alpha = (1 - t / trailLength) * 0.8;
        
        ctx.beginPath();
        ctx.arc(trailX, y, 2 - t * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
      }
    }
  });
}