const { createCanvas, loadImage } = require('canvas');

const width = 1404;
const height = 1872;

function render(pageDef) {

  const streams = [];

  for (const page of pageDef.pages) {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
  
    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.fillRect(0, 0, width, height); 

    for (const layer of page.layers) {
      for (const line of layer.lines) {
        ctx.strokeStyle = 'rgba(0,0,0,1)';
        ctx.lineWidth = 2;

        // eraser brush
        if (line.brush == 6) {
          ctx.strokeStyle = 'rgba(255,255,255,1)';
          ctx.lineWidth = 36;
        }

        ctx.beginPath();

        for (const point of line.points) {

          ctx.lineTo(point.x, point.y);
          
        }

        ctx.stroke();
      }
    }

    streams.push(canvas.pngStream());
  }

  return Promise.resolve(streams);
}

module.exports = render;
