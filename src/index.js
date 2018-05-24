const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

const headerLength = 43;
const standardHeader = 'reMarkable lines with selections and layers';
const width = 1404;
const height = 1872;


/**
 * 
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
 * 
 * @param {Buffer} buffer 
 * @param {number} offset 
 */
function processPage(buffer, offset) {
    console.log('\t--- processing page at ' + offset.toString(16));

    const layers = buffer.readInt32LE(offset);

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    offset += 4;

    console.log('\tpage has ' + layers + ' layers');

    for (let l = 0; l < layers; l++) {

        console.log('\t\tprocessing layer ' + l);

        const lines = buffer.readInt32LE(offset);

        offset += 4;

        console.log('\t\tlevel has ' + lines + ' lines');

        for (let li = 0; li < lines; li++) {
            const lineDef = {
                brush: buffer.readInt32LE(offset + 0x00),
                color: buffer.readInt32LE(offset + 0x04),
                magic: buffer.readInt32LE(offset + 0x08),
                brushSize: buffer.readFloatLE(offset + 0x0C),
                dots: buffer.readInt32LE(offset + 0x10),
            }
            offset += 20;
            // console.log('\t\t\tlinedef ', lineDef);

            ctx.strokeStyle = 'rgba(0,0,0,1)';
            ctx.lineWidth = 8;
            ctx.beginPath();
            for (let d = 0; d < lineDef.dots; d++) {
                const dotDef = {
                    x: buffer.readFloatLE(offset + 0x00),
                    y: buffer.readFloatLE(offset + 0x04),
                    pressure: buffer.readFloatLE(offset + 0x08),
                    xrot: buffer.readFloatLE(offset + 0x0c),
                    yrot: buffer.readFloatLE(offset + 0x10),
                }
                offset += 20;

                ctx.lineTo(dotDef.x, dotDef.y);
                // console.log(dotDef);
            }
            ctx.stroke()

        }
    }

    outImg = fs.createWriteStream(__dirname + '/' + Math.random() + '.png');

    canvas.pngStream().pipe(outImg);

    outImg.on('finish', function () {
        console.log('The PNG file was created.');
    });

    return offset;
}

/**
 * 
 * @param {Buffer} buffer 
 */
function processFile(buffer) {
    console.log('processing file');

    let pages = buffer.readInt32LE(0x0);

    console.log('the file has ' + pages + ' pages');

    let pOffset = 0x4;
    do {
        pOffset = processPage(buffer, pOffset);
        pages--;
    } while (pOffset > 0 && pages > 0);
}

function parse(input) {
    fs.readFile(input, (err, data) => {
        if (!checkHeader(data)) {
            console.log('invalid lines file');
            return;
        }
        processFile(data.slice(headerLength));
    })
}

module.exports = parse;