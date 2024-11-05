interface NatureElement {
  type: 'tree' | 'flower' | 'butterfly';
  x: number;
  y: number;
  scale: number;
  rotation: number;
  color: string;
  phase: number;
  morphProgress: number;
  targetType: 'tree' | 'flower' | 'butterfly';
  velocity: number;
}

function drawMorphingTree(
  ctx: CanvasRenderingContext2D,
  intensity: number,
  progress: number,
  element: NatureElement
) {
  const trunkHeight = 60;
  const branchLevels = 3;
  
  ctx.strokeStyle = `hsl(30, 50%, ${20 + intensity * 30}%)`;
  ctx.lineWidth = 4;
  
  // Draw trunk
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -trunkHeight);
  ctx.stroke();
  
  // Draw branches recursively
  function drawBranch(x: number, y: number, length: number, angle: number, level: number) {
    if (level >= branchLevels) return;
    
    const x2 = x + Math.cos(angle) * length;
    const y2 = y + Math.sin(angle) * length;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    
    const newLength = length * 0.7;
    drawBranch(x2, y2, newLength, angle - 0.5, level + 1);
    drawBranch(x2, y2, newLength, angle + 0.5, level + 1);
  }
  
  drawBranch(0, -trunkHeight, trunkHeight * 0.7, -Math.PI / 2 - 0.3, 0);
  drawBranch(0, -trunkHeight, trunkHeight * 0.7, -Math.PI / 2 + 0.3, 0);
}

function drawMorphingFlower(
  ctx: CanvasRenderingContext2D,
  intensity: number,
  time: number,
  progress: number,
  element: NatureElement
) {
  const petalCount = 6;
  const size = 30;
  
  // Draw stem
  ctx.strokeStyle = `hsl(120, 50%, ${30 + intensity * 20}%)`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -40);
  ctx.stroke();
  
  // Draw petals
  ctx.translate(0, -40);
  for (let i = 0; i < petalCount; i++) {
    const angle = (i / petalCount) * Math.PI * 2 + time;
    const petalSize = size * (1 + Math.sin(time * 2 + i) * 0.2);
    
    ctx.fillStyle = element.color;
    ctx.beginPath();
    ctx.ellipse(
      Math.cos(angle) * 15,
      Math.sin(angle) * 15,
      petalSize,
      petalSize / 2,
      angle,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
  
  // Draw center
  ctx.fillStyle = `hsl(60, 80%, ${70 + intensity * 30}%)`;
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, Math.PI * 2);
  ctx.fill();
}

function drawMorphingButterfly(
  ctx: CanvasRenderingContext2D,
  intensity: number,
  time: number,
  progress: number,
  element: NatureElement
) {
  const wingSize = 30;
  const flapAmount = Math.sin(time * 5) * 0.5;
  
  // Draw wings
  ctx.fillStyle = element.color;
  
  // Left wing
  ctx.save();
  ctx.rotate(flapAmount);
  ctx.beginPath();
  ctx.ellipse(-15, 0, wingSize, wingSize * 0.6, Math.PI / 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  
  // Right wing
  ctx.save();
  ctx.rotate(-flapAmount);
  ctx.beginPath();
  ctx.ellipse(15, 0, wingSize, wingSize * 0.6, -Math.PI / 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  
  // Draw body
  ctx.fillStyle = `hsl(0, 0%, ${20 + intensity * 30}%)`;
  ctx.beginPath();
  ctx.ellipse(0, 0, 3, 15, 0, 0, Math.PI * 2);
  ctx.fill();
}

export function drawNature(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  dataArray: Uint8Array,
  deltaTime: number
) {
  const elements: NatureElement[] = [];
  const time = Date.now() * 0.001;
  const intensity = Array.from(dataArray).reduce((sum, val) => sum + val, 0) / dataArray.length / 255;

  // Create transforming elements with slower movement
  const elementCount = 15;
  for (let i = 0; i < elementCount; i++) {
    const dataIndex = Math.floor((i / elementCount) * dataArray.length);
    const amplitude = dataArray[dataIndex] / 255;
    
    if (amplitude > 0.6 && Math.random() < 0.2) {
      const types: Array<'tree' | 'flower' | 'butterfly'> = ['tree', 'flower', 'butterfly'];
      const currentType = types[Math.floor(Math.random() * types.length)];
      const targetType = types[Math.floor(Math.random() * types.length)];
      
      elements.push({
        type: currentType,
        x: Math.random() * width,
        y: height - Math.random() * height * 0.3,
        scale: 0.6 + Math.random() * 0.6,
        rotation: Math.random() * Math.PI * 2,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        phase: Math.random() * Math.PI * 2,
        morphProgress: 0,
        targetType,
        velocity: 0.2 + Math.random() * 0.3
      });
    }
  }

  // Draw magical forest background
  const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
  skyGradient.addColorStop(0, `hsla(${time * 10}, 70%, ${20 + intensity * 30}%, 1)`);
  skyGradient.addColorStop(1, `hsla(${time * 10 + 60}, 60%, ${40 + intensity * 30}%, 1)`);
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, width, height);

  // Draw elements with smoother morphing animation
  elements.forEach(element => {
    ctx.save();
    ctx.translate(element.x, element.y);
    ctx.rotate(element.rotation + Math.sin(time + element.phase) * 0.05 * intensity);
    ctx.scale(element.scale, element.scale);

    // Update morph progress more slowly
    element.morphProgress = Math.min(1, element.morphProgress + 0.02);
    if (element.morphProgress >= 1) {
      element.type = element.targetType;
      element.morphProgress = 0;
    }

    // Draw morphing shape
    const progress = element.morphProgress;
    switch(element.type) {
      case 'tree':
        drawMorphingTree(ctx, intensity, progress, element);
        break;
      case 'flower':
        drawMorphingFlower(ctx, intensity, time + element.phase, progress, element);
        break;
      case 'butterfly':
        drawMorphingButterfly(ctx, intensity, time + element.phase, progress, element);
        break;
    }

    ctx.restore();
  });

  // Add magical particles with slower movement
  const particleCount = Math.floor(30 * intensity);
  for (let i = 0; i < particleCount; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = 1 + Math.random() * 2;
    
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${time * 50 + i * 20}, 100%, 70%, ${Math.random() * 0.4})`;
    ctx.fill();
  }
}