interface Neuron {
  x: number;
  y: number;
  connections: number[];
  activity: number;
}

export function drawNeural(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  dataArray: Uint8Array
) {
  const neurons: Neuron[] = [];
  const neuronCount = 50;
  const maxConnections = 5;

  // Create neural network layout
  for (let i = 0; i < neuronCount; i++) {
    const dataIndex = Math.floor((i / neuronCount) * dataArray.length);
    const activity = dataArray[dataIndex] / 255;

    neurons.push({
      x: Math.random() * width,
      y: Math.random() * height,
      connections: Array.from({ length: maxConnections }, () => 
        Math.floor(Math.random() * neuronCount)),
      activity
    });
  }

  // Draw neural connections
  ctx.lineWidth = 1;
  neurons.forEach((neuron, i) => {
    neuron.connections.forEach(targetIndex => {
      const target = neurons[targetIndex];
      const strength = (neuron.activity + target.activity) / 2;
      
      if (strength > 0.1) {
        const gradient = ctx.createLinearGradient(
          neuron.x, neuron.y, target.x, target.y
        );
        
        gradient.addColorStop(0, `rgba(64, 224, 208, ${strength * 0.5})`);
        gradient.addColorStop(1, `rgba(128, 0, 255, ${strength * 0.5})`);
        
        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.moveTo(neuron.x, neuron.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
      }
    });
  });

  // Draw neurons
  neurons.forEach(neuron => {
    const radius = 2 + neuron.activity * 4;
    
    ctx.beginPath();
    ctx.arc(neuron.x, neuron.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + neuron.activity * 0.7})`;
    ctx.fill();
    
    // Add glow effect
    ctx.shadowBlur = 15;
    ctx.shadowColor = `rgba(64, 224, 208, ${neuron.activity})`;
  });
}