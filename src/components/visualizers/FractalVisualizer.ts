function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function drawSierpinskiTriangle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  depth: number,
  maxDepth: number,
  time: number,
  intensity: number
) {
  if (depth >= maxDepth) return;

  const height = size * Math.sin(Math.PI / 3);
  const points = [
    { x: x, y: y - height / 2 },
    { x: x - size / 2, y: y + height / 2 },
    { x: x + size / 2, y: y + height / 2 }
  ];

  // Draw triangle
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  ctx.lineTo(points[1].x, points[1].y);
  ctx.lineTo(points[2].x, points[2].y);
  ctx.closePath();

  const hue = (time * 50 + depth * 30) % 360;
  ctx.fillStyle = `hsla(${hue}, 70%, 50%, ${0.5 * (1 - depth / maxDepth)})`;
  ctx.fill();

  // Recursive calls for sub-triangles
  const newSize = size / 2;
  const newDepth = depth + 1;

  points.forEach((point, i) => {
    const nextPoint = points[(i + 1) % points.length];
    const midX = (point.x + nextPoint.x) / 2;
    const midY = (point.y + nextPoint.y) / 2;

    drawSierpinskiTriangle(
      ctx,
      midX,
      midY,
      newSize,
      newDepth,
      maxDepth,
      time,
      intensity
    );
  });
}

function drawMandelbrot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rotation: number,
  intensity: number,
  time: number
) {
  const maxIterations = 100;
  const scale = size / 4;
  
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;
  
  for (let px = 0; px < size; px++) {
    for (let py = 0; py < size; py++) {
      const x0 = (px - size / 2) / scale;
      const y0 = (py - size / 2) / scale;
      
      let x1 = 0;
      let y1 = 0;
      let iteration = 0;
      
      while (x1 * x1 + y1 * y1 <= 4 && iteration < maxIterations) {
        const xtemp = x1 * x1 - y1 * y1 + x0;
        y1 = 2 * x1 * y1 + y0;
        x1 = xtemp;
        iteration++;
      }
      
      const i = (py * size + px) * 4;
      const hue = (time * 50 + iteration * 3) % 360;
      const [r, g, b] = hslToRgb(hue / 360, 0.8, iteration < maxIterations ? 0.5 : 0);
      
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = 255;
    }
  }
  
  ctx.putImageData(imageData, -size / 2, -size / 2);
  ctx.restore();
}

function drawJuliaSet(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rotation: number,
  intensity: number,
  time: number
) {
  const maxIterations = 100;
  const scale = size / 4;
  const cx = Math.cos(time * 0.5) * 0.7;
  const cy = Math.sin(time * 0.3) * 0.7;
  
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;
  
  for (let px = 0; px < size; px++) {
    for (let py = 0; py < size; py++) {
      let x0 = (px - size / 2) / scale;
      let y0 = (py - size / 2) / scale;
      let iteration = 0;
      
      while (x0 * x0 + y0 * y0 <= 4 && iteration < maxIterations) {
        const xtemp = x0 * x0 - y0 * y0 + cx;
        y0 = 2 * x0 * y0 + cy;
        x0 = xtemp;
        iteration++;
      }
      
      const i = (py * size + px) * 4;
      const hue = (time * 30 + iteration * 3) % 360;
      const [r, g, b] = hslToRgb(hue / 360, 0.8, iteration < maxIterations ? 0.5 : 0);
      
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = 255;
    }
  }
  
  ctx.putImageData(imageData, -size / 2, -size / 2);
  ctx.restore();
}

export function drawFractal(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  dataArray: Uint8Array,
  deltaTime: number
) {
  const time = Date.now() * 0.001;
  const intensity = Array.from(dataArray).reduce((sum, val) => sum + val, 0) / dataArray.length / 255;
  
  // Clear with fade effect
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fillRect(0, 0, width, height);
  
  // Draw Sierpinski triangle
  drawSierpinskiTriangle(
    ctx,
    width * 0.5,
    height * 0.5,
    Math.min(width, height) * 0.3,
    0,
    6,
    time,
    intensity
  );
  
  // Draw Mandelbrot set
  drawMandelbrot(
    ctx,
    width * 0.25,
    height * 0.5,
    Math.min(width, height) * 0.3,
    time * 0.1,
    intensity,
    time
  );
  
  // Draw Julia set
  drawJuliaSet(
    ctx,
    width * 0.75,
    height * 0.5,
    Math.min(width, height) * 0.3,
    -time * 0.1,
    intensity,
    time
  );
  
  // Add connecting effects between fractals
  ctx.globalCompositeOperation = 'screen';
  const connectionPoints = [
    { x: width * 0.25, y: height * 0.5 },
    { x: width * 0.5, y: height * 0.5 },
    { x: width * 0.75, y: height * 0.5 }
  ];
  
  connectionPoints.forEach((point, i) => {
    const nextPoint = connectionPoints[(i + 1) % connectionPoints.length];
    const gradient = ctx.createLinearGradient(
      point.x, point.y,
      nextPoint.x, nextPoint.y
    );
    
    gradient.addColorStop(0, `hsla(${time * 50 + i * 120}, 100%, 50%, ${0.2 * intensity})`);
    gradient.addColorStop(1, 'transparent');
    
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    ctx.lineTo(nextPoint.x, nextPoint.y);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 5 * intensity;
    ctx.stroke();
  });
  
  ctx.globalCompositeOperation = 'source-over';
}