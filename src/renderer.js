const { createCanvas, loadImage } = require('canvas');

const width = 1404;
const height = 1872;

const colors = {
  black: '#000000',
  gray: '#999999',
  pencil: '#666666',
  higlighter: '#AAAAAA',
  white: '#ffffff',
  transparent: 'rgba(255,255,255,0)',
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

        if (line.brush == 8) {
          ctx.fill();
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
  let fillColor = color.transparent;

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
    case 8:
      // eraser area
      color = colors.white;
      fillColor = colors.white;
      sizeFactor = 1;
    default:
      break;
  }

  ctx.strokeStyle = color;
  ctx.fillStyle = fillColor;
  ctx.lineWidth = sizeFactor * linedef.brushSize;
}

module.exports = render;
