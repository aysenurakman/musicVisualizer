export function drawSpectrum(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  dataArray: Uint8Array
) {
  const barWidth = width / dataArray.length;
  
  for (let i = 0; i < dataArray.length; i++) {
    const barHeight = (dataArray[i] / 255) * height;
    const x = i * barWidth;
    const y = height - barHeight;

    const hue = (i / dataArray.length) * 360;
    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.fillRect(x, y, barWidth - 1, barHeight);
  }
}