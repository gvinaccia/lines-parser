const fs = require('fs');

const headerLength = 43;
const standardHeader = 'reMarkable lines with selections and layers';

function parseFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (!checkHeader(data)) {
        return reject('invalid lines file');
      }
      processFile(data.slice(headerLength))
        .then(data => resolve(data));
    });
  });
}

/**
 * @param {Buffer} buffer 
 */
function checkHeader(buffer) {
  let s = '';

  buffer.slice(0, headerLength).forEach((v) => {
    s += String.fromCharCode(v);
  })

  return s == standardHeader;
}


/**
 * @param {Buffer} buffer 
 */
function processFile(buffer) {

  const parsed = {
    pages: []
  };

  let pages = buffer.readInt32LE(0x0);
  let pOffset = 4;

  for (let p = 0; p < pages; p++) {

    pOffset = processPage(buffer, pOffset, parsed.pages);


  };

  return Promise.resolve(parsed);
}

/** 
 * @param {Buffer} buffer 
 * @param {number} offset 
 * @param {any[]} output
 */
function processPage(buffer, offset, output) {
  // console.log('\t--- processing page at ' + offset.toString(16));

  const page = {
    layers: []
  };

  const layers = buffer.readInt32LE(offset);
  offset += 4;

  // console.log('\tpage has ' + layers + ' layers');

  for (let l = 0; l < layers; l++) {

    const layer = {
      lines: []
    };

    // console.log('\t\tprocessing layer ' + l);

    const lines = buffer.readInt32LE(offset);
    offset += 4;

    // console.log('\t\tlevel has ' + lines + ' lines');

    for (let li = 0; li < lines; li++) {
      const lineDef = {
        brush: buffer.readInt32LE(offset),
        color: buffer.readInt32LE(offset + 4),
        magic: buffer.readInt32LE(offset + 8),
        brushSize: buffer.readFloatLE(offset + 12),
        dots: buffer.readInt32LE(offset + 16),
        points: [],
      };
      offset += 20;

      for (let d = 0; d < lineDef.dots; d++) {
        const dotDef = {
          x: buffer.readFloatLE(offset),
          y: buffer.readFloatLE(offset + 4),
          pressure: buffer.readFloatLE(offset + 8),
          xrot: buffer.readFloatLE(offset + 12),
          yrot: buffer.readFloatLE(offset + 16),
        }
        offset += 20;
        lineDef.points.push(dotDef);
      }
      layer.lines.push(lineDef);
    }
    page.layers.push(layer);
  }

  output.push(page);

  return offset;
}


module.exports = parseFile;
