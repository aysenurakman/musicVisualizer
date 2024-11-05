export function drawGeometric(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  dataArray: Uint8Array
) {
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(width, height) / 3;
  
  // Clear canvas with fade effect
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fillRect(0, 0, width, height);

  // Draw multiple layers of geometric shapes
  for (let layer = 0; layer < 3; layer++) {
    const points: [number, number][] = [];
    const sides = 6 + layer * 2;
    
    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * Math.PI * 2;
      const dataIndex = Math.floor((i / sides) * dataArray.length);
      const amplitude = dataArray[dataIndex] / 255;
      
      const radius = maxRadius * (0.5 + layer * 0.2) * (0.5 + amplitude * 0.5);
      points.push([
        centerX + Math.cos(angle) * radius,
        centerY + Math.sin(angle) * radius
      ]);
    }

    // Draw shape
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    points.forEach(([x, y]) => ctx.lineTo(x, y));
    ctx.closePath();

    // Style with gradient
    const gradient = ctx.createLinearGradient(
      centerX - maxRadius,
      centerY - maxRadius,
      centerX + maxRadius,
      centerY + maxRadius
    );
    gradient.addColorStop(0, `hsla(${Date.now() / 50 + layer * 120}, 70%, 60%, 0.5)`);
    gradient.addColorStop(1, `hsla(${Date.now() / 50 + layer * 120 + 60}, 70%, 60%, 0.5)`);

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}