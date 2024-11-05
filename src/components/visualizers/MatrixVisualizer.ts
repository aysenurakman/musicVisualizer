export function drawMatrix(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  dataArray: Uint8Array
) {
  const fontSize = 14;
  const columns = Math.floor(width / fontSize);
  const symbols = '01';
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fillRect(0, 0, width, height);
  
  for (let i = 0; i < columns; i++) {
    const dataIndex = Math.floor((i / columns) * dataArray.length);
    const amplitude = dataArray[dataIndex] / 255;
    
    if (Math.random() < amplitude) {
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      const x = i * fontSize;
      const y = (Math.random() * height);
      
      const hue = 120 + amplitude * 60;
      ctx.fillStyle = `hsla(${hue}, 100%, 50%, ${0.5 + amplitude * 0.5})`;
      ctx.font = `${fontSize}px monospace`;
      ctx.fillText(symbol, x, y);
    }
  }
}