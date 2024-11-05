interface FluidCell {
  density: number;
  vx: number;
  vy: number;
  nextDensity: number;
  nextVx: number;
  nextVy: number;
}

class FluidSimulation {
  private cells: FluidCell[][];
  private size: number;
  private diffusion: number;
  private viscosity: number;
  private dt: number;

  constructor(size: number) {
    this.size = size;
    this.diffusion = 0.0001;
    this.viscosity = 0.0001;
    this.dt = 0.2;
    this.cells = Array(size).fill(0).map(() => 
      Array(size).fill(0).map(() => ({
        density: 0,
        vx: 0,
        vy: 0,
        nextDensity: 0,
        nextVx: 0,
        nextVy: 0
      }))
    );
  }

  private diffuse(x: number, y: number, x0: number, diff: number): number {
    const a = this.dt * diff * (this.size - 2) * (this.size - 2);
    return (x0 + a * (
      this.cells[y][x-1].density + 
      this.cells[y][x+1].density + 
      this.cells[y-1][x].density + 
      this.cells[y+1][x].density
    )) / (1 + 4 * a);
  }

  private project(): void {
    for (let y = 1; y < this.size - 1; y++) {
      for (let x = 1; x < this.size - 1; x++) {
        const cell = this.cells[y][x];
        const div = -0.5 * (
          this.cells[y][x+1].vx - 
          this.cells[y][x-1].vx + 
          this.cells[y+1][x].vy - 
          this.cells[y-1][x].vy
        ) / this.size;
        cell.nextVx = div;
        cell.nextVy = 0;
      }
    }

    for (let y = 1; y < this.size - 1; y++) {
      for (let x = 1; x < this.size - 1; x++) {
        const cell = this.cells[y][x];
        cell.vx -= 0.5 * this.size * (
          this.cells[y][x+1].nextVx - 
          this.cells[y][x-1].nextVx
        );
        cell.vy -= 0.5 * this.size * (
          this.cells[y+1][x].nextVy - 
          this.cells[y-1][x].nextVy
        );
      }
    }
  }

  addDensity(x: number, y: number, amount: number): void {
    const cellX = Math.floor(x * this.size);
    const cellY = Math.floor(y * this.size);
    if (cellX > 0 && cellX < this.size - 1 && cellY > 0 && cellY < this.size - 1) {
      this.cells[cellY][cellX].density += amount;
    }
  }

  addVelocity(x: number, y: number, amountX: number, amountY: number): void {
    const cellX = Math.floor(x * this.size);
    const cellY = Math.floor(y * this.size);
    if (cellX > 0 && cellX < this.size - 1 && cellY > 0 && cellY < this.size - 1) {
      this.cells[cellY][cellX].vx += amountX;
      this.cells[cellY][cellX].vy += amountY;
    }
  }

  step(): void {
    // Velocity step
    for (let y = 1; y < this.size - 1; y++) {
      for (let x = 1; x < this.size - 1; x++) {
        const cell = this.cells[y][x];
        cell.nextVx = this.diffuse(x, y, cell.vx, this.viscosity);
        cell.nextVy = this.diffuse(x, y, cell.vy, this.viscosity);
      }
    }

    this.project();

    // Density step
    for (let y = 1; y < this.size - 1; y++) {
      for (let x = 1; x < this.size - 1; x++) {
        const cell = this.cells[y][x];
        cell.nextDensity = this.diffuse(x, y, cell.density, this.diffusion);
      }
    }

    // Update cells
    for (let y = 1; y < this.size - 1; y++) {
      for (let x = 1; x < this.size - 1; x++) {
        const cell = this.cells[y][x];
        cell.density = cell.nextDensity;
        cell.vx = cell.nextVx;
        cell.vy = cell.nextVy;
      }
    }
  }

  getDensity(x: number, y: number): number {
    const cellX = Math.floor(x * this.size);
    const cellY = Math.floor(y * this.size);
    if (cellX >= 0 && cellX < this.size && cellY >= 0 && cellY < this.size) {
      return this.cells[cellY][cellX].density;
    }
    return 0;
  }
}

export function drawFluid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  dataArray: Uint8Array,
  deltaTime: number
) {
  const simulation = new FluidSimulation(64);
  const time = Date.now() * 0.001;
  const intensity = Array.from(dataArray).reduce((sum, val) => sum + val, 0) / dataArray.length / 255;

  // Add fluid based on audio data
  for (let i = 0; i < dataArray.length; i++) {
    const amplitude = dataArray[i] / 255;
    if (amplitude > 0.5) {
      const angle = (i / dataArray.length) * Math.PI * 2;
      const radius = 0.3 + amplitude * 0.2;
      const x = 0.5 + Math.cos(angle) * radius;
      const y = 0.5 + Math.sin(angle) * radius;
      
      simulation.addDensity(x, y, amplitude * 100);
      simulation.addVelocity(
        x, y,
        Math.cos(angle + time) * amplitude * 50,
        Math.sin(angle + time) * amplitude * 50
      );
    }
  }

  // Update simulation
  simulation.step();

  // Render fluid
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const density = simulation.getDensity(x / width, y / height);
      const i = (y * width + x) * 4;
      
      // Create dynamic color based on density and time
      const hue = (time * 30 + density * 360) % 360;
      const [r, g, b] = hslToRgb(hue / 360, 0.8, 0.5);
      
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = Math.min(255, density * 255);
    }
  }

  ctx.putImageData(imageData, 0, 0);

  // Add glow effect
  ctx.globalCompositeOperation = 'screen';
  const gradient = ctx.createRadialGradient(
    width / 2, height / 2, 0,
    width / 2, height / 2, Math.max(width, height) / 2
  );
  gradient.addColorStop(0, `hsla(${time * 30}, 100%, 50%, ${0.2 * intensity})`);
  gradient.addColorStop(1, 'transparent');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = 'source-over';
}

// Helper function to convert HSL to RGB
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