const { createCanvas, loadImage } = require('canvas');

const width = 1404;
const height = 1872;

const colors = {
  black: '#000000',
  gray: '#999999',
  pencil: '#666666',
  higlighter: '#AAAAAA',
  white: '#ffffff',
}

function render(pageDef) {

  const streams = [];

  for (const page of pageDef.pages) {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = colors.white;
    ctx.fillRect(0, 0, width, height);

    for (const layer of page.layers) {
      for (const line of layer.lines) {

        configureBrush(line, ctx);

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

function configureBrush(linedef, ctx) {

  let color = linedef.color == 0 ? colors.black : (linedef.color == 1 ? colors.gray : colors.white);
  let sizeFactor = 1;

  switch (linedef.brush) {
    case 0:
      sizeFactor = 8;
      break;
    case 1:  
      sizeFactor = 4;
      color = colors.pencil;
      break;
    case 2:
      sizeFactor = 2;
      break;
    case 3: 
      sizeFactor = 6; 
      break;
    case 4:  
      sizeFactor = 2;  
      break;
    case 5:  
      sizeFactor = 12;
      color = colors.higlighter;
      break;
    case 6:
      // eraser
      color = colors.white;
      sizeFactor = 16;  
      break;
    case 7:
      sizeFactor = 4;
      color = colors.pencil;
      break;
  }

  ctx.strokeStyle = color;
  ctx.lineWidth = sizeFactor * linedef.brushSize;
}

module.exports = render;
