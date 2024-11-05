interface PsychedelicLayer {
  rotation: number;
  scale: number;
  hue: number;
  opacity: number;
  speed: number;
}

export function drawPsychedelic(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  dataArray: Uint8Array,
  deltaTime: number
) {
  const time = Date.now() * 0.001;
  const intensity = Array.from(dataArray).reduce((sum, val) => sum + val, 0) / dataArray.length / 255;
  
  // Create multiple rotating layers
  const layers: PsychedelicLayer[] = [];
  const layerCount = 5;
  
  for (let i = 0; i < layerCount; i++) {
    layers.push({
      rotation: (i / layerCount) * Math.PI * 2,
      scale: 0.5 + i * 0.3,
      hue: (time * 30 + i * 360 / layerCount) % 360,
      opacity: 0.3 - i * 0.05,
      speed: 0.5 + i * 0.2
    });
  }
  
  // Clear canvas with fade effect
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fillRect(0, 0, width, height);
  
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Draw each layer
  layers.forEach(layer => {
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(layer.rotation + time * layer.speed);
    ctx.scale(layer.scale, layer.scale);
    
    // Create spiral pattern
    const arms = 8;
    const points = 50;
    
    for (let arm = 0; arm < arms; arm++) {
      ctx.beginPath();
      const armAngle = (arm / arms) * Math.PI * 2;
      
      for (let i = 0; i < points; i++) {
        const t = i / points;
        const angle = armAngle + t * Math.PI * 4 + time * layer.speed;
        const radius = t * Math.min(width, height) * 0.5;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        const dataIndex = Math.floor((i / points) * dataArray.length);
        const amplitude = dataArray[dataIndex] / 255;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          const cp1x = x + Math.cos(angle + Math.PI / 2) * 50 * amplitude;
          const cp1y = y + Math.sin(angle + Math.PI / 2) * 50 * amplitude;
          ctx.quadraticCurveTo(cp1x, cp1y, x, y);
        }
      }
      
      const gradient = ctx.createLinearGradient(-width/2, -height/2, width/2, height/2);
      gradient.addColorStop(0, `hsla(${layer.hue}, 100%, 50%, ${layer.opacity * intensity})`);
      gradient.addColorStop(0.5, `hsla(${layer.hue + 60}, 100%, 50%, ${layer.opacity * intensity})`);
      gradient.addColorStop(1, `hsla(${layer.hue + 120}, 100%, 50%, ${layer.opacity * intensity})`);
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 5 * intensity;
      ctx.stroke();
    }
    
    ctx.restore();
  });
  
  // Add kaleidoscope effect
  ctx.globalCompositeOperation = 'screen';
  const segments = 12;
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const gradient = ctx.createLinearGradient(
      centerX, centerY,
      centerX + Math.cos(angle) * width,
      centerY + Math.sin(angle) * height
    );
    
    gradient.addColorStop(0, `hsla(${time * 100 + i * 30}, 100%, 50%, ${0.1 * intensity})`);
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, Math.max(width, height), angle, angle + Math.PI / segments);
    ctx.closePath();
    ctx.fill();
  }
  
  // Add central mandala
  const mandalaSize = Math.min(width, height) * 0.2;
  const petals = 16;
  
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(time * 0.2);
  
  for (let i = 0; i < petals; i++) {
    const petalAngle = (i / petals) * Math.PI * 2;
    const petalX = Math.cos(petalAngle) * mandalaSize;
    const petalY = Math.sin(petalAngle) * mandalaSize;
    
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(
      petalX * 0.5, petalY * 0.5,
      petalX, petalY
    );
    
    const gradient = ctx.createLinearGradient(0, 0, petalX, petalY);
    gradient.addColorStop(0, `hsla(${time * 100 + i * 20}, 100%, 50%, ${0.5 * intensity})`);
    gradient.addColorStop(1, 'transparent');
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3 * intensity;
    ctx.stroke();
  }
  
  ctx.restore();
  ctx.globalCompositeOperation = 'source-over';
}