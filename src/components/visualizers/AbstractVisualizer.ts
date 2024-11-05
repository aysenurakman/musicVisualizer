interface AbstractElement {
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  rotation: number;
  life: number;
  vx: number;
  vy: number;
  shape: 'circle' | 'square' | 'triangle';
}

export function drawAbstract(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  dataArray: Uint8Array,
  deltaTime: number
) {
  const elements: AbstractElement[] = [];
  const time = Date.now() * 0.001;
  const intensity = Array.from(dataArray).reduce((sum, val) => sum + val, 0) / dataArray.length / 255;
  
  // Generate elements based on audio intensity
  const spawnCount = Math.floor(intensity * 8);
  const shapes: Array<'circle' | 'square' | 'triangle'> = ['circle', 'square', 'triangle'];
  
  for (let i = 0; i < spawnCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 4 * intensity;
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    
    elements.push({
      x: width / 2,
      y: height / 2,
      size: 40 + Math.random() * 80,
      color: `hsl(${(time * 50 + Math.random() * 60) % 360}, 100%, 50%)`,
      speed,
      rotation: angle,
      life: 1.0,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      shape
    });
  }

  // Clear canvas with fade effect
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fillRect(0, 0, width, height);

  // Update and draw elements
  elements.forEach((element, index) => {
    // Update position with smooth movement
    element.x += element.vx * deltaTime * 0.016;
    element.y += element.vy * deltaTime * 0.016;
    element.rotation += 0.02 * intensity;
    element.life -= 0.01 * deltaTime * 0.016;

    if (element.life <= 0) {
      elements.splice(index, 1);
      return;
    }

    // Draw element with glow effect
    ctx.save();
    ctx.translate(element.x, element.y);
    ctx.rotate(element.rotation);

    const alpha = element.life * 0.8;
    ctx.fillStyle = element.color.replace(')', `, ${alpha})`);
    ctx.shadowBlur = 20 * intensity;
    ctx.shadowColor = element.color;

    // Draw different shapes
    switch (element.shape) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, element.size / 2, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'square':
        ctx.fillRect(-element.size / 2, -element.size / 2, element.size, element.size);
        break;

      case 'triangle':
        const size = element.size / 2;
        ctx.beginPath();
        ctx.moveTo(-size, size);
        ctx.lineTo(size, size);
        ctx.lineTo(0, -size);
        ctx.closePath();
        ctx.fill();
        break;
    }

    // Add inner glow
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, element.size / 2);
    gradient.addColorStop(0, `hsla(${time * 100}, 100%, 50%, ${0.5 * element.life})`);
    gradient.addColorStop(1, 'transparent');
    
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, element.size / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  });

  // Add connecting lines between nearby elements
  ctx.globalCompositeOperation = 'screen';
  elements.forEach((element1, i) => {
    elements.slice(i + 1).forEach(element2 => {
      const dx = element2.x - element1.x;
      const dy = element2.y - element1.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 200) {
        const gradient = ctx.createLinearGradient(
          element1.x, element1.y,
          element2.x, element2.y
        );
        
        gradient.addColorStop(0, element1.color.replace(')', ', 0.2)'));
        gradient.addColorStop(1, element2.color.replace(')', ', 0.2)'));

        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2 * intensity;
        ctx.moveTo(element1.x, element1.y);
        ctx.lineTo(element2.x, element2.y);
        ctx.stroke();
      }
    });
  });

  ctx.globalCompositeOperation = 'source-over';

  // Add central energy burst
  if (intensity > 0.7) {
    const burstGradient = ctx.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, 200 * intensity
    );
    
    burstGradient.addColorStop(0, `hsla(${time * 100}, 100%, 50%, ${0.3 * intensity})`);
    burstGradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = burstGradient;
    ctx.fillRect(0, 0, width, height);
  }
}